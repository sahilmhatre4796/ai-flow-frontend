import { Database, FileText, Link2, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createDocumentFromText, createDocumentFromUrl, deleteDocument, fetchChunks, fetchDocuments, uploadDocument } from "../api/knowledge";
import { BotPicker, EmptyState, ErrorBanner, NoBotsYet, Spinner, errorText, useBots } from "./shared";

const STATUS_LABEL = { pending: "Queued", parsing: "Parsing…", chunking: "Chunking…", embedding: "Embedding…", ready: "Ready", error: "Error" };
const IN_PROGRESS = new Set(["pending", "parsing", "chunking", "embedding"]);
const STATUS_PILL = { ready: "pill-success", error: "pill-error" };

export function KnowledgeBasePage({ workspace, selectedBotId, setSelectedBotId, goTo }) {
  const canWrite = workspace.role === "owner" || workspace.role === "admin";
  const { bots, loading: botsLoading } = useBots(workspace.id);
  useEffect(() => { if (!selectedBotId && bots.length > 0) setSelectedBotId(bots[0].id); }, [bots, selectedBotId, setSelectedBotId]);
  if (botsLoading) return <Spinner label="Loading" />;
  if (bots.length === 0) return <NoBotsYet onGoToBuilder={() => goTo("builder")} />;
  const bot = bots.find(b => b.id === selectedBotId) || bots[0];
  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>Knowledge Base</h1>
      <BotPicker bots={bots} selectedBotId={bot.id} setSelectedBotId={setSelectedBotId} />
      <DocumentManager key={bot.id} workspace={workspace} bot={bot} canWrite={canWrite} />
    </div>
  );
}

function DocumentManager({ workspace, bot, canWrite }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const pollRef = useRef(null);

  const reload = async () => {
    try { const docs = await fetchDocuments(workspace.id, bot.id); setDocuments(docs); }
    catch (err) { setError(errorText(err, "Couldn't load documents")); }
    finally { setLoading(false); }
  };

  useEffect(() => { reload(); return () => clearInterval(pollRef.current); }, [workspace.id, bot.id]);
  useEffect(() => {
    const anyInProgress = documents.some(d => IN_PROGRESS.has(d.status));
    clearInterval(pollRef.current);
    if (anyInProgress) pollRef.current = setInterval(reload, 3000);
    return () => clearInterval(pollRef.current);
  }, [documents]);

  if (loading) return <Spinner label="Loading documents" />;
  return (
    <div>
      {canWrite && <AddDocumentForm workspace={workspace} bot={bot} onAdded={doc => setDocuments(d => [doc, ...d])} />}
      <ErrorBanner message={error} />
      {documents.length === 0 ? (
        <EmptyState icon={Database} title="No documents yet" body="Upload a file, paste text, or add a URL above — your bot retrieves real answers from whatever you add here." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {documents.map(doc => (
            <DocumentRow key={doc.id} workspace={workspace} bot={bot} doc={doc} canWrite={canWrite}
              expanded={expandedId === doc.id} onToggle={() => setExpandedId(expandedId === doc.id ? null : doc.id)}
              onDeleted={() => setDocuments(d => d.filter(x => x.id !== doc.id))} />
          ))}
        </div>
      )}
    </div>
  );
}

