import React, { useState, useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../styles/HomeLanding.module.css';
import ScoreLeaderboard from '../components/ScoreLeaderboard';
import { useAudio } from '../hooks/useAudio';

export default function HomeLandingPortal({ audioContext}) {
  const router = useRouter();
  const { audioRef, isPlaying, toggleMusic, changeTrack, src } = audioContext;
  const [username, setUsername] = useState('');
  const [isLaunching, setIsLaunching] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0
  });

  // 🎮 Cinematic boot messages
  const loadingMessages = [
    "CONNECTING TO GRID...",
    "VERIFYING CALLSIGN...",
    "INITIALIZING NEURAL LINK...",
    "SYNCING GLOBAL SERVERS...",
    "FINALIZING UPLINK..."
  ];

  // ⚡ Stable particles (NO jitter)
  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100
    }));
  }, []);

  // 🖱️ Smooth cursor (optimized)
  useEffect(() => {
    let raf;

    const handleMouseMove = (e) => {
      cancelAnimationFrame(raf);

      raf = requestAnimationFrame(() => {
        setMousePosition({
          x: e.clientX,
          y: e.clientY
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  

  const handleLaunchSequence = async () => {
    const finalUsername =
      username.trim() ||
      `GUEST_${Math.floor(Math.random() * 10000)}`;

    setIsLaunching(true);
    setLoadingStep(0);

    const MIN_LOADING_TIME = 4000;
    const startTime = Date.now();

    // 🎬 Step animation
    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < loadingMessages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 700);

    try {
      const response = await fetch('/api/check-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: finalUsername })
      });

      const data = await response.json();

      if (data.isTaken) {
        clearInterval(interval);
        alert('CALLSIGN ALREADY IN USE');
        setIsLaunching(false);
        return;
      }

      localStorage.setItem('neon_rider_user', finalUsername);

      const elapsed = Date.now() - startTime;
      const remainingTime = MIN_LOADING_TIME - elapsed;

      setTimeout(() => {
        clearInterval(interval);
        router.push('/game');
      }, Math.max(remainingTime, 0));

    } catch {
      localStorage.setItem('neon_rider_user', finalUsername);

      const elapsed = Date.now() - startTime;
      const remainingTime = MIN_LOADING_TIME - elapsed;

      setTimeout(() => {
        clearInterval(interval);
        router.push('/game');
      }, Math.max(remainingTime, 0));
    }
  };

  return (
    
    <div className={styles.portalContainer}>
        
      {/* MUSIC CONTROLS */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 100, margin:6 }}>
        <button onClick={toggleMusic} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '15px' }}>
          {isPlaying ? '🔊' : '🔇'}
        </button>
        
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ marginLeft: '6px', background: 'transparent',border: 'none', color: '#00f2ff', cursor: 'pointer' }}>
          {isMenuOpen ? 'TRACK SELECT 🔼':'TRACK SELECT 🔽'}
        </button>
      </div>

      {/* UNIQUE TRACK SELECTOR POPUP */}
      {isMenuOpen && (
        <div className={styles.trackSelectorPopup}>
          <h3 style={{ fontSize: '10px', marginBottom: '10px', color: '#00f2ff' }}>SELECT AUDIO STREAM</h3>
          <button className={styles.trackOption} onClick={() => changeTrack('/audio/Akon - Lonely.mp3')}>[03] Akon - Lonely</button>
          <button className={styles.trackOption} onClick={() => changeTrack('/audio/Mood (Lofi).mp3')}>[01] MOOD LOFI</button>
          <button className={styles.trackOption} onClick={() => changeTrack('/audio/LET THE WORLD BURN - Chris Grey.mp3')}>[02] LET THE WORLD BURN</button>
        </div>
      )}

    <div className={styles.portalContainer}>
      <Head>
        <title>NEON RIDER GLOBAL</title>
      </Head>

      {/* BACKGROUND FX */}
      <div className={styles.digitalRain}></div>
      <div className={styles.circuitOverlay}></div>

      <div className={styles.aurora}></div>
      <div className={styles.grid}></div>
      <div className={styles.radar}></div>
      <div className={styles.scanline}></div>
      <div className={styles.noise}></div>

      <div className={styles.orb1}></div>
      <div className={styles.orb2}></div>
      <div className={styles.orb3}></div>

      <div className={styles.starField}></div>
      <div className={styles.energyRing}></div>
      <div className={styles.energyRing2}></div>
      <div className={styles.hexGrid}></div>

      <div className={styles.techLine1}></div>
      <div className={styles.techLine2}></div>

      {/* PARTICLES (stable) */}
      <div className={styles.particleLayer}>
        {particles.map((p) => (
          <span
            key={p.id}
            className={styles.particle}
            style={{
              '--delay': `${p.id * 0.3}s`,
              '--left': `${p.left}%`
            }}
          />
        ))}
      </div>

      {/* HUD */}
      <div className={styles.hudTopLeft}>PING: 12ms</div>
      <div className={styles.hudTopRight}>NEURAL LINK: ACTIVE</div>
      <div className={styles.hudBottomLeft}>SERVER: GLOBAL-01</div>
      <div className={styles.hudBottomRight}>BUILD: 1.0.NEON</div>

      {/* CURSOR GLOW */}
      <div
        className={styles.cursorGlow}
        style={{
          left: mousePosition.x,
          top: mousePosition.y
        }}
      />

      {/* LOADING OVERLAY */}
      {isLaunching && (
        <div className={styles.launchOverlay}>
          <div className={styles.loaderRing}></div>

          <h2>{loadingMessages[loadingStep]}</h2>

          <p>ESTABLISHING SECURE UPLINK...</p>
        </div>
      )}


      {/* MAIN UI */}
      <div className={styles.layoutWrapper}>
        <span className={styles.cornerTL}></span>
        <span className={styles.cornerTR}></span>
        <span className={styles.cornerBL}></span>
        <span className={styles.cornerBR}></span>

        <header className={styles.header}>
          <div className={styles.systemTag}>
            GLOBAL CYBER RACING NETWORK
          </div>

          <h1 className={styles.title} data-text="NEON_RIDER">
            NEON
            <span className={styles.neonText}>_RIDER</span>
          </h1>

          <div className={styles.divider}></div>
        </header>

        <section className={styles.inputSection}>
          <input
            className={styles.inputField}
            type="text"
            placeholder="ENTER CALLSIGN"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value.toUpperCase())
            }
            maxLength={12}
            disabled={isLaunching}
          />

          <button
            className={styles.button}
            onClick={handleLaunchSequence}
            disabled={isLaunching}
          >
            {isLaunching
              ? 'SYNCHRONIZING...'
              : 'INITIALIZE UPLINK'}
          </button>
        </section>

        <div className={styles.leaderboardCard}>
          

          <ScoreLeaderboard currentScore={0} />
        </div>
      </div>

      <footer className={styles.footer}>
        <span className={styles.statusDot}></span>
        {isLaunching
          ? 'HANDSHAKE IN PROGRESS'
          : 'SYSTEM READY'}
      </footer>
    </div>

    </div>
  );
}