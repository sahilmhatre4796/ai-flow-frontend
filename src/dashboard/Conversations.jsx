import { motion } from "framer-motion";
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 20 }}>Conversations</motion.h1>
      <ErrorBanner message={error} />
      {conversations.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No conversations yet" body="Once visitors chat with your bot (or you test it yourself), real conversations show up here." actionLabel="Test your bot" onAction={() => goTo("test")} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {conversations.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
            >
              <ConversationRow workspace={workspace} conv={c} botName={botName(c.bot_id)}
                expanded={openId === c.id} onToggle={() => setOpenId(openId === c.id ? null : c.id)}
                onUpdated={updated => setConversations(p => p.map(x => x.id === updated.id ? updated : x))} />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
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
    <motion.div className="card" whileHover={{ borderColor: "rgba(99,102,241,0.12)" }}>
      <div onClick={toggle} style={{ display: "flex", justifyContent: "space-between", cursor: "pointer" }}>
        <div>
          <div style={{ fontWeight: 600 }}>{botName}</div>
          <div className="text-muted" style={{ fontSize: 12, marginTop: 2 }}>{conv.message_count} messages · last activity {new Date(conv.last_message_at).toLocaleString()}</div>
        </div>
        <span className={`pill ${STATUS_PILL[conv.status] || "pill-neutral"}`} style={{ textTransform: "capitalize", height: "fit-content" }}>{conv.status}</span>
      </div>
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          style={{ marginTop: 16, borderTop: "1px solid var(--border)", paddingTop: 16 }}
        >
          {!detail ? <Spinner label="Loading messages" /> : (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 280, overflowY: "auto", marginBottom: 16 }}>
                {detail.messages.map((m, i) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, x: m.role === "user" ? 10 : -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    style={{
                      alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                      background: m.role === "user" ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.05)",
                      borderRadius: 10,
                      padding: "9px 13px",
                      fontSize: 13,
                      maxWidth: "85%",
                      lineHeight: 1.5,
                    }}
                  >
                    {m.content}
                  </motion.div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <motion.button disabled={saving} className="btn btn-ghost btn-sm" onClick={() => setStatus("resolved")} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>Mark resolved</motion.button>
                <motion.button disabled={saving} className="btn btn-ghost btn-sm" onClick={() => setStatus("unresolved")} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>Mark unresolved</motion.button>
              </div>
            </>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
