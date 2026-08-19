import React, {
  useState,
  useEffect,
  useCallback
} from 'react';

export default function MainMenu({
  onStartGame,
  audioEngine
}) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [currentUser, setCurrentUser] =
    useState('GUEST_USER');

  useEffect(() => {
    const savedUser =
      localStorage.getItem('neon_rider_user');

    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  const triggerMenuActivation = useCallback(() => {
    if (audioEngine) {
      if (
        typeof audioEngine.initAudio === 'function'
      ) {
        audioEngine.initAudio();
      }

      if (
        typeof audioEngine.playClick === 'function'
      ) {
        audioEngine.playClick();
      }
    }

    onStartGame();
  }, [audioEngine, onStartGame]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) return;

      if (
        e.key === 'Enter' ||
        e.key === ' '
      ) {
        e.preventDefault();
        triggerMenuActivation();
      }
    };

    window.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, [triggerMenuActivation]);

  return (
    <div className="launcher">

      {/* BACKGROUND */}
      <div className="vector-grid" />
      <div className="scanlines" />
      <div className="vignette" />

      <div className="orb orb-cyan" />
      <div className="orb orb-magenta" />

      <main className="shell">

        {/* =========================================
            HEADER
        ========================================= */}

        <header className="top-bar">

          <div className="status-chip online">
            <span className="status-dot">●</span>
            <span>NETWORK SYNC</span>
          </div>

          <div className="status-chip user-chip">
            <span className="pilot-label">
              PILOT:
            </span>

            <span className="username">
              {currentUser}
            </span>
          </div>

          <div className="status-chip warning">
            <span>THREAT</span>
            <strong>02</strong>
          </div>

        </header>

        {/* =========================================
            MAIN CONTENT
        ========================================= */}

        <div className="layout">

          {/* =======================================
              HERO PANEL
          ======================================= */}

          <section className="hero-panel">

            <div className="corner tl" />
            <div className="corner tr" />
            <div className="corner bl" />
            <div className="corner br" />

            <div className="hero-content">

              <div className="classification">
                NR-77 // NEURAL STREET RACING SYSTEM
              </div>

              <div className="title-zone">

                <h1 className="title">
                  <span>NEON</span>
                  <span className="title-accent">
                    RIDER
                  </span>
                </h1>

                <div className="subtitle">
                  HIGH-SPEED COMBAT ARCADE RACER
                </div>

              </div>

              <p className="intro">
                Welcome back,{' '}
                <strong>{currentUser}</strong>.
                Vehicle synchronization complete.
                Neon corridor traffic is active.
                Launch authorization granted.
              </p>

              {/* ===================================
                  READINESS
              =================================== */}

              <div className="readiness-grid">

                <div className="readiness-card">
                  <span className="label">
                    VEHICLE LINK
                  </span>

                  <span className="value success">
                    <i /> CONNECTED
                  </span>
                </div>

                <div className="readiness-card">
                  <span className="label">
                    HAZARD MAP
                  </span>

                  <span className="value cyan">
                    <i /> SCANNING
                  </span>
                </div>

                <div className="readiness-card">
                  <span className="label">
                    FRAME SYNC
                  </span>

                  <span className="value pink">
                    60 FPS LOCK
                  </span>
                </div>

              </div>

              {/* ===================================
                  LAUNCH
              =================================== */}

              <button
                type="button"
                className={`launch-btn ${
                  hovered || focused
                    ? 'active'
                    : ''
                }`}
                onClick={triggerMenuActivation}
                onMouseEnter={() =>
                  setHovered(true)
                }
                onMouseLeave={() =>
                  setHovered(false)
                }
                onFocus={() =>
                  setFocused(true)
                }
                onBlur={() =>
                  setFocused(false)
                }
                aria-label="Start Game"
              >

                <span className="launch-glow" />

                <span className="launch-content">

                  <span className="launch-text">

                    <span className="launch-label">
                      IGNITE ENGINE
                    </span>

                    <span className="launch-hint">
                      ENTER / SPACE
                    </span>

                  </span>

                  <span className="launch-icon">
                    →
                  </span>

                </span>

              </button>

            </div>

          </section>

          {/* =======================================
              TELEMETRY
          ======================================= */}

          <aside className="telemetry">

            <div className="telemetry-card score-card">

              <div className="card-title">
                DAILY HIGH SCORE
              </div>

              <div className="big-number">
                342
                <small>m</small>
              </div>

              <div className="micro-bar">
                <span />
              </div>

              <div className="card-meta">
                CURRENT RECORD
              </div>

            </div>

            <div className="telemetry-card">

              <div className="card-title">
                VEHICLE SYNC
              </div>

              <div className="signal">

                <span />
                <span />
                <span />
                <span />

              </div>

              <div className="small-meta">
                SIGNAL STRENGTH: 98%
              </div>

            </div>

            <div className="telemetry-card protocol-card">

              <div className="card-title">
                LAUNCH PROTOCOL
              </div>

              <ul className="timeline">
                <li>Driver verified</li>
                <li>Systems armed</li>
                <li>Track streaming</li>
                <li className="current">
                  Awaiting ignition
                </li>
              </ul>

            </div>

          </aside>

        </div>

        {/* =========================================
            COMMAND STRIP
        ========================================= */}

        <footer className="command-strip">

          <div className="command-module">
            <span>THROTTLE</span>
            <strong>
              W / ↑ / SPACE
            </strong>
          </div>

          <div className="command-module">
            <span>STEER</span>
            <strong>
              A / D / ← →
            </strong>
          </div>

          <div className="command-module">
            <span>BRAKE</span>
            <strong>
              S / SHIFT
            </strong>
          </div>

        </footer>

      </main>

      <style jsx>{`

        /* =====================================================
           RESET
        ===================================================== */

        .launcher,
        .launcher * {
          box-sizing: border-box;
        }

        /* =====================================================
           ROOT
        ===================================================== */

        .launcher {
          position: fixed;
          inset: 0;

          width: 100%;
          min-height: 100svh;

          overflow-x: hidden;
          overflow-y: auto;

          color: #fff;

          background:
            radial-gradient(
              circle at 15% 10%,
              rgba(0,217,255,.11),
              transparent 34%
            ),
            radial-gradient(
              circle at 85% 90%,
              rgba(255,0,170,.09),
              transparent 34%
            ),
            #02050b;

          font-family:
            Inter,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;

          isolation: isolate;

          -webkit-overflow-scrolling: touch;

          overscroll-behavior: none;
        }

        /* =====================================================
           BACKGROUND
        ===================================================== */

        .vector-grid,
        .scanlines,
        .vignette {
          position: fixed;
          inset: 0;

          pointer-events: none;
        }

        .vector-grid {
          z-index: -3;

          opacity: .13;

          background-image:
            linear-gradient(
              rgba(0,217,255,.12) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(0,217,255,.12) 1px,
              transparent 1px
            );

          background-size:
            clamp(34px, 5vw, 70px)
            clamp(34px, 5vw, 70px);

          transform:
            perspective(900px)
            rotateX(68deg);

          transform-origin: bottom;
        }

        .scanlines {
          z-index: 10;

          opacity: .025;

          background:
            repeating-linear-gradient(
              0deg,
              transparent 0,
              transparent 3px,
              rgba(255,255,255,.12) 4px
            );
        }

        .vignette {
          z-index: -1;

          background:
            radial-gradient(
              ellipse at center,
              transparent 40%,
              rgba(0,0,0,.7) 100%
            );
        }

        .orb {
          position: fixed;

          width:
            clamp(260px, 40vw, 560px);

          height:
            clamp(260px, 40vw, 560px);

          border-radius: 50%;

          pointer-events: none;

          filter: blur(110px);

          z-index: -2;
        }

        .orb-cyan {
          left: -250px;
          top: -250px;

          background:
            rgba(0,217,255,.11);
        }

        .orb-magenta {
          right: -250px;
          bottom: -250px;

          background:
            rgba(255,0,170,.09);
        }

        /* =====================================================
           SHELL
        ===================================================== */

        .shell {
          position: relative;
          z-index: 5;

          width:
            min(
              1400px,
              calc(100% - 32px)
            );

          min-height: 100svh;

          margin: 0 auto;

          padding:
            max(20px, env(safe-area-inset-top))
            max(16px, env(safe-area-inset-right))
            max(20px, env(safe-area-inset-bottom))
            max(16px, env(safe-area-inset-left));

          display: flex;
          flex-direction: column;
          justify-content: center;

          gap: 18px;
        }

        /* =====================================================
           TOP BAR
        ===================================================== */

        .top-bar {
          display: grid;

          grid-template-columns:
            auto
            minmax(0, 1fr)
            auto;

          align-items: center;

          gap: 10px;

          flex-shrink: 0;
        }

        .status-chip {
          min-width: 0;

          min-height: 34px;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 7px;

          padding: 7px 12px;

          border:
            1px solid
            rgba(255,255,255,.11);

          border-radius: 999px;

          background:
            rgba(255,255,255,.045);

          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);

          color: #a9bad3;

          font-size: 11px;
          font-weight: 750;

          letter-spacing: .1em;

          white-space: nowrap;

          overflow: hidden;
          text-overflow: ellipsis;
        }

        .online {
          color: #53ffb2;
        }

        .warning {
          color: #ff5fa7;
        }

        .status-dot {
          font-size: 9px;
        }

        .user-chip {
          justify-self: center;

          width: min(100%, 360px);
        }

        .pilot-label {
          color: #71819a;
        }

        .username {
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* =====================================================
           MAIN GRID
        ===================================================== */

        .layout {
          display: grid;

          grid-template-columns:
            minmax(0, 1.65fr)
            minmax(250px, .75fr);

          gap: 22px;

          min-width: 0;
        }

        /* =====================================================
           PANELS
        ===================================================== */

        .hero-panel,
        .telemetry-card {
          position: relative;

          min-width: 0;

          border:
            1px solid
            rgba(255,255,255,.10);

          background:
            linear-gradient(
              180deg,
              rgba(255,255,255,.065),
              rgba(255,255,255,.025)
            );

          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);

          box-shadow:
            inset 0 1px rgba(255,255,255,.04),
            0 20px 80px rgba(0,0,0,.18);
        }

        .hero-panel {
          min-height: 560px;

          display: flex;
          align-items: center;

          padding:
            clamp(28px, 4vw, 52px);

          border-radius: 26px;

          overflow: hidden;
        }

        .hero-content {
          width: 100%;
          min-width: 0;
        }

        /* =====================================================
           CORNERS
        ===================================================== */

        .corner {
          position: absolute;

          width: 24px;
          height: 24px;

          border-color: #4fe5ff;

          opacity: .6;

          pointer-events: none;
        }

        .tl {
          top: 10px;
          left: 10px;

          border-top: 2px solid;
          border-left: 2px solid;
        }

        .tr {
          top: 10px;
          right: 10px;

          border-top: 2px solid;
          border-right: 2px solid;
        }

        .bl {
          bottom: 10px;
          left: 10px;

          border-bottom: 2px solid;
          border-left: 2px solid;
        }

        .br {
          bottom: 10px;
          right: 10px;

          border-bottom: 2px solid;
          border-right: 2px solid;
        }

        /* =====================================================
           HERO TYPOGRAPHY
        ===================================================== */

        .classification {
          margin-bottom: 16px;

          color: #7ccfff;

          font-family: monospace;

          font-size:
            clamp(9px, .75vw, 12px);

          line-height: 1.4;

          letter-spacing:
            clamp(.08em, .2vw, .2em);

          white-space: nowrap;

          overflow: hidden;
          text-overflow: ellipsis;
        }

        .title {
          display: flex;
          flex-direction: column;

          margin: 0;

          font-size:
            clamp(
              52px,
              7.5vw,
              112px
            );

          line-height: .82;

          font-weight: 950;

          letter-spacing: -.07em;

          color: #f8fafc;

          text-shadow:
            0 0 35px
            rgba(34,211,238,.08);
        }

        .title-accent {
          color: #67e8f9;

          text-shadow:
            3px 0 #ff2ba6,
            0 0 28px
            rgba(0,217,255,.2);
        }

        .subtitle {
          margin-top: 16px;

          color: #9ec7ff;

          font-size:
            clamp(9px, 1vw, 15px);

          font-weight: 600;

          letter-spacing:
            clamp(.08em, .25vw, .3em);
        }

        .intro {
          max-width: 720px;

          margin:
            clamp(20px, 3vh, 32px)
            0;

          color: #cbd5e1;

          font-size:
            clamp(13px, 1.05vw, 17px);

          line-height: 1.65;
        }

        .intro strong {
          color: #67e8f9;
        }

        /* =====================================================
           READINESS
        ===================================================== */

        .readiness-grid {
          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 12px;

          margin-bottom: 22px;
        }

        .readiness-card {
          min-width: 0;

          padding: 14px;

          border:
            1px solid
            rgba(255,255,255,.07);

          border-radius: 14px;

          background:
            rgba(255,255,255,.025);
        }

        .label {
          display: block;

          margin-bottom: 7px;

          color: #8ea3c2;

          font-size: 10px;
          font-weight: 700;

          letter-spacing: .12em;

          white-space: nowrap;

          overflow: hidden;
          text-overflow: ellipsis;
        }

        .value {
          display: flex;
          align-items: center;
          gap: 6px;

          color: #fff;

          font-size: 12px;
          font-weight: 850;

          white-space: nowrap;
        }

        .value i {
          width: 6px;
          height: 6px;

          flex-shrink: 0;

          border-radius: 50%;

          background: currentColor;

          box-shadow:
            0 0 8px currentColor;
        }

        .success {
          color: #53ffb2;
        }

        .cyan {
          color: #67e8f9;
        }

        .pink {
          color: #ff82c5;
        }

        /* =====================================================
           LAUNCH BUTTON
        ===================================================== */

        .launch-btn {
          position: relative;

          width: 100%;
          min-height: 76px;

          padding: 14px 20px;

          border:
            1px solid
            rgba(103,232,249,.55);

          border-radius: 17px;

          cursor: pointer;

          overflow: hidden;

          background:
            linear-gradient(
              135deg,
              #00d9ff,
              #26b9ff 50%,
              #6a7cff
            );

          color: white;

          box-shadow:
            0 15px 45px
            rgba(0,217,255,.14);

          transition:
            transform .18s ease,
            box-shadow .18s ease;

          -webkit-tap-highlight-color: transparent;
        }

        .launch-btn:hover,
        .launch-btn.active,
        .launch-btn:focus-visible {
          transform: translateY(-2px);

          box-shadow:
            0 0 45px
            rgba(0,217,255,.34);
        }

        .launch-btn:active {
          transform: scale(.985);
        }

        .launch-btn:focus-visible {
          outline:
            2px solid white;

          outline-offset: 3px;
        }

        .launch-glow {
          position: absolute;
          inset: 0;

          background:
            linear-gradient(
              110deg,
              transparent 20%,
              rgba(255,255,255,.25) 50%,
              transparent 80%
            );

          transform: translateX(-100%);

          transition: transform .6s ease;

          pointer-events: none;
        }

        .launch-btn:hover .launch-glow,
        .launch-btn.active .launch-glow {
          transform: translateX(100%);
        }

        .launch-content {
          position: relative;
          z-index: 2;

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 16px;
        }

        .launch-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;

          min-width: 0;
        }

        .launch-label {
          font-size:
            clamp(15px, 1.5vw, 21px);

          font-weight: 950;

          letter-spacing:
            clamp(.08em, .15vw, .18em);
        }

        .launch-hint {
          margin-top: 5px;

          font-size: 10px;

          letter-spacing: .15em;

          opacity: .78;
        }

        .launch-icon {
          flex-shrink: 0;

          font-size:
            clamp(26px, 2.4vw, 34px);

          font-weight: 300;
        }

        /* =====================================================
           TELEMETRY
        ===================================================== */

        .telemetry {
          min-width: 0;

          display: grid;

          grid-template-rows:
            1fr 1fr 1.25fr;

          gap: 14px;
        }

        .telemetry-card {
          padding:
            clamp(16px, 1.6vw, 22px);

          border-radius: 18px;
        }

        .card-title {
          margin-bottom: 12px;

          color: #91a7c5;

          font-size: 10px;
          font-weight: 750;

          letter-spacing: .15em;
        }

        .big-number {
          font-size:
            clamp(34px, 4vw, 52px);

          font-weight: 950;

          line-height: 1;
        }

        .big-number small {
          margin-left: 5px;

          color: #64748b;

          font-size: 13px;
          font-weight: 700;
        }

        .micro-bar {
          width: 100%;
          height: 5px;

          margin-top: 16px;

          overflow: hidden;

          border-radius: 999px;

          background:
            rgba(255,255,255,.07);
        }

        .micro-bar span {
          display: block;

          width: 82%;
          height: 100%;

          border-radius: inherit;

          background:
            linear-gradient(
              90deg,
              #00d9ff,
              #67e8f9
            );
        }

        .card-meta {
          margin-top: 9px;

          color: #60718b;

          font-size: 9px;
          letter-spacing: .12em;
        }

        .signal {
          display: flex;

          align-items: flex-end;

          gap: 6px;

          height: 38px;
        }

        .signal span {
          width: 7px;

          border-radius: 2px 2px 0 0;

          background:
            linear-gradient(
              to top,
              #0891b2,
              #67e8f9
            );

          box-shadow:
            0 0 8px
            rgba(0,217,255,.25);
        }

        .signal span:nth-child(1) {
          height: 25%;
        }

        .signal span:nth-child(2) {
          height: 50%;
        }

        .signal span:nth-child(3) {
          height: 75%;
        }

        .signal span:nth-child(4) {
          height: 100%;
        }

        .small-meta {
          margin-top: 10px;

          color: #7f93af;

          font-family: monospace;

          font-size: 9px;
        }

        .timeline {
          margin: 0;

          padding-left: 17px;

          color: #b8c4d6;

          font-size: 11px;

          line-height: 1.9;
        }

        .timeline .current {
          color: #67e8f9;

          font-weight: 700;
        }

        /* =====================================================
           COMMAND STRIP
        ===================================================== */

        .command-strip {
          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 12px;
        }

        .command-module {
          min-width: 0;

          padding: 12px 14px;

          border:
            1px solid
            rgba(255,255,255,.07);

          border-radius: 13px;

          background:
            rgba(255,255,255,.035);
        }

        .command-module span {
          display: block;

          margin-bottom: 5px;

          color: #71819a;

          font-size: 9px;
          font-weight: 700;

          letter-spacing: .12em;
        }

        .command-module strong {
          display: block;

          color: #dbeafe;

          font-family: monospace;

          font-size: 12px;

          white-space: nowrap;
        }

        /* =====================================================
           LARGE DESKTOP
        ===================================================== */

        @media (min-width: 1400px) {

          .shell {
            gap: 22px;
          }

          .hero-panel {
            min-height: 600px;
          }

        }

        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 1050px) {

          .shell {
            width: min(
              100%,
              calc(100% - 24px)
            );

            padding-top: 18px;
            padding-bottom: 18px;
          }

          .layout {
            grid-template-columns:
              minmax(0, 1.35fr)
              minmax(220px, .75fr);

            gap: 14px;
          }

          .hero-panel {
            min-height: 500px;

            padding: 30px;
          }

          .title {
            font-size:
              clamp(
                48px,
                7.5vw,
                78px
              );
          }

          .intro {
            font-size: 13px;
          }

          .readiness-card {
            padding: 11px;
          }

          .value {
            font-size: 10px;
          }

        }

        /* =====================================================
           TABLET PORTRAIT / SMALL LAPTOP
        ===================================================== */

        @media (max-width: 820px) {

          .shell {
            justify-content: flex-start;

            padding-top:
              max(14px, env(safe-area-inset-top));
          }

          .layout {
            grid-template-columns: 1fr;
          }

          .hero-panel {
            min-height: auto;

            padding: 28px;
          }

          .telemetry {
            grid-template-columns:
              repeat(3, minmax(0, 1fr));

            grid-template-rows: auto;

            gap: 10px;
          }

          .telemetry-card {
            min-height: 125px;
          }

          .protocol-card {
            display: block;
          }

          .timeline {
            font-size: 10px;
          }

        }

        /* =====================================================
           PHONE
        ===================================================== */

        @media (max-width: 600px) {

          .launcher {
            overflow-y: auto;
          }

          .shell {
            width: 100%;

            min-height: 100svh;

            padding:
              max(12px, env(safe-area-inset-top))
              max(12px, env(safe-area-inset-right))
              max(14px, env(safe-area-inset-bottom))
              max(12px, env(safe-area-inset-left));

            gap: 10px;

            justify-content: flex-start;
          }

          /* HEADER */

          .top-bar {
            grid-template-columns:
              auto
              minmax(0, 1fr)
              auto;

            gap: 5px;
          }

          .status-chip {
            min-height: 32px;

            padding:
              6px 8px;

            font-size: 8px;

            letter-spacing: .06em;
          }

          .user-chip {
            max-width: none;
          }

          /* HERO */

          .hero-panel {
            padding:
              22px 17px;

            border-radius: 18px;
          }

          .corner {
            width: 17px;
            height: 17px;
          }

          .classification {
            margin-bottom: 11px;

            font-size: 8px;

            letter-spacing: .08em;
          }

          .title {
            font-size:
              clamp(
                50px,
                16vw,
                76px
              );

            line-height: .82;
          }

          .subtitle {
            margin-top: 11px;

            font-size: 8px;

            letter-spacing: .09em;

            white-space: normal;

            line-height: 1.4;
          }

          .intro {
            display: block;

            margin:
              16px 0;

            font-size: 12px;

            line-height: 1.55;
          }

          /* READINESS */

          .readiness-grid {
            grid-template-columns:
              repeat(3, minmax(0, 1fr));

            gap: 6px;

            margin-bottom: 12px;
          }

          .readiness-card {
            padding:
              10px 8px;

            border-radius: 10px;
          }

          .label {
            font-size: 8px;

            letter-spacing: .06em;
          }

          .value {
            font-size: 9px;

            gap: 4px;
          }

          .value i {
            width: 5px;
            height: 5px;
          }

          /* BUTTON */

          .launch-btn {
            min-height: 64px;

            padding:
              10px 14px;

            border-radius: 13px;
          }

          .launch-label {
            font-size: 14px;
          }

          .launch-hint {
            font-size: 8px;
          }

          .launch-icon {
            font-size: 25px;
          }

          /* TELEMETRY */

          .telemetry {
            display: grid;

            grid-template-columns:
              repeat(3, minmax(0, 1fr));

            gap: 6px;
          }

          .telemetry-card {
            min-height: 105px;

            padding: 11px;

            border-radius: 12px;
          }

          .card-title {
            margin-bottom: 9px;

            font-size: 7px;

            letter-spacing: .09em;
          }

          .big-number {
            font-size: 27px;
          }

          .big-number small {
            font-size: 9px;
          }

          .micro-bar {
            height: 3px;

            margin-top: 9px;
          }

          .card-meta {
            margin-top: 6px;

            font-size: 6px;
          }

          .signal {
            height: 28px;

            gap: 4px;
          }

          .signal span {
            width: 5px;
          }

          .small-meta {
            font-size: 7px;

            white-space: nowrap;
          }

          .timeline {
            padding-left: 12px;

            font-size: 8px;

            line-height: 1.55;
          }

          /* COMMANDS */

          .command-strip {
            grid-template-columns:
              repeat(3, minmax(0, 1fr));

            gap: 6px;
          }

          .command-module {
            padding:
              9px 7px;

            border-radius: 9px;

            text-align: center;
          }

          .command-module span {
            margin-bottom: 3px;

            font-size: 7px;
          }

          .command-module strong {
            font-size: 8px;

            white-space: normal;

            line-height: 1.3;
          }

        }

        /* =====================================================
           SMALL PHONE
        ===================================================== */

        @media (max-width: 390px) {

          .shell {
            padding-left: 9px;
            padding-right: 9px;
          }

          .top-bar {
            gap: 4px;
          }

          .status-chip {
            min-height: 29px;

            padding:
              5px 6px;

            font-size: 7px;
          }

          .hero-panel {
            padding:
              18px 13px;
          }

          .classification {
            font-size: 7px;
          }

          .title {
            font-size:
              clamp(
                43px,
                15vw,
                62px
              );
          }

          .subtitle {
            font-size: 7px;
          }

          .intro {
            font-size: 11px;

            margin:
              13px 0;
          }

          .readiness-card {
            padding:
              8px 6px;
          }

          .label {
            font-size: 7px;
          }

          .value {
            font-size: 8px;
          }

          .launch-btn {
            min-height: 60px;
          }

          .launch-label {
            font-size: 13px;
          }

          .launch-hint {
            font-size: 7px;
          }

          .telemetry-card {
            min-height: 95px;

            padding: 9px;
          }

          .big-number {
            font-size: 24px;
          }

          .timeline {
            font-size: 7px;
          }

          .command-module {
            padding: 8px 5px;
          }

          .command-module span {
            font-size: 6px;
          }

          .command-module strong {
            font-size: 7px;
          }

        }

        /* =====================================================
           VERY SMALL PHONE
        ===================================================== */

        @media (max-width: 340px) {

          .hero-panel {
            padding:
              16px 11px;
          }

          .title {
            font-size: 40px;
          }

          .intro {
            font-size: 10px;
          }

          .readiness-grid {
            grid-template-columns: 1fr;

            gap: 5px;
          }

          .readiness-card {
            display: flex;

            align-items: center;

            justify-content: space-between;

            padding: 7px 9px;
          }

          .label {
            margin-bottom: 0;
          }

          .telemetry {
            grid-template-columns:
              1fr 1fr;
          }

          .protocol-card {
            grid-column: 1 / -1;
          }

          .command-strip {
            grid-template-columns: 1fr;

            gap: 5px;
          }

          .command-module {
            display: flex;

            justify-content: space-between;

            align-items: center;

            text-align: left;
          }

          .command-module span {
            margin: 0;
          }

        }

        /* =====================================================
           LANDSCAPE PHONES
        ===================================================== */

        @media (
          max-height: 600px
        ) and (
          orientation: landscape
        ) {

          .shell {
            min-height: auto;

            padding-top: 8px;
            padding-bottom: 8px;

            gap: 7px;
          }

          .top-bar {
            margin: 0;
          }

          .status-chip {
            min-height: 27px;

            padding:
              4px 7px;

            font-size: 7px;
          }

          .layout {
            grid-template-columns:
              minmax(0, 1.5fr)
              minmax(190px, .7fr);

            gap: 8px;
          }

          .hero-panel {
            padding:
              17px 18px;

            min-height: auto;
          }

          .classification {
            margin-bottom: 6px;

            font-size: 7px;
          }

          .title {
            font-size:
              clamp(
                34px,
                11vh,
                54px
              );
          }

          .subtitle {
            margin-top: 6px;

            font-size: 7px;
          }

          .intro {
            margin:
              8px 0;

            font-size: 9px;

            line-height: 1.35;
          }

          .readiness-grid {
            margin-bottom: 7px;

            gap: 5px;
          }

          .readiness-card {
            padding: 6px;
          }

          .label {
            font-size: 6px;
          }

          .value {
            font-size: 7px;
          }

          .launch-btn {
            min-height: 46px;

            padding: 7px 10px;
          }

          .launch-label {
            font-size: 10px;
          }

          .launch-hint {
            font-size: 6px;
          }

          .launch-icon {
            font-size: 18px;
          }

          .telemetry {
            gap: 6px;
          }

          .telemetry-card {
            min-height: 0;

            padding: 8px;
          }

          .card-title {
            margin-bottom: 5px;

            font-size: 6px;
          }

          .big-number {
            font-size: 22px;
          }

          .signal {
            height: 22px;
          }

          .small-meta {
            font-size: 6px;
          }

          .timeline {
            font-size: 7px;

            line-height: 1.45;
          }

          .command-strip {
            gap: 5px;
          }

          .command-module {
            padding:
              6px 8px;
          }

          .command-module span {
            font-size: 6px;
          }

          .command-module strong {
            font-size: 7px;
          }

        }

        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {

          .launch-btn {
            transition: none;
          }

          .launch-glow {
            display: none;
          }

        }

      `}</style>
    </div>
  );
}
