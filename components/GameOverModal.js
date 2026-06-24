import React, { useState, useEffect } from 'react';

// Added 'time' to props
export default function GameOverModal({ distance, highScore, time, onRestartGame, onExitToHome, audioEngine }) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentUser, setCurrentUser] = useState('GUEST_USER');

  // Helper to format time into MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('neon_rider_user');
    if (savedUser) setCurrentUser(savedUser);
  }, []);

  const handleRestartTrigger = () => {
    if (audioEngine?.playClick) audioEngine.playClick();
    onRestartGame();
  };

  return (
    <div className="modal-overlay">
      <div className="terminal-card">
        <div className="laser-line"></div>
        <div className="system-tag">CRITICAL SYSTEM FAILURE {currentUser}</div>

        <div className="header-group">
          <h1 className="glitch-title">GAME OVER</h1>
          <div className="subtitle">LINK TERMINATED</div>
        </div>

        <p className="status-text">
          Mainframe connection for <span style={{ color: '#22d3ee' }}>{currentUser}</span> dropped. 
          Crash impact coordinates recorded.
        </p>

        <div className="telemetry-box">
          <div className="telemetry-header">
            <span>DIAGNOSTIC TELEMETRY</span>
            <span className="pulse-dot">● OFFLINE</span>
          </div>
          
          {/* RUN TIME METRIC - NEW */}
          <div className="metric-row">
            <span className="metric-label">RUN DURATION</span>
            <span className="metric-value current-run">
              {formatTime(time)}
            </span>
          </div>

          <div className="metric-row">
            <span className="metric-label">FINAL DISTANCE</span>
            <span className="metric-value current-run">
              {Math.round(distance).toLocaleString()} <span className="unit">m</span>
            </span>
          </div>

          <div className="metric-row" style={{ marginTop: '8px' }}>
            <span className="metric-label">ALL-TIME HIGH</span>
            <span className="metric-value high-record">
              🏆 {Math.round(highScore).toLocaleString()} <span className="unit">m</span>
            </span>
          </div>
        </div>

        <button 
          onClick={handleRestartTrigger}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`action-btn ${isHovered ? 'btn-hover' : ''}`}
        >
          RE-INITIALIZE LINK 🔄
        </button>

        <button onClick={onExitToHome} className="exit-btn">
          EXIT TO MAINFRAME ⏼
        </button>

        <div className="footnote">SECURE PORT 8080 | OPERATOR: {currentUser}</div>
      </div>

      <style jsx>{`
        /* Styles remain identical as per your provided file */
        .pulse-dot { color: #ef4444; font-size: 8px; }
        .modal-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; background: rgba(2, 4, 9, 0.8); backdrop-filter: blur(4px); padding: 0 24px; font-family: monospace; color: #ffffff; }
        .terminal-card { background: rgba(2, 4, 9, 0.9); border: 1px solid rgba(239, 68, 68, 0.3); padding: 40px; border-radius: 16px; max-width: 400px; width: 100%; text-align: center; box-shadow: 0 0 50px rgba(239, 68, 68, 0.15); position: relative; }
        .laser-line { position: absolute; top: 0; left: 48px; right: 48px; height: 2px; background: linear-gradient(90deg, transparent, #ef4444, transparent); }
        .system-tag { position: absolute; top: -11px; left: 50%; transform: translateX(-50%); padding: 2px 12px; background: #090d16; border: 1px solid rgba(239, 68, 68, 0.3); font-size: 9px; color: #f87171; letter-spacing: 0.2em; font-weight: bold; border-radius: 6px; }
        .glitch-title { font-size: 42px; font-weight: 900; margin: 0; background: linear-gradient(90deg, #ef4444, #f97316, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .subtitle { font-size: 10px; color: #f87171; font-weight: bold; letter-spacing: 0.4em; margin-top: 4px; }
        .status-text { font-size: 12px; color: #94a3b8; line-height: 1.6; background: rgba(15, 23, 42, 0.4); border: 1px solid #1e293b; padding: 12px; border-radius: 8px; margin: 24px 0; }
        .telemetry-box { background: rgba(2, 4, 9, 0.6); border: 1px solid #1e293b; border-radius: 12px; padding: 16px; text-align: left; margin-bottom: 24px; }
        .telemetry-header { font-size: 9px; color: #576375; font-weight: bold; border-bottom: 1px solid rgba(30, 41, 59, 0.8); padding-bottom: 8px; margin-bottom: 12px; display: flex; justify-content: space-between; }
        .metric-row { display: flex; justify-content: space-between; align-items: center; margin: 6px 0; }
        .metric-label { color: #64748b; font-size: 11px; font-weight: bold; }
        .metric-value { font-size: 18px; font-weight: 900; }
        .current-run { color: #ffffff; }
        .high-record { color: #ec4899; }
        .unit { font-size: 11px; color: #475569; }
        .action-btn { width: 100%; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 12px; padding: 16px; font-size: 12px; font-weight: 900; letter-spacing: 0.25em; color: #ef4444; cursor: pointer; transition: all 0.3s ease; }
        .btn-hover { background: #ef4444; color: #020409; }
        .exit-btn { width: 100%; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(71, 85, 105, 0.4); border-radius: 12px; padding: 14px; margin-top: 12px; font-size: 10px; color: #94a3b8; cursor: pointer; }
        .footnote { font-size: 8px; color: #475569; margin-top: 24px; }
      `}</style>
    </div>
  );
}