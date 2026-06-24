import React, { useState, useEffect, useCallback } from 'react';

export default function MainMenu({ onStartGame, audioEngine }) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [currentUser, setCurrentUser] = useState('GUEST_USER');

  useEffect(() => {
    const savedUser = localStorage.getItem('neon_rider_user');
    if (savedUser) setCurrentUser(savedUser);
  }, []);

  const triggerMenuActivation = useCallback(() => {
    if (audioEngine) {
      if (typeof audioEngine.initAudio === 'function') {
        audioEngine.initAudio();
      }

      if (typeof audioEngine.playClick === 'function') {
        audioEngine.playClick();
      }
    }

    onStartGame();
  }, [audioEngine, onStartGame]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) return;

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerMenuActivation();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerMenuActivation]);

  return (
    <div className="launcher">
      {/* ENVIRONMENT */}
      <div className="starfield" />
      <div className="radar-sweep" />
      <div className="vector-grid" />
      <div className="speed-lines" />
      <div className="city-silhouette" />
      <div className="scanlines" />
      <div className="vignette" />

      <div className="orb cyan" />
      <div className="orb magenta" />

      <div className="shell">

        {/* TOP STATUS */}
        <div className="top-bar">
          <div className="status-chip online">
            ● NETWORK SYNC
          </div>

          <div className="status-chip">
            PILOT: {currentUser}
          </div>

          <div className="status-chip warning">
            THREAT LVL 02
          </div>
        </div>

        <div className="layout">

          {/* MAIN HERO */}
          <section className="hero-panel">

            <div className="corner tl" />
            <div className="corner tr" />
            <div className="corner bl" />
            <div className="corner br" />

            <div className="panel-sweep" />

            <div className="classification">
              NR-77 NEURAL STREET RACING SYSTEM
            </div>

            <div className="title-zone">

              <h1 className="title">
                <span className="glitch-layer">NEON RIDER</span>
                <span className="glitch-shadow">NEON RIDER</span>
              </h1>

              <div className="subtitle">
                HIGH-SPEED COMBAT ARCADE RACER
              </div>
            </div>

            <p className="intro">
              Welcome back, <strong>{currentUser}</strong>.
              Vehicle synchronization complete.
              Neon corridor traffic is active.
              Launch authorization granted.
            </p>

            <div className="readiness-grid">

              <div className="readiness-card">
                <span className="label">VEHICLE LINK</span>
                <span className="value success">
                  ● CONNECTED
                </span>
              </div>

              <div className="readiness-card">
                <span className="label">HAZARD MAP</span>
                <span className="value cyan">
                  SCANNING
                </span>
              </div>

              <div className="readiness-card">
                <span className="label">FRAME SYNC</span>
                <span className="value pink">
                  60 FPS LOCK
                </span>
              </div>

            </div>

            <button
              className={`launch-btn ${
                hovered || focused ? 'active' : ''
              }`}
              onClick={triggerMenuActivation}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              aria-label="Start Game"
            >
              <div className="energy-sweep" />

              <div className="launch-content">
                <span className="launch-label">
                  IGNITE ENGINE
                </span>

                <span className="launch-icon">
                  →
                </span>
              </div>

              <div className="launch-hint">
                ENTER / SPACE
              </div>
            </button>
          </section>

          {/* TELEMETRY RAIL */}
          <aside className="telemetry">

            <div className="telemetry-card">
              <div className="card-title">
                DAILY HIGH SCORE
              </div>

              <div className="big-number">
                342
              </div>

              <div className="micro-bar">
                <span />
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

            <div className="telemetry-card">
              <div className="card-title">
                LAUNCH PROTOCOL
              </div>

              <ul className="timeline">
                <li>Driver verified</li>
                <li>Systems armed</li>
                <li>Track streaming</li>
                <li>Awaiting ignition</li>
              </ul>
            </div>

          </aside>

        </div>

        {/* COMMAND STRIP */}

        <div className="command-strip">

          <div className="command-module">
            <span>THROTTLE</span>
            <strong>[W] [▲] [SPACE]</strong>
          </div>

          <div className="command-module">
            <span>STEER</span>
            <strong>[A] [D] [◀ ▶]</strong>
          </div>

          <div className="command-module">
            <span>BRAKE</span>
            <strong>[S] [SHIFT]</strong>
          </div>

        </div>

      </div>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        .launcher {
          position: absolute;
          inset: 0;
          overflow: hidden;
          color: white;
          background:
            radial-gradient(circle at top, #0d1630 0%, #05070d 55%);
          font-family:
            Inter,
            system-ui,
            sans-serif;
        }

        .shell {
          position: relative;
          z-index: 5;
          max-width: 1400px;
          margin: 0 auto;
          height: 100%;
          padding: 32px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        /* BACKGROUND */

        .starfield,
        .vector-grid,
        .speed-lines,
        .radar-sweep,
        .scanlines,
        .vignette,
        .city-silhouette {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .vector-grid {
          opacity: .12;
          transform: perspective(900px)
            rotateX(72deg);
          transform-origin: bottom;
          background-image:
            linear-gradient(#00d9ff22 1px, transparent 1px),
            linear-gradient(90deg,#00d9ff22 1px, transparent 1px);
          background-size: 80px 80px;
          animation: drift 20s linear infinite;
        }

        .speed-lines {
          opacity: .06;
          background:
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 80px,
              rgba(255,255,255,.3) 81px
            );
        }

        .city-silhouette {
          bottom: 0;
          top: auto;
          height: 220px;
          background:
            linear-gradient(
              transparent,
              rgba(0,0,0,.7)
            );
        }

        .radar-sweep {
          background:
            conic-gradient(
              from 0deg,
              transparent,
              rgba(0,255,255,.08),
              transparent
            );
          animation: radar 10s linear infinite;
          opacity: .5;
        }

        .scanlines {
          opacity: .04;
          background-size: 100% 3px;
          background-image:
            linear-gradient(
              transparent 50%,
              rgba(255,255,255,.15) 50%
            );
        }

        .vignette {
          background:
            radial-gradient(
              ellipse at center,
              transparent 45%,
              rgba(0,0,0,.65)
            );
        }

        .orb {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          filter: blur(150px);
        }

        .cyan {
          left: -150px;
          top: -120px;
          background: rgba(0,255,255,.12);
        }

        .magenta {
          right: -150px;
          bottom: -120px;
          background: rgba(255,0,170,.10);
        }

        .top-bar {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }

        .status-chip {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .12em;
          padding: 10px 14px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,.12);
          background: rgba(255,255,255,.05);
          backdrop-filter: blur(16px);
        }

        .online {
          color: #53ffb2;
        }

        .warning {
          color: #ff5fa7;
        }

        .layout {
          display: grid;
          grid-template-columns: 1.7fr 0.8fr;
          gap: 28px;
          align-items: stretch;
        }

        .hero-panel,
        .telemetry-card {
          position: relative;
          overflow: hidden;
          background:
            linear-gradient(
              180deg,
              rgba(255,255,255,.07),
              rgba(255,255,255,.03)
            );
          backdrop-filter: blur(22px);
          border: 1px solid rgba(255,255,255,.10);
        }

        .hero-panel {
          padding: 48px;
          border-radius: 28px;
          min-height: 620px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .panel-sweep {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              110deg,
              transparent,
              rgba(255,255,255,.05),
              transparent
            );
          animation: sweep 8s linear infinite;
        }

        .classification {
          color: #7ccfff;
          letter-spacing: .25em;
          font-size: 12px;
          margin-bottom: 22px;
        }

        .title {
          position: relative;
          font-size: clamp(64px, 10vw, 120px);
          line-height: .9;
          margin: 0;
          font-weight: 900;
          letter-spacing: -.06em;
        }

        .glitch-layer {
          position: relative;
          z-index: 2;
        }

        .glitch-shadow {
          position: absolute;
          left: 2px;
          top: 0;
          opacity: .18;
          color: #00eaff;
          animation: glitch 7s infinite;
        }

        .subtitle {
          margin-top: 14px;
          font-size: 16px;
          letter-spacing: .35em;
          color: #9ec7ff;
        }

        .intro {
          max-width: 700px;
          margin: 34px 0;
          font-size: 18px;
          line-height: 1.7;
          color: #d0d8e7;
        }

        .readiness-grid {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 14px;
          margin-bottom: 40px;
        }

        .readiness-card,
        .telemetry-card {
          border-radius: 18px;
          padding: 18px;
        }

        .label {
          display: block;
          font-size: 12px;
          letter-spacing: .18em;
          color: #8ea3c2;
          margin-bottom: 10px;
        }

        .value {
          font-weight: 800;
          font-size: 16px;
        }

        .success { color:#53ffb2; }
        .cyan { color:#67e8f9; }
        .pink { color:#ff82c5; }

        .launch-btn {
          position: relative;
          overflow: hidden;
          border: none;
          cursor: pointer;
          border-radius: 20px;
          padding: 28px;
          background:
            linear-gradient(
              135deg,
              #00d9ff,
              #26b9ff,
              #6a7cff
            );
          color: white;
          transition: .25s ease;
        }

        .launch-btn:hover,
        .launch-btn.active,
        .launch-btn:focus-visible {
          transform: translateY(-2px);
          box-shadow:
            0 0 50px rgba(0,217,255,.35);
        }

        .launch-btn:focus-visible {
          outline: 3px solid white;
          outline-offset: 4px;
        }

        .launch-content {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .launch-label {
          font-size: 22px;
          font-weight: 900;
          letter-spacing: .18em;
        }

        .launch-icon {
          font-size: 30px;
        }

        .launch-hint {
          margin-top: 10px;
          font-size: 12px;
          opacity: .8;
          letter-spacing: .2em;
        }

        .energy-sweep {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              110deg,
              transparent,
              rgba(255,255,255,.25),
              transparent
            );
          animation: sweep 2.5s linear infinite;
        }

        .telemetry {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .card-title {
          font-size: 12px;
          letter-spacing: .18em;
          color: #91a7c5;
          margin-bottom: 16px;
        }

        .big-number {
          font-size: 42px;
          font-weight: 900;
          font-variant-numeric: tabular-nums;
        }

        .micro-bar {
          margin-top: 18px;
          height: 6px;
          background: rgba(255,255,255,.08);
        }

        .micro-bar span {
          display:block;
          width:82%;
          height:100%;
          background:#00d9ff;
        }

        .signal {
          display:flex;
          align-items:flex-end;
          gap:6px;
          height:40px;
        }

        .signal span {
          width:8px;
          background:#00d9ff;
          animation:pulse 1.5s infinite;
        }

        .signal span:nth-child(1){height:25%}
        .signal span:nth-child(2){height:50%}
        .signal span:nth-child(3){height:75%}
        .signal span:nth-child(4){height:100%}

        .timeline {
          margin:0;
          padding-left:18px;
          line-height:2;
          color:#d4dceb;
        }

        .command-strip {
          margin-top: 24px;
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:16px;
        }

        .command-module {
          padding:18px;
          border-radius:16px;
          background:rgba(255,255,255,.04);
          border:1px solid rgba(255,255,255,.08);
        }

        .command-module span {
          display:block;
          color:#8ea3c2;
          margin-bottom:8px;
        }

        .command-module strong {
          font-size:15px;
        }

        .corner {
          position:absolute;
          width:26px;
          height:26px;
          border-color:#4fe5ff;
          opacity:.6;
        }

        .tl {top:12px;left:12px;border-top:2px solid;border-left:2px solid;}
        .tr {top:12px;right:12px;border-top:2px solid;border-right:2px solid;}
        .bl {bottom:12px;left:12px;border-bottom:2px solid;border-left:2px solid;}
        .br {bottom:12px;right:12px;border-bottom:2px solid;border-right:2px solid;}

        @keyframes sweep {
          from {transform:translateX(-100%);}
          to {transform:translateX(100%);}
        }

        @keyframes pulse {
          50% {opacity:.4;}
        }

        @keyframes drift {
          from {transform:perspective(900px) rotateX(72deg) translateY(0);}
          to {transform:perspective(900px) rotateX(72deg) translateY(80px);}
        }

        @keyframes radar {
          to {transform:rotate(360deg);}
        }

        @keyframes glitch {
          0%,95%,100% {transform:none;}
          96% {transform:translate(3px,0);}
          97% {transform:translate(-3px,0);}
          98% {transform:translate(2px,0);}
        }

        @media (max-width: 960px) {
          .layout {
            grid-template-columns: 1fr;
          }

          .readiness-grid {
            grid-template-columns: 1fr;
          }

          .command-strip {
            grid-template-columns: 1fr;
          }

          .hero-panel {
            padding: 32px;
            min-height: auto;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}