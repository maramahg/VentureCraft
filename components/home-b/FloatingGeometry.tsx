'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Floating wireframe icosahedron — represents the global deep-tech network.
 * Purposeful 3D: each edge = a connection between a venture and the world.
 */
function Icosahedron() {
  const outer = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const ring  = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (outer.current) {
      outer.current.rotation.x = t * 0.07;
      outer.current.rotation.y = t * 0.11;
    }
    if (inner.current) {
      inner.current.rotation.x = -t * 0.1;
      inner.current.rotation.y =  t * 0.08;
    }
    if (ring.current) {
      ring.current.rotation.z = t * 0.04;
      ring.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    }
  });

  return (
    <>
      {/* Outer wireframe icosahedron */}
      <mesh ref={outer}>
        <icosahedronGeometry args={[2.2, 1]} />
        <meshBasicMaterial color="#4FD1C5" wireframe transparent opacity={0.08} />
      </mesh>

      {/* Inner denser icosahedron */}
      <mesh ref={inner}>
        <icosahedronGeometry args={[1.4, 1]} />
        <meshBasicMaterial color="#00A383" wireframe transparent opacity={0.12} />
      </mesh>

      {/* Equatorial ring */}
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.6, 0.006, 4, 80]} />
        <meshBasicMaterial color="#4FD1C5" transparent opacity={0.18} />
      </mesh>

      {/* Ambient point light for subtle glow */}
      <pointLight color="#4FD1C5" intensity={0.6} position={[0, 0, 3]} />
    </>
  );
}

export default function FloatingGeometry({ className }: { className?: string }) {
  return (
    <Canvas
      className={className}
      camera={{ position: [0, 0, 5.5], fov: 42 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 1.5]}
    >
      <Icosahedron />
    </Canvas>
  );
}
