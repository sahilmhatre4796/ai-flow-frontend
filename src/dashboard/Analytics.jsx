import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchAnalytics } from "../api/misc";
import { EmptyState, Spinner, errorText } from "./shared";

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const item = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export function AnalyticsPage({ workspace, goTo }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchAnalytics(workspace.id)
      .then(d => !cancelled && setData(d))
      .catch(err => !cancelled && setError(errorText(err, "Couldn't load analytics")));
    return () => { cancelled = true; };
  }, [workspace.id]);

  if (error) return <div style={{ color: "#fca5a5" }}>{error}</div>;
  if (!data) return <Spinner label="Loading analytics" />;

  if (data.total_conversations === 0) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 style={{ marginBottom: 20 }}>Analytics</h1>
      <EmptyState icon={BarChart3} title="Nothing to analyze yet" body="Analytics are computed live from real conversations — once your bot has talked to someone, numbers show up here." actionLabel="Test your bot" onAction={() => goTo("test")} />
    </motion.div>
  );

  return (
    <motion.div variants={stagger} initial="initial" animate="animate">
      <motion.h1 variants={item} style={{ marginBottom: 20 }}>Analytics</motion.h1>

      <motion.div variants={item} style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        <Stat label="Total conversations" value={data.total_conversations} delay={0} />
        <Stat label="Resolution rate" value={data.resolution_rate != null ? `${Math.round(data.resolution_rate * 100)}%` : "N/A"} delay={0.06} />
        <Stat label="Total leads" value={data.total_leads} delay={0.12} />
        <Stat label="Avg. messages / convo" value={data.avg_messages_per_conversation != null ? data.avg_messages_per_conversation.toFixed(1) : "N/A"} delay={0.18} />
      </motion.div>

      <motion.div variants={item} className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16 }}>Conversation status breakdown</h3>
        <div style={{ display: "flex", gap: 40 }}>
          <Breakdown label="Open" value={data.open_count} color="var(--status-processing)" />
          <Breakdown label="Resolved" value={data.resolved_count} color="var(--status-success)" />
          <Breakdown label="Unresolved" value={data.unresolved_count} color="var(--status-error)" />
        </div>
      </motion.div>

      <motion.div variants={item} className="card">
        <h3 style={{ marginBottom: 14 }}>Recent questions</h3>
        {data.recent_questions.length === 0 ? (
          <p className="text-muted" style={{ fontSize: 13 }}>No questions recorded yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {data.recent_questions.map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                style={{ fontSize: 13, display: "flex", justifyContent: "space-between", gap: 12, padding: "6px 0" }}
              >
                <span>{q.text}</span>
                <span className="text-faint" style={{ flexShrink: 0 }}>{new Date(q.asked_at).toLocaleDateString()}</span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function Stat({ label, value, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="card card-interactive"
    >
      <div className="text-muted" style={{ fontSize: 13, marginBottom: 12 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>{value}</div>
    </motion.div>
  );
}

function Breakdown({ label, value, color }) {
  return (
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color, fontFamily: "var(--font-display)" }}>{value}</div>
      <div className="text-muted" style={{ fontSize: 12, marginTop: 2 }}>{label}</div>
    </div>
  );
}
