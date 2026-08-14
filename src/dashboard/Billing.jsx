import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ApiError } from "../api/client";
import { createCheckoutSession, fetchUsage } from "../api/misc";
import { Spinner, errorText } from "./shared";

const PLANS = [{ id: "pro", label: "Pro" }, { id: "business", label: "Business" }];

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
  const [error, setError] = useState(null);
  const [checkingOut, setCheckingOut] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchUsage(workspace.id)
      .then(u => !cancelled && setUsage(u))
      .catch(err => !cancelled && setError(errorText(err, "Couldn't load billing info")));
    return () => { cancelled = true; };
  }, [workspace.id]);

  async function upgrade(plan) {
    setCheckingOut(plan); setError(null);
    try {
      const { checkout_url } = await createCheckoutSession(workspace.id, plan);
      window.location.href = checkout_url;
    } catch (err) {
      setError(err instanceof ApiError && err.status === 501
        ? "Stripe isn't configured on this server yet — set STRIPE_SECRET_KEY and price IDs in the backend .env."
        : errorText(err, "Couldn't start checkout"));
    } finally { setCheckingOut(null); }
  }

  if (!usage) return <Spinner label="Loading billing" />;

  return (
    <motion.div variants={stagger} initial="initial" animate="animate">
      <motion.h1 variants={item} style={{ marginBottom: 20 }}>Billing</motion.h1>
      {error && (
        <motion.div variants={item} style={{ color: "#fca5a5", marginBottom: 16, fontSize: 13, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: "12px 16px" }}>
          {error}
        </motion.div>
      )}
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
        <motion.div variants={item} style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
          {PLANS.map(p => (
            <motion.div
              key={p.id}
              className="card card-interactive"
              whileHover={{ y: -3 }}
            >
              <h3 style={{ marginBottom: 16 }}>{p.label}</h3>
              <motion.button
                className="btn btn-primary"
                style={{ width: "100%" }}
                disabled={usage.plan === p.id || checkingOut === p.id}
                onClick={() => upgrade(p.id)}
                whileHover={usage.plan !== p.id ? { scale: 1.02 } : {}}
                whileTap={usage.plan !== p.id ? { scale: 0.98 } : {}}
              >
                {checkingOut === p.id ? "Redirecting..." : usage.plan === p.id ? "Current plan" : `Upgrade to ${p.label}`}
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
