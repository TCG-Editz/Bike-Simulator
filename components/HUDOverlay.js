import React, { useState, useEffect } from 'react';

// Added 'time' to props
export default function HUDOverlay({ speed, distance, time }) { 
  const [currentUser, setCurrentUser] = useState('GUEST_USER');
  const velocityNormalizedRatio = Math.min(speed / 185, 1);

  // Helper to format time into MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('neon_rider_user');
    if (storedUser) setCurrentUser(storedUser);
  }, []);

  const exitFullscreenMode = () => {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
  };

  return (
    <div className="hud-container">
      <header className="hud-header">
        <div className="transmission-badge">
          <div className="pulse-dot-container">
            <span className="dot-ping"></span>
            <span className="dot-core"></span>
          </div>
          <div className="text-left">
            <div className="link-status">TRANSMISSION LINK: ONLINE</div>
            <div className="buffer-logs">OPERATOR: {currentUser}</div>
          </div>
        </div>

        <div className="performance-blocks">
          {/* TIMER GAUGE - NEW */}
          <div className="velocity-gauge">
            <div className="gauge-label">ELAPSED TIME</div>
            <div className="gauge-value">
              {formatTime(time)}
            </div>
          </div>

          {/* DISTANCE GAUGE */}
          <div className="velocity-gauge">
            <div className="gauge-label">TOTAL DISTANCE</div>
            <div className="gauge-value">
              {Math.round(distance).toLocaleString()}
              <span className="unit-label">M</span>
            </div>
          </div>

          {/* VELOCITY GAUGE */}
          <div className="velocity-gauge">
            <div className="gauge-label">VELOCITY TRACE</div>
            <div className="gauge-value">
              {Math.round(speed)}
              <span className="unit-label">KM/H</span>
            </div>
            <div className="progress-track">
              <div 
                className="progress-fill"
                style={{ width: `${velocityNormalizedRatio * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      <footer className="hud-footer">
        <button onClick={exitFullscreenMode} className="exit-btn">
          ⛶ EXIT FULLSCREEN
        </button>
        <div className="controls-tip">
          MANEUVER MATRIX: <span className="highlight-white">[W, A, S, D]</span> // TRIGGER OVERDRIVE: <span className="highlight-cyan">[SPACEBAR]</span>
        </div>
        <div className="region-tag">GRID_REGION: {currentUser}</div>
      </footer>

      <style jsx>{`
        .hud-container {
          position: absolute; inset: 0; width: 100%; height: 100%; z-index: 40;
          pointer-events: none; display: flex; flex-direction: column;
          justify-content: space-between; padding: 48px; box-sizing: border-box;
          font-family: monospace; user-select: none;
        }
        .hud-header { width: 100%; display: flex; justify-content: space-between; align-items: flex-start; }
        .transmission-badge {
          background: rgba(2, 4, 9, 0.8); border: 1px solid rgba(30, 41, 59, 0.8);
          padding: 12px 20px; border-radius: 12px; display: flex; align-items: center;
          gap: 16px; backdrop-filter: blur(6px);
        }
        .pulse-dot-container { position: relative; display: flex; width: 12px; height: 12px; }
        .dot-ping { position: absolute; width: 100%; height: 100%; border-radius: 50%; background: #22d3ee; opacity: 0.75; animation: pingPulse 1.2s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .dot-core { border-radius: 50%; width: 12px; height: 12px; background: #06b6d4; }
        .link-status { font-weight: 900; font-size: 11px; letter-spacing: 0.2em; color: #22d3ee; }
        .buffer-logs { font-size: 9px; color: #475569; letter-spacing: 0.05em; margin-top: 2px; }
        .performance-blocks { display: flex; gap: 16px; }
        .velocity-gauge { 
          background: rgba(2, 4, 9, 0.9); border: 1px solid rgba(30, 41, 59, 0.8); 
          padding: 16px; border-radius: 16px; backdrop-filter: blur(6px); 
          text-align: right; min-width: 140px; 
        }
        .gauge-label { font-size: 10px; color: #475569; font-weight: bold; letter-spacing: 0.15em; margin-bottom: 4px; }
        .gauge-value { font-size: 30px; font-weight: 900; color: #ffffff; letter-spacing: -0.02em; }
        .unit-label { font-size: 12px; color: #94a3b8; margin-left: 4px; }
        .progress-track { width: 100%; height: 6px; background: #0f172a; border-radius: 9999px; margin-top: 10px; overflow: hidden; border: 1px solid #1e293b; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #06b6d4, #3b82f6); transition: width 75ms linear; }
        .hud-footer { width: 100%; display: flex; justify-content: space-between; align-items: flex-end; }
        .exit-btn { pointer-events: auto; background: rgba(2, 4, 9, 0.9); border: 1px solid rgba(30, 41, 59, 0.8); padding: 10px 16px; border-radius: 12px; font-size: 10px; color: #f43f5e; cursor: pointer; }
        .controls-tip { background: rgba(2, 4, 9, 0.9); border: 1px solid rgba(30, 41, 59, 0.8); padding: 12px 24px; border-radius: 9999px; font-size: 10px; color: #94a3b8; }
        .highlight-white { color: #ffffff; font-weight: bold; }
        .highlight-cyan { color: #22d3ee; font-weight: bold; }
        .region-tag { background: rgba(2, 4, 9, 0.75); border: 1px solid #0f172a; padding: 8px 16px; border-radius: 8px; font-size: 9px; color: #475569; }
        @keyframes pingPulse { 75%, 100% { transform: scale(2.5); opacity: 0; } }
      `}</style>
    </div>
  );
}