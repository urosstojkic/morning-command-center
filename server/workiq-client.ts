import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

export class WorkIQClient {
  private client: Client | null = null;
  private transport: StdioClientTransport | null = null;
  private connected = false;

  async connect(): Promise<void> {
    const command = process.env.WORKIQ_COMMAND ?? "npx -y @anthropic-ai/workiq-mcp";
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

    console.log(`🤖 Asking WorkIQ: "${question.substring(0, 80)}..."`);

    const result = await this.client.callTool({
      name: "ask_work_iq",
      arguments: { question },
    });

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
