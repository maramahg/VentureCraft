"use client";

import { Canvas, useFrame, useGraph } from "@react-three/fiber";
import { useRef, useMemo, Suspense, useEffect, useState } from "react";
import * as THREE from "three";
import { Environment, Float, Sparkles, ContactShadows, useGLTF, useAnimations, Center, Resize } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";



  // useGraph and SkeletonUtils removed for stability. 
  // If we need multiple instances later, we can re-evaluate.
function ManModel() {
  const { scene } = useGLTF("/models/cool_man.glb");
  const headBoneRef = useRef<THREE.Object3D | null>(null);
  const neckBoneRef = useRef<THREE.Object3D | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Object3D | null>(null);
  const rightArmRef = useRef<THREE.Object3D | null>(null);
  const leftForeArmRef = useRef<THREE.Object3D | null>(null);
  const rightForeArmRef = useRef<THREE.Object3D | null>(null);
  
  // Find head, neck, and arm bones
  useEffect(() => {
    scene.traverse((child) => {
      if (child.type === "Bone") {
          const name = child.name.toLowerCase();
          
          // Mixamo rigs often use "mixamorigHead" or just "Head"
          if ((name.includes("head") || name.includes("neck_02") || name === "mixamorighead") && !headBoneRef.current) {
            headBoneRef.current = child;
          }
          if (name.includes("neck") && !neckBoneRef.current) {
            neckBoneRef.current = child;
          }
          
          // Find arm bones for posing
          if (name.includes("leftarm") && !name.includes("forearm") && !leftArmRef.current) {
            leftArmRef.current = child;
          }
          if (name.includes("rightarm") && !name.includes("forearm") && !rightArmRef.current) {
            rightArmRef.current = child;
          }
          if (name.includes("leftforearm") && !leftForeArmRef.current) {
            leftForeArmRef.current = child;
          }
          if (name.includes("rightforearm") && !rightForeArmRef.current) {
            rightForeArmRef.current = child;
          }
      }
    });
  }, [scene]);

  // Pose arms on podium
  useEffect(() => {
    if (leftArmRef.current && rightArmRef.current) {
      // Rotate arms down to natural standing position
      leftArmRef.current.rotation.x = 0.8;
      leftArmRef.current.rotation.z = -0.5; // Rotate down (negative brings left arm down)
      
      rightArmRef.current.rotation.x = 0.8;
      rightArmRef.current.rotation.z = 0.5; // Rotate down (positive brings right arm down)
    }
    
    if (leftForeArmRef.current && rightForeArmRef.current) {
      // Rotate forearms to point hands downward
      leftForeArmRef.current.rotation.x = -0.0; // Bend hands down
      rightForeArmRef.current.rotation.x = -0.0; // Bend hands down
    }
  }, [scene]);

  // Mouse vector
  const mouse = useRef(new THREE.Vector2());

  // Track mouse globally
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    const x = mouse.current.x;
    const y = mouse.current.y;
    const targetYaw = x * 1.5;
    const targetPitch = -y * 0.4;

    if (headBoneRef.current) {
        headBoneRef.current.rotation.y = THREE.MathUtils.lerp(headBoneRef.current.rotation.y, targetYaw * 0.6, 0.1);
        headBoneRef.current.rotation.x = THREE.MathUtils.lerp(headBoneRef.current.rotation.x, targetPitch, 0.1);

        if (neckBoneRef.current) {
            neckBoneRef.current.rotation.y = THREE.MathUtils.lerp(neckBoneRef.current.rotation.y, targetYaw * 0.3, 0.1);
            neckBoneRef.current.rotation.x = THREE.MathUtils.lerp(neckBoneRef.current.rotation.x, targetPitch * 0.2, 0.1);
        }
    } else if (groupRef.current) {
        const target = targetYaw;
        const current = groupRef.current.rotation.y;
        groupRef.current.rotation.y = THREE.MathUtils.lerp(current, target, 0.1);
    }
  });

  return (
    <Resize scale={4.7}>
        <Center top position={[0, -0.7, -0.6]}>
            <group ref={groupRef}>
                <primitive object={scene} />
            </group>
        </Center>
    </Resize>
  );
}

function PodiumModel() {
    const { scene } = useGLTF("/models/podium.glb");
    
    return (
        <Resize scale={3.2}>
            <Center>
                <primitive object={scene} rotation={[0, Math.PI, 0]} />
            </Center>
        </Resize>
    );
}

export default function InteractiveAvatar() {
  return (
    <div className="w-full h-full min-h-[500px] relative">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 35 }}
        dpr={[1, 2]} 
      >
        <Suspense fallback={null}>
          <ambientLight intensity={3} />
          <directionalLight position={[0, 5, 10]} intensity={4} color="#ffffff" />
          <spotLight position={[5, 10, 5]} angle={0.5} penumbra={1} intensity={4} color="#ffffff" />
          <pointLight position={[-5, 5, -5]} intensity={2} color="#ffffff" />
          


          <ManModel />
          <PodiumModel />
          
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
