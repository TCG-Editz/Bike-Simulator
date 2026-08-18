import React, { useState, useEffect } from 'react';

export default function HUDOverlay({ speed, distance, time }) {
  const [currentUser, setCurrentUser] = useState('GUEST_USER');

  const velocityNormalizedRatio = Math.min(speed / 185, 1);

  // Helper to format time into MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins
      .toString()
      .padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('neon_rider_user');

    if (storedUser) {
      setCurrentUser(storedUser);
    }
  }, []);

  const exitFullscreenMode = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  return (
    <div className="hud-container">

      {/* =========================================
          TOP HUD
      ========================================== */}

      <header className="hud-header">

        {/* TRANSMISSION / USER */}
        <div className="transmission-badge">

          <div className="pulse-dot-container">
            <span className="dot-ping"></span>
            <span className="dot-core"></span>
          </div>

          <div className="text-left">
            <div className="link-status">
              TRANSMISSION LINK: ONLINE
            </div>

            <div className="buffer-logs">
              OPERATOR: {currentUser}
            </div>
          </div>

        </div>


        {/* =====================================
            PERFORMANCE GAUGES
        ====================================== */}

        <div className="performance-blocks">

          {/* TIMER */}
          <div className="velocity-gauge time-gauge">
            <div className="gauge-label">
              ELAPSED TIME
            </div>

            <div className="gauge-value">
              {formatTime(time)}
            </div>
          </div>


          {/* DISTANCE */}
          <div className="velocity-gauge distance-gauge">
            <div className="gauge-label">
              TOTAL DISTANCE
            </div>

            <div className="gauge-value">
              {Math.round(distance).toLocaleString()}

              <span className="unit-label">
                M
              </span>
            </div>
          </div>


          {/* VELOCITY */}
          <div className="velocity-gauge velocity-gauge-main">

            <div className="gauge-label">
              VELOCITY TRACE
            </div>

            <div className="gauge-value">
              {Math.round(speed)}

              <span className="unit-label">
                KM/H
              </span>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${velocityNormalizedRatio * 100}%`
                }}
              />
            </div>

          </div>

        </div>
      </header>


      {/* =========================================
          BOTTOM HUD
      ========================================== */}

      <footer className="hud-footer">

        {/* EXIT FULLSCREEN */}

        <button
          onClick={exitFullscreenMode}
          className="exit-btn"
        >
          ⛶ EXIT FULLSCREEN
        </button>


        {/* DESKTOP MANEUVERER */}

        <div className="maneuverer">

          <div className="controls-tip">

            MANEUVER MATRIX:{' '}

            <span className="highlight-white">
              [W, A, S, D]
            </span>

            {' '}// TRIGGER OVERDRIVE:{' '}

            <span className="highlight-cyan">
              [SPACEBAR]
            </span>

          </div>

        </div>


        {/* REGION */}

        <div className="region-tag">
          GRID_REGION: {currentUser}
        </div>

      </footer>


      <style jsx>{`

        /* =========================================
           MAIN HUD
        ========================================== */

        .hud-container {
          position: absolute;
          inset: 0;

          width: 100%;
          height: 100%;

          z-index: 40;

          pointer-events: none;

          display: flex;
          flex-direction: column;
          justify-content: space-between;

          padding: 48px;

          box-sizing: border-box;

          font-family: monospace;

          user-select: none;
          -webkit-user-select: none;
        }


        /* =========================================
           HEADER
        ========================================== */

        .hud-header {
          width: 100%;

          display: flex;

          justify-content: space-between;

          align-items: flex-start;

          gap: 20px;
        }


        /* =========================================
           TRANSMISSION
        ========================================== */

        .transmission-badge {
          background: rgba(2, 4, 9, 0.8);

          border: 1px solid rgba(30, 41, 59, 0.8);

          padding: 12px 20px;

          border-radius: 12px;

          display: flex;

          align-items: center;

          gap: 16px;

          backdrop-filter: blur(6px);

          flex-shrink: 0;
        }


        .pulse-dot-container {
          position: relative;

          display: flex;

          width: 12px;
          height: 12px;
        }


        .dot-ping {
          position: absolute;

          width: 100%;
          height: 100%;

          border-radius: 50%;

          background: #22d3ee;

          opacity: 0.75;

          animation:
            pingPulse 1.2s
            cubic-bezier(0, 0, 0.2, 1)
            infinite;
        }


        .dot-core {
          border-radius: 50%;

          width: 12px;
          height: 12px;

          background: #06b6d4;
        }


        .link-status {
          font-weight: 900;

          font-size: 11px;

          letter-spacing: 0.2em;

          color: #22d3ee;

          white-space: nowrap;
        }


        .buffer-logs {
          font-size: 9px;

          color: #475569;

          letter-spacing: 0.05em;

          margin-top: 2px;
        }


        /* =========================================
           PERFORMANCE BLOCKS
        ========================================== */

        .performance-blocks {
          display: flex;

          gap: 16px;

          flex-shrink: 1;

          min-width: 0;
        }


        .velocity-gauge {
          background: rgba(2, 4, 9, 0.9);

          border: 1px solid rgba(30, 41, 59, 0.8);

          padding: 16px;

          border-radius: 16px;

          backdrop-filter: blur(6px);

          text-align: right;

          min-width: 140px;
        }


        .gauge-label {
          font-size: 10px;

          color: #475569;

          font-weight: bold;

          letter-spacing: 0.15em;

          margin-bottom: 4px;

          white-space: nowrap;
        }


        .gauge-value {
          font-size: 30px;

          font-weight: 900;

          color: #ffffff;

          letter-spacing: -0.02em;

          white-space: nowrap;
        }


        .unit-label {
          font-size: 12px;

          color: #94a3b8;

          margin-left: 4px;
        }


        /* =========================================
           VELOCITY BAR
        ========================================== */

        .progress-track {
          width: 100%;

          height: 6px;

          background: #0f172a;

          border-radius: 9999px;

          margin-top: 10px;

          overflow: hidden;

          border: 1px solid #1e293b;
        }


        .progress-fill {
          height: 100%;

          background:
            linear-gradient(
              90deg,
              #06b6d4,
              #3b82f6
            );

          transition: width 75ms linear;
        }


        /* =========================================
           FOOTER
        ========================================== */

        .hud-footer {
          width: 100%;

          display: flex;

          justify-content: space-between;

          align-items: flex-end;

          gap: 15px;
        }


        /* =========================================
           EXIT BUTTON
        ========================================== */

        .exit-btn {
          pointer-events: auto;

          background: rgba(2, 4, 9, 0.9);

          border: 1px solid rgba(30, 41, 59, 0.8);

          padding: 10px 16px;

          border-radius: 12px;

          font-size: 10px;

          color: #f43f5e;

          cursor: pointer;

          white-space: nowrap;

          transition:
            background 0.15s ease,
            box-shadow 0.15s ease;
        }


        .exit-btn:hover {
          background: rgba(244, 63, 94, 0.12);

          box-shadow:
            0 0 12px rgba(244, 63, 94, 0.25);
        }


        /* =========================================
           MANEUVERER
        ========================================== */

        .maneuverer {
          display: flex;

          justify-content: center;

          align-items: center;

          flex: 1;
        }


        .controls-tip {
          background: rgba(2, 4, 9, 0.9);

          border: 1px solid rgba(30, 41, 59, 0.8);

          padding: 12px 24px;

          border-radius: 9999px;

          font-size: 10px;

          color: #94a3b8;

          white-space: nowrap;
        }


        .highlight-white {
          color: #ffffff;

          font-weight: bold;
        }


        .highlight-cyan {
          color: #22d3ee;

          font-weight: bold;
        }


        /* =========================================
           REGION
        ========================================== */

        .region-tag {
          background: rgba(2, 4, 9, 0.75);

          border: 1px solid #0f172a;

          padding: 8px 16px;

          border-radius: 8px;

          font-size: 9px;

          color: #475569;

          white-space: nowrap;
        }


        /* =========================================
           TABLET
        ========================================== */

        @media (max-width: 1100px) {

          .hud-container {
            padding: 30px;
          }

          .performance-blocks {
            gap: 8px;
          }

          .velocity-gauge {
            min-width: 105px;

            padding: 12px;
          }

          .gauge-value {
            font-size: 23px;
          }

          .transmission-badge {
            padding: 10px 14px;

            gap: 10px;
          }

          .controls-tip {
            font-size: 9px;

            padding: 10px 16px;
          }
        }


        /* =========================================
           MOBILE PORTRAIT
        ========================================== */

        @media (max-width: 768px) {

          .hud-container {
            padding: 10px;

            height: 100%;

            justify-content: flex-start;
          }


          /* TOP ROW */

          .hud-header {
            display: flex;

            flex-direction: column;

            width: 100%;

            gap: 7px;
          }


          /* TRANSMISSION BECOMES COMPACT */

          .transmission-badge {
            width: fit-content;

            padding: 6px 9px;

            border-radius: 7px;

            gap: 7px;

            opacity: 0.9;
          }


          .pulse-dot-container {
            width: 7px;
            height: 7px;
          }


          .dot-core {
            width: 7px;
            height: 7px;
          }


          .link-status {
            font-size: 7px;

            letter-spacing: 0.12em;
          }


          .buffer-logs {
            font-size: 6px;

            margin-top: 1px;
          }


          /* PERFORMANCE */

          .performance-blocks {
            width: 100%;

            display: grid;

            grid-template-columns:
              repeat(3, 1fr);

            gap: 5px;
          }


          .velocity-gauge {
            min-width: 0;

            width: 100%;

            padding: 6px 4px;

            border-radius: 7px;

            box-sizing: border-box;

            text-align: center;
          }


          .gauge-label {
            font-size: 6px;

            letter-spacing: 0.06em;

            margin-bottom: 3px;

            overflow: hidden;

            text-overflow: ellipsis;
          }


          .gauge-value {
            font-size: 16px;

            letter-spacing: 0;
          }


          .unit-label {
            font-size: 7px;

            margin-left: 2px;
          }


          /* VELOCITY BAR */

          .progress-track {
            height: 3px;

            margin-top: 5px;
          }


          /* =====================================
             MOBILE FOOTER
          ====================================== */

          .hud-footer {
            position: absolute;

            left: 10px;
            right: 10px;

            bottom: 112px;

            width: auto;

            display: flex;

            align-items: center;

            justify-content: space-between;

            gap: 8px;
          }


          /*
           * IMPORTANT:
           *
           * Mobile uses:
           * LEFT / ACCEL / RIGHT
           *
           * Therefore desktop maneuver instructions
           * disappear.
           */

          .maneuverer {
            display: none !important;
          }


          .exit-btn {
            font-size: 8px;

            padding: 7px 9px;

            border-radius: 7px;
          }


          .region-tag {
            font-size: 7px;

            padding: 6px 8px;

            border-radius: 6px;

            max-width: 45vw;

            overflow: hidden;

            text-overflow: ellipsis;
          }
        }


        /* =========================================
           SMALL PHONES
        ========================================== */

        @media (max-width: 380px) {

          .hud-container {
            padding: 7px;
          }


          .performance-blocks {
            gap: 3px;
          }


          .velocity-gauge {
            padding: 5px 2px;
          }


          .gauge-label {
            font-size: 5px;
          }


          .gauge-value {
            font-size: 14px;
          }


          .unit-label {
            display: none;
          }


          .hud-footer {
            left: 7px;
            right: 7px;

            bottom: 96px;
          }


          .exit-btn {
            font-size: 7px;

            padding: 6px 7px;
          }


          .region-tag {
            font-size: 6px;

            padding: 5px 6px;
          }
        }


        /* =========================================
           MOBILE LANDSCAPE
        ========================================== */

        @media (max-width: 900px)
          and (max-height: 500px)
          and (orientation: landscape) {

          .hud-container {
            padding: 6px 10px;
          }


          .hud-header {
            flex-direction: row;

            align-items: flex-start;

            gap: 8px;
          }


          .transmission-badge {
            padding: 5px 8px;
          }


          .link-status {
            font-size: 6px;
          }


          .buffer-logs {
            font-size: 5px;
          }


          .performance-blocks {
            width: auto;

            display: flex;

            gap: 4px;
          }


          .velocity-gauge {
            min-width: 70px;

            padding: 4px 6px;

            border-radius: 6px;
          }


          .gauge-label {
            font-size: 5px;
          }


          .gauge-value {
            font-size: 13px;
          }


          .unit-label {
            display: none;
          }


          .progress-track {
            height: 2px;

            margin-top: 3px;
          }


          /*
           * Mobile controls are at the bottom,
           * so leave room for them.
           */

          .hud-footer {
            position: absolute;

            left: 10px;
            right: 10px;

            bottom: 76px;

            width: auto;
          }


          .maneuverer {
            display: none !important;
          }


          .exit-btn {
            font-size: 7px;

            padding: 5px 8px;
          }


          .region-tag {
            font-size: 6px;

            padding: 5px 7px;
          }
        }


        /* =========================================
           VERY SHORT DEVICES
        ========================================== */

        @media (max-height: 400px) {

          .hud-container {
            padding-top: 4px;
          }


          .transmission-badge {
            padding: 4px 7px;
          }


          .performance-blocks {
            gap: 3px;
          }


          .velocity-gauge {
            padding: 3px 5px;
          }


          .hud-footer {
            bottom: 68px;
          }
        }


        /* =========================================
           ANIMATION
        ========================================== */

        @keyframes pingPulse {

          75%,
          100% {
            transform: scale(2.5);

            opacity: 0;
          }

        }

      `}</style>
    </div>
  );
}
