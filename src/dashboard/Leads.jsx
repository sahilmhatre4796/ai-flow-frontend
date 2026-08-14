import { motion } from "framer-motion";
import { Download, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { downloadLeadsCsv, fetchLeads } from "../api/misc";
import { EmptyState, ErrorBanner, Spinner, errorText } from "./shared";

export function LeadsPage({ workspace, goTo }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchLeads(workspace.id)
      .then(data => !cancelled && setLeads(data))
      .catch(err => !cancelled && setError(errorText(err, "Couldn't load leads")))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [workspace.id]);

  async function exportCsv() {
    setExporting(true);
    try { await downloadLeadsCsv(workspace.id); }
    catch (err) { setError(errorText(err, "Couldn't export leads")); }
    finally { setExporting(false); }
  }

  if (loading) return <Spinner label="Loading leads" />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1>Leads</h1>
        {leads.length > 0 && (
          <motion.button className="btn btn-ghost" onClick={exportCsv} disabled={exporting} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Download size={15} />{exporting ? "Exporting..." : "Export CSV"}
          </motion.button>
        )}
      </motion.div>
      <ErrorBanner message={error} />
      {leads.length === 0 ? (
        <EmptyState icon={Target} title="No leads yet" body="When your bot captures contact info during a conversation, real leads appear here." actionLabel="Test your bot" onAction={() => goTo("test")} />
      ) : (
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ padding: 0, overflow: "hidden" }}
        >
          <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
            <thead>
              <tr className="text-muted" style={{ textAlign: "left", fontSize: 12 }}>
                <th style={{ padding: "16px 24px" }}>Name</th>
                <th style={{ padding: "16px 24px" }}>Email</th>
                <th style={{ padding: "16px 24px" }}>Company</th>
                <th style={{ padding: "16px 24px" }}>Captured</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, i) => (
                <motion.tr
                  key={lead.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  style={{ borderTop: "1px solid var(--border)" }}
                >
                  <td style={{ padding: "14px 24px" }}>{lead.name}</td>
                  <td className="text-muted" style={{ padding: "14px 24px" }}>{lead.email}</td>
                  <td className="text-muted" style={{ padding: "14px 24px" }}>{lead.company || "---"}</td>
                  <td className="text-muted" style={{ padding: "14px 24px" }}>{new Date(lead.captured_at).toLocaleDateString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </motion.div>
  );
}
