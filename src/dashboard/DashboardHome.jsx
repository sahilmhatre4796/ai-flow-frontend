import { Bot, Check, Database, MessageSquare, Play, Target, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchAnalytics, fetchUsage } from "../api/misc";
import { EmptyState, Spinner, errorText, useBots } from "./shared";

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
    <div>
      <h1 style={{ marginBottom: 24 }}>Dashboard</h1>
      {error && <div style={{ color: "#fca5a5", marginBottom: 16, fontSize: 13 }}>{error}</div>}
      {remaining.length > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
            <h3>Get started</h3>
            <span className="text-muted" style={{ fontSize: 13 }}>{checklist.length - remaining.length} of {checklist.length} done</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {checklist.map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 26, height: 26, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", background: item.done ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.05)", color: item.done ? "var(--status-success)" : "var(--ink-faint)", flexShrink: 0 }}>
                      {item.done ? <Check size={14} strokeWidth={2.5} /> : <Icon size={14} strokeWidth={1.8} />}
                    </div>
                    <span style={{ color: item.done ? "var(--ink-faint)" : "var(--ink)", textDecoration: item.done ? "line-through" : "none", fontSize: 14 }}>{item.label}</span>
                  </div>
                  {!item.done && <button onClick={item.action} className="btn btn-ghost btn-sm">Go</button>}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {bots.length === 0 ? (
        <EmptyState icon={Bot} title="No bots yet" body="Create your first bot to start seeing real conversation and lead data here." actionLabel="Create a bot" onAction={() => goTo("builder")} />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          <StatCard icon={Bot} label="Bots" value={bots.length} />
          <StatCard icon={MessageSquare} label="Conversations" value={analytics.total_conversations} />
          <StatCard icon={Check} label="Resolution rate" value={analytics.resolution_rate != null ? `${Math.round(analytics.resolution_rate * 100)}%` : "N/A"} />
          <StatCard icon={Target} label="Leads captured" value={analytics.total_leads} />
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="card card-interactive">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <span className="text-muted" style={{ fontSize: 13 }}>{label}</span>
        <Icon size={16} strokeWidth={1.8} style={{ color: "var(--ink-faint)" }} />
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "var(--font-display)" }}>{value}</div>
    </div>
  );
}
