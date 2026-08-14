import { motion } from "framer-motion";
import { FloatingParticles } from "../components/FloatingParticles";

export function Field({ label, children }) {
  return (
    <motion.label
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ display: "flex", flexDirection: "column", gap: 6 }}
    >
      <span className="text-muted" style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
      {children}
    </motion.label>
  );
}

export function AuthShell({ title, subtitle, children }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", overflow: "hidden" }}>
      <FloatingParticles />

      <div className="ambient-glow" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="card glass"
        style={{
          width: 400,
          position: "relative",
          zIndex: 10,
          boxShadow: "var(--shadow-elevated), 0 0 80px rgba(99,102,241,0.08)",
          border: "1px solid rgba(99,102,241,0.15)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "var(--brand-gradient)",
              boxShadow: "0 0 16px rgba(99,102,241,0.3)",
            }}
          />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em" }}>
            AI Flow
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          style={{ marginBottom: 6, fontSize: 24 }}
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-muted"
          style={{ fontSize: 14, marginBottom: 28 }}
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
