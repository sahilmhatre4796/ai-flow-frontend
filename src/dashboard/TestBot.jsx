import { Send, UserPlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { sendSandboxMessage } from "../api/conversations";
import { createLead } from "../api/misc";
import { BotPicker, NoBotsYet, Spinner, errorText, useBots } from "./shared";

export function TestBotPage({ workspace, selectedBotId, setSelectedBotId, goTo }) {
  const { bots, loading } = useBots(workspace.id);
  useEffect(() => { if (!selectedBotId && bots.length > 0) setSelectedBotId(bots[0].id); }, [bots, selectedBotId, setSelectedBotId]);
  if (loading) return <Spinner label="Loading" />;
  if (bots.length === 0) return <NoBotsYet onGoToBuilder={() => goTo("builder")} />;
  const bot = bots.find(b => b.id === selectedBotId) || bots[0];
  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>Test bot</h1>
      <BotPicker bots={bots} selectedBotId={bot.id} setSelectedBotId={setSelectedBotId} />
      <Sandbox key={bot.id} workspace={workspace} bot={bot} />
    </div>
  );
}

function Sandbox({ workspace, bot }) {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input_, setInput] = useState("");
  const [loadingReply, setLoadingReply] = useState(false);
  const [error, setError] = useState(null);
  const [leadOpen, setLeadOpen] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => { setConversationId(null); setMessages([]); }, [bot.id]);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages, loadingReply]);

  async function send(e) {
    e.preventDefault();
    const text = input_.trim(); if (!text) return;
    setInput("");
    setMessages(m => [...m, { role: "user", content: text }]);
    setLoadingReply(true); setError(null);
    try {
      const res = await sendSandboxMessage(workspace.id, bot.id, text, conversationId);
      setConversationId(res.conversation_id);
      setMessages(m => [...m, res.assistant_message]);
    } catch (err) { setError(errorText(err, "The bot couldn't respond — please try again")); }
    finally { setLoadingReply(false); }
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
      <div className="card" style={{ display: "flex", flexDirection: "column", height: 540, padding: 20 }}>
        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
          {messages.length === 0 && <div className="text-muted" style={{ fontSize: 14, margin: "auto", textAlign: "center", maxWidth: 280 }}>Send a message to test "{bot.name}" — this calls the real RAG pipeline against your knowledge base.</div>}
          {messages.map((m, i) => (
            <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", background: m.role === "user" ? "var(--brand-gradient)" : "rgba(255,255,255,0.05)", color: m.role === "user" ? "#fff" : "var(--ink)", borderRadius: 12, padding: "10px 14px", maxWidth: "80%", fontSize: 14 }}>{m.content}</div>
          ))}
          {loadingReply && <div style={{ display: "flex", gap: 4, padding: "10px 14px" }}>{[0,1,2].map(i => <span key={i} className="skeleton" style={{ width: 6, height: 6, borderRadius: "50%", animationDelay: `${i*120}ms` }} />)}</div>}
        </div>
        {error && <div style={{ color: "#fca5a5", fontSize: 13, marginTop: 8 }}>{error}</div>}
        <form onSubmit={send} style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <input className="input" placeholder="Ask your bot something…" value={input_} onChange={e => setInput(e.target.value)} />
          <button type="submit" className="btn btn-primary" disabled={loadingReply}><Send size={15} /></button>
        </form>
      </div>
      <div className="card">
        <h3 style={{ marginBottom: 10, fontSize: 15 }}>Simulate lead capture</h3>
        <p className="text-muted" style={{ fontSize: 13, marginBottom: 16 }}>See how a captured lead would flow into your real Leads page.</p>
        {leadOpen ? (
          <LeadForm workspace={workspace} bot={bot} conversationId={conversationId} onDone={() => setLeadOpen(false)} />
        ) : (
          <button className="btn btn-ghost" onClick={() => setLeadOpen(true)} style={{ width: "100%" }}><UserPlus size={15} />Capture a test lead</button>
        )}
      </div>
    </div>
  );
}

function LeadForm({ workspace, bot, conversationId, onDone }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault(); setBusy(true); setError(null);
    try { await createLead(workspace.id, { bot_id: bot.id, conversation_id: conversationId, name, email }); onDone(); }
    catch (err) { setError(errorText(err, "Couldn't capture this lead")); }
    finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <input className="input" placeholder="Name" required value={name} onChange={e => setName(e.target.value)} />
      <input className="input" placeholder="Email" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
      {error && <div style={{ color: "#fca5a5", fontSize: 12 }}>{error}</div>}
      <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? "Saving…" : "Save lead"}</button>
    </form>
  );
}
