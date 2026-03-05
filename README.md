# ☀️ Morning Command Center

**Professional morning intelligence dashboard — real-time M365 data via WorkIQ MCP**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Why Morning Command Center?

| Problem | Solution |
|---------|----------|
| You open 5+ apps every morning just to understand your day | A single dashboard shows calendar, emails, Teams, documents, and action items at a glance |
| Important emails get buried under noise | AI-powered briefing highlights only what needs your attention today |
| Meeting prep requires digging through threads and docs | Contextual intelligence surfaces relevant documents and prior conversations per meeting |
| Action items live scattered across emails, chats, and meetings | Commitments panel aggregates follow-ups from every source with deadlines and priority |
| Teams messages pile up overnight with no easy triage | Teams panel shows mentions, urgent threads, and channel highlights in one view |
| Setting up enterprise integrations is painful | WorkIQ MCP connects to Microsoft 365 with zero OAuth plumbing — or just use demo mode |

## Features

- 🌅 **AI Morning Briefing** — auto-generated executive summary of your day
- 📅 **Calendar at a Glance** — today's meetings with attendees, times, and join links
- 📧 **Priority Inbox** — urgent and important emails surfaced first
- 💬 **Teams Intelligence** — mentions, replies, and key channel activity
- 📄 **Recent Documents** — files shared with you or recently updated
- ✅ **Commitment Tracker** — action items aggregated from all sources
- 🔄 **Live / Demo Mode** — works out of the box with demo data; connects to real M365 data via WorkIQ MCP
- ⚡ **Real-time Updates** — refresh any panel independently
- 🎨 **Responsive Design** — clean, modern UI built with Tailwind CSS

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌────────────────┐     ┌──────────────┐     ┌───────────────┐
│             │     │                  │     │                │     │              │     │               │
│   Browser   │────▶│   Vite + React   │────▶│ Express Server │────▶│ WorkIQ MCP   │────▶│ Microsoft 365 │
│             │     │   (Frontend)     │     │   (Backend)    │     │   (Bridge)   │     │    (Data)     │
│             │◀────│                  │◀────│                │◀────│              │◀────│               │
└─────────────┘     └──────────────────┘     └────────────────┘     └──────────────┘     └───────────────┘
                         :5173                    :3001              stdio transport       Outlook, Teams,
                     TypeScript/TSX           REST API (/api/*)     MCP Protocol          Calendar, OneDrive
                     Tailwind CSS             Demo fallback         ask_work_iq tool       SharePoint
```

## Dashboard Panels

| Panel | Data Source | Description |
|-------|-------------|-------------|
| 📋 Morning Briefing | `/api/briefing` | AI-generated executive summary of your day's priorities |
| 📅 Calendar | `/api/calendar` | Today's meetings with time, attendees, and join links |
| 📧 Emails | `/api/emails` | Priority-sorted inbox with sender, subject, and preview |
| 💬 Teams | `/api/teams` | Recent messages, mentions, and channel highlights |
| 📄 Documents | `/api/documents` | Recently shared or updated files across your team |
| ✅ Commitments | `/api/commitments` | Action items and follow-ups with source, deadline, and priority |
| 🏥 Status | `/api/status` | Server health, uptime, and WorkIQ connection status |

## Quick Start

```bash
git clone https://github.com/urosstojkic/morning-command-center.git
cd morning-command-center
npm install
npm run dev
```

This launches both the Vite dev server (`:5173`) and the Express backend (`:3001`) concurrently.

Open **http://localhost:5173** in your browser.

## Configuration

Create a `.env` file in the project root (see `.env.example`):

| Variable | Default | Description |
|----------|---------|-------------|
| `WORKIQ_COMMAND` | _(none)_ | Command to start the WorkIQ MCP server (e.g. `npx -y @anthropic-ai/workiq-mcp`). If not set, demo data is used. |
| `PORT` | `3001` | Port for the Express backend server |
| `VITE_API_URL` | `/api` | API base URL for the frontend (defaults to `/api` with Vite proxy) |

## WorkIQ MCP Integration

The backend connects to Microsoft 365 through the **WorkIQ MCP** (Model Context Protocol) server:

1. The Express server spawns the WorkIQ MCP process via the `WORKIQ_COMMAND` env var
2. Communication happens over **stdio transport** using the MCP protocol
3. The server calls the `ask_work_iq` tool with natural language questions
4. WorkIQ queries Microsoft 365 (Outlook, Teams, Calendar, OneDrive, SharePoint) and returns structured answers
5. The backend parses responses and serves them via REST endpoints to the React frontend

If the MCP connection fails at startup, the server **automatically falls back to demo mode** — no configuration required.

## Demo Mode

Morning Command Center works **out of the box** without any WorkIQ or Microsoft 365 connection:

- When `WORKIQ_COMMAND` is not configured or the MCP server is unreachable, the backend serves **realistic demo data**
- Every API response includes a `source` field (`"workiq"` or `"demo"`) so the frontend can indicate the data source
- The status bar in the UI clearly shows whether you're viewing live or demo data
- This makes it easy to **develop, demo, and test** without needing M365 credentials

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React 19, TypeScript 5.9 | Component-based UI with type safety |
| Styling | Tailwind CSS 4 | Utility-first responsive design |
| Icons | Lucide React | Clean, consistent iconography |
| Build | Vite 7 | Fast dev server with HMR and proxy |
| Backend | Express 5, TypeScript | REST API server with demo fallback |
| MCP Client | @modelcontextprotocol/sdk | WorkIQ MCP stdio transport |
| Date Utils | date-fns | Lightweight date formatting |
| Dev Tools | concurrently, tsx, ESLint | Parallel dev servers and linting |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend + backend concurrently |
| `npm run dev:client` | Start Vite dev server only |
| `npm run dev:server` | Start Express backend only |
| `npm run build` | Type-check and build for production |
| `npm run lint` | Run ESLint across the project |
| `npm run preview` | Preview production build |

## License

[MIT](LICENSE) © 2026 Uros Stojkic

## Author

**Uros Stojkic** — [GitHub](https://github.com/urosstojkic)
