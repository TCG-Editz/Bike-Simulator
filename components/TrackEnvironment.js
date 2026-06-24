import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function TrackEnvironment({ gameState, speed }) {
  const gridPrimaryRef = useRef();
  const gridSecondaryRef = useRef();
  const boundaryLeftRef = useRef();
  const boundaryRightRef = useRef();

  useFrame((state, delta) => {
    if (gameState !== 'playing') return;
    
    const velocityFactor = speed * delta * 0.35;

    if (gridPrimaryRef.current && gridSecondaryRef.current) {
      gridPrimaryRef.current.position.z += velocityFactor;
      gridSecondaryRef.current.position.z += velocityFactor;

      if (gridPrimaryRef.current.position.z > 300) {
        gridPrimaryRef.current.position.z = gridSecondaryRef.current.position.z - 600;
      }
      if (gridSecondaryRef.current.position.z > 300) {
        gridSecondaryRef.current.position.z = gridPrimaryRef.current.position.z - 600;
      }
    }
  });

  return (
    <group>
      {/* Structural Neon Horizon Deck */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[40, 3000]} />
        <meshStandardMaterial color="#030611" roughness={0.9} metalness={0.4} />
      </mesh>

      {/* Primary Roadbed Splines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[16, 3000]} />
        <meshStandardMaterial color="#05091a" roughness={0.8} />
      </mesh>

      {/* Interlocking Grid Systems */}
      <group ref={gridPrimaryRef} position={[0, 0, 0]}>
        <gridHelper args={[200, 50, '#06b6d4', '#1e293b']} position={[0, 0.01, 0]} />
      </group>
      <group ref={gridSecondaryRef} position={[0, 0, -600]}>
        <gridHelper args={[200, 50, '#06b6d4', '#1e293b']} position={[0, 0.01, 0]} />
      </group>

      {/* Cyberpunk Track Side Light Guardrails */}
      <mesh ref={boundaryLeftRef} position={[-8.2, 0.2, -500]}>
        <boxGeometry args={[0.15, 0.4, 2000]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1.2} />
      </mesh>
      <mesh ref={boundaryRightRef} position={[8.2, 0.2, -500]}>
        <boxGeometry args={[0.15, 0.4, 2000]} />
        <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={1.2} />
      </mesh>

      {/* Modular Background Structural Towers */}
      {Array.from({ length: 15 }).map((_, i) => {
        const zPos = -150 * i - 50;
        const leftHeight = 25 + Math.random() * 45;
        const rightHeight = 25 + Math.random() * 45;
        return (
          <group key={i}>
            <mesh position={[-35, leftHeight / 2, zPos]}>
              <boxGeometry args={[8, leftHeight, 8]} />
              <meshStandardMaterial color="#090d22" roughness={0.7} metalness={0.8} wireframe />
            </mesh>
            <mesh position={[35, rightHeight / 2, zPos]}>
              <boxGeometry args={[8, rightHeight, 8]} />
              <meshStandardMaterial color="#090d22" roughness={0.7} metalness={0.8} wireframe />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}