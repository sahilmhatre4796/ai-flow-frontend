import { useEffect, useState } from "react";
import { ApiError } from "../api/client";
import { createCheckoutSession, fetchUsage } from "../api/misc";
import { Spinner, errorText } from "./shared";

const PLANS = [{ id: "pro", label: "Pro" }, { id: "business", label: "Business" }];

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
    <div>
      <h1 style={{ marginBottom: 20 }}>Billing</h1>
      {error && <div style={{ color: "#fca5a5", marginBottom: 16, fontSize: 13 }}>{error}</div>}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 18, textTransform: "capitalize" }}>Current plan: {usage.plan}</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <UsageBar label="Bots" used={usage.bots_used} limit={usage.bots_limit} />
          <UsageBar label="Messages this period" used={usage.messages_used_this_period} limit={usage.messages_limit} />
        </div>
        <div className="text-muted" style={{ display: "flex", gap: 24, marginTop: 18, fontSize: 13 }}>
          <span>{usage.documents_uploaded} documents uploaded</span>
          <span>{usage.team_members} team members</span>
        </div>
      </div>
      {canManage && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
          {PLANS.map(p => (
            <div key={p.id} className="card card-interactive">
              <h3 style={{ marginBottom: 14 }}>{p.label}</h3>
              <button className="btn btn-primary" style={{ width: "100%" }} disabled={usage.plan === p.id || checkingOut === p.id} onClick={() => upgrade(p.id)}>
                {checkingOut === p.id ? "Redirecting…" : usage.plan === p.id ? "Current plan" : `Upgrade to ${p.label}`}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UsageBar({ label, used, limit }) {
  const pct = limit ? Math.min(100, Math.round((used / limit) * 100)) : null;
  return (
    <div>
      <div className="text-muted" style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
        <span>{label}</span>
        <span>{used} / {limit ?? "∞"}</span>
      </div>
      <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 4 }}>
        <div style={{ height: 6, width: pct != null ? `${pct}%` : "100%", background: pct != null && pct > 90 ? "var(--status-error)" : "var(--brand-gradient)", borderRadius: 4, transition: "width 300ms ease" }} />
      </div>
    </div>
  );
}
