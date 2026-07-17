import { BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchAnalytics } from "../api/misc";
import { EmptyState, Spinner, errorText } from "./shared";

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
    <div>
      <h1 style={{ marginBottom: 20 }}>Analytics</h1>
      <EmptyState icon={BarChart3} title="Nothing to analyze yet" body="Analytics are computed live from real conversations — once your bot has talked to someone, numbers show up here." actionLabel="Test your bot" onAction={() => goTo("test")} />
    </div>
  );

  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>Analytics</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        <Stat label="Total conversations" value={data.total_conversations} />
        <Stat label="Resolution rate" value={data.resolution_rate != null ? `${Math.round(data.resolution_rate * 100)}%` : "N/A"} />
        <Stat label="Total leads" value={data.total_leads} />
        <Stat label="Avg. messages / convo" value={data.avg_messages_per_conversation != null ? data.avg_messages_per_conversation.toFixed(1) : "N/A"} />
      </div>
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16 }}>Conversation status breakdown</h3>
        <div style={{ display: "flex", gap: 32 }}>
          <Breakdown label="Open" value={data.open_count} color="var(--status-processing)" />
          <Breakdown label="Resolved" value={data.resolved_count} color="var(--status-success)" />
          <Breakdown label="Unresolved" value={data.unresolved_count} color="var(--status-error)" />
        </div>
      </div>
      <div className="card">
        <h3 style={{ marginBottom: 14 }}>Recent questions</h3>
        {data.recent_questions.length === 0 ? (
          <p className="text-muted" style={{ fontSize: 13 }}>No questions recorded yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {data.recent_questions.map((q, i) => (
              <div key={i} style={{ fontSize: 13, display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span>{q.text}</span>
                <span className="text-faint" style={{ flexShrink: 0 }}>{new Date(q.asked_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="card card-interactive">
      <div className="text-muted" style={{ fontSize: 13, marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "var(--font-display)" }}>{value}</div>
    </div>
  );
}

function Breakdown({ label, value, color }) {
  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 700, color, fontFamily: "var(--font-display)" }}>{value}</div>
      <div className="text-muted" style={{ fontSize: 12 }}>{label}</div>
    </div>
  );
}
