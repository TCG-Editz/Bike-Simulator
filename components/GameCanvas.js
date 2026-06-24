import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import TrackEnvironment from './TrackEnvironment';
import CyberBike from './CyberBike';
import HazardBarrier from './HazardBarrier';
import ParticleSystem from './ParticleSystem';

export default function GameCanvas({ 
  gameState, 
  hasStartedMoving, 
  speed, 
  setSpeed, 
  distance, 
  setDistance, 
  time,           // Added time prop
  setTime,        // Added setTime prop
  obstacles, 
  setObstacles,
  controlsRef, 
  onCollision,
  audioEngine 
}) {
  return (
    <div className="absolute top-0 left-0 w-screen h-screen z-10 overflow-hidden m-0 p-0">
      <Canvas
        camera={{ position: [0, 4.5, 8.5], fov: 70, near: 0.1, far: 3000 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        resize={{ scroll: false, debounce: 0 }}
        style={{ width: '100vw', height: '100vh' }}
      >
        <color attach="background" args={["#020409"]} />
        
        <ambientLight intensity={0.45} />
        <directionalLight 
          position={[20, 50, 20]} 
          intensity={1.3} 
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048} 
        />
        <pointLight position={[-15, 15, -30]} intensity={0.7} color="#06b6d4" />
        <pointLight position={[15, 15, -60]} intensity={0.7} color="#ec4899" />

        <Stars 
          radius={300} 
          depth={80} 
          count={3500} 
          factor={7} 
          saturation={0.5} 
          fade 
          speed={gameState === 'playing' && hasStartedMoving ? 1.8 : 0.2} 
        />
        
        <TrackEnvironment 
          gameState={gameState} 
          hasStartedMoving={hasStartedMoving} 
          speed={speed} 
        />
        
        {obstacles.map((obs) => (
          <HazardBarrier 
            key={obs.id} 
            obstacleData={obs} 
            speed={obs.speed} 
            gameState={gameState} 
            hasStartedMoving={hasStartedMoving}
          />
        ))}

        <ParticleSystem 
          gameState={gameState} 
          hasStartedMoving={hasStartedMoving} 
          bikeSpeed={speed} 
        />

        <CyberBike 
          gameState={gameState}
          hasStartedMoving={hasStartedMoving}
          speed={speed}
          setSpeed={setSpeed}
          distance={distance}
          setDistance={setDistance}
          time={time}
          setTime={setTime}
          obstacles={obstacles}
          setObstacles={setObstacles}
          controlsRef={controlsRef}
          onCollision={onCollision}
          audioEngine={audioEngine}
        />
      </Canvas>
    </div>
  );
}