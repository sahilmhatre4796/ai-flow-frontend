import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function FloatingOrb({ position, color, speed, distort, size }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.2;
      meshRef.current.rotation.y += 0.003 * speed;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh ref={meshRef} position={position}>
        <icosahedronGeometry args={[size, 4]} />
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.12}
          distort={distort}
          speed={speed * 2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

function ParticleField({ count = 200 }) {
  const points = useRef();
  const particleCount = count;

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const sz = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      sz[i] = Math.random() * 2 + 0.5;
    }
    return [pos, sz];
  }, [particleCount]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.02;
      points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#6366f1"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function ConnectionLines() {
  const linesRef = useRef();
  const lineCount = 40;

  const positions = useMemo(() => {
    const pos = new Float32Array(lineCount * 6);
    for (let i = 0; i < lineCount; i++) {
      const x1 = (Math.random() - 0.5) * 16;
      const y1 = (Math.random() - 0.5) * 16;
      const z1 = (Math.random() - 0.5) * 6;
      const angle = Math.random() * Math.PI * 2;
      const len = 1 + Math.random() * 3;
      pos[i * 6] = x1;
      pos[i * 6 + 1] = y1;
      pos[i * 6 + 2] = z1;
      pos[i * 6 + 3] = x1 + Math.cos(angle) * len;
      pos[i * 6 + 4] = y1 + Math.sin(angle) * len;
      pos[i * 6 + 5] = z1;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={lineCount * 2}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#6366f1" transparent opacity={0.06} />
    </lineSegments>
  );
}

export function FloatingParticles({ className, style }) {
  return (
    <div
      className={className}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        ...style,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.4} />
        <pointLight position={[-5, -5, 2]} intensity={0.3} color="#a855f7" />

        <FloatingOrb position={[-4, 3, -2]} color="#6366f1" speed={0.8} distort={0.4} size={1.2} />
        <FloatingOrb position={[4, -2, -3]} color="#a855f7" speed={0.6} distort={0.3} size={0.9} />
        <FloatingOrb position={[0, 4, -4]} color="#06b6d4" speed={0.5} distort={0.5} size={1.5} />
        <FloatingOrb position={[-3, -3, -1]} color="#8b5cf6" speed={0.7} distort={0.2} size={0.7} />
        <FloatingOrb position={[3, 1, -5]} color="#6366f1" speed={0.4} distort={0.6} size={1.8} />

        <ParticleField count={180} />
        <ConnectionLines />
      </Canvas>
    </div>
  );
}
