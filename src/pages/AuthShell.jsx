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
        background: `radial-gradient(circle at 30% 30%, ${color}88, ${color}22, transparent 70%)`,
        filter: "blur(40px)",
        animation: `orbFloat ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

function GlowRing({ size, color, rotation, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, rotate: 0 }}
      animate={{ opacity: 1, rotate: rotation }}
      transition={{ delay, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        borderRadius: "50%",
        border: `1px solid ${color}44`,
        boxShadow: `0 0 20px ${color}22, inset 0 0 20px ${color}11`,
        animation: `ringPulse 4s ease-in-out infinite, ringRotate 20s linear infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

function FloatingParticle({ x, y, size, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay + 0.5, duration: 0.5 }}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: "50%",
        background: "#818cf8",
        boxShadow: "0 0 10px #6366f188",
        animation: `particleFloat ${3 + Math.random() * 2}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

function AIVisual() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    x: `${10 + Math.random() * 80}%`,
    y: `${10 + Math.random() * 80}%`,
    size: 2 + Math.random() * 4,
    delay: Math.random() * 2,
  }));

  return (
    <div style={{
      position: "absolute",
      inset: 0,
      overflow: "hidden",
    }}>
      {/* Central glow */}
      <div style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 300,
        height: 300,
        marginLeft: -150,
        marginTop: -150,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, rgba(139,92,246,0.1) 40%, transparent 70%)",
        filter: "blur(60px)",
        animation: "centralPulse 4s ease-in-out infinite",
      }} />

      {/* Orbs */}
      <AnimatedOrb size={200} color="#6366f1" x="15%" y="20%" delay={0} duration={6} />
      <AnimatedOrb size={150} color="#a855f7" x="60%" y="60%" delay={0.3} duration={7} />
      <AnimatedOrb size={180} color="#06b6d4" x="70%" y="15%" delay={0.6} duration={5} />
      <AnimatedOrb size={120} color="#8b5cf6" x="25%" y="65%" delay={0.4} duration={8} />
      <AnimatedOrb size={160} color="#6366f1" x="50%" y="40%" delay={0.2} duration={6.5} />

      {/* Glow rings */}
      <GlowRing size={280} color="#6366f1" rotation={45} delay={0.5} />
      <GlowRing size={350} color="#06b6d4" rotation={-30} delay={0.7} />
      <GlowRing size={220} color="#a855f7" rotation={60} delay={0.9} />

      {/* Particles */}
      {particles.map((p, i) => (
        <FloatingParticle key={i} {...p} />
      ))}

      {/* Animated lines */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        {[...Array(8)].map((_, i) => {
          const x1 = 20 + Math.random() * 60;
          const y1 = 20 + Math.random() * 60;
          const x2 = x1 + (Math.random() - 0.5) * 30;
          const y2 = y1 + (Math.random() - 0.5) * 30;
          return (
            <line
              key={i}
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke="url(#lineGrad)"
              strokeWidth="1"
              style={{
                animation: `linePulse 3s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          );
        })}
      </svg>
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
          25% { transform: translate(10px, -15px) scale(1.05); }
          50% { transform: translate(-5px, 10px) scale(0.95); }
          75% { transform: translate(-10px, -5px) scale(1.02); }
        }
        @keyframes ringPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        @keyframes ringRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes particleFloat {
          0%, 100% { transform: translate(0, 0); opacity: 0.6; }
          50% { transform: translate(${Math.random() > 0.5 ? '' : '-'}10px, -15px); opacity: 1; }
        }
        @keyframes centralPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes linePulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="auth-container" style={{
        minHeight: "100vh",
        display: "flex",
        background: "#050510",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Left visual panel */}
        <div className="auth-visual-panel" style={{
          flex: 1,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}>
          {/* Background gradient */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 30% 50%, rgba(99,102,241,0.12) 0%, rgba(5,5,16,0) 60%)",
            pointerEvents: "none",
          }} />

          {/* Animated AI visual */}
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
          width: 520,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 48,
          position: "relative",
          background: "rgba(10,10,30,0.6)",
          borderLeft: "1px solid rgba(99,102,241,0.1)",
          backdropFilter: "blur(40px)",
        }}>
          {/* Glow effect on right panel */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: 0,
            width: 200,
            height: 400,
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

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
