import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';


export default function CyberBike({ 
  gameState, 
  hasStartedMoving, // 🚨 Added freeze state dependency tracking parameter
  speed, 
  setSpeed, 
  distance, 
  setDistance, 
  obstacles,
  setObstacles, 
  controlsRef, 
  onCollision,
  audioEngine
})
 {
  const bikeGroupRef = useRef();
  const chassisRef = useRef();
  const frontForkRef = useRef();
  const frontWheelRef = useRef();
  const rearWheelRef = useRef();
  const lightTrailRef = useRef();
  const collisionTriggered = useRef(false);

  const { scene } = useGLTF('/models/Motorcycle.glb');

const bikeModel = useMemo(() => {
  const clone = scene.clone();

  clone.traverse((obj) => {
    if (obj.isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;

  obj.material = new THREE.MeshPhysicalMaterial({
  map: obj.material?.map || null,

  color: '#f8fafc',          // bright white body

  metalness: 1,
  roughness: 0.08,

  clearcoat: 1,
  clearcoatRoughness: 0.02,

  envMapIntensity: 4,

  emissive: '#8b5cf6',       // violet glow
  emissiveIntensity: 0.18
});
    }
  });

  return clone;
}, [scene]);

  const [lateralVelocity, setLateralVelocity] = useState(0);
  const [bankAngle, setBankAngle] = useState(0);
  
  // Track continuous bike coordinate internally
  const bikeInternalZ = useRef(0);
  const bikeInternalX = useRef(0);

  useEffect(() => {
    if (gameState === 'playing') {
      bikeInternalZ.current = 0;
      bikeInternalX.current = 0;
      collisionTriggered.current = false;
      if (bikeGroupRef.current) {
        bikeGroupRef.current.position.set(0, 0, 0);
        bikeGroupRef.current.rotation.set(0, 0, 0);
      }
      setLateralVelocity(0);
      setBankAngle(0);
      
    }
  }, [gameState]);

  useFrame((state, delta) => {
    // Rigid transform operations when simulation terminates
    if (gameState === 'gameover') {
      if (bikeGroupRef.current) {
        bikeGroupRef.current.position.y = Math.max(0.12, bikeGroupRef.current.position.y - delta * 2);
        bikeGroupRef.current.rotation.z = THREE.MathUtils.lerp(bikeGroupRef.current.rotation.z, Math.PI / 2.2, delta * 4);
        bikeGroupRef.current.rotation.x = THREE.MathUtils.lerp(bikeGroupRef.current.rotation.x, -0.3, delta * 2);
      }
      return;
    }

    if (gameState !== 'playing') return;

    // 🚨 NEW ESCAPE GUARD BLOCK: Freeze system tick parameters until keyboard engagement is established
    if (!hasStartedMoving) {
      // Force internal state variables to report stationary indices to canvas listeners
      state.scene.userData.currentBikeSpeed = 0;
      
      // Lock down standard dynamic background camera updates to prevent camera sway drifting
      const initialCamOffset = new THREE.Vector3(bikeInternalX.current * 0.85, 2.4, 5.8);
      const initialLookTarget = new THREE.Vector3(bikeInternalX.current, 0.9, -15);
      state.camera.position.copy(initialCamOffset);
      state.camera.lookAt(initialLookTarget);
      return; 
    }

    const keys = controlsRef.current || {};    
    // --- 1. ACCELERATION AND VELOCITY MATHEMATICS ---
    let targetAcceleration = 0;
    if (keys.forward) targetAcceleration += 45;
    if (keys.backward) targetAcceleration -= 35;
    if (keys.boost) targetAcceleration += 85;
    if (keys.brake) targetAcceleration -= 95;

    // Fluid aerodynamic drag dampening
    const structuralDrag = speed * 0.45;
    const finalSpeedDelta = targetAcceleration - structuralDrag;
    
    let newSpeed = speed + finalSpeedDelta * delta;
    if (newSpeed > 185) newSpeed = 185;
    if (newSpeed < 0) newSpeed = 0;
    setSpeed(newSpeed);

    // CRITICAL FIX: Share speed directly with the shared 3D Scene instance user-data dictionary
    state.scene.userData.currentBikeSpeed = newSpeed;

    // Communicate speed updates directly to audio engines
    const normalizedVelocity = newSpeed / 185;
    if (audioEngine && typeof audioEngine.updateEnginePitch === 'function') {
      audioEngine.updateEnginePitch(normalizedVelocity);
    }

    // --- 2. LATERAL STEERING CALCULATIONS ---
    let targetSteerForce = 0;
    if (keys.left) targetSteerForce -= 7.5;
    if (keys.right) targetSteerForce += 7.5;

    let currentLatVelocity = lateralVelocity + targetSteerForce * delta * 4;
    // Friction dampening
    currentLatVelocity *= Math.pow(0.04, delta);
    setLateralVelocity(currentLatVelocity);

    // Roll/bank structural mapping equations
    const targetBank = -currentLatVelocity * 0.038;
    setBankAngle(prev =>
  THREE.MathUtils.lerp(prev, targetBank, delta * 8)
);
    // --- 3. SYSTEM COORDINATE UPDATES ---
    bikeInternalX.current += currentLatVelocity * delta * (newSpeed * 0.012 + 0.3);
    
    // Hard collision constraints with guardrails
    if (bikeInternalX.current < -7.4) {
      bikeInternalX.current = -7.4;
      currentLatVelocity *= -0.3;
      setLateralVelocity(currentLatVelocity);
    }
    if (bikeInternalX.current > 7.4) {
      bikeInternalX.current = 7.4;
      currentLatVelocity *= -0.3;
      setLateralVelocity(currentLatVelocity);
    }

    // Advance longitudinal positions relative to velocity metrics
    const frameDistanceTravelled = newSpeed * delta;
    // Increment absolute score state tracking matrix
    setDistance((prev) => parseFloat(prev) + frameDistanceTravelled * 0.1);

    // --- 4. ENGINE TRANSFORM APPLICATION ---
    if (bikeGroupRef.current) {
      bikeGroupRef.current.position.x = bikeInternalX.current;
      bikeGroupRef.current.position.y = 0.45 + Math.sin(state.clock.getElapsedTime() * 14) * (newSpeed * 0.0003);
      bikeGroupRef.current.rotation.z = bankAngle;
      bikeGroupRef.current.rotation.y = currentLatVelocity * 0.018;
    }

    // Spin tires based on current track velocity
    const wheelSpinRotationDelta = (newSpeed * 0.5) * delta;
    if (frontWheelRef.current) {
      frontWheelRef.current.rotation.x -= wheelSpinRotationDelta;
    }

    if (rearWheelRef.current) {
      rearWheelRef.current.rotation.x -= wheelSpinRotationDelta;
    }
    if (chassisRef.current) {
      chassisRef.current.position.y =
      Math.sin(state.clock.getElapsedTime() * 28) *
      (newSpeed / 185) *
      0.018;
    }
    if (lightTrailRef.current) {
  const intensity = newSpeed / 185;

  lightTrailRef.current.scale.y =
    1 + intensity * 2.5;

  lightTrailRef.current.material.opacity =
    0.35 + intensity * 0.55;
}
    // Steer front fork array structure assembly
    if (frontForkRef.current) {
      const targetForkYaw = currentLatVelocity * 0.045;
      frontForkRef.current.rotation.y = THREE.MathUtils.lerp(frontForkRef.current.rotation.y, targetForkYaw, delta * 12);
    }

    // --- 5. REAL-TIME OBSTACLE COLLISION MATRIX ---
    setObstacles((prevObstacles) => {
      // Filter out obstacles that passed the player (Z has scrolled past 25 behind camera)
      const activeObstacles = prevObstacles.filter(obs => obs.z < 25);
      
      // If we fall below target layout density, append an entry forward
      while (activeObstacles.length < 40) {
        const furthestZ = activeObstacles.reduce((min, o) => o.z < min ? o.z : min, -100);
        activeObstacles.push({
          id: Math.random() + Date.now(),
          x: (Math.random() * 13.6) - 6.8,
          z: furthestZ - (35 + Math.random() * 45),
          speed: (Math.random() * 16 - 8) * (Math.random() > 0.6 ? 1 : 0)
        });
      }

      // Check collisions against active layouts using relative spatial offsets
      activeObstacles.forEach((obs) => {
        const lateralDistance = Math.abs(bikeInternalX.current - obs.x);
        
        // Since bike is stationary around Z=0, proximity to Z=0 triggers collisions
        const trackDistance = Math.abs(obs.z); 

        // Check proximity threshold bounding boxes
        if (
          !collisionTriggered.current &&
          trackDistance < 1.35 &&
          lateralDistance < 1.55
        ) {
          collisionTriggered.current = true;
          onCollision();
        }
      });

      return activeObstacles;
    });

    // Dynamic Camera Tracking Vectors
    const idealCamOffset = new THREE.Vector3(bikeInternalX.current * 0.85, 2.4, 5.8);
    const idealLookTarget = new THREE.Vector3(bikeInternalX.current, 0.9, -15);
    
    state.camera.position.lerp(idealCamOffset, delta * 12);
    state.camera.lookAt(idealLookTarget);
  });

  return (
    <group ref={bikeGroupRef}>

  {/* UNDERGLOW */}

  <mesh
    position={[0, 0.05, 0]}
    rotation={[-Math.PI / 2, 0, 0]}
  >
    <circleGeometry args={[1.4, 48]} />
    <meshBasicMaterial
      color="#00d9ff"
      transparent
      opacity={0.2}
    />
  </mesh>

  {/* BIKE MODEL */}

  <group ref={chassisRef}>

    <primitive
      object={bikeModel}
      scale={0.025}
      position={[0, 0.12, 0]}
      castShadow
      receiveShadow
    />
    {/* CYAN SIDE STRIPS */}

    <mesh position={[0.34, 0.46, -0.1]}>
      <boxGeometry args={[0.03, 0.03, 1.4]} />
      <meshBasicMaterial
  color="#00ffff"
  toneMapped={false}
/>
    </mesh>

    <mesh position={[-0.34, 0.46, -0.1]}>
      <boxGeometry args={[0.03, 0.03, 1.4]} />
      <meshBasicMaterial
  color="#8b5cf6"
  toneMapped={false}
/>
    </mesh>

    {/* MAGENTA REAR POWER FINS */}

    <mesh
      position={[0.28, 0.36, 1.05]}
      rotation={[0, 0, 0.3]}
    >
      <boxGeometry args={[0.03, 0.28, 0.65]} />
<meshBasicMaterial color="#8b5cf6" />
</mesh>

    <mesh
      position={[-0.28, 0.36, 1.05]}
      rotation={[0, 0, -0.3]}
    >
      <boxGeometry args={[0.03, 0.28, 0.65]} />
      <meshBasicMaterial color="#ff2fd0" />
    </mesh>

    {/* ENERGY SPINE */}

    <mesh position={[0, 0.72, -0.05]}>
      <boxGeometry args={[0.08, 0.08, 1.2]} />
      <meshStandardMaterial
        color="#22d3ee"
        emissive="#22d3ee"
        emissiveIntensity={1.8}
      />
    </mesh>

    {/* FRONT LIGHT */}

    <mesh position={[0, 0.48, -1.25]}>
      <boxGeometry args={[0.18, 0.03, 0.03]} />
      <meshBasicMaterial color="#67e8f9" />
    </mesh>

    {/* REAR REACTOR */}

    <mesh position={[0, 0.32, 1.25]}>
      <sphereGeometry args={[0.11, 16, 16]} />
      <meshBasicMaterial color="#ec4899" />
    </mesh>

    {/* REACTOR BLOOM */}

    <mesh
      position={[0, 0.32, 1.42]}
      scale={[
        1 + Math.sin(performance.now() * 0.005) * 0.15,
        1 + Math.sin(performance.now() * 0.005) * 0.15,
        1 + Math.sin(performance.now() * 0.005) * 0.15
      ]}
    >
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshBasicMaterial
        color="#ec4899"
        transparent
        opacity={0.55}
      />
    </mesh>

  </group>

  {/* DUMMY FRONT FORK */}

  <group
    ref={frontForkRef}
    position={[0, 0.25, -0.9]}
  />

  {/* DUMMY FRONT WHEEL */}

  <group
    ref={frontWheelRef}
    position={[0, 0, -0.9]}
  />

  {/* DUMMY REAR WHEEL */}

  <group
    ref={rearWheelRef}
    position={[0, 0, 0.9]}
  />

  {/* LIGHT TRAIL */}

  

</group>


  );
}

useGLTF.preload('/models/Motorcycle.glb');