import express from "express";
import cors from "cors";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { WorkIQClient } from "./workiq-client.js";
import {
  demoBriefing,
  demoCalendar,
  demoEmails,
  demoTeams,
  demoDocuments,
  demoCommitments,
} from "./demo-data.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE_PATH = resolve(__dirname, "..", "data", "cache.json");

const app = express();
const PORT = parseInt(process.env.PORT ?? "3001", 10);

app.use(cors({ origin: /^http:\/\/localhost:\d+$/ }));
app.use(express.json());

// --- Data sources ---

const workiq = new WorkIQClient();
let workiqAvailable = false;

interface CacheData {
  briefing?: unknown;
  calendar?: unknown[];
  emails?: unknown[];
  teams?: unknown[];
  documents?: unknown[];
  commitments?: unknown[];
}

let cache: CacheData | null = null;

function loadCache(): boolean {
  if (!existsSync(CACHE_PATH)) return false;
  try {
    cache = JSON.parse(readFileSync(CACHE_PATH, "utf-8")) as CacheData;
    return true;
  } catch { return false; }
}

/** Try WorkIQ live → fall back to cache → fall back to demo */
async function queryOrFallback<T>(
  question: string,
  cacheKey: keyof CacheData,
  fallback: T,
): Promise<{ data: T; source: "live" | "cache" | "demo" }> {
  // Try live WorkIQ
  if (workiqAvailable) {
    try {
      const raw = await workiq.ask(question);
      return { data: raw as unknown as T, source: "live" };
    } catch (err) {
      console.warn(`⚠️  WorkIQ query failed: ${(err as Error).message}`);
    }
  }
  // Try cache
  if (cache?.[cacheKey]) {
    return { data: cache[cacheKey] as T, source: "cache" };
  }
  // Demo fallback
  return { data: fallback, source: "demo" };
}

// --- API Routes ---

app.get("/api/briefing", async (_req, res) => {
  console.log("📋 GET /api/briefing");
  const { data, source } = await queryOrFallback(
    "Give me a concise morning briefing. Summarize my key meetings today with times, most urgent emails needing action, and important deadlines or follow-ups. Keep it brief and actionable.",
    "briefing",
    demoBriefing,
  );
  if (source === "live") {
    res.json({ summary: data, highlights: [], generatedAt: new Date().toISOString(), source });
  } else {
    res.json({ ...(data as object), source });
  }
});

app.get("/api/calendar", async (_req, res) => {
  console.log("📅 GET /api/calendar");
  const { data, source } = await queryOrFallback(
    "What meetings do I have scheduled for today? Include the meeting title, time, duration, attendees, and location for each one. Return a concise list.",
    "calendar",
    demoCalendar,
  );
  res.json({ meetings: source === "live" ? data : data, source });
});

app.get("/api/emails", async (_req, res) => {
  console.log("📧 GET /api/emails");
  const { data, source } = await queryOrFallback(
    "What are my most important and urgent emails from today and yesterday? Show sender, subject, one-sentence preview, and urgency level. Focus on emails needing my action.",
    "emails",
    demoEmails,
  );
  res.json({ emails: source === "live" ? data : data, source });
});

app.get("/api/teams", async (_req, res) => {
  console.log("💬 GET /api/teams");
  const { data, source } = await queryOrFallback(
    "What are the most recent important Teams messages I should know about? Include sender, channel or chat name, and message summary.",
    "teams",
    demoTeams,
  );
  res.json({ messages: source === "live" ? data : data, source });
});

app.get("/api/documents", async (_req, res) => {
  console.log("📄 GET /api/documents");
  const { data, source } = await queryOrFallback(
    "What documents have been recently shared with me or that I've worked on? Include document title, who shared or modified it, and file type.",
    "documents",
    demoDocuments,
  );
  res.json({ documents: source === "live" ? data : data, source });
});

app.get("/api/commitments", async (_req, res) => {
  console.log("✅ GET /api/commitments");
  const { data, source } = await queryOrFallback(
    "What are my current open action items, commitments, and follow-ups from recent emails and meetings? Include source, what I need to do, and urgency.",
    "commitments",
    demoCommitments,
  );
  res.json({ commitments: source === "live" ? data : data, source });
});

app.get("/api/status", (_req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    workiq: {
      connected: workiqAvailable,
      mode: workiqAvailable ? "live" : cache ? "cache" : "demo",
    },
    timestamp: new Date().toISOString(),
  });
});

// --- Startup ---

async function start() {
  console.log("🌅 Morning Command Center — Backend Server");
  console.log("━".repeat(50));

  // Load file cache as fallback
  const hasCache = loadCache();
  if (hasCache) console.log("📦 File cache loaded (fallback)");

  // Try to connect to WorkIQ MCP
  try {
    await workiq.connect();
    workiqAvailable = true;
    console.log("🟢 WorkIQ MCP: connected — serving live data");
  } catch (err) {
    workiqAvailable = false;
    console.warn("🟡 WorkIQ MCP: not available");
    console.warn(`   Reason: ${(err as Error).message}`);
    console.log(hasCache ? "📦 Falling back to cached data" : "🟡 Falling back to demo data");
  }

  app.listen(PORT, () => {
    console.log("━".repeat(50));
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    const mode = workiqAvailable ? "LIVE (WorkIQ)" : hasCache ? "CACHED (file)" : "DEMO (fallback)";
    console.log(`📊 Mode: ${mode}`);
    console.log("━".repeat(50));
  });
}

start();
