/**
 * MoonScene Component - Three.js 3D Moon Visualization
 * 
 * Renders a 3D interactive moon using Three.js with:
 * - Rotating moon sphere with realistic texture
 * - Revolving camera that orbits the moon
 * - Dynamic lighting that adapts to theme (light/dark mode)
 * - Starfield and sparkle effects
 * - Performance optimizations (DPR, power preference)
 * - Fallback placeholder while texture loads
 * 
 * Theme awareness:
 * - Light mode: Brighter environment, dimmer stars
 * - Dark mode: Darker environment, more visible stars
 * 
 * Technical stack:
 * - @react-three/fiber: React renderer for Three.js
 * - @react-three/drei: Utility components (Stars, Sparkles, useTexture)
 * - three: Core 3D graphics library
 */
import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles, Stars, useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { Theme } from "../../context/themeInit.ts";

type MoonSceneProps = {
  theme: Theme; // Current theme for lighting adjustments
};

// 3D Scene Constants
const MOON_RADIUS = 1.65;        // Size of moon sphere
const ORBIT_RADIUS = 5.4;        // Distance camera orbits from center
const REVOLVE_SPEED = 0.22;      // Speed of camera orbit around moon
const SPIN_SPEED = 0.14;         // Speed of moon's self-rotation

/**
 * RevolvingCamera Component
 * 
 * Custom camera controller that orbits the moon continuously
 * 
 * Animation:
 * - Moves in circular orbit around scene center
 * - Bobs up and down slightly for visual interest
 * - Always looks toward center of moon
 * - Completes full orbit based on REVOLVE_SPEED
 * 
 * Used with useFrame to update on every animation frame
 */
function RevolvingCamera() {
  const { camera } = useThree();

  /**
   * useFrame Hook - Called every animation frame
   * 
   * Updates camera position in circular orbit:
   * - X/Z: Circular path around scene center
   * - Y: Slight vertical bob motion
   * - Always focuses on scene center (0, 0, 0)
   */
  useFrame(({ clock }) => {
    // Elapsed time used for smooth continuous rotation
    const t = clock.getElapsedTime() * REVOLVE_SPEED;
    // Vertical position with gentle bobbing motion
    const y = 0.25 + Math.sin(t * 0.6) * 0.12;
    // Circular orbit in X/Z plane
    camera.position.set(
      Math.sin(t) * ORBIT_RADIUS,
      y,
      Math.cos(t) * ORBIT_RADIUS
    );
    // Always look at moon center
    camera.lookAt(0, 0, 0);
  });

  return null; // This is a non-visual component (just controls camera)
}

/**
 * MoonSphere Component
 * 
 * Main moon 3D model with:
 * - Textured sphere using NASA moon texture
 * - Realistic material with roughness and metalness
 * - Theme-aware emissive lighting
 * - Subtle rim light via second semi-transparent sphere
 * 
 * The component loads texture asynchronously.
 * If texture fails to load, the Suspense boundary shows the fallback.
 */
function MoonSphere({ theme }: { theme: Theme }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const isLight = theme === "light";

  /**
   * Load moon texture from NASA/Three.js CDN
   * This texture maps realistic moon surface details onto the sphere
   */
  const colorMap = useTexture(
    "https://threejs.org/examples/textures/planets/moon_1024.jpg"
  );

  /**
   * Effect: Configure texture color space
   * 
   * Ensures texture uses sRGB color space for proper color rendering
   * Called after texture loads to apply correct color profile
   */
  useEffect(() => {
    colorMap.colorSpace = THREE.SRGBColorSpace;
  }, [colorMap]);

  /**
   * useFrame Hook - Rotate moon on every frame
   * 
   * Makes moon spin continuously using delta time for frame-rate independence
   * Rotation speed controlled by SPIN_SPEED constant
   */
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * SPIN_SPEED;
    }
  });

  return (
    <group>
      {/* Main moon sphere with texture and realistic materials */}
      <mesh ref={meshRef}>
        {/* High-poly sphere for smooth appearance */}
        <sphereGeometry args={[MOON_RADIUS, 128, 128]} />
        {/* Physically-based material for realistic lighting response */}
        <meshStandardMaterial
          map={colorMap}
          roughness={0.82}           // Slightly rough surface (not shiny)
          metalness={0.04}            // Mostly non-metallic
          emissive={isLight ? "#999999" : "#222222"} // Self-emitted light
          emissiveIntensity={isLight ? 0.05 : 0.12}   // Theme-dependent brightness
        />
      </mesh>
      {/* Subtle rim light sphere - creates glow effect */}
      <mesh scale={1.04}>
        <sphereGeometry args={[MOON_RADIUS, 64, 64]} />
        {/* Semi-transparent rim with theme-aware opacity */}
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={isLight ? 0.04 : 0.07} // More visible in dark mode
          side={THREE.BackSide}          // Only render inside-facing side
        />
      </mesh>
    </group>
  );
}

