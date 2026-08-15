import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function AIVisual() {
  const meshRef = useRef();
  const ringRef = useRef();
  const ring2Ref = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      meshRef.current.rotation.y += 0.005;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x += 0.008;
      ringRef.current.rotation.z += 0.004;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x -= 0.006;
      ring2Ref.current.rotation.y += 0.003;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.3} />
      <pointLight position={[-3, 2, 4]} intensity={0.8} color="#6366f1" distance={12} />
      <pointLight position={[3, -2, 3]} intensity={0.6} color="#06b6d4" distance={10} />
      <pointLight position={[0, 0, 5]} intensity={0.4} color="#a855f7" distance={8} />

      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.4, 5]} />
          <MeshDistortMaterial
            color="#6366f1"
            transparent
            opacity={0.25}
            distort={0.4}
            speed={2}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
      </Float>

      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.2, 0.015, 16, 100]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.4} />
      </mesh>

      <mesh ref={ring2Ref} rotation={[Math.PI / 2.5, Math.PI / 4, 0]}>
        <torusGeometry args={[2.6, 0.01, 16, 100]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.3} />
      </mesh>

      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[1.8, 0.008, 16, 80]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.2} />
      </mesh>

      {[...Array(60)].map((_, i) => {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 3 + Math.random() * 1.5;
        return (
          <mesh
            key={i}
            position={[
              r * Math.sin(phi) * Math.cos(theta),
              r * Math.sin(phi) * Math.sin(theta),
              r * Math.cos(phi),
            ]}
          >
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color="#818cf8" transparent opacity={0.6} />
          </mesh>
        );
      })}
    </group>
  );
}

function AIVisualCanvas() {
  return (
    <div style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <AIVisual />
      </Canvas>
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
          background: "radial-gradient(ellipse at 30% 50%, rgba(99,102,241,0.15) 0%, rgba(5,5,16,0) 60%)",
          pointerEvents: "none",
        }} />

        {/* Animated AI visual */}
        <AIVisualCanvas />

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
  );
}
