import { motion } from "framer-motion";
import { Bot, Check, Database, MessageSquare, Play, Target, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchAnalytics, fetchUsage } from "../api/misc";
import { EmptyState, Spinner, errorText, useBots } from "./shared";

const stagger = {
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const item = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function DashboardHome({ workspace, goTo }) {
  const { bots, loading: botsLoading } = useBots(workspace.id);
  const [usage, setUsage] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchUsage(workspace.id), fetchAnalytics(workspace.id)])
      .then(([u, a]) => { if (!cancelled) { setUsage(u); setAnalytics(a); } })
      .catch(err => !cancelled && setError(errorText(err, "Couldn't load your dashboard")));
    return () => { cancelled = true; };
  }, [workspace.id]);

  if (botsLoading || !usage || !analytics) return <Spinner label="Loading dashboard" />;

  const checklist = [
    { label: "Create your first bot", icon: Bot, done: bots.length > 0, action: () => goTo("builder") },
    { label: "Upload a knowledge base document", icon: Database, done: usage.documents_uploaded > 0, action: () => goTo("knowledge") },
    { label: "Test your bot", icon: Play, done: analytics.total_conversations > 0, action: () => goTo("test") },
    { label: "Invite a teammate", icon: Users, done: usage.team_members > 1, action: () => goTo("team") },
  ];
  const remaining = checklist.filter(c => !c.done);

  return (
    <motion.div variants={stagger} initial="initial" animate="animate">
      <motion.h1 variants={item} style={{ marginBottom: 28 }}>
        Dashboard
      </motion.h1>

      {error && (
        <motion.div variants={item} style={{ color: "#fca5a5", marginBottom: 16, fontSize: 13, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: "12px 16px" }}>
          {error}
        </motion.div>
      )}

      {remaining.length > 0 && (
        <motion.div variants={item} className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
            <h3>Get started</h3>
            <span className="text-muted" style={{ fontSize: 13 }}>
              {checklist.length - remaining.length} of {checklist.length} done
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {checklist.map((ci, i) => {
              const Icon = ci.icon;
              return (
                <motion.div
                  key={ci.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 6px",
                    borderRadius: 10,
                    transition: "background 150ms ease",
                  }}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <motion.div
                      animate={ci.done ? { scale: [1, 1.15, 1] } : {}}
                      transition={{ duration: 0.4 }}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 9,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: ci.done ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.04)",
                        color: ci.done ? "var(--status-success)" : "var(--ink-faint)",
                        flexShrink: 0,
                        boxShadow: ci.done ? "0 0 12px rgba(34,197,94,0.15)" : "none",
                      }}
                    >
                      {ci.done ? <Check size={15} strokeWidth={2.5} /> : <Icon size={15} strokeWidth={1.8} />}
                    </motion.div>
                    <span style={{
                      color: ci.done ? "var(--ink-faint)" : "var(--ink)",
                      textDecoration: ci.done ? "line-through" : "none",
                      fontSize: 14,
                      fontWeight: ci.done ? 400 : 500,
                    }}>
                      {ci.label}
                    </span>
                  </div>
                  {!ci.done && (
                    <motion.button
                      onClick={ci.action}
                      className="btn btn-ghost btn-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Go
                    </motion.button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {bots.length === 0 ? (
        <motion.div variants={item}>
          <EmptyState
            icon={Bot}
            title="No bots yet"
            body="Create your first bot to start seeing real conversation and lead data here."
            actionLabel="Create a bot"
            onAction={() => goTo("builder")}
          />
        </motion.div>
      ) : (
        <motion.div
          variants={stagger}
          style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}
        >
          <StatCard icon={Bot} label="Bots" value={bots.length} delay={0} />
          <StatCard icon={MessageSquare} label="Conversations" value={analytics.total_conversations} delay={0.08} />
          <StatCard icon={Check} label="Resolution rate" value={analytics.resolution_rate != null ? `${Math.round(analytics.resolution_rate * 100)}%` : "N/A"} delay={0.16} />
          <StatCard icon={Target} label="Leads captured" value={analytics.total_leads} delay={0.24} />
        </motion.div>
      )}
    </motion.div>
  );
}

function StatCard({ icon: Icon, label, value, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, boxShadow: "0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.15)" }}
      className="card card-interactive"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <div style={{
        position: "absolute",
        top: -20,
        right: -20,
        width: 80,
        height: 80,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.08), transparent)",
        pointerEvents: "none",
      }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <span className="text-muted" style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 9,
          background: "rgba(99,102,241,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <Icon size={16} strokeWidth={1.8} style={{ color: "#a5b4fc" }} />
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.2, duration: 0.4 }}
        style={{ fontSize: 30, fontWeight: 700, fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
      >
        {value}
      </motion.div>
    </motion.div>
  );
}
