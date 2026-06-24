import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

export default function HazardBarrier({ obstacleData, speed, gameState, hasStartedMoving }) {
  const localBarrierGroupRef = useRef();
  
  // Track the obstacle's horizontal scanning speed (X-axis velocity)
  const horizontalVelocityRef = useRef(speed);

  // Sync the horizontal speed ref if a layout re-render triggers
  useEffect(() => {
    horizontalVelocityRef.current = speed;
  }, [speed]);

  // Capture the initial spawn position on component mount
  useEffect(() => {
    if (localBarrierGroupRef.current) {
      localBarrierGroupRef.current.position.x = obstacleData.x;
      localBarrierGroupRef.current.position.z = obstacleData.z;
    }
  }, [obstacleData]);

  useFrame((state, delta) => {
    // 🚨 GUARD CHECK: Freeze obstacle movement if game is playing but player hasn't moved yet
    if (gameState !== 'playing' || !hasStartedMoving) return;

    if (localBarrierGroupRef.current) {
      // 1. THE HYBRID TREADMILL SCROLL: 
      const bikeSpeed = state.scene.userData.currentBikeSpeed || 45; 
      
      // Move the hazard BACKWARDS toward the stationary bike camera space
      localBarrierGroupRef.current.position.z += bikeSpeed * delta;
      
      // Mutate the original data reference for collision detection
      obstacleData.z = localBarrierGroupRef.current.position.z;

      // 2. SIDE-TO-SIDE SCANNING: Move left and right on the track lanes (X-axis)
      if (horizontalVelocityRef.current !== 0) {
        localBarrierGroupRef.current.position.x += horizontalVelocityRef.current * delta;
        obstacleData.x = localBarrierGroupRef.current.position.x;

        // Bounce mechanics
        const currentX = localBarrierGroupRef.current.position.x;
        if (currentX > 6.5) {
          localBarrierGroupRef.current.position.x = 6.5;
          horizontalVelocityRef.current *= -1; 
        } else if (currentX < -6.5) {
          localBarrierGroupRef.current.position.x = -6.5;
          horizontalVelocityRef.current *= -1;
        }
      }
    }
  });

  return (
    <group ref={localBarrierGroupRef} position={[obstacleData.x, 0, obstacleData.z]}>
      {/* Transverse Heavy Defense Anchor Guard Base */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[2.5, 0.8, 0.65]} />
        <meshStandardMaterial color="#1e1b4b" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Glowing Energy Hazard Core Block */}
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[2.3, 0.45, 0.55]} />
        <meshStandardMaterial 
          color="#f43f5e" 
          emissive="#f43f5e" 
          emissiveIntensity={2.5} 
          transparent 
          opacity={0.95} 
        />
      </mesh>

      {/* Structural Lateral Support Pillar Anchors */}
      <mesh position={[-1.1, 0.15, 0]}>
        <cylinderGeometry args={[0.08, 0.14, 0.3, 8]} />
        <meshStandardMaterial color="#334155" metalness={0.9} />
      </mesh>
      <mesh position={[1.1, 0.15, 0]}>
        <cylinderGeometry args={[0.08, 0.14, 0.3, 8]} />
        <meshStandardMaterial color="#334155" metalness={0.9} />
      </mesh>
    </group>
  );
}