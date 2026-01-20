'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Float, Sparkles, Grid, Html } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

// --- VISUAL ASSETS ---

function ScannerBeam() {
    const meshRef = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if (meshRef.current) {
            // Sweep back and forth (Restricted to background to avoid clipping camera)
            const t = state.clock.elapsedTime * 0.5;
            meshRef.current.position.z = Math.sin(t) * 10 - 5; // Wide sweep covering corridor
            meshRef.current.position.x = Math.cos(t * 0.5) * 5;
        }
    });
    return (
        <mesh ref={meshRef} position={[0, 2, 0]} rotation={[0, 0, Math.PI / 2]}>
            <planeGeometry args={[0.2, 50]} />
            <meshBasicMaterial color="#2dd4bf" transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>
    );
}

function HudLabel({ position, text, subtext }: { position: [number, number, number], text: string, subtext: string }) {
    return (
        <group position={position}>
            <Html center distanceFactor={10} transform>
                <div className="pointer-events-none select-none flex flex-col items-center bg-black/60 backdrop-blur-md border border-vc-teal/50 p-2 rounded-sm transform scale-75">
                    <div className="w-2 h-2 bg-vc-teal rounded-full animate-pulse mb-1" />
                    <h1 className="text-vc-teal font-bold text-xs tracking-widest uppercase whitespace-nowrap">{text}</h1>
                    <p className="text-white/60 text-[8px] font-mono tracking-wider">{subtext}</p>
                </div>
            </Html>
            <mesh position={[0, -1, 0]}>
                <cylinderGeometry args={[0.01, 0.01, 2]} />
                <meshBasicMaterial color="#2dd4bf" opacity={0.5} transparent />
            </mesh>
        </group>
    )
}

// NEW: Data Servers for the Hero Corridor to prevent "Empty Start"
function DataColumn({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            <mesh position={[0, 2.5, 0]}>
                <boxGeometry args={[0.5, 5, 0.5]} />
                <meshBasicMaterial color="#0f766e" wireframe transparent opacity={0.2} />
            </mesh>
            {/* Blinking Lights */}
            {Array.from({ length: 5 }).map((_, i) => (
                <mesh key={i} position={[0, i * 0.8 + 0.5, 0.26]}>
                    <planeGeometry args={[0.3, 0.05]} />
                    <meshBasicMaterial color={Math.random() > 0.5 ? "#2dd4bf" : "#115e59"} />
                </mesh>
            ))}
        </group>
    )
}

function WindTurbine({ position, rotation, scale = 1 }: { position: [number, number, number], rotation?: [number, number, number], scale?: number }) {
    const bladeRef = useRef<THREE.Group>(null);
    useFrame((state, delta) => {
        if (bladeRef.current) bladeRef.current.rotation.z -= 1 * delta;
    });

    return (
        <group position={position} rotation={rotation} scale={scale}>
            <HudLabel position={[0, 6, 0]} text="Status: Active" subtext="Efficiency: 98.4%" />
            <mesh position={[0, 4, 0]}>
                <cylinderGeometry args={[0.1, 0.3, 8, 8]} />
                <meshBasicMaterial color="#0f766e" wireframe />
            </mesh>
            <mesh position={[0, 8, 0.2]}>
                <boxGeometry args={[0.5, 0.5, 1]} />
                <meshBasicMaterial color="#2dd4bf" wireframe />
            </mesh>
            <group position={[0, 8, 0.8]} ref={bladeRef}>
                {[0, 1, 2].map((i) => (
                    <group key={i} rotation={[0, 0, (i * Math.PI * 2) / 3]}>
                        <mesh position={[0, 2, 0]}>
                            <coneGeometry args={[0.2, 4, 4]} />
                            <meshBasicMaterial color="#5eead4" wireframe />
                        </mesh>
                    </group>
                ))}
            </group>
        </group>
    );
}

