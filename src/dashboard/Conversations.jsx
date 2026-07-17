import { MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchConversation, fetchConversations, updateConversation } from "../api/conversations";
import { EmptyState, ErrorBanner, Spinner, errorText, useBots } from "./shared";

const STATUS_PILL = { resolved: "pill-success", unresolved: "pill-error", open: "pill-processing" };

export function ConversationsPage({ workspace, goTo }) {
  const { bots } = useBots(workspace.id);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchConversations(workspace.id)
      .then(data => !cancelled && setConversations(data))
      .catch(err => !cancelled && setError(errorText(err, "Couldn't load conversations")))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [workspace.id]);

  if (loading) return <Spinner label="Loading conversations" />;
  const botName = id => bots.find(b => b.id === id)?.name || "Unknown bot";

  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>Conversations</h1>
      <ErrorBanner message={error} />
      {conversations.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No conversations yet" body="Once visitors chat with your bot (or you test it yourself), real conversations show up here." actionLabel="Test your bot" onAction={() => goTo("test")} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {conversations.map(c => (
            <ConversationRow key={c.id} workspace={workspace} conv={c} botName={botName(c.bot_id)}
              expanded={openId === c.id} onToggle={() => setOpenId(openId === c.id ? null : c.id)}
              onUpdated={updated => setConversations(p => p.map(x => x.id === updated.id ? updated : x))} />
          ))}
        </div>
      )}
    </div>
  );
}

function ConversationRow({ workspace, conv, botName, expanded, onToggle, onUpdated }) {
  const [detail, setDetail] = useState(null);
  const [saving, setSaving] = useState(false);

  async function toggle() {
    onToggle();
    if (!expanded && !detail) setDetail(await fetchConversation(workspace.id, conv.id));
  }

  async function setStatus(status) {
    setSaving(true);
    try { onUpdated(await updateConversation(workspace.id, conv.id, { status })); }
    finally { setSaving(false); }
  }

  return (
    <div className="card">
      <div onClick={toggle} style={{ display: "flex", justifyContent: "space-between", cursor: "pointer" }}>
        <div>
          <div style={{ fontWeight: 600 }}>{botName}</div>
          <div className="text-muted" style={{ fontSize: 12, marginTop: 2 }}>{conv.message_count} messages · last activity {new Date(conv.last_message_at).toLocaleString()}</div>
        </div>
        <span className={`pill ${STATUS_PILL[conv.status] || "pill-neutral"}`} style={{ textTransform: "capitalize", height: "fit-content" }}>{conv.status}</span>
      </div>
      {expanded && (
        <div style={{ marginTop: 16, borderTop: "1px solid var(--border)", paddingTop: 16 }}>
          {!detail ? <Spinner label="Loading messages" /> : (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 280, overflowY: "auto", marginBottom: 16 }}>
                {detail.messages.map(m => (
                  <div key={m.id} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", background: m.role === "user" ? "rgba(99,102,241,0.18)" : "rgba(255,255,255,0.05)", borderRadius: 10, padding: "8px 12px", fontSize: 13, maxWidth: "85%" }}>{m.content}</div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button disabled={saving} className="btn btn-ghost btn-sm" onClick={() => setStatus("resolved")}>Mark resolved</button>
                <button disabled={saving} className="btn btn-ghost btn-sm" onClick={() => setStatus("unresolved")}>Mark unresolved</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
