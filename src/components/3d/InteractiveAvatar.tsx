"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";
import { Environment, Float, Sparkles, ContactShadows } from "@react-three/drei";

function AvatarHead() {
  // ... (rest of AvatarHead remains same, omitted for brevity in tool call but keeping imports correct in replacement)
  const headGroup = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const neckRef = useRef<THREE.Group>(null);

  // Mouse vector
  const mouse = useRef(new THREE.Vector2());
  const targetRotation = useRef(new THREE.Euler());

  useFrame((state) => {
    if (!headGroup.current || !neckRef.current) return;

    // Smoothly interpolate mouse coordinates
    const x = state.pointer.x;
    const y = state.pointer.y;

    // Calculate target rotations with limits (human neck constraints)
    // Yaw (Left/Right): +/- 45 degrees (approx 0.8 rad)
    // Pitch (Up/Down): +/- 30 degrees (approx 0.5 rad)
    const targetYaw = x * 0.8;
    const targetPitch = -y * 0.5;

    // Apply rotation to head with smooth lerp
    headGroup.current.rotation.y = THREE.MathUtils.lerp(
      headGroup.current.rotation.y,
      targetYaw,
      0.1
    );
    headGroup.current.rotation.x = THREE.MathUtils.lerp(
      headGroup.current.rotation.x,
      targetPitch,
      0.1
    );

    // Subtle Tilt (Roll) based on movement for "natural" feel
    // If looking left, tilt slightly left. If looking right, tilt slightly right.
    const targetRoll = -x * 0.1; 
    headGroup.current.rotation.z = THREE.MathUtils.lerp(
      headGroup.current.rotation.z,
      targetRoll,
      0.05
    );
    
    // Neck follows slightly (30% of head movement) to feel organic
    neckRef.current.rotation.y = THREE.MathUtils.lerp(
        neckRef.current.rotation.y,
        targetYaw * 0.3,
        0.08
    );
    neckRef.current.rotation.x = THREE.MathUtils.lerp(
      neckRef.current.rotation.x,
      targetPitch * 0.2,
      0.08
  );
  });

  const material = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: "#f0f0f0",
      roughness: 0.2,
      metalness: 0.1,
    }),
    []
  );

  const skinMaterial = useMemo(
      () => new THREE.MeshStandardMaterial({
        color: "#1a1a1a", // Dark aesthetic skin
        roughness: 0.3,
        metalness: 0.5,
      }),
      []
    );

    const glowingMint = useMemo(
        () => new THREE.MeshStandardMaterial({
            color: "#39cc89",
            emissive: "#39cc89",
            emissiveIntensity: 2,
            toneMapped: false
        }),
        []
    );
  
  return (
    <group ref={neckRef}>
      {/* Neck/Collar */}
      <mesh position={[0, -0.6, 0]} material={skinMaterial}>
         <cylinderGeometry args={[0.3, 0.4, 0.4, 32]} />
      </mesh>

      {/* Head Group */}
      <group ref={headGroup}>
        {/* Main Head Shape (Stylized Helmet/Head) */}
        <mesh position={[0, 0.1, 0]} material={skinMaterial}>
          <boxGeometry args={[0.9, 1.1, 0.95]} /> 
        </mesh>

        {/* Face Plate (Visor area) */}
        <mesh position={[0, 0.1, 0.48]}>
            <planeGeometry args={[0.7, 0.6]} />
            <meshStandardMaterial color="#000000" roughness={0.1} metalness={0.9} />
        </mesh>

        {/* Eyes (Glowing) */}
        <mesh ref={leftEyeRef} position={[-0.2, 0.1, 0.49]} material={glowingMint}>
            <circleGeometry args={[0.06, 32]} />
        </mesh>
        <mesh ref={rightEyeRef} position={[0.2, 0.1, 0.49]} material={glowingMint}>
            <circleGeometry args={[0.06, 32]} />
        </mesh>
        
        {/* Subtle Cybernetic Details using thin strips */}
        <mesh position={[0.46, 0.1, 0]}>
            <boxGeometry args={[0.02, 0.8, 0.6]} />
            <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[-0.46, 0.1, 0]}>
            <boxGeometry args={[0.02, 0.8, 0.6]} />
            <meshStandardMaterial color="#333" />
        </mesh>

      </group>
    </group>
  );
}

function Podium() {
    return (
        <group position={[0, -2.5, 0]}>
            {/* Top base */}
            <mesh position={[0, 1.4, 0]}>
                <cylinderGeometry args={[1.2, 1.2, 0.2, 64]} />
                <meshStandardMaterial color="#0b2222" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Glowing Ring */}
            <mesh position={[0, 1.25, 0]}>
                <cylinderGeometry args={[1.22, 1.22, 0.05, 64]} />
                <meshStandardMaterial color="#39cc89" emissive="#39cc89" emissiveIntensity={2} toneMapped={false} />
            </mesh>
            {/* Main Column */}
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[1, 1.5, 2.5, 64]} />
                <meshStandardMaterial color="#061818" metalness={0.6} roughness={0.4} />
            </mesh>
        </group>
    )
}

export default function InteractiveAvatar() {
  return (
    <div className="w-full h-full min-h-[500px] relative">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]} // Optimize pixel ratio
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#39cc89" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#2d7a7a" />
          
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
              <AvatarHead />
          </Float>
          
          <Podium />

          <Sparkles count={30} scale={4} size={4} speed={0.4} opacity={0.5} color="#39cc89" position={[0, 0, 0]} />
          <Environment preset="city" />
          <ContactShadows position={[0, -1.8, 0]} opacity={0.4} scale={10} blur={2.5} far={4} color="#000000" />
        </Suspense>
      </Canvas>
    </div>
  );
}
