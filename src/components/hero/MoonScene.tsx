import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles, Stars, useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { Theme } from "../../context/themeInit.ts";

type MoonSceneProps = {
  theme: Theme;
};

const MOON_RADIUS = 1.65;
const ORBIT_RADIUS = 5.4;
const REVOLVE_SPEED = 0.22;
const SPIN_SPEED = 0.14;

function RevolvingCamera() {
  const { camera } = useThree();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * REVOLVE_SPEED;
    const y = 0.25 + Math.sin(t * 0.6) * 0.12;
    camera.position.set(
      Math.sin(t) * ORBIT_RADIUS,
      y,
      Math.cos(t) * ORBIT_RADIUS
    );
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function MoonSphere({ theme }: { theme: Theme }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const isLight = theme === "light";

  const colorMap = useTexture(
    "https://threejs.org/examples/textures/planets/moon_1024.jpg"
  );

  useEffect(() => {
    colorMap.colorSpace = THREE.SRGBColorSpace;
  }, [colorMap]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * SPIN_SPEED;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[MOON_RADIUS, 128, 128]} />
        <meshStandardMaterial
          map={colorMap}
          roughness={0.82}
          metalness={0.04}
          emissive={isLight ? "#999999" : "#222222"}
          emissiveIntensity={isLight ? 0.05 : 0.12}
        />
      </mesh>
      <mesh scale={1.04}>
        <sphereGeometry args={[MOON_RADIUS, 64, 64]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={isLight ? 0.04 : 0.07}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

/** Plain sphere shown while the moon texture loads */
function MoonFallback({ theme }: { theme: Theme }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const isLight = theme === "light";

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * SPIN_SPEED;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[MOON_RADIUS, 64, 64]} />
      <meshStandardMaterial
        color={isLight ? "#c4c4c4" : "#e0e0e0"}
        roughness={0.82}
        metalness={0.04}
      />
    </mesh>
  );
}

const MoonScene: React.FC<MoonSceneProps> = ({ theme }) => {
  const isLight = theme === "light";

  return (
    <Canvas
      camera={{ position: [0, 0, ORBIT_RADIUS], fov: 40 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 2]}
      style={{ background: "transparent" }}
    >
      <RevolvingCamera />
      <ambientLight intensity={isLight ? 0.45 : 0.35} color="#ffffff" />
      <directionalLight
        position={[5, 3, 4]}
        intensity={isLight ? 1 : 1.25}
        color="#ffffff"
      />
      <directionalLight
        position={[-4, -2, -3]}
        intensity={isLight ? 0.15 : 0.35}
        color={isLight ? "#999999" : "#666666"}
      />
      <pointLight position={[-3, 2, 2]} intensity={0.3} color="#dddddd" />
      <Stars
        radius={55}
        depth={28}
        count={isLight ? 700 : 1600}
        factor={isLight ? 4.2 : 5.5}
        saturation={0}
        fade={false}
        speed={0.45}
      />
      <Sparkles
        count={isLight ? 55 : 90}
        scale={[7, 7, 7]}
        position={[0, 0, 0]}
        size={isLight ? 2.8 : 3.8}
        speed={0.35}
        opacity={isLight ? 0.55 : 0.85}
        color={isLight ? "#525252" : "#ffffff"}
      />
      <Suspense fallback={<MoonFallback theme={theme} />}>
        <MoonSphere theme={theme} />
      </Suspense>
    </Canvas>
  );
};

export default MoonScene;
