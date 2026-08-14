import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { fetchTemplates, installTemplate } from "../api/misc";
import { ErrorBanner, Spinner, errorText } from "./shared";

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const item = {
  initial: { opacity: 0, y: 16, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 20 }}>Marketplace</motion.h1>
      <ErrorBanner message={error} />
      <motion.div variants={stagger} initial="initial" animate="animate" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px,1fr))", gap: 16 }}>
        {templates.map(t => (
          <motion.div key={t.id} variants={item} className="card card-interactive" style={{ position: "relative", overflow: "hidden" }}>
            <div style={{
              position: "absolute",
              top: -30,
              right: -30,
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(99,102,241,0.06), transparent)",
              pointerEvents: "none",
            }} />
            <h3 style={{ marginBottom: 8 }}>{t.name}</h3>
            <p className="text-muted" style={{ fontSize: 13, marginBottom: 18, lineHeight: 1.6 }}>{t.description}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="text-faint" style={{ fontSize: 12 }}>{t.install_count} install{t.install_count === 1 ? "" : "s"}</span>
              {canInstall && (
                <motion.button
                  className="btn btn-primary btn-sm"
                  disabled={installingId === t.id}
                  onClick={() => install(t.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {installingId === t.id ? "Installing..." : "Install"}
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
