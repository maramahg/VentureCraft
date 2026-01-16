'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Line, Html } from '@react-three/drei';
import { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';

function GlobalSphere() {
  const meshRef = useRef<THREE.Group>(null);
  
  // Create points on a sphere surface to represent "nodes" or "hubs"
  const points = useMemo(() => {
    const temp = [];
    const count = 60;
    for (let i = 0; i < count; i++) {
        // Uniform distribution on sphere
        const phi = Math.acos(-1 + (2 * i) / count);
        const theta = Math.sqrt(count * Math.PI) * phi;
        const x = 3.5 * Math.cos(theta) * Math.sin(phi);
        const y = 3.5 * Math.sin(theta) * Math.sin(phi);
        const z = 3.5 * Math.cos(phi);
        temp.push(new THREE.Vector3(x, y, z));
    }
    return temp;
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
        meshRef.current.rotation.y += delta * 0.1; // Slow rotation of the world
        meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Central Wireframe Globe */}
      <Sphere args={[3.4, 24, 24]}>
         <meshBasicMaterial color="#003833" wireframe transparent opacity={0.1} />
      </Sphere>
      
      {/* Nodes */}
      {points.map((pos, i) => (
        <mesh key={i} position={pos}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color={i % 3 === 0 ? "#4FD1C5" : "#00A383"} />
        </mesh>
      ))}

      {/* Connecting Lines (Simulating Network) */}
      {/* We just draw a few lines between random points for effect */}
        <Lines points={points} />
    </group>
  );
}

function Lines({ points }: { points: THREE.Vector3[] }) {
    const lines = useMemo(() => {
        const temp = [];
        // Connect each point to nearest 2 points or simple random connections for visual abstractness
        for (let i = 0; i < points.length; i++) {
            const p1 = points[i];
            const p2 = points[(i + 3) % points.length]; // Connect to another point
            const p3 = points[(i + 5) % points.length]; 
            
            temp.push(p1);
            temp.push(p2);
            
             if (i % 2 === 0) {
                 temp.push(p1);
                 temp.push(p3);
             }
        }
        return temp;
    }, [points]);

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry().setFromPoints(lines);
        return geo;
    }, [lines]);

    return (
        <lineSegments geometry={geometry}>
            <lineBasicMaterial color="#00A383" transparent opacity={0.15} />
        </lineSegments>
    )
}

function Satellites() {
    const groupRef = useRef<THREE.Group>(null);
    
    useFrame((state) => {
        if(groupRef.current) {
            groupRef.current.rotation.y -= 0.005;
            groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
        }
    });

    return (
        <group ref={groupRef} rotation={[0, 0, Math.PI / 6]}>
             {/* Orbiting Ring 1 */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[5, 0.02, 16, 100]} />
                <meshBasicMaterial color="#4FD1C5" transparent opacity={0.3} />
            </mesh>
            
            {/* Satellite 1 */}
            <mesh position={[5, 0, 0]}>
                <sphereGeometry args={[0.15]} />
                <meshBasicMaterial color="#ffffff" />
            </mesh>

             {/* Orbiting Ring 2 */}
            <mesh rotation={[0, Math.PI / 3, 0]}>
                 <torusGeometry args={[6, 0.02, 16, 100]} />
                 <meshBasicMaterial color="#00A383" transparent opacity={0.2} />
            </mesh>

             {/* Satellite 2 */}
             <mesh position={[0, 6 * Math.sin(Math.PI/3), 6 * Math.cos(Math.PI/3)]}>
                <boxGeometry args={[0.2, 0.2, 0.2]} />
                <meshBasicMaterial color="#4FD1C5" />
            </mesh>
        </group>
    )
}


export default function Scene() {
  return (
    <div className="absolute inset-0 z-0 bg-gradient-to-br from-vc-green-dark to-black/95">
      <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
        <fog attach="fog" args={['#00201D', 10, 25]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#4FD1C5" />
        
        <GlobalSphere />
        <Satellites />
      </Canvas>
    </div>
  );
}
