import { motion } from "framer-motion";
import { useState } from "react";
import { ApiError } from "../api/client";
import { useAuth } from "../AuthContext";
import { AuthShell, Field } from "./AuthShell";

const buttonVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98 },
};

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
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="Email">
          <input className="input" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" />
        </Field>
        <Field label="Password">
          <input className="input" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" />
        </Field>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            style={{ color: "#fca5a5", fontSize: 13, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "10px 14px" }}
          >
            {error}
          </motion.div>
        )}

        <motion.button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{ marginTop: 4, width: "100%", height: 44 }}
          variants={buttonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
        >
          {loading ? (
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              Logging in...
            </motion.span>
          ) : "Log in"}
        </motion.button>
      </form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-muted"
        style={{ fontSize: 13, marginTop: 24, textAlign: "center" }}
      >
        Don't have an account?{" "}
        <motion.a
          onClick={onSwitchToRegister}
          whileHover={{ color: "#c7d2fe" }}
          style={{ color: "#a5b4fc", cursor: "pointer", fontWeight: 600 }}
        >
          Create one
        </motion.a>
      </motion.p>
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
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(34,197,94,0.12)", color: "var(--status-success)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 24 }}>
          &#10003;
        </div>
        <p className="text-muted" style={{ fontSize: 14, lineHeight: 1.6, textAlign: "center" }}>
          Click the link we sent to <strong style={{ color: "var(--ink)" }}>{email}</strong> to verify your address, then log in.
        </p>
        <motion.button
          onClick={onSwitchToLogin}
          className="btn btn-primary"
          style={{ marginTop: 24, width: "100%", height: 44 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Back to login
        </motion.button>
      </motion.div>
    </AuthShell>
  );

  return (
    <AuthShell title="Create your account" subtitle="Start building AI chatbots without code">
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="Full name">
          <input className="input" required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Doe" />
        </Field>
        <Field label="Email">
          <input className="input" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" />
        </Field>
        <Field label="Password">
          <input className="input" type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" />
        </Field>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ color: "#fca5a5", fontSize: 13, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "10px 14px" }}
          >
            {error}
          </motion.div>
        )}

        <motion.button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{ marginTop: 4, width: "100%", height: 44 }}
          variants={buttonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
        >
          {loading ? (
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              Creating account...
            </motion.span>
          ) : "Create account"}
        </motion.button>
      </form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-muted"
        style={{ fontSize: 13, marginTop: 24, textAlign: "center" }}
      >
        Already have an account?{" "}
        <motion.a
          onClick={onSwitchToLogin}
          whileHover={{ color: "#c7d2fe" }}
          style={{ color: "#a5b4fc", cursor: "pointer", fontWeight: 600 }}
        >
          Log in
        </motion.a>
      </motion.p>
    </AuthShell>
  );
}
