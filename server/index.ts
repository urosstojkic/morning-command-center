import express from "express";
import cors from "cors";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
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

// --- Cache loading ---

interface CacheData {
  briefing?: unknown;
  calendar?: unknown[];
  emails?: unknown[];
  teams?: unknown[];
  documents?: unknown[];
  commitments?: unknown[];
}

let cache: CacheData | null = null;
let dataSource: "cache" | "demo" = "demo";

function loadCache(): boolean {
  if (!existsSync(CACHE_PATH)) {
    console.warn(`🟡 Cache file not found: ${CACHE_PATH}`);
    return false;
  }
  try {
    const raw = readFileSync(CACHE_PATH, "utf-8");
    cache = JSON.parse(raw) as CacheData;
    dataSource = "cache";
    console.log(`🟢 Loaded cached data from ${CACHE_PATH}`);
    return true;
  } catch (err) {
    console.error(`⚠️  Failed to parse cache file: ${(err as Error).message}`);
    return false;
  }
}

// --- API Routes ---

app.get("/api/briefing", (_req, res) => {
  console.log("📋 GET /api/briefing");
  const data = cache?.briefing ?? demoBriefing;
  const source = cache?.briefing ? "cache" : "demo";
  res.json({ ...(data as object), source });
});

app.get("/api/calendar", (_req, res) => {
  console.log("📅 GET /api/calendar");
  const data = cache?.calendar ?? demoCalendar;
  const source = cache?.calendar ? "cache" : "demo";
  res.json({ meetings: data, source });
});

app.get("/api/emails", (_req, res) => {
  console.log("📧 GET /api/emails");
  const data = cache?.emails ?? demoEmails;
  const source = cache?.emails ? "cache" : "demo";
  res.json({ emails: data, source });
});

app.get("/api/teams", (_req, res) => {
  console.log("💬 GET /api/teams");
  const data = cache?.teams ?? demoTeams;
  const source = cache?.teams ? "cache" : "demo";
  res.json({ messages: data, source });
});

app.get("/api/documents", (_req, res) => {
  console.log("📄 GET /api/documents");
  const data = cache?.documents ?? demoDocuments;
  const source = cache?.documents ? "cache" : "demo";
  res.json({ documents: data, source });
});

app.get("/api/commitments", (_req, res) => {
  console.log("✅ GET /api/commitments");
  const data = cache?.commitments ?? demoCommitments;
  const source = cache?.commitments ? "cache" : "demo";
  res.json({ commitments: data, source });
});

app.get("/api/status", (_req, res) => {
  console.log("🏥 GET /api/status");
  res.json({
    status: "ok",
    uptime: process.uptime(),
    workiq: {
      connected: dataSource === "cache",
      mode: dataSource === "cache" ? "live" : "demo",
    },
    timestamp: new Date().toISOString(),
  });
});

app.post("/api/refresh", (_req, res) => {
  console.log("🔄 POST /api/refresh — reloading cache from disk");
  const ok = loadCache();
  res.json({
    success: ok,
    source: dataSource,
    message: ok ? "Cache reloaded from disk" : "Cache not available, using demo data",
  });
});

// --- Startup ---

function start() {
  console.log("🌅 Morning Command Center — Backend Server");
  console.log("━".repeat(50));

  loadCache();

  if (dataSource === "cache") {
    console.log("🟢 Data source: file cache (data/cache.json)");
  } else {
    console.log("🟡 Data source: demo data (cache file not found)");
  }

  app.listen(PORT, () => {
    console.log("━".repeat(50));
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📡 CORS enabled for http://localhost:5173`);
    console.log(`📊 Mode: ${dataSource === "cache" ? "CACHED (real data)" : "DEMO (fallback data)"}`);
    console.log("━".repeat(50));
  });
}

start();
