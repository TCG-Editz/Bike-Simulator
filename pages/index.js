import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import styles from '../styles/HomeLanding.module.css';
import ScoreLeaderboard from '../components/ScoreLeaderboard';

export default function HomeLandingPortal({ audioContext }) {
  const router = useRouter();

  const {
    isPlaying,
    toggleMusic,
    changeTrack,
  } = audioContext || {};

  const [username, setUsername] = useState('');
  const [isLaunching, setIsLaunching] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const loadingMessages = [
    'CONNECTING TO GRID...',
    'VERIFYING CALLSIGN...',
    'INITIALIZING NEURAL LINK...',
    'SYNCING GLOBAL SERVERS...',
    'FINALIZING UPLINK...',
  ];

  const handleLaunchSequence = async () => {
    const finalUsername =
      username.trim() ||
      `GUEST_${Math.floor(Math.random() * 10000)}`;

    setIsLaunching(true);
    setLoadingStep(0);

    const MIN_LOADING_TIME = 2500;
    const startTime = Date.now();

    /*
     * Static page:
     * We don't animate the loading UI.
     * We simply move through the messages while the
     * server request is being processed.
     */
    const messageTimer = setTimeout(() => {
      setLoadingStep(1);
    }, 500);

    try {
      const response = await fetch('/api/check-username', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          username: finalUsername,
        }),
      });

      const data = await response.json();

      if (data.isTaken) {
        clearTimeout(messageTimer);

        alert('CALLSIGN ALREADY IN USE');

        setIsLaunching(false);
        setLoadingStep(0);

        return;
      }

      localStorage.setItem(
        'neon_rider_user',
        finalUsername
      );

      const elapsed =
        Date.now() - startTime;

      const remainingTime =
        Math.max(
          MIN_LOADING_TIME - elapsed,
          0
        );

      setLoadingStep(4);

      setTimeout(() => {
        router.push('/game');
      }, remainingTime);

    } catch (error) {
      /*
       * If the API is unavailable, allow the player
       * to continue as a guest.
       */

      localStorage.setItem(
        'neon_rider_user',
        finalUsername
      );

      setLoadingStep(4);

      const elapsed =
        Date.now() - startTime;

      const remainingTime =
        Math.max(
          MIN_LOADING_TIME - elapsed,
          0
        );

      setTimeout(() => {
        router.push('/game');
      }, remainingTime);
    }
  };

  const handleTrackChange = (track) => {
    if (typeof changeTrack === 'function') {
      changeTrack(track);
    }

    setIsMenuOpen(false);
  };

  return (
  <div className={styles.portalContainer}>
    <Head>
      <title>NEON RIDER GLOBAL</title>
    </Head>

    {/* MUSIC CONTROLS */}
    <div className={styles.musicControls}>
      <button
        className={styles.musicButton}
        onClick={toggleMusic}
        aria-label={isPlaying ? 'Mute music' : 'Play music'}
      >
        {isPlaying ? '🔊' : '🔇'}
      </button>

      <button
        className={styles.trackButton}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? 'TRACK ▲' : 'TRACK ▼'}
      </button>
    </div>

    {isMenuOpen && (
      <div className={styles.trackSelectorPopup}>
        <div className={styles.trackTitle}>
          SELECT AUDIO STREAM
        </div>

        <button
          className={styles.trackOption}
          onClick={() => changeTrack('/audio/Akon - Lonely.mp3')}
        >
          [01] AKON - LONELY
        </button>

        <button
          className={styles.trackOption}
          onClick={() => changeTrack('/audio/Mood (Lofi).mp3')}
        >
          [02] MOOD LOFI
        </button>

        <button
          className={styles.trackOption}
          onClick={() =>
            changeTrack('/audio/LET THE WORLD BURN - Chris Grey.mp3')
          }
        >
          [03] LET THE WORLD BURN
        </button>

        <button
          className={styles.trackOption}
          onClick={() => changeTrack('/audio/なとり.mp3')}
        >
          [04] NATORI
        </button>

        <button
          className={styles.trackOption}
          onClick={() => changeTrack('/audio/All In.mp3')}
        >
          [05] ALL IN
        </button>

        <button
          className={styles.trackOption}
          onClick={() => changeTrack('/audio/Crush.mp3')}
        >
          [06] CRUSH
        </button>

        <button
          className={styles.trackOption}
          onClick={() => changeTrack('/audio/The Good Times.mp3')}
        >
          [07] THE GOOD TIMES
        </button>

        <button
          className={styles.trackOption}
          onClick={() => changeTrack('/audio/Odoriko.mp3')}
        >
          [08] ODORIKO
        </button>

        <button
          className={styles.trackOption}
          onClick={() => changeTrack('/audio/Lust.mp3')}
        >
          [09] LUST
        </button>
      </div>
    )}

    {/* STATIC BACKGROUND */}
    <div className={styles.aurora} />
    <div className={styles.orb1} />
    <div className={styles.orb2} />
    <div className={styles.orb3} />

    <div className={styles.energyRing} />
    <div className={styles.energyRing2} />

    <div className={styles.techLine1} />
    <div className={styles.techLine2} />

    {/* HUD */}
    <div className={styles.hudTopLeft}>
      PING: 12ms
    </div>

    <div className={styles.hudTopRight}>
      NEURAL LINK: ACTIVE
    </div>

    <div className={styles.hudBottomLeft}>
      SERVER: GLOBAL-01
    </div>

    <div className={styles.hudBottomRight}>
      BUILD: 1.0.NEON
    </div>

    {/* LOADING */}
    {isLaunching && (
      <div className={styles.launchOverlay}>
        <div className={styles.loaderRing} />

        <h2>
          {loadingMessages[loadingStep]}
        </h2>

        <p>
          ESTABLISHING SECURE UPLINK...
        </p>
      </div>
    )}

    {/* MAIN UI */}
    <main className={styles.layoutWrapper}>
      <span className={styles.cornerTL} />
      <span className={styles.cornerTR} />
      <span className={styles.cornerBL} />
      <span className={styles.cornerBR} />

      <header className={styles.header}>
        <div className={styles.systemTag}>
          GLOBAL CYBER RACING NETWORK
        </div>

        <h1
          className={styles.title}
          data-text="NEON_RIDER"
        >
          NEON
          <span className={styles.neonText}>
            _RIDER
          </span>
        </h1>

        <div className={styles.divider} />
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
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
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
    </main>

    <footer className={styles.footer}>
      <span className={styles.statusDot} />

      {isLaunching
        ? 'HANDSHAKE IN PROGRESS'
        : 'SYSTEM READY'}
    </footer>
  </div>
);
}
