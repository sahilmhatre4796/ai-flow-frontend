import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { rotateBotKey, updateBot } from "../api/bots";
import { WIDGET_SCRIPT_URL } from "../api/client";
import { BotPicker, NoBotsYet, Spinner, errorText, useBots } from "./shared";

export function SettingsPage({ workspace, selectedBotId, setSelectedBotId, goTo }) {
  const canWrite = workspace.role === "owner" || workspace.role === "admin";
  const { bots, loading, setBots } = useBots(workspace.id);
  useEffect(() => { if (!selectedBotId && bots.length > 0) setSelectedBotId(bots[0].id); }, [bots, selectedBotId, setSelectedBotId]);
  if (loading) return <Spinner label="Loading" />;
  if (bots.length === 0) return <NoBotsYet onGoToBuilder={() => goTo("builder")} />;
  const bot = bots.find(b => b.id === selectedBotId) || bots[0];
  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>Settings</h1>
      <BotPicker bots={bots} selectedBotId={bot.id} setSelectedBotId={setSelectedBotId} />
      <WidgetSettings key={bot.id} workspace={workspace} bot={bot} canWrite={canWrite} onUpdated={updated => setBots(p => p.map(b => b.id === updated.id ? updated : b))} />
    </div>
  );
}

function WidgetSettings({ workspace, bot, canWrite, onUpdated }) {
  const [color, setColor] = useState(bot.widget_color);
  const [position, setPosition] = useState(bot.widget_position);
  const [saving, setSaving] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [error, setError] = useState(null);
  const dirty = color !== bot.widget_color || position !== bot.widget_position;

  async function save() {
    setSaving(true); setError(null);
    try { onUpdated(await updateBot(workspace.id, bot.id, { widget_color: color, widget_position: position })); }
    catch (err) { setError(errorText(err, "Couldn't save settings")); }
    finally { setSaving(false); }
  }

  async function rotateKey() {
    if (!window.confirm("This invalidates the current embed code on any site using it. Continue?")) return;
    setRotating(true);
    try { onUpdated(await rotateBotKey(workspace.id, bot.id)); }
    finally { setRotating(false); }
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <div className="card">
        <h3 style={{ marginBottom: 18 }}>Widget appearance</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span className="text-muted" style={{ fontSize: 13 }}>Accent color</span>
            <input type="color" disabled={!canWrite} value={color} onChange={e => setColor(e.target.value)} style={{ width: 60, height: 36, borderRadius: 8, border: "1px solid var(--border)", background: "none" }} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span className="text-muted" style={{ fontSize: 13 }}>Position</span>
            <select className="input" disabled={!canWrite} value={position} onChange={e => setPosition(e.target.value)}>
              <option value="bottom-right">Bottom right</option>
              <option value="bottom-left">Bottom left</option>
            </select>
          </label>
          {error && <div style={{ color: "#fca5a5", fontSize: 13 }}>{error}</div>}
          {canWrite && <button className="btn btn-primary" disabled={!dirty || saving} onClick={save} style={{ alignSelf: "flex-start" }}>{saving ? "Saving…" : "Save changes"}</button>}
        </div>
      </div>
      <div className="card">
        <h3 style={{ marginBottom: 18 }}>Embed this bot</h3>
        <p className="text-muted" style={{ fontSize: 13, marginBottom: 14, lineHeight: 1.5 }}>
          Paste this snippet before <code className="mono">&lt;/body&gt;</code> on any site. Identifies the bot only by its public key — never your workspace or internal IDs.
        </p>
        <pre className="mono" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid var(--border)", borderRadius: 10, padding: 16, fontSize: 12, color: "var(--ink-muted)", overflowX: "auto", lineHeight: 1.8 }}>
{`<script src="${WIDGET_SCRIPT_URL}"
  data-bot-id="${bot.public_key}"
  data-color="${bot.widget_color}"
  data-position="${bot.widget_position}">
</script>`}
        </pre>
        {canWrite && <button className="btn btn-ghost btn-sm" onClick={rotateKey} disabled={rotating} style={{ marginTop: 12 }}><RefreshCw size={13} />{rotating ? "Rotating…" : "Rotate public key"}</button>}
      </div>
    </div>
  );
}
