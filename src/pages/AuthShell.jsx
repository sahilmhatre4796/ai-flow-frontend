import { motion } from "framer-motion";

export function Field({ label, children }) {
  return (
    <motion.label
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ display: "flex", flexDirection: "column", gap: 6 }}
    >
      <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.6)" }}>{label}</span>
      {children}
    </motion.label>
  );
}

export function AuthShell({ title, subtitle, children }) {
  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#050510",
      position: "relative",
      overflow: "hidden",
      padding: 24,
      boxSizing: "border-box",
    }}>
      {/* Animated background orbs */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
        <div className="orb orb-5" />

        <div className="ring ring-1" />
        <div className="ring ring-2" />
        <div className="ring ring-3" />

        {[...Array(30)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${5 + Math.random() * 90}%`,
            top: `${5 + Math.random() * 90}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
          }} />
        ))}
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "100%",
          maxWidth: 420,
          position: "relative",
          zIndex: 10,
          background: "rgba(12,12,30,0.85)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: 24,
          padding: 40,
          boxShadow: "0 0 80px rgba(99,102,241,0.1), 0 24px 48px rgba(0,0,0,0.4)",
        }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 36 }}
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              boxShadow: "0 0 24px rgba(99,102,241,0.5)",
            }}
          />
          <span style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: "-0.01em",
            color: "#fff",
          }}>
            AI Flow
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          style={{
            marginBottom: 8,
            fontSize: 28,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          style={{ fontSize: 14, marginBottom: 32, color: "rgba(255,255,255,0.5)" }}
        >
          {subtitle}
        </motion.p>

        {/* Form content */}
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
