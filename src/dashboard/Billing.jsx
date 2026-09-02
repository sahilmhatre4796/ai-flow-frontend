import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { fetchUsage } from "../api/misc";
import { Spinner } from "./shared";

const PLANS = [
  { id: "free", label: "Free", price: "$0", priceINR: "₹0 (India)", features: ["1 bot", "100 messages/month", "0 documents", "1 team member"] },
  { id: "pro", label: "Pro", price: "$10/month", priceINR: "₹999/month (India)", features: ["Unlimited bots", "1,000 messages/month", "10 documents", "3 team members"] },
  { id: "business", label: "Business", price: "$10/month", priceINR: "₹999/month (India)", features: ["Unlimited bots", "10,000 messages/month", "100 documents", "10 team members"] },
];

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const item = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function BillingPage({ workspace }) {
  const canManage = workspace.role === "owner";
  const [usage, setUsage] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchUsage(workspace.id)
      .then(u => !cancelled && setUsage(u))
      .catch(() => {});
    return () => { cancelled = true; };
  }, [workspace.id]);

  if (!usage) return <Spinner label="Loading billing" />;

  return (
    <motion.div variants={stagger} initial="initial" animate="animate">
      <motion.h1 variants={item} style={{ marginBottom: 20 }}>Billing</motion.h1>
      <motion.div variants={item} className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 20, textTransform: "capitalize" }}>Current plan: {usage.plan}</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <UsageBar label="Bots" used={usage.bots_used} limit={usage.bots_limit} />
          <UsageBar label="Messages this period" used={usage.messages_used_this_period} limit={usage.messages_limit} />
        </div>
        <div className="text-muted" style={{ display: "flex", gap: 28, marginTop: 20, fontSize: 13 }}>
          <span>{usage.documents_uploaded} documents uploaded</span>
          <span>{usage.team_members} team members</span>
        </div>
      </motion.div>

      {canManage && (
        <motion.div variants={item} style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {PLANS.map(p => (
            <motion.div
              key={p.id}
              className="card card-interactive"
              whileHover={{ y: -3 }}
            >
              <h3 style={{ marginBottom: 16 }}>{p.label}</h3>
              <div style={{ fontSize: 14, marginBottom: 16 }}>
                <span style={{ fontWeight: 600, color: "#a78bfa" }}>{p.price}</span>
                <span style={{ color: "#6b7280", marginLeft: 8 }}>{p.priceINR}</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {p.features.map((f, i) => (
                  <li key={i} style={{ fontSize: 13, marginBottom: 8, color: "#cbd5e1" }}>
                    • {f}
                  </li>
                ))}
              </ul>
              <motion.button
                className="btn btn-primary"
                style={{ width: "100%", marginTop: 12 }}
                disabled={usage.plan === p.id}
                onClick={() => {
                  if (p.id === "free") return;
                  const baseUrl = "https://t.me/Chaincraftsupport";
                  const message = `Hi, I'd like to subscribe to AIFlow ${p.label}.`;
                  const url = `${baseUrl}?start=${encodeURIComponent(message)}`;
                  window.open(url, '_blank');
                }}
                whileHover={usage.plan !== p.id ? { scale: 1.02 } : {}}
                whileTap={usage.plan !== p.id ? { scale: 0.98 } : {}}
              >
                {usage.plan === p.id ? "Current plan" : p.id === "free" ? "Free forever" : `Subscribe to ${p.label}`}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

function UsageBar({ label, used, limit }) {
  const pct = limit ? Math.min(100, Math.round((used / limit) * 100)) : null;
  return (
    <div>
      <div className="text-muted" style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 10 }}>
        <span>{label}</span>
        <span>{used} / {limit ?? "unlimited"}</span>
      </div>
      <div style={{ height: 7, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: pct != null ? `${pct}%` : "100%" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          style={{
            height: 7,
            background: pct != null && pct > 90 ? "var(--status-error)" : "var(--brand-gradient)",
            borderRadius: 4,
          }}
        />
      </div>
    </div>
  );
}