/**
 * MoonFallback Component
 * 
 * Placeholder moon shown while texture loads
 * 
 * Purpose:
 * - Provides immediate visual feedback
 * - Prevents jarring transition when texture loads
 * - Shows spinner moon that matches final appearance
 * 
 * This component renders while MoonSphere is loading its texture
 * (handled by Suspense boundary)
 */
function MoonFallback({ theme }: { theme: Theme }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const isLight = theme === "light";

  /**
   * Rotate fallback moon same as real moon
   * for seamless transition when texture loads
   */
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * SPIN_SPEED;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[MOON_RADIUS, 64, 64]} />
      {/* Solid gray material that looks similar to textured moon */}
      <meshStandardMaterial
        color={isLight ? "#c4c4c4" : "#e0e0e0"} // Theme-aware gray
        roughness={0.82}
        metalness={0.04}
      />
    </mesh>
  );
}

/**
 * MoonScene Component
 * 
 * Main component that sets up Three.js Canvas with:
 * - Revolving camera
 * - Adaptive lighting based on theme
 * - Starfield effect (more visible in dark mode)
 * - Sparkle particles
 * - Moon sphere with texture loading fallback
 * 
 * Props:
 * - theme: Current theme ('light' or 'dark')
 *   Affects lighting intensity, star visibility, and sparkle appearance
 */
const MoonScene: React.FC<MoonSceneProps> = ({ theme }) => {
  const isLight = theme === "light";

  return (
    <Canvas
      /**
       * Camera configuration
       * - position: Start camera at orbit distance
       * - fov: Field of view (wider = more zoom out)
       */
      camera={{ position: [0, 0, ORBIT_RADIUS], fov: 40 }}
      /**
       * Renderer configuration
       * - alpha: Transparent background (not white)
       * - antialias: Smooth edges without jagged lines
       * - powerPreference: Use better GPU for smoother animation
       */
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      /**
       * DPR: Device pixel ratio
       * [1, 2] = Use 1x on low-res, 2x on high-res (best quality)
       */
      dpr={[1, 2]}
      style={{ background: "transparent" }}
    >
      {/* Orbit camera around scene center */}
      <RevolvingCamera />

      {/* Ambient light - illuminates all surfaces equally */}
      <ambientLight
        intensity={isLight ? 0.45 : 0.35}
        color="#ffffff"
      />

      {/* Main directional light - bright key light from front */}
      <directionalLight
        position={[5, 3, 4]}
        intensity={isLight ? 1 : 1.25}
        color="#ffffff"
      />

      {/* Fill light - subtle light from behind for contrast */}
      <directionalLight
        position={[-4, -2, -3]}
        intensity={isLight ? 0.15 : 0.35}
        color={isLight ? "#999999" : "#666666"}
      />

      {/* Accent point light - adds visual interest */}
      <pointLight
        position={[-3, 2, 2]}
        intensity={0.3}
        color="#dddddd"
      />

      {/* Starfield background - more stars in dark mode */}
      <Stars
        radius={55}                         // How far stars appear
        depth={28}                          // Depth of starfield layer
        count={isLight ? 700 : 1600}        // More stars in dark mode
        factor={isLight ? 4.2 : 5.5}        // Size/brightness scale
        saturation={0}                      // Grayscale (no color)
        fade={false}                        // Don't fade toward edges
        speed={0.45}                        // Slow rotation
      />

      {/* Sparkle particles for visual enhancement */}
      <Sparkles
        count={isLight ? 55 : 90}           // More sparkles in dark mode
        scale={[7, 7, 7]}                   // Size of sparkle area
        position={[0, 0, 0]}                // Center on moon
        size={isLight ? 2.8 : 3.8}          // Pixel size of sparkles
        speed={0.35}                        // Sparkle animation speed
        opacity={isLight ? 0.55 : 0.85}     // More visible in dark mode
        color={isLight ? "#525252" : "#ffffff"} // Theme-aware color
      />

      {/* MoonSphere with loading fallback */}
      <Suspense fallback={<MoonFallback theme={theme} />}>
        <MoonSphere theme={theme} />
      </Suspense>
    </Canvas>
  );
};

export default MoonScene;
