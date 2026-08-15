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

const inputStyle = {
  width: "100%",
  height: 48,
  padding: "0 16px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(99,102,241,0.15)",
  borderRadius: 12,
  color: "#fff",
  fontSize: 14,
  outline: "none",
  transition: "all 0.2s ease",
  boxSizing: "border-box",
};

const inputFocusStyle = {
  ...inputStyle,
  borderColor: "rgba(99,102,241,0.5)",
  boxShadow: "0 0 0 3px rgba(99,102,241,0.1), 0 0 20px rgba(99,102,241,0.1)",
  background: "rgba(255,255,255,0.06)",
};

function GlowInput({ type, required, value, onChange, placeholder, minLength }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      required={required}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      minLength={minLength}
      style={focused ? inputFocusStyle : inputStyle}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onMouseEnter={(e) => {
        if (!focused) {
          e.target.style.borderColor = "rgba(99,102,241,0.3)";
          e.target.style.background = "rgba(255,255,255,0.05)";
        }
      }}
      onMouseLeave={(e) => {
        if (!focused) {
          e.target.style.borderColor = "rgba(99,102,241,0.15)";
          e.target.style.background = "rgba(255,255,255,0.04)";
        }
      }}
    />
  );
}

export function LoginPage({ onSwitchToRegister, onSwitchToForgotPassword }) {
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
          <GlowInput type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" />
        </Field>
        <Field label="Password">
          <GlowInput type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" />
        </Field>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            style={{
              color: "#fca5a5",
              fontSize: 13,
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 12,
              padding: "12px 16px",
            }}
          >
            {error}
          </motion.div>
        )}

        <motion.button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 8,
            width: "100%",
            height: 48,
            borderRadius: 12,
            border: "none",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 0 20px rgba(99,102,241,0.3), 0 4px 12px rgba(0,0,0,0.2)",
          }}
          variants={buttonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
        >
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)",
              opacity: 0,
            }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
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
        style={{ fontSize: 13, marginTop: 24, textAlign: "center", color: "rgba(255,255,255,0.5)" }}
      >
        <motion.a
          onClick={onSwitchToForgotPassword}
          whileHover={{ color: "#c7d2fe" }}
          style={{ color: "#818cf8", cursor: "pointer", fontWeight: 600 }}
        >
          Forgot password?
        </motion.a>
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        style={{ fontSize: 13, marginTop: 12, textAlign: "center", color: "rgba(255,255,255,0.5)" }}
      >
        Don't have an account?{" "}
        <motion.a
          onClick={onSwitchToRegister}
          whileHover={{ color: "#c7d2fe" }}
          style={{ color: "#818cf8", cursor: "pointer", fontWeight: 600 }}
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
    <AuthShell title="Account created!" subtitle="Your account has been created successfully">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div style={{
          width: 64,
          height: 64,
          borderRadius: 20,
          background: "rgba(34,197,94,0.15)",
          color: "#22c55e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 24px",
          fontSize: 28,
          boxShadow: "0 0 24px rgba(34,197,94,0.2)",
        }}>
          &#10003;
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.6, textAlign: "center", color: "rgba(255,255,255,0.7)" }}>
          You can now log in with your email <strong style={{ color: "#fff" }}>{email}</strong> and password.
        </p>
        <motion.button
          onClick={onSwitchToLogin}
          style={{
            marginTop: 24,
            width: "100%",
            height: 48,
            borderRadius: 12,
            border: "none",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 0 20px rgba(99,102,241,0.3), 0 4px 12px rgba(0,0,0,0.2)",
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Log in
        </motion.button>
      </motion.div>
    </AuthShell>
  );

  return (
    <AuthShell title="Create your account" subtitle="Start building AI chatbots without code">
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="Full name">
          <GlowInput required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Doe" />
        </Field>
        <Field label="Email">
          <GlowInput type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" />
        </Field>
        <Field label="Password">
          <GlowInput type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" />
        </Field>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              color: "#fca5a5",
              fontSize: 13,
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 12,
              padding: "12px 16px",
            }}
          >
            {error}
          </motion.div>
        )}

        <motion.button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 8,
            width: "100%",
            height: 48,
            borderRadius: 12,
            border: "none",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 0 20px rgba(99,102,241,0.3), 0 4px 12px rgba(0,0,0,0.2)",
          }}
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
        style={{ fontSize: 13, marginTop: 24, textAlign: "center", color: "rgba(255,255,255,0.5)" }}
      >
        Already have an account?{" "}
        <motion.a
          onClick={onSwitchToLogin}
          whileHover={{ color: "#c7d2fe" }}
          style={{ color: "#818cf8", cursor: "pointer", fontWeight: 600 }}
        >
          Log in
        </motion.a>
      </motion.p>
    </AuthShell>
  );
}

