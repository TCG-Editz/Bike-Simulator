import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import MainMenu from '../components/MainMenu';
import HUDOverlay from '../components/HUDOverlay';
import GameOverModal from '../components/GameOverModal';
import GameStartModal from '../components/GameStartModal';
import GameCanvas from '../components/GameCanvas';
import ScoreLeaderboard from '../components/ScoreLeaderboard';
import { useGameControls } from '../hooks/useGameControls';
import { useAudioEngine } from '../hooks/useAudioEngine';

function MasterArcadeAppPortal() {
  const router = useRouter();
  const controlsRef = useGameControls();
  const audioEngine = useAudioEngine();

  const [currentUser, setCurrentUser] = useState('GUEST_USER');
  const [gameState, setGameState] = useState('menu');
  const [hasStartedMoving, setHasStartedMoving] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0); // Added timer state
  const [obstacles, setObstacles] = useState([]);
  const [isClientMounted, setIsClientMounted] = useState(false);
  const [sessionHighScore, setSessionHighScore] = useState(0);

  // Timer logic: starts only when the game is 'playing' AND movement has begun
  useEffect(() => {
    let interval = null;
    if (gameState === 'playing' && hasStartedMoving) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [gameState, hasStartedMoving]);

  useEffect(() => {
    setIsClientMounted(true);
    const savedUser = localStorage.getItem('neon_rider_user');
    if (savedUser) setCurrentUser(savedUser);
    const record = localStorage.getItem('neon_rider_high_score');
    if (record) setSessionHighScore(Math.round(parseFloat(record)));
    
    return () => audioEngine?.silenceEngine?.();
  }, [audioEngine]);

  const submitScoreToLeaderboard = async (finalScore, finalTime) => {
    try {
      const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: currentUser, 
          score: Math.round(finalScore),
          time: Math.round(finalTime) 
        })
      });
      return res.ok;
    } catch (err) {
      console.error("Leaderboard transmission failed:", err);
      return false;
    }
  };

  const handleImpactCollisionTermination = async () => {
  audioEngine?.playCrash?.();
  audioEngine?.silenceEngine?.();

  setGameState('gameover');

  const currentRunScore = Math.round(distance);
  const currentRunTime = Math.round(timeElapsed);

  // Save LAST RUN
  localStorage.setItem(
    'bike_last_run_score',
    currentRunScore.toString()
  );

  localStorage.setItem(
    'bike_last_run_time',
    currentRunTime.toString()
  );

  // Save HIGH SCORE
  const storedHighScore =
    Number(localStorage.getItem('bike_high_score')) || 0;

  if (currentRunScore > storedHighScore) {
    localStorage.setItem(
      'bike_high_score',
      currentRunScore.toString()
    );

    setSessionHighScore(currentRunScore);
  }

  await submitScoreToLeaderboard(
    currentRunScore,
    currentRunTime
  );
};

  const handleAbortToTerminalHome = () => {
    audioEngine?.silenceEngine?.();
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    router.replace('/');
  };

  useEffect(() => {
    if (gameState !== 'playing' || hasStartedMoving) return;
    const handleInitialThrottleDetection = (event) => {
      if (['w', 'arrowup', ' '].includes(event.key.toLowerCase())) {
        setHasStartedMoving(true);
        audioEngine?.startEngineLoop?.();
      }
    };
    window.addEventListener('keydown', handleInitialThrottleDetection);
    return () => window.removeEventListener('keydown', handleInitialThrottleDetection);
  }, [gameState, hasStartedMoving, audioEngine]);

  const executeSystemStartSequence = () => {
    setDistance(0);
    setTimeElapsed(0); // Reset timer on start
    setSpeed(0);
    setHasStartedMoving(false);
    try { document.documentElement.requestFullscreen?.(); } catch (err) { console.warn(err); }
    const generatedObstacleScaffolding = Array.from({ length: 120 }, (_, i) => ({
      id: i + Date.now() + Math.random(),
      x: (Math.random() * 13.6) - 6.8,
      z: -(100 + i * (30 + Math.random() * 35)),
      speed: Math.random() > 0.55 ? (Math.random() * 22 - 11) : 0
    }));
    setObstacles(generatedObstacleScaffolding);
    setGameState('playing');
  };

  if (!isClientMounted) return null;

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-[#020409] m-0 p-0 text-white font-mono">
      <Head><title>NEON RIDER</title></Head>
      <div className="absolute inset-0 z-10 block w-full h-full">
        <GameCanvas 
          gameState={gameState} hasStartedMoving={hasStartedMoving} 
          speed={speed} setSpeed={setSpeed} distance={distance} setDistance={setDistance}
          obstacles={obstacles} setObstacles={setObstacles} controlsRef={controlsRef}
          onCollision={handleImpactCollisionTermination} audioEngine={audioEngine}
          time={timeElapsed} 
          setTime={setTimeElapsed}
        />
      </div>
      <div className="absolute inset-0 pointer-events-none z-40 flex flex-col justify-between p-6">
        <div className="w-full flex justify-between items-start pointer-events-auto">
          {gameState === 'gameover' && <ScoreLeaderboard currentScore={distance} highScore={sessionHighScore} currentTime={timeElapsed} />}
        </div>
        <div className="w-full pointer-events-auto">
          {gameState === 'playing' && <HUDOverlay speed={speed} distance={distance} time={timeElapsed} />}
        </div>
      </div>
      <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
        <div className="pointer-events-auto w-full h-full flex items-center justify-center">
          {gameState === 'menu' && <MainMenu onStartGame={() => setGameState('countdown')} audioEngine={audioEngine} />}
          {gameState === 'countdown' && <GameStartModal onConfirmStart={executeSystemStartSequence} audioEngine={audioEngine} />}
          {gameState === 'gameover' && (
            <GameOverModal distance={distance} highScore={sessionHighScore} time={timeElapsed}
              onRestartGame={() => setGameState('countdown')} onExitToHome={handleAbortToTerminalHome} audioEngine={audioEngine} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default MasterArcadeAppPortal; 