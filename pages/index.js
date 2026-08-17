import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import styles from '../styles/HomeLanding.module.css';

import ScoreLeaderboard from '../components/ScoreLeaderboard';


export default function HomeLandingPortal({
  audioContext,
}) {
  const router = useRouter();

  const {
    isPlaying,
    toggleMusic,
    changeTrack,
  } = audioContext || {};


  /* =====================================================
     STATE
     ===================================================== */

  const [username, setUsername] =
    useState('');

  const [isLaunching, setIsLaunching] =
    useState(false);

  const [loadingStep, setLoadingStep] =
    useState(0);

  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  const [
    mousePosition,
    setMousePosition,
  ] = useState({
    x: 0,
    y: 0,
  });


  /* =====================================================
     REFS
     ===================================================== */

  const launchTimeoutRef =
    useRef(null);

  const loadingIntervalRef =
    useRef(null);


  /* =====================================================
     LOADING MESSAGES
     ===================================================== */

  const loadingMessages = useMemo(
    () => [
      'CONNECTING TO GRID...',
      'VERIFYING CALLSIGN...',
      'INITIALIZING NEURAL LINK...',
      'SYNCING GLOBAL SERVERS...',
      'FINALIZING UPLINK...',
    ],
    []
  );


  /* =====================================================
     AUDIO TRACKS
     ===================================================== */

  const tracks = useMemo(
    () => [
      {
        id: '01',
        name: 'Akon - Lonely',
        src: '/audio/Akon - Lonely.mp3',
      },

      {
        id: '02',
        name: 'MOOD LOFI',
        src: '/audio/Mood (Lofi).mp3',
      },

      {
        id: '03',
        name: 'LET THE WORLD BURN',
        src:
          '/audio/LET THE WORLD BURN - Chris Grey.mp3',
      },

      {
        id: '04',
        name: 'Natori - なとり',
        src: '/audio/なとり.mp3',
      },

      {
        id: '05',
        name: 'ALL IN',
        src: '/audio/All In.mp3',
      },

      {
        id: '06',
        name: 'CRUSH',
        src: '/audio/Crush.mp3',
      },

      {
        id: '07',
        name: 'THE GOOD TIMES',
        src: '/audio/The Good Times.mp3',
      },

      {
        id: '08',
        name: '踊り子',
        src: '/audio/Odoriko.mp3',
      },

      {
        id: '09',
        name: 'LUST',
        src: '/audio/Lust.mp3',
      },
    ],
    []
  );


  /* =====================================================
     PARTICLES
     ===================================================== */

  const particles = useMemo(() => {
    return Array.from(
      { length: 20 },
      (_, index) => ({
        id: index,
        left: Math.random() * 100,
      })
    );
  }, []);


  /* =====================================================
     DESKTOP CURSOR
     ===================================================== */

  useEffect(() => {
    if (
      typeof window === 'undefined'
    ) {
      return undefined;
    }

    const mediaQuery =
      window.matchMedia(
        '(hover: hover) and (pointer: fine)'
      );

    if (!mediaQuery.matches) {
      return undefined;
    }

    let rafId = null;


    const handleMouseMove =
      (event) => {
        if (rafId !== null) {
          cancelAnimationFrame(
            rafId
          );
        }

        rafId =
          requestAnimationFrame(() => {
            setMousePosition({
              x: event.clientX,
              y: event.clientY,
            });
          });
      };


    window.addEventListener(
      'mousemove',
      handleMouseMove,
      {
        passive: true,
      }
    );


    return () => {
      window.removeEventListener(
        'mousemove',
        handleMouseMove
      );

      if (rafId !== null) {
        cancelAnimationFrame(
          rafId
        );
      }
    };
  }, []);


  /* =====================================================
     CLEANUP
     ===================================================== */

  useEffect(() => {
    return () => {
      if (
        loadingIntervalRef.current
      ) {
        clearInterval(
          loadingIntervalRef.current
        );
      }

      if (
        launchTimeoutRef.current
      ) {
        clearTimeout(
          launchTimeoutRef.current
        );
      }
    };
  }, []);


  /* =====================================================
     LAUNCH
     ===================================================== */

  const handleLaunchSequence =
    async () => {
      if (isLaunching) {
        return;
      }


      const finalUsername =
        username.trim() ||
        `GUEST_${Math.floor(
          Math.random() * 10000
        )}`;


      setIsLaunching(true);
      setLoadingStep(0);


      const MIN_LOADING_TIME =
        3000;

      const startTime =
        Date.now();


      /* -----------------------------------------------
         Loading messages
         ----------------------------------------------- */

      loadingIntervalRef.current =
        setInterval(() => {
          setLoadingStep(
            (previous) => {
              if (
                previous <
                loadingMessages.length - 1
              ) {
                return previous + 1;
              }

              return previous;
            }
          );
        }, 700);


      try {
        const response =
          await fetch(
            '/api/check-username',
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body: JSON.stringify({
                username:
                  finalUsername,
              }),
            }
          );


        const data =
          await response.json();


        /* ---------------------------------------------
           CALLSIGN TAKEN
           --------------------------------------------- */

        if (data?.isTaken) {
          if (
            loadingIntervalRef.current
          ) {
            clearInterval(
              loadingIntervalRef.current
            );
          }

          setIsLaunching(false);

          window.alert(
            'CALLSIGN ALREADY IN USE'
          );

          return;
        }


        /* ---------------------------------------------
           SAVE USER
           --------------------------------------------- */

        try {
          window.localStorage.setItem(
            'neon_rider_user',
            finalUsername
          );
        } catch {
          // Ignore localStorage errors.
        }


        /* ---------------------------------------------
           MINIMUM CINEMATIC LOAD
           --------------------------------------------- */

        const elapsed =
          Date.now() - startTime;

        const remainingTime =
          Math.max(
            MIN_LOADING_TIME -
              elapsed,
            0
          );


        launchTimeoutRef.current =
          setTimeout(() => {
            if (
              loadingIntervalRef.current
            ) {
              clearInterval(
                loadingIntervalRef.current
              );
            }

            router.push('/game');
          }, remainingTime);

      } catch {
        /* ---------------------------------------------
           API FALLBACK
           --------------------------------------------- */

        try {
          window.localStorage.setItem(
            'neon_rider_user',
            finalUsername
          );
        } catch {
          // Ignore storage errors.
        }


        const elapsed =
          Date.now() - startTime;

        const remainingTime =
          Math.max(
            MIN_LOADING_TIME -
              elapsed,
            0
          );


        launchTimeoutRef.current =
          setTimeout(() => {
            if (
              loadingIntervalRef.current
            ) {
              clearInterval(
                loadingIntervalRef.current
              );
            }

            router.push('/game');
          }, remainingTime);
      }
    };


  /* =====================================================
     MUSIC
     ===================================================== */

  const handleToggleMusic =
    () => {
      if (
        typeof toggleMusic ===
        'function'
      ) {
        toggleMusic();
      }
    };


  const handleChangeTrack =
    (src) => {
      if (
        typeof changeTrack ===
        'function'
      ) {
        changeTrack(src);
      }

      setIsMenuOpen(false);
    };


  /* =====================================================
     RENDER
     ===================================================== */

  return (
    <>
      <Head>
        <title>
          NEON RIDER GLOBAL
        </title>

        <meta
          name="description"
          content="NEON RIDER GLOBAL — Cyber Racing Network"
        />

        <meta
          name="theme-color"
          content="#020409"
        />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </Head>


      {/* =================================================
          SINGLE MAIN CONTAINER
          ================================================= */}

      <main
        className={
          styles.portalContainer
        }
      >


        {/* =================================================
            MUSIC CONTROLS
            ================================================= */}

        <div
          className={
            styles.musicControls
          }
        >

          <button
            type="button"
            className={
              styles.musicButton
            }
            onClick={
              handleToggleMusic
            }
            aria-label={
              isPlaying
                ? 'Mute music'
                : 'Play music'
            }
          >
            {isPlaying
              ? '🔊'
              : '🔇'}
          </button>


          <button
            type="button"
            className={
              styles.trackButton
            }
            onClick={() =>
              setIsMenuOpen(
                (previous) =>
                  !previous
              )
            }
            aria-expanded={
              isMenuOpen
            }
          >
            {isMenuOpen
              ? 'TRACK SELECT 🔼'
              : 'TRACK SELECT 🔽'}
          </button>

        </div>


        {/* =================================================
            TRACK SELECTOR
            ================================================= */}

        {isMenuOpen && (
          <div
            className={
              styles.trackSelectorPopup
            }
          >

            <h3
              className={
                styles.trackSelectorTitle
              }
            >
              SELECT AUDIO STREAM
            </h3>


            <div
              className={
                styles.trackList
              }
            >

              {tracks.map(
                (track) => (
                  <button
                    key={track.id}
                    type="button"
                    className={
                      styles.trackOption
                    }
                    onClick={() =>
                      handleChangeTrack(
                        track.src
                      )
                    }
                  >
                    [{track.id}]{' '}
                    {track.name}
                  </button>
                )
              )}

            </div>

          </div>
        )}


        {/* =================================================
            BACKGROUND
            ================================================= */}

        <div
          className={
            styles.digitalRain
          }
        />

        <div
          className={
            styles.circuitOverlay
          }
        />

        <div
          className={
            styles.aurora
          }
        />

        <div
          className={
            styles.grid
          }
        />

        <div
          className={
            styles.radar
          }
        />

        <div
          className={
            styles.scanline
          }
        />

        <div
          className={
            styles.noise
          }
        />

        <div
          className={
            styles.orb1
          }
        />

        <div
          className={
            styles.orb2
          }
        />

        <div
          className={
            styles.orb3
          }
        />

        <div
          className={
            styles.starField
          }
        />

        <div
          className={
            styles.energyRing
          }
        />

        <div
          className={
            styles.energyRing2
          }
        />

        <div
          className={
            styles.hexGrid
          }
        />

        <div
          className={
            styles.techLine1
          }
        />

        <div
          className={
            styles.techLine2
          }
        />


        {/* =================================================
            PARTICLES
            ================================================= */}

        <div
          className={
            styles.particleLayer
          }
        >

          {particles.map(
            (particle) => (
              <span
                key={particle.id}
                className={
                  styles.particle
                }
                style={{
                  '--delay':
                    `${particle.id * 0.3}s`,

                  '--left':
                    `${particle.left}%`,
                }}
              />
            )
          )}

        </div>


        {/* =================================================
            HUD
            ================================================= */}

        <div
          className={
            styles.hudTopLeft
          }
        >
          PING: 12ms
        </div>

        <div
          className={
            styles.hudTopRight
          }
        >
          NEURAL LINK: ACTIVE
        </div>

        <div
          className={
            styles.hudBottomLeft
          }
        >
          SERVER: GLOBAL-01
        </div>

        <div
          className={
            styles.hudBottomRight
          }
        >
          BUILD: 1.0.NEON
        </div>


        {/* =================================================
            CURSOR
            ================================================= */}

        <div
          className={
            styles.cursorGlow
          }
          style={{
            left:
              `${mousePosition.x}px`,
            top:
              `${mousePosition.y}px`,
          }}
        />


        {/* =================================================
            LAUNCH OVERLAY
            ================================================= */}

        {isLaunching && (
          <div
            className={
              styles.launchOverlay
            }
            role="status"
            aria-live="polite"
          >

            <div
              className={
                styles.loaderRing
              }
            />

            <h2>
              {
                loadingMessages[
                  loadingStep
                ]
              }
            </h2>

            <p>
              ESTABLISHING SECURE UPLINK...
            </p>

          </div>
        )}


        {/* =================================================
            MAIN PANEL
            ================================================= */}

        <section
          className={
            styles.layoutWrapper
          }
        >

          {/* HUD CORNERS */}

          <span
            className={
              styles.cornerTL
            }
          />

          <span
            className={
              styles.cornerTR
            }
          />

          <span
            className={
              styles.cornerBL
            }
          />

          <span
            className={
              styles.cornerBR
            }
          />


          {/* HEADER */}

          <header
            className={
              styles.header
            }
          >

            <div
              className={
                styles.systemTag
              }
            >
              GLOBAL CYBER RACING NETWORK
            </div>


            <h1
              className={
                styles.title
              }
              data-text="NEON_RIDER"
            >
              NEON
              <span
                className={
                  styles.neonText
                }
              >
                _RIDER
              </span>
            </h1>


            <div
              className={
                styles.divider
              }
            />

          </header>


          {/* =================================================
              CALLSIGN
              ================================================= */}

          <section
            className={
              styles.inputSection
            }
          >

            <input
              className={
                styles.inputField
              }

              type="text"

              inputMode="text"

              autoComplete="nickname"

              autoCapitalize="characters"

              autoCorrect="off"

              spellCheck={false}

              placeholder="ENTER CALLSIGN"

              value={username}

              onChange={(event) => {
                const value =
                  event.target.value
                    .toUpperCase()
                    .replace(
                      /[^A-Z0-9_-]/g,
                      ''
                    );

                setUsername(value);
              }}

              maxLength={12}

              disabled={
                isLaunching
              }

              aria-label="Enter callsign"
            />


            <button
              type="button"
              className={
                styles.button
              }

              onClick={
                handleLaunchSequence
              }

              disabled={
                isLaunching
              }
            >
              {isLaunching
                ? 'SYNCHRONIZING...'
                : 'INITIALIZE UPLINK'}
            </button>

          </section>


          {/* =================================================
              LEADERBOARD
              ================================================= */}

          <div
            className={
              styles.leaderboardCard
            }
          >
            <ScoreLeaderboard
              currentScore={0}
            />
          </div>

        </section>


        {/* =================================================
            FOOTER
            ================================================= */}

        <footer
          className={
            styles.footer
          }
        >

          <span
            className={
              styles.statusDot
            }
          />

          {isLaunching
            ? 'HANDSHAKE IN PROGRESS'
            : 'SYSTEM READY'}

        </footer>

      </main>
    </>
  );
}