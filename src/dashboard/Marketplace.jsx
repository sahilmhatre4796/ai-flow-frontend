import { useEffect, useState } from "react";
import { fetchTemplates, installTemplate } from "../api/misc";
import { ErrorBanner, Spinner, errorText } from "./shared";

export function MarketplacePage({ workspace, setSelectedBotId, goTo }) {
  const canInstall = workspace.role === "owner" || workspace.role === "admin";
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [installingId, setInstallingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchTemplates()
      .then(data => !cancelled && setTemplates(data))
      .catch(err => !cancelled && setError(errorText(err, "Couldn't load templates")))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  async function install(templateId) {
    setInstallingId(templateId); setError(null);
    try {
      const bot = await installTemplate(workspace.id, templateId);
      setSelectedBotId(bot.id); goTo("builder");
    } catch (err) { setError(errorText(err, "Couldn't install this template")); }
    finally { setInstallingId(null); }
  }

  if (loading) return <Spinner label="Loading templates" />;

  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>Marketplace</h1>
      <ErrorBanner message={error} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))", gap: 16 }}>
        {templates.map(t => (
          <div key={t.id} className="card card-interactive">
            <h3 style={{ marginBottom: 8 }}>{t.name}</h3>
            <p className="text-muted" style={{ fontSize: 13, marginBottom: 16, lineHeight: 1.5 }}>{t.description}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="text-faint" style={{ fontSize: 12 }}>{t.install_count} install{t.install_count === 1 ? "" : "s"}</span>
              {canInstall && <button className="btn btn-primary btn-sm" disabled={installingId === t.id} onClick={() => install(t.id)}>{installingId === t.id ? "Installing…" : "Install"}</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
