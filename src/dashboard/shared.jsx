import { Inbox } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchBots } from "../api/bots";
import { ApiError } from "../api/client";

export function useBots(workspaceId, version = 0) {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchBots(workspaceId)
      .then(data => { if (!cancelled) setBots(data); })
      .catch(err => { if (!cancelled) setError(err instanceof ApiError ? err.detail : "Couldn't load bots"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [workspaceId, version]);
  return { bots, loading, error, setBots };
}

export function errorText(err, fallback = "Something went wrong") {
  return err instanceof ApiError ? err.detail : fallback;
}

export function Skeleton({ width = "100%", height = 16, style }) {
  return <div className="skeleton" style={{ width, height, ...style }} />;
}

export function Spinner({ label = "Loading" }) {
  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <Skeleton height={88} /><Skeleton height={88} />
      <span className="text-faint" style={{ fontSize: 12 }}>{label}…</span>
    </div>
  );
}

export function ErrorBanner({ message }) {
  if (!message) return null;
  return <div className="fade-in" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5", borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 16 }}>{message}</div>;
}

export function EmptyState({ icon, title, body, actionLabel, onAction }) {
  const Icon = icon || Inbox;
  return (
    <div className="card fade-in" style={{ textAlign: "center", padding: "56px 32px" }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(99,102,241,0.12)", color: "#a5b4fc", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
        <Icon size={24} strokeWidth={1.75} />
      </div>
      <h3 style={{ marginBottom: 8 }}>{title}</h3>
      <p className="text-muted" style={{ fontSize: 14, marginBottom: actionLabel ? 22 : 0, maxWidth: 360, marginInline: "auto" }}>{body}</p>
      {actionLabel && <button className="btn btn-primary" onClick={onAction}>{actionLabel}</button>}
    </div>
  );
}

export function NoBotsYet({ onGoToBuilder }) {
  return <EmptyState title="Create your first bot to get started" body="Bots live in the Bot Builder — once you've created one, this page fills in with real data." actionLabel="Go to Bot Builder" onAction={onGoToBuilder} />;
}

export function BotPicker({ bots, selectedBotId, setSelectedBotId }) {
  if (bots.length <= 1) return null;
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap", borderBottom: "1px solid var(--border)", paddingBottom: 14 }}>
      {bots.map(b => (
        <button key={b.id} onClick={() => setSelectedBotId(b.id)} className={`pill ${selectedBotId === b.id ? "pill-brand" : "pill-neutral"}`} style={{ border: "none", cursor: "pointer", fontSize: 13, padding: "7px 14px" }}>{b.name}</button>
      ))}
    </div>
  );
}