function SolarArray({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) {
    return (
        <group position={position} rotation={rotation}>
            <gridHelper args={[8, 8, 0x2dd4bf, 0x0f766e]} position={[0, 0, 0]} rotation={[0.5, 0, 0]} />
        </group>
    );
}

function IndustrialBattery({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) {
    return (
        <group position={position} rotation={rotation}>
             <HudLabel position={[0, 4, 0]} text="Storage: Full" subtext="Cycle: 4502" />
            <mesh position={[0, 1.5, 0]}>
                <boxGeometry args={[2, 3, 1]} />
                <meshBasicMaterial color="#115e59" wireframe />
            </mesh>
            {Array.from({ length: 4 }).map((_, i) => (
                 <mesh key={i} position={[0, 0.5 + i * 0.6, 0.51]}>
                    <boxGeometry args={[1.8, 0.4, 0.1]} />
                    <meshBasicMaterial color="#4fd1c5" />
                 </mesh>
            ))}
        </group>
    );
}

// --- MAIN SCENE ---

function DigitalTwinScene() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const lightRef = useRef<THREE.SpotLight>(null);
  const [isReady, setIsReady] = useState(false);
  const [initialPosition] = useState(new THREE.Vector3(0, 1, 15));
  const { pointer } = useThree();

  // Initialize camera position properly on first mount
  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.copy(initialPosition);
      cameraRef.current.lookAt(0, 1, -5); // Match l_forward target
      // Allow a frame for the camera to settle
      setTimeout(() => setIsReady(true), 100);
    }
  }, [initialPosition]); 

  useFrame((state, delta) => {
    if (typeof window === 'undefined' || !isReady) return;
    
    // Safety: Clamp delta
    const safeDelta = Math.min(delta, 0.1);
    
    const scrollY = window.scrollY;
    // Estimate max height carefully
    const winHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    let maxScroll = docHeight - winHeight;
    
    // Safety: MaxScroll Gate
    if (isNaN(maxScroll) || maxScroll < 100) maxScroll = 1000; 
    
    const rawProgress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

    if (cameraRef.current) {
        // --- CHOREOGRAPHY (Fixed Initial State) ---
        // Ensure initial position exactly matches camera initialization
        const p_start = initialPosition.clone(); // Use the same initial position 
        const p_corridor = new THREE.Vector3(0, 1, 8); 
        const p_turbine = new THREE.Vector3(-4, 4, 4); 
        const p_center_lock = new THREE.Vector3(0, 2, 6); 
        const p_battery = new THREE.Vector3(3, 1, 2); 

        const l_forward = new THREE.Vector3(0, 1, -5);
        const l_turbine = new THREE.Vector3(-3, 3, -3);
        const l_center = new THREE.Vector3(0, 2, -2); 
        const l_battery = new THREE.Vector3(2, 2, -3);

        const targetPos = new THREE.Vector3();
        const targetLook = new THREE.Vector3();

        if (rawProgress < 0.2) {
             const t = rawProgress / 0.2;
             targetPos.lerpVectors(p_start, p_corridor, t);
             targetLook.lerpVectors(l_forward, l_center, t);
        } else if (rawProgress < 0.4) {
             const t = (rawProgress - 0.2) / 0.2;
             const smoothT = t * t * (3 - 2 * t);
             targetPos.lerpVectors(p_corridor, p_turbine, smoothT);
             targetLook.lerpVectors(l_center, l_turbine, smoothT);
        } else if (rawProgress < 0.75) {
             const t = Math.min((rawProgress - 0.4) / 0.15, 1); 
             targetPos.lerpVectors(p_turbine, p_center_lock, t);
             targetLook.lerpVectors(l_turbine, l_center, t);
             if (t >= 1) targetPos.y += Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        } else {
             const t = (rawProgress - 0.75) / 0.25;
             const smoothT = t * t;
             targetPos.lerpVectors(p_center_lock, p_battery, smoothT);
             targetLook.lerpVectors(l_center, l_battery, smoothT);
        }

        // Mouse Parallax (Restored & Damped)
        if (pointer) {
             targetPos.x += pointer.x * 0.5; // Increased parallax for drama
             targetPos.y += pointer.y * 0.5;
             targetLook.x += pointer.x * 0.2;
             targetLook.y += pointer.y * 0.2;
        }

        // SAFETY GATE: Check for NaNs before applying
        if (
            !isNaN(targetPos.x) && !isNaN(targetPos.y) && !isNaN(targetPos.z) &&
            !isNaN(targetLook.x) && !isNaN(targetLook.y) && !isNaN(targetLook.z)
        ) {
            // Smoother initial transition
            const lerpFactor = isReady ? 2.0 * safeDelta : 0;
            cameraRef.current.position.lerp(targetPos, lerpFactor); 
            
            // Simple and stable lookAt approach
            if (lerpFactor > 0) {
                // Create a temporary target position for smooth lookAt
                const currentLookTarget = cameraRef.current.getWorldDirection(new THREE.Vector3()).multiplyScalar(10).add(cameraRef.current.position);
                const smoothLookTarget = new THREE.Vector3().lerpVectors(currentLookTarget, targetLook, lerpFactor * 0.3);
                
                // Use direct lookAt for stability
                cameraRef.current.lookAt(smoothLookTarget);
            }
        }
    }

    // Dynamic Spotlight
    if (lightRef.current) {
        lightRef.current.position.x = (rawProgress - 0.5) * 10;
        lightRef.current.target.position.x = (rawProgress - 0.5) * 5;
        lightRef.current.target.updateMatrixWorld();
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 1, 15]} fov={60} />
      <fog attach="fog" args={['#020617', 2, 30]} />

      <ambientLight intensity={0.5} color="#0f766e" />
      <spotLight ref={lightRef} position={[0, 10, 5]} intensity={20} angle={0.8} penumbra={1} color="#2dd4bf" />
      <pointLight position={[0, 2, 0]} intensity={2} color="#5eead4" distance={10} decay={2} />

      {/* Only render content when ready to prevent initial flash */}
      {isReady && (
        <group>
          <ScannerBeam />
        
        {/* ENHANCED CORRIDOR: Data Columns for richer start visually */}
        {[-1, 1].map((side) => (
             Array.from({ length: 6 }).map((_, i) => (
                 <DataColumn key={`${side}-${i}`} position={[side * 4, -2, 12 - i * 4]} />
             ))
        ))}

        <Grid 
            position={[0, -2, 0]} args={[60, 60]} 
            cellColor="#115e59" sectionColor="#2dd4bf" 
            fadeDistance={40} cellSize={1} sectionSize={5} 
        />
        
        {/* ASSETS (Original Layout) */}
        
        {/* Turbine Left */}
        <WindTurbine position={[-8, -2, -5]} rotation={[0, 0.5, 0]} scale={2} />
        
        <SolarArray position={[0, -3, -15]} rotation={[0, 0, 0]} />
        
        {/* Battery Right */}
        <IndustrialBattery position={[6, -1, -5]} rotation={[0, -0.5, 0]} />
        
          <Sparkles count={200} scale={[20, 10, 30]} size={2} speed={0.2} opacity={0.4} color="#5eead4" />
        </group>
      )}

      <EffectComposer>
        <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.2} radius={0.6} />
      </EffectComposer>
    </>
  );
}

export default function Background3D() {
  return (
    <div className="fixed inset-0 z-0 bg-slate-950">
      <Canvas dpr={[1, 2]} gl={{ antialias: false }}>
        <DigitalTwinScene />
      </Canvas>
      <div className="absolute inset-0 z-10 pointer-events-none opacity-20" 
           style={{
               background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
               backgroundSize: "100% 2px, 3px 100%"
           }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/80 pointer-events-none" />
    </div>
  );
}
