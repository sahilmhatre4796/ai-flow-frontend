export function Field({ label, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span className="text-muted" style={{ fontSize: 13 }}>{label}</span>
      {children}
    </label>
  );
}

export function AuthShell({ title, subtitle, children }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "-20%", left: "50%", width: 700, height: 700, transform: "translateX(-50%)", background: "radial-gradient(circle, rgba(99,102,241,0.16), transparent 65%)", pointerEvents: "none" }} />
      <div className="card fade-in" style={{ width: 380, position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: "var(--brand-gradient)" }} />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15 }}>AI Flow</span>
        </div>
        <h1 style={{ marginBottom: 4 }}>{title}</h1>
        <p className="text-muted" style={{ fontSize: 14, marginBottom: 26 }}>{subtitle}</p>
        {children}
      </div>
    </div>
  );
}