function AddDocumentForm({ workspace, bot, onAdded }) {
  const [mode, setMode] = useState("file");
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [isSitemap, setIsSitemap] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function handleFile(e) {
    const file = e.target.files?.[0]; if (!file) return;
    setBusy(true); setError(null);
    try { onAdded(await uploadDocument(workspace.id, bot.id, file)); }
    catch (err) { setError(errorText(err, "Upload failed")); }
    finally { setBusy(false); e.target.value = ""; }
  }

  async function submitText(e) {
    e.preventDefault(); setBusy(true); setError(null);
    try { onAdded(await createDocumentFromText(workspace.id, bot.id, { name: name || "Pasted text", text })); setName(""); setText(""); }
    catch (err) { setError(errorText(err, "Couldn't add this text")); }
    finally { setBusy(false); }
  }

  async function submitUrl(e) {
    e.preventDefault(); setBusy(true); setError(null);
    try { onAdded(await createDocumentFromUrl(workspace.id, bot.id, { name: name || url, url, is_sitemap: isSitemap })); setName(""); setUrl(""); }
    catch (err) { setError(errorText(err, "Couldn't add this URL")); }
    finally { setBusy(false); }
  }

  const modes = [{ id: "file", label: "Upload file", icon: Upload }, { id: "text", label: "Paste text", icon: FileText }, { id: "url", label: "Website URL", icon: Link2 }];
  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {modes.map(m => { const Icon = m.icon; return <button key={m.id} onClick={() => setMode(m.id)} className={`btn ${mode === m.id ? "btn-primary" : "btn-ghost"}`}><Icon size={14} />{m.label}</button>; })}
      </div>
      {error && <div style={{ color: "#fca5a5", fontSize: 13, marginBottom: 12 }}>{error}</div>}
      {mode === "file" && <input type="file" accept=".pdf,.docx,.csv,.txt" disabled={busy} onChange={handleFile} className="text-muted" />}
      {mode === "text" && (
        <form onSubmit={submitText} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input className="input" placeholder="Name (optional)" value={name} onChange={e => setName(e.target.value)} />
          <textarea className="input" style={{ minHeight: 100 }} placeholder="Paste FAQ content, policies, product info…" required value={text} onChange={e => setText(e.target.value)} />
          <button type="submit" disabled={busy || !text.trim()} className="btn btn-primary" style={{ alignSelf: "flex-start" }}>{busy ? "Adding…" : "Add text"}</button>
        </form>
      )}
      {mode === "url" && (
        <form onSubmit={submitUrl} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input className="input" placeholder="Name (optional)" value={name} onChange={e => setName(e.target.value)} />
          <input className="input input-mono" placeholder="https://example.com/help or .../sitemap.xml" required value={url} onChange={e => setUrl(e.target.value)} />
          <label className="text-muted" style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13 }}>
            <input type="checkbox" checked={isSitemap} onChange={e => setIsSitemap(e.target.checked)} />
            This is a sitemap.xml — crawl every page in it
          </label>
          <button type="submit" disabled={busy || !url.trim()} className="btn btn-primary" style={{ alignSelf: "flex-start" }}>{busy ? "Adding…" : "Add URL"}</button>
        </form>
      )}
    </div>
  );
}

function DocumentRow({ workspace, bot, doc, canWrite, expanded, onToggle, onDeleted }) {
  const [chunks, setChunks] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function toggle() {
    onToggle();
    if (!expanded && chunks === null && doc.status === "ready") setChunks(await fetchChunks(workspace.id, bot.id, doc.id));
  }

  async function remove() {
    setDeleting(true);
    try { await deleteDocument(workspace.id, bot.id, doc.id); onDeleted(); }
    finally { setDeleting(false); }
  }

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div onClick={toggle} style={{ cursor: doc.status === "ready" ? "pointer" : "default", flex: 1 }}>
          <div style={{ fontWeight: 600 }}>{doc.name}</div>
          <div className="text-muted" style={{ fontSize: 12, marginTop: 2 }}>{doc.char_count != null ? `${doc.char_count.toLocaleString()} characters · ` : ""}{new Date(doc.created_at).toLocaleString()}</div>
        </div>
        <span className={`pill ${STATUS_PILL[doc.status] || "pill-processing"}`} style={{ marginRight: 14 }}>{STATUS_LABEL[doc.status] || doc.status}</span>
        {canWrite && <button onClick={remove} disabled={deleting} className="btn btn-danger btn-sm"><Trash2 size={13} /></button>}
      </div>
      {doc.status === "error" && doc.error_message && <div style={{ color: "#fca5a5", fontSize: 12, marginTop: 10 }}>{doc.error_message}</div>}
      {expanded && chunks && (
        <div style={{ marginTop: 16, borderTop: "1px solid var(--border)", paddingTop: 16 }}>
          <div className="text-muted" style={{ fontSize: 12, marginBottom: 10 }}>{chunks.length} chunks</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 240, overflowY: "auto" }}>
            {chunks.map(c => <div key={c.id} className="text-muted mono" style={{ fontSize: 12, background: "rgba(255,255,255,0.03)", padding: 10, borderRadius: 8 }}>{c.content}</div>)}
          </div>
        </div>
      )}
    </div>
  );
}