export function ForgotPasswordPage({ onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { forgotPassword } = await import("../api/auth");
      await forgotPassword(email);
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.detail : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (done) return (
    <AuthShell title="Request received" subtitle="Password reset functionality">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div style={{
          width: 64,
          height: 64,
          borderRadius: 20,
          background: "rgba(251,191,36,0.15)",
          color: "#fbbf24",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 24px",
          fontSize: 28,
          boxShadow: "0 0 24px rgba(251,191,36,0.2)",
        }}>
          &#9888;
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.6, textAlign: "center", color: "rgba(255,255,255,0.7)" }}>
          Password reset is not available yet. Please contact support to reset your password.
        </p>
        <motion.button
          onClick={onSwitchToLogin}
          style={{
            marginTop: 24,
            width: "100%",
            height: 48,
            borderRadius: 12,
            border: "none",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 0 20px rgba(99,102,241,0.3), 0 4px 12px rgba(0,0,0,0.2)",
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Back to login
        </motion.button>
      </motion.div>
    </AuthShell>
  );

  return (
    <AuthShell title="Reset your password" subtitle="Enter your email and we'll send you a reset link">
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="Email">
          <GlowInput type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" />
        </Field>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              color: "#fca5a5",
              fontSize: 13,
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 12,
              padding: "12px 16px",
            }}
          >
            {error}
          </motion.div>
        )}

        <motion.button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 8,
            width: "100%",
            height: 48,
            borderRadius: 12,
            border: "none",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 0 20px rgba(99,102,241,0.3), 0 4px 12px rgba(0,0,0,0.2)",
          }}
          variants={buttonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
        >
          {loading ? "Sending..." : "Send reset link"}
        </motion.button>
      </form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        style={{ fontSize: 13, marginTop: 24, textAlign: "center", color: "rgba(255,255,255,0.5)" }}
      >
        Remember your password?{" "}
        <motion.a
          onClick={onSwitchToLogin}
          whileHover={{ color: "#c7d2fe" }}
          style={{ color: "#818cf8", cursor: "pointer", fontWeight: 600 }}
        >
          Log in
        </motion.a>
      </motion.p>
    </AuthShell>
  );
}

export function VerifyEmailPage({ onSwitchToLogin }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);

  useState(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token) {
      setError("No verification token found. Please check your email link.");
      setLoading(false);
      return;
    }
    import("../api/auth").then(({ verifyEmail }) =>
      verifyEmail(token).then(() => setDone(true)).catch((err) => {
        setError(err instanceof ApiError ? err.detail : "Verification failed or link expired.");
      }).finally(() => setLoading(false))
    );
  }, []);

  if (loading) return (
    <AuthShell title="Verifying your email" subtitle="Please wait...">
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.2, repeat: Infinity }}
        style={{ textAlign: "center", color: "rgba(255,255,255,0.6)" }}
      >
        Verifying...
      </motion.div>
    </AuthShell>
  );

  if (done) return (
    <AuthShell title="Email verified" subtitle="Your email has been verified successfully">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div style={{
          width: 64,
          height: 64,
          borderRadius: 20,
          background: "rgba(34,197,94,0.15)",
          color: "#22c55e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 24px",
          fontSize: 28,
          boxShadow: "0 0 24px rgba(34,197,94,0.2)",
        }}>
          &#10003;
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.6, textAlign: "center", color: "rgba(255,255,255,0.7)" }}>
          Your email has been verified. You can now log in to your account.
        </p>
        <motion.button
          onClick={onSwitchToLogin}
          style={{
            marginTop: 24,
            width: "100%",
            height: 48,
            borderRadius: 12,
            border: "none",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 0 20px rgba(99,102,241,0.3), 0 4px 12px rgba(0,0,0,0.2)",
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Log in
        </motion.button>
      </motion.div>
    </AuthShell>
  );

  return (
    <AuthShell title="Verification failed" subtitle="We couldn't verify your email">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div style={{
          width: 64,
          height: 64,
          borderRadius: 20,
          background: "rgba(239,68,68,0.15)",
          color: "#fca5a5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 24px",
          fontSize: 28,
          boxShadow: "0 0 24px rgba(239,68,68,0.2)",
        }}>
          &#10007;
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.6, textAlign: "center", color: "rgba(255,255,255,0.7)" }}>
          {error}
        </p>
        <motion.button
          onClick={onSwitchToLogin}
          style={{
            marginTop: 24,
            width: "100%",
            height: 48,
            borderRadius: 12,
            border: "none",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 0 20px rgba(99,102,241,0.3), 0 4px 12px rgba(0,0,0,0.2)",
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Back to login
        </motion.button>
      </motion.div>
    </AuthShell>
  );
}
