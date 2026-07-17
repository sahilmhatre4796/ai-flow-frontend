# AI FLOW — Frontend (dashboard + embeddable widget)

This is the real, backend-wired frontend — it replaces the original
`ai-flow.jsx` single-file artifact's in-memory state and direct
Anthropic-API calls with actual requests to the FastAPI backend in
`../ai-flow-backend`.

It's a normal Vite + React project now (not a Claude.ai artifact), because a
JWT-authenticated, multi-workspace app with real persistence needs routing,
env vars, and `localStorage` for the refresh token — none of which are
available inside the artifact sandbox.

## What's here

- **Dashboard app** (`src/`) — login/register, workspace creation, and the
  full app shell (Bot Builder, Knowledge Base, Test bot, Conversations,
  Leads, Analytics, Marketplace, Team, Settings, Billing), each page reading
  and writing real backend data. No fabricated numbers anywhere — empty
  states show until there's real data, exactly like the original artifact's
  policy, just now backed by Postgres instead of React state.
- **Embeddable widget** (`src/widget/main.jsx`) — the small chat bubble that
  gets dropped onto a customer's own site via the `<script>` snippet shown
  on the Settings page. It talks to the public `/widget/{key}/config`
  endpoint and the `/ws/widget/{key}` WebSocket — no auth, no workspace
  internals exposed, identified only by the bot's `public_key`.

The marketing landing page from the original artifact is intentionally
*not* part of this codebase — that was a self-contained demo and still
works standalone. This project is the real authenticated application.

## Running it locally

```bash
npm install
cp .env.example .env   # point VITE_API_BASE_URL at your running backend
npm run dev            # dashboard at http://localhost:5173
```

Run the backend alongside it (see `../ai-flow-backend/README.md`). Make
sure the backend's `BACKEND_CORS_ORIGINS` includes `http://localhost:5173`
(it does by default).

To build the embeddable widget bundle that customers actually embed:

```bash
npm run build   # builds both the dashboard (dist/) and widget.js (dist-widget/)
```

Deploy `dist-widget/widget.js` to wherever `VITE_WIDGET_SCRIPT_URL` points
(typically the same static host as the dashboard, e.g. Vercel).

## Important: this won't run live inside the Claude.ai artifact preview

Earlier versions of this project (`ai-flow.jsx`) ran directly inside a
Claude.ai artifact iframe. This version can't, for two unavoidable reasons:

1. **Browser storage restrictions.** Artifacts can't use `localStorage`,
   which this app needs to persist the refresh token between page loads.
2. **Cross-origin/private-network restrictions.** Even if storage weren't an
   issue, a page served from `claude.ai`/`claudeusercontent.com` over HTTPS
   generally can't reach a `localhost` backend — browsers block exactly this
   ("private network access") for security reasons, regardless of CORS
   headers.

So: download this project and the backend, run both on your own machine (or
deploy them — Vercel for this frontend, Railway for the backend, per the
original architecture spec), and they'll talk to each other normally. This
is real, runnable source code — it's just not previewable inside a chat
artifact the way the marketing page was.

## Auth/session notes

- Access tokens live in memory only (15 min lifetime) — lost on refresh by
  design.
- Refresh tokens are stored in `localStorage` and used to silently restore
  a session on page load, the same pattern most real SPAs use when a
  backend issues tokens in the response body rather than as httpOnly
  cookies (a future hardening step would be to move to httpOnly cookies
  issued by the backend instead).

## Known gaps / next steps

- The dashboard polls for knowledge-base ingestion status (every 3s while a
  document is still processing) rather than subscribing to a push channel.
  The backend's `WorkspaceBroadcaster` (Redis pub/sub) already exists for
  conversations — extending it to publish document-status events too would
  let this become a real-time push instead of a poll.
- The agent-side "watch live conversations" WebSocket (`/ws/agent/{id}`) is
  implemented on the backend but not yet wired into the dashboard UI — the
  Conversations page currently reads via REST. Wiring it up would make new
  visitor messages appear without a manual refresh.
- Bot Builder intentionally does not include a drag-and-drop flow canvas —
  that was cosmetic-only in the original artifact and wasn't backed by
  persisted data there either; it's been left out here rather than ported
  as another fake feature.
