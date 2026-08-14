import { motion } from "framer-motion";
import { Bot, Play, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { createBot, updateBot } from "../api/bots";
import { BotPicker, EmptyState, ErrorBanner, Spinner, errorText, useBots } from "./shared";

const PROVIDER_MODELS = { anthropic: ["claude-sonnet-4-6", "claude-haiku-4-5-20251001"], openai: ["gpt-4o", "gpt-4o-mini"], ollama: ["llama3", "mistral"] };

const item = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export function BotBuilderPage({ workspace, selectedBotId, setSelectedBotId, bumpBotsVersion, goTo }) {
  const canWrite = workspace.role === "owner" || workspace.role === "admin";
  const { bots, loading, error, setBots } = useBots(workspace.id);
  const [creating, setCreating] = useState(false);

  useEffect(() => { if (!selectedBotId && bots.length > 0) setSelectedBotId(bots[0].id); }, [bots, selectedBotId, setSelectedBotId]);

  if (loading) return <Spinner label="Loading bots" />;
  const selectedBot = bots.find(b => b.id === selectedBotId) || bots[0];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}
      >
        <h1>Bot Builder</h1>
        {canWrite && (
          <motion.button
            className="btn btn-primary"
            onClick={() => setCreating(true)}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            <Plus size={16} />New bot
          </motion.button>
        )}
      </motion.div>
      <ErrorBanner message={error} />
      {creating && (
        <CreateBotForm workspace={workspace} onCreated={bot => { setBots(p => [...p, bot]); setSelectedBotId(bot.id); bumpBotsVersion(); setCreating(false); }} onCancel={() => setCreating(false)} />
      )}
      {bots.length === 0 && !creating ? (
        <EmptyState icon={Bot} title="No bots yet" body={canWrite ? "Create your first bot to get started." : "Ask an admin to create the first bot."} actionLabel={canWrite ? "Create a bot" : undefined} onAction={() => setCreating(true)} />
      ) : (
        <>
          <BotPicker bots={bots} selectedBotId={selectedBot?.id} setSelectedBotId={setSelectedBotId} />
          {selectedBot && <BotEditor key={selectedBot.id} workspace={workspace} bot={selectedBot} canWrite={canWrite} onUpdated={updated => setBots(p => p.map(b => b.id === updated.id ? updated : b))} onTestBot={() => goTo("test")} />}
        </>
      )}
    </motion.div>
  );
}

function CreateBotForm({ workspace, onCreated, onCancel }) {
  const [name, setName] = useState("");
  const [persona, setPersona] = useState("You are a friendly, helpful support assistant.");
  const [provider, setProvider] = useState("anthropic");
  const [model, setModel] = useState(PROVIDER_MODELS.anthropic[0]);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(e) {
    e.preventDefault(); setSubmitting(true); setError(null);
    try { onCreated(await createBot(workspace.id, { name, persona, chat_provider: provider, chat_model: model })); }
    catch (err) { setError(errorText(err, "Couldn't create the bot")); }
    finally { setSubmitting(false); }
  }

  return (
    <motion.form
      onSubmit={submit}
      className="card"
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4 }}
      style={{ marginBottom: 24, display: "flex", flexDirection: "column", gap: 14, border: "1px solid rgba(99,102,241,0.15)" }}
    >
      <input className="input" placeholder="Bot name" required value={name} onChange={e => setName(e.target.value)} />
      <textarea className="input" style={{ minHeight: 80, resize: "vertical" }} placeholder="Persona / system prompt" required value={persona} onChange={e => setPersona(e.target.value)} />
      <div style={{ display: "flex", gap: 10 }}>
        <select className="input" value={provider} onChange={e => { setProvider(e.target.value); setModel(PROVIDER_MODELS[e.target.value][0]); }}>
          {Object.keys(PROVIDER_MODELS).map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select className="input" value={model} onChange={e => setModel(e.target.value)}>
          {PROVIDER_MODELS[provider].map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      {error && <div style={{ color: "#fca5a5", fontSize: 13 }}>{error}</div>}
      <div style={{ display: "flex", gap: 10 }}>
        <motion.button type="submit" disabled={submitting} className="btn btn-primary" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          {submitting ? "Creating..." : "Create bot"}
        </motion.button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </motion.form>
  );
}

function BotEditor({ workspace, bot, canWrite, onUpdated, onTestBot }) {
  const [name, setName] = useState(bot.name);
  const [persona, setPersona] = useState(bot.persona);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const dirty = name !== bot.name || persona !== bot.persona;

  async function save() {
    setSaving(true); setError(null);
    try { onUpdated(await updateBot(workspace.id, bot.id, { name, persona })); }
    catch (err) { setError(errorText(err, "Couldn't save changes")); }
    finally { setSaving(false); }
  }

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h3>Editing "{bot.name}"</h3>
        <motion.button className="btn btn-ghost btn-sm" onClick={onTestBot} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Play size={14} />Test this bot
        </motion.button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span className="text-muted" style={{ fontSize: 13 }}>Name</span>
          <input className="input" value={name} disabled={!canWrite} onChange={e => setName(e.target.value)} />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span className="text-muted" style={{ fontSize: 13 }}>Persona / system prompt</span>
          <textarea className="input" style={{ minHeight: 130, resize: "vertical" }} value={persona} disabled={!canWrite} onChange={e => setPersona(e.target.value)} />
        </label>
        {error && <div style={{ color: "#fca5a5", fontSize: 13 }}>{error}</div>}
        {canWrite && (
          <motion.button
            className="btn btn-primary"
            disabled={!dirty || saving}
            onClick={save}
            style={{ alignSelf: "flex-start" }}
            whileHover={dirty ? { scale: 1.02 } : {}}
            whileTap={dirty ? { scale: 0.98 } : {}}
          >
            {saving ? "Saving..." : "Save changes"}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
