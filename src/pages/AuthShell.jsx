import { motion } from "framer-motion";

function AnimatedOrb({ size, color, x, y, delay, duration }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle at 30% 30%, ${color}, ${color}44, transparent 70%)`,
        filter: "blur(60px)",
        animation: `orbFloat ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

function GlowRing({ size, color, delay }) {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        borderRadius: "50%",
        border: `2px solid ${color}`,
        opacity: 0.4,
        animation: `ringPulse 4s ease-in-out infinite, ringRotate 20s linear infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

function FloatingParticle({ x, y, size, delay }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: "50%",
        background: "#a5b4fc",
        boxShadow: "0 0 12px #818cf8, 0 0 24px #6366f188",
        animation: `particleFloat ${3 + Math.random() * 2}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

function AIVisual() {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    x: `${5 + Math.random() * 90}%`,
    y: `${5 + Math.random() * 90}%`,
    size: 3 + Math.random() * 5,
    delay: Math.random() * 2,
  }));

  return (
    <div style={{
      position: "absolute",
      inset: 0,
      overflow: "hidden",
      background: "radial-gradient(ellipse at center, rgba(99,102,241,0.08) 0%, transparent 50%)",
    }}>
      {/* Central bright core */}
      <div style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 200,
        height: 200,
        marginLeft: -100,
        marginTop: -100,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(129,140,248,0.6) 0%, rgba(99,102,241,0.3) 30%, transparent 60%)",
        filter: "blur(40px)",
        animation: "centralPulse 3s ease-in-out infinite",
      }} />

      {/* Orbs - larger and brighter */}
      <AnimatedOrb size={280} color="rgba(99,102,241,0.5)" x="10%" y="15%" delay={0} duration={6} />
      <AnimatedOrb size={220} color="rgba(168,85,247,0.5)" x="55%" y="55%" delay={0.3} duration={7} />
      <AnimatedOrb size={250} color="rgba(6,182,212,0.4)" x="65%" y="10%" delay={0.6} duration={5} />
      <AnimatedOrb size={180} color="rgba(139,92,246,0.5)" x="20%" y="60%" delay={0.4} duration={8} />
      <AnimatedOrb size={200} color="rgba(99,102,241,0.4)" x="45%" y="35%" delay={0.2} duration={6.5} />

      {/* Glow rings - more visible */}
      <GlowRing size={300} color="rgba(99,102,241,0.5)" delay={0.5} />
      <GlowRing size={380} color="rgba(6,182,212,0.4)" delay={0.7} />
      <GlowRing size={240} color="rgba(168,85,247,0.4)" delay={0.9} />

      {/* Particles */}
      {particles.map((p, i) => (
        <FloatingParticle key={i} {...p} />
      ))}
    </div>
  );
}

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
    <>
      <style>{`
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(15px, -20px) scale(1.05); }
          50% { transform: translate(-10px, 15px) scale(0.95); }
          75% { transform: translate(-15px, -10px) scale(1.02); }
        }
        @keyframes ringPulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        @keyframes ringRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes particleFloat {
          0%, 100% { transform: translate(0, 0); opacity: 0.5; }
          50% { transform: translate(8px, -12px); opacity: 1; }
        }
        @keyframes centralPulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.15); opacity: 1; }
        }
      `}</style>
      <div className="auth-container" style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "row",
        background: "#050510",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Left visual panel */}
        <div className="auth-visual-panel" style={{
          flex: "1 1 50%",
          minWidth: 0,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}>
          <AIVisual />

          {/* Left panel content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "relative",
              zIndex: 10,
              textAlign: "center",
              padding: 40,
              maxWidth: 420,
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              style={{
                fontSize: 48,
                fontWeight: 700,
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                marginBottom: 20,
                background: "linear-gradient(135deg, #fff 0%, #c7d2fe 50%, #818cf8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Build intelligent chatbots
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              style={{
                fontSize: 16,
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.6,
                maxWidth: 320,
                margin: "0 auto",
              }}
            >
              Create, train, and deploy AI-powered conversational agents in minutes.
            </motion.p>
          </motion.div>
        </div>

        {/* Right form panel */}
        <div className="auth-form-panel" style={{
          flex: "0 0 520px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 48,
          position: "relative",
          background: "rgba(10,10,30,0.8)",
          borderLeft: "1px solid rgba(99,102,241,0.15)",
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
                  boxShadow: "0 0 24px rgba(99,102,241,0.4)",
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
    </>
  );
}
