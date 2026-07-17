import { useState } from "react";
import { ApiError } from "../api/client";
import { useAuth } from "../AuthContext";
import { AuthShell, Field } from "./AuthShell";

export function LoginPage({ onSwitchToRegister }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try { await login(email, password); }
    catch (err) { setError(err instanceof ApiError ? err.detail : "Something went wrong. Please try again."); }
    finally { setLoading(false); }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Log in to your AI Flow workspace">
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="Email"><input className="input" type="email" required value={email} onChange={e => setEmail(e.target.value)} /></Field>
        <Field label="Password"><input className="input" type="password" required value={password} onChange={e => setPassword(e.target.value)} /></Field>
        {error && <div style={{ color: "#fca5a5", fontSize: 13 }}>{error}</div>}
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: 6, width: "100%" }}>
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>
      <p className="text-muted" style={{ fontSize: 13, marginTop: 20, textAlign: "center" }}>
        Don't have an account?{" "}
        <a onClick={onSwitchToRegister} style={{ color: "#a5b4fc", cursor: "pointer", fontWeight: 600 }}>Create one</a>
      </p>
    </AuthShell>
  );
}

export function RegisterPage({ onSwitchToLogin }) {
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try { await register(email, password, fullName); setDone(true); }
    catch (err) { setError(err instanceof ApiError ? err.detail : "Something went wrong."); }
    finally { setLoading(false); }
  }

  if (done) return (
    <AuthShell title="Check your email" subtitle="We sent a verification link to your inbox">
      <p className="text-muted" style={{ fontSize: 14, lineHeight: 1.6 }}>
        Click the link we sent to <strong style={{ color: "var(--ink)" }}>{email}</strong> to verify your address, then log in.
      </p>
      <button onClick={onSwitchToLogin} className="btn btn-primary" style={{ marginTop: 20, width: "100%" }}>Back to login</button>
    </AuthShell>
  );

  return (
    <AuthShell title="Create your account" subtitle="Start building AI chatbots without code">
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="Full name"><input className="input" required value={fullName} onChange={e => setFullName(e.target.value)} /></Field>
        <Field label="Email"><input className="input" type="email" required value={email} onChange={e => setEmail(e.target.value)} /></Field>
        <Field label="Password"><input className="input" type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} /></Field>
        {error && <div style={{ color: "#fca5a5", fontSize: 13 }}>{error}</div>}
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: 6, width: "100%" }}>
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="text-muted" style={{ fontSize: 13, marginTop: 20, textAlign: "center" }}>
        Already have an account?{" "}
        <a onClick={onSwitchToLogin} style={{ color: "#a5b4fc", cursor: "pointer", fontWeight: 600 }}>Log in</a>
      </p>
    </AuthShell>
  );
}
