import express from "express";
import cors from "cors";
import { WorkIQClient } from "./workiq-client.js";
import {
  demoBriefing,
  demoCalendar,
  demoEmails,
  demoTeams,
  demoDocuments,
  demoCommitments,
} from "./demo-data.js";

const app = express();
const PORT = parseInt(process.env.PORT ?? "3001", 10);

app.use(cors({ origin: /^http:\/\/localhost:\d+$/ }));
app.use(express.json());

const workiq = new WorkIQClient();
let workiqAvailable = false;

// --- Helper: query WorkIQ or fall back to demo data ---

async function queryOrFallback<T>(
  question: string,
  fallback: T,
  parse?: (raw: string) => T,
): Promise<{ data: T; source: "workiq" | "demo" }> {
  if (!workiqAvailable) {
    return { data: fallback, source: "demo" };
  }
  try {
    const raw = await workiq.ask(question);
    return { data: parse ? parse(raw) : (raw as unknown as T), source: "workiq" };
  } catch (err) {
    console.error("⚠️  WorkIQ query failed, using demo data:", (err as Error).message);
    return { data: fallback, source: "demo" };
  }
}

// --- API Routes ---

app.get("/api/briefing", async (_req, res) => {
  console.log("📋 GET /api/briefing");
  const { data, source } = await queryOrFallback(
    "Give me a comprehensive morning briefing. Summarize my most important meetings today, urgent emails, key Teams messages, and any action items I need to address. Be concise but thorough.",
    demoBriefing,
  );
  res.json({ ...( source === "demo" ? data : { summary: data, highlights: [], generatedAt: new Date().toISOString() }), source });
});

app.get("/api/calendar", async (_req, res) => {
  console.log("📅 GET /api/calendar");
  const { data, source } = await queryOrFallback(
    "What meetings do I have scheduled for today? Include the meeting title, time, duration, attendees, and location or link for each one.",
    demoCalendar,
  );
  res.json({ meetings: source === "demo" ? data : data, source });
});

app.get("/api/emails", async (_req, res) => {
  console.log("📧 GET /api/emails");
  const { data, source } = await queryOrFallback(
    "What are my most important and urgent emails? Show me the sender, subject, a brief preview, and whether they have attachments. Focus on emails that need my attention today.",
    demoEmails,
  );
  res.json({ emails: source === "demo" ? data : data, source });
});

app.get("/api/teams", async (_req, res) => {
  console.log("💬 GET /api/teams");
  const { data, source } = await queryOrFallback(
    "What are the most recent and important Teams messages I should be aware of? Include the sender, channel, message preview, and whether I was mentioned.",
    demoTeams,
  );
  res.json({ messages: source === "demo" ? data : data, source });
});

app.get("/api/documents", async (_req, res) => {
  console.log("📄 GET /api/documents");
  const { data, source } = await queryOrFallback(
    "What documents have been recently shared with me or updated in my team? Include the document title, who shared it, when, and the file type.",
    demoDocuments,
  );
  res.json({ documents: source === "demo" ? data : data, source });
});

app.get("/api/commitments", async (_req, res) => {
  console.log("✅ GET /api/commitments");
  const { data, source } = await queryOrFallback(
    "What are my current action items, follow-ups, and commitments? Include where each one came from (email, meeting, Teams), the deadline, and priority level.",
    demoCommitments,
  );
  res.json({ commitments: source === "demo" ? data : data, source });
});

app.get("/api/status", (_req, res) => {
  console.log("🏥 GET /api/status");
  res.json({
    status: "ok",
    uptime: process.uptime(),
    workiq: {
      connected: workiqAvailable,
      mode: workiqAvailable ? "live" : "demo",
    },
    timestamp: new Date().toISOString(),
  });
});

// --- Startup ---

async function start() {
  console.log("🌅 Morning Command Center — Backend Server");
  console.log("━".repeat(50));

  try {
    await workiq.connect();
    workiqAvailable = true;
    console.log("🟢 WorkIQ MCP: connected — serving live data");
  } catch (err) {
    workiqAvailable = false;
    console.warn("🟡 WorkIQ MCP: not available — serving demo data");
    console.warn(`   Reason: ${(err as Error).message}`);
  }

  app.listen(PORT, () => {
    console.log("━".repeat(50));
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📡 CORS enabled for http://localhost:5173`);
    console.log(`📊 Mode: ${workiqAvailable ? "LIVE (WorkIQ)" : "DEMO (fallback data)"}`);
    console.log("━".repeat(50));
  });
}

start();
