import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ display: "flex", flexDirection: "column", gap: 12 }}
    >
      <Skeleton height={88} />
      <Skeleton height={88} />
      <motion.span
        className="text-faint"
        style={{ fontSize: 12 }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        {label}...
      </motion.span>
    </motion.div>
  );
}

export function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -8, height: 0 }}
      style={{
        background: "rgba(239,68,68,0.06)",
        border: "1px solid rgba(239,68,68,0.2)",
        color: "#fca5a5",
        borderRadius: 12,
        padding: "12px 16px",
        fontSize: 13,
        marginBottom: 16,
      }}
    >
      {message}
    </motion.div>
  );
}

export function EmptyState({ icon, title, body, actionLabel, onAction }) {
  const Icon = icon || Inbox;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="card"
      style={{ textAlign: "center", padding: "60px 32px" }}
    >
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: "rgba(99,102,241,0.1)",
          color: "#a5b4fc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
          boxShadow: "0 0 24px rgba(99,102,241,0.12)",
        }}
      >
        <Icon size={26} strokeWidth={1.75} />
      </motion.div>
      <h3 style={{ marginBottom: 8 }}>{title}</h3>
      <p className="text-muted" style={{ fontSize: 14, marginBottom: actionLabel ? 24 : 0, maxWidth: 380, marginInline: "auto", lineHeight: 1.6 }}>
        {body}
      </p>
      {actionLabel && (
        <motion.button
          className="btn btn-primary"
          onClick={onAction}
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
}

export function NoBotsYet({ onGoToBuilder }) {
  return (
    <EmptyState
      title="Create your first bot to get started"
      body="Bots live in the Bot Builder — once you've created one, this page fills in with real data."
      actionLabel="Go to Bot Builder"
      onAction={onGoToBuilder}
    />
  );
}

export function BotPicker({ bots, selectedBotId, setSelectedBotId }) {
  if (bots.length <= 1) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: "flex",
        gap: 6,
        marginBottom: 24,
        flexWrap: "wrap",
        borderBottom: "1px solid var(--border)",
        paddingBottom: 14,
      }}
    >
      {bots.map((b, i) => (
        <motion.button
          key={b.id}
          onClick={() => setSelectedBotId(b.id)}
          className={`pill ${selectedBotId === b.id ? "pill-brand" : "pill-neutral"}`}
          style={{ border: "none", cursor: "pointer", fontSize: 13, padding: "7px 14px" }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {b.name}
        </motion.button>
      ))}
    </motion.div>
  );
}
