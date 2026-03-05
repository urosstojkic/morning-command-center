import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const TIMEOUT_MS = 300_000; // 5 minutes — WorkIQ queries M365 APIs which can be slow
const CACHE_TTL_MS = 4 * 60_000; // Cache responses for 4 minutes

interface CacheEntry {
  data: string;
  timestamp: number;
}

export class WorkIQClient {
  private client: Client | null = null;
  private transport: StdioClientTransport | null = null;
  private connected = false;
  private queue: Promise<void> = Promise.resolve();
  private cache = new Map<string, CacheEntry>();

  async connect(): Promise<void> {
    const command = process.env.WORKIQ_COMMAND ?? "npx -y @microsoft/workiq mcp";
    const parts = command.split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);

    console.log(`🔌 Connecting to WorkIQ MCP server: ${command}`);

    this.transport = new StdioClientTransport({ command: cmd, args });

    this.client = new Client(
      { name: "morning-command-center", version: "1.0.0" },
      { capabilities: {} },
    );

    await this.client.connect(this.transport);
    this.connected = true;
    console.log("✅ WorkIQ MCP connection established");
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.transport = null;
      this.connected = false;
      console.log("🔌 WorkIQ MCP connection closed");
    }
  }

  isConnected(): boolean {
    return this.connected;
  }

  async ask(question: string): Promise<string> {
    if (!this.client || !this.connected) {
      throw new Error("WorkIQ MCP client is not connected");
    }

    // Check cache first
    const cacheKey = question.substring(0, 100);
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      console.log(`📦 Cache hit for: "${cacheKey.substring(0, 60)}..."`);
      return cached.data;
    }

    // Queue requests so they run one at a time (WorkIQ serializes internally)
    return new Promise<string>((resolve, reject) => {
      this.queue = this.queue.then(async () => {
        try {
          const result = await this._doAsk(question);
          this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
          resolve(result);
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  private async _doAsk(question: string): Promise<string> {
    console.log(`🤖 Asking WorkIQ: "${question.substring(0, 80)}..."`);

    const result = await this.client!.callTool(
      { name: "ask_work_iq", arguments: { question } },
      undefined,
      { timeout: TIMEOUT_MS },
    );

    const content = result.content;
    if (Array.isArray(content)) {
      return content
        .filter((c): c is { type: "text"; text: string } => c.type === "text")
        .map((c) => c.text)
        .join("\n");
    }

    return String(content);
  }
}
