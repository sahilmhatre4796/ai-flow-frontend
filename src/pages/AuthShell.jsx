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
      flexDirection: "row",
      background: "#050510",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Left - Video Panel */}
      <div style={{
        flex: "1 1 60%",
        position: "relative",
        overflow: "hidden",
      }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        >
          <source src="/ai-bg.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay gradient */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(5,5,16,0.7) 0%, rgba(5,5,16,0.3) 40%, rgba(5,5,16,0.5) 100%)",
        }} />

        {/* Right edge fade into form */}
        <div style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 200,
          height: "100%",
          background: "linear-gradient(to left, rgba(10,10,30,0.95) 0%, transparent 100%)",
        }} />

        {/* Left panel content overlay */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            bottom: 80,
            left: 60,
            zIndex: 10,
            maxWidth: 500,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            style={{
              fontSize: 52,
              fontWeight: 700,
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              marginBottom: 16,
              background: "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Build intelligent
            <br />
            chatbots
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.6,
              maxWidth: 380,
            }}
          >
            Create, train, and deploy AI-powered conversational agents in minutes.
          </motion.p>
        </motion.div>
      </div>

      {/* Right - Form Panel */}
      <div style={{
        flex: "0 0 480px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 48,
        position: "relative",
        background: "rgba(8,8,24,0.95)",
        backdropFilter: "blur(60px)",
        WebkitBackdropFilter: "blur(60px)",
        borderLeft: "1px solid rgba(99,102,241,0.1)",
      }}>
        {/* Subtle glow from left edge */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: -100,
          width: 300,
          height: 500,
          transform: "translateY(-50%)",
          background: "radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: "100%", maxWidth: 360, position: "relative", zIndex: 10 }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }}
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
    </div>
  );
}
