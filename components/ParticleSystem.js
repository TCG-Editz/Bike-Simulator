import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ParticleSystem({ gameState, bikeSpeed }) {
  const particleInstanceRef = useRef();
  const particleCount = 220;

  const particleDataArray = useMemo(() => {
    const records = [];
    for (let i = 0; i < particleCount; i++) {
      records.push({
        x: (Math.random() * 50) - 25,
        y: (Math.random() * 12) + 0.1,
        z: (Math.random() * -300),
        speedFactor: 0.6 + Math.random() * 1.4
      });
    }
    return records;
  }, []);

  const dummyObject = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    if (!particleInstanceRef.current) return;

    const runtimeSpeedModifier = gameState === 'playing' ? bikeSpeed * 1.1 : 5;

    particleDataArray.forEach((particle, idx) => {
      // Pull items backwards past layout view limits
      particle.z += runtimeSpeedModifier * delta * particle.speedFactor;
      
      if (particle.z > 15) {
        particle.z = -300;
        particle.x = (Math.random() * 50) - 25;
        particle.y = (Math.random() * 12) + 0.1;
      }

      dummyObject.position.set(particle.x, particle.y, particle.z);
      dummyObject.updateMatrix();
      particleInstanceRef.current.setMatrixAt(idx, dummyObject.matrix);
    });

    particleInstanceRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={particleInstanceRef} args={[null, null, particleCount]}>
      <boxGeometry args={[0.04, 0.04, 1.4]} />
      <meshBasicMaterial color="#06b6d4" transparent opacity={0.45} />
    </instancedMesh>
  );
}