import React, { useState, useEffect } from 'react';

export default function GameStartModal({ onConfirmStart, audioEngine }) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentUser, setCurrentUser] = useState('GUEST_USER');

  useEffect(() => {
    const savedUser = localStorage.getItem('neon_rider_user');
    if (savedUser) setCurrentUser(savedUser);
  }, []);

  const handleStartSequence = () => {
    if (audioEngine) {
      if (typeof audioEngine.initAudio === 'function') audioEngine.initAudio();
      if (typeof audioEngine.playClick === 'function') audioEngine.playClick();
    }
    onConfirmStart();
  };

  return (
    <div className="modal-overlay">
      <div className="terminal-card">
        <div className="laser-line"></div>
        <div className="system-tag">MAINFRAME CONNECTED {currentUser}</div>

        <div className="header-group">
          <h1 className="glitch-title">READY {currentUser}</h1>
          <div className="subtitle">SYNCHRONIZING NEURAL LINK</div>
        </div>

        <p className="status-text">
          <span className="text-cyan-400">{currentUser}</span> authenticated.<br />
          CyberBike X9 synchronization complete.<br />
          Engine systems operating at peak efficiency.<br />
          The neon grid awaits your arrival.
        </p>

        <div className="telemetry-box">
          <div className="telemetry-header">
            <span>PRE-FLIGHT SYSTEM CHECK</span>
            <span className="pulse-dot">● STANDBY OK</span>
          </div>
          
          <div className="metric-row">
            <span className="metric-label">ENGINE INJECTORS</span>
            <span className="metric-status online">READY</span>
          </div>

          <div className="metric-row border-top">
            <span className="metric-label">TIME BUFFER</span>
            <span className="metric-value">00:00 <span className="unit">MM:SS</span></span>
          </div>
          
          <div className="metric-row border-top">
            <span className="metric-label">INITIAL VELOCITY</span>
            <span className="metric-value">0 <span className="unit">KM/H</span></span>
          </div>
        </div>

        <button 
          onClick={handleStartSequence}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`action-btn ${isHovered ? 'btn-hover' : ''}`}
        >
          START RIDE ⚡
        </button>

        <div className="footnote">SECURE | PORT 8080 | OPERATOR: {currentUser}</div>
      </div>

      <style jsx>{`
        .modal-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; background: rgba(2, 4, 9, 0.8); backdrop-filter: blur(4px); padding: 0 24px; font-family: monospace; color: #ffffff; }
        .terminal-card { background: rgba(2, 4, 9, 0.9); border: 1px solid rgba(34, 211, 238, 0.3); padding: 40px; border-radius: 16px; max-width: 400px; width: 100%; text-align: center; box-shadow: 0 0 50px rgba(6, 182, 212, 0.15); position: relative; animation: scaleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .laser-line { position: absolute; top: 0; left: 48px; right: 48px; height: 2px; background: linear-gradient(90deg, transparent, #22d3ee, transparent); }
        .system-tag { position: absolute; top: -11px; left: 50%; transform: translateX(-50%); padding: 2px 12px; background: #090d16; border: 1px solid rgba(34, 211, 238, 0.3); font-size: 9px; color: #22d3ee; letter-spacing: 0.15em; font-weight: bold; border-radius: 6px; }
        .glitch-title { font-size: 42px; font-weight: 900; margin: 0; background: linear-gradient(90deg, #22d3ee, #3b82f6, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-transform: uppercase; }
        .subtitle { font-size: 10px; color: #a5f3fc; font-weight: bold; letter-spacing: 0.2em; margin-top: 4px; }
        .status-text { font-size: 12px; color: #94a3b8; line-height: 1.6; background: rgba(15, 23, 42, 0.4); border: 1px solid #1e293b; padding: 12px; border-radius: 8px; margin: 24px 0; }
        .telemetry-box { background: rgba(2, 4, 9, 0.6); border: 1px solid #1e293b; border-radius: 12px; padding: 16px; text-align: left; margin-bottom: 24px; }
        .telemetry-header { font-size: 9px; color: #576375; border-bottom: 1px solid rgba(30, 41, 59, 0.8); padding-bottom: 8px; margin-bottom: 12px; display: flex; justify-content: space-between; }
        .pulse-dot { color: #34d399; animation: pulse 1.5s infinite; }
        .metric-row { display: flex; justify-content: space-between; align-items: center; margin: 6px 0; }
        .border-top { border-top: 1px solid rgba(30, 41, 59, 0.4); padding-top: 10px; margin-top: 10px; }
        .metric-label { color: #64748b; font-size: 11px; font-weight: bold; }
        .metric-status { font-size: 12px; font-weight: bold; }
        .online { color: #34d399; }
        .metric-value { font-size: 16px; font-weight: 900; }
        .unit { font-size: 11px; color: #475569; }
        .action-btn { width: 100%; background: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.4); border-radius: 12px; padding: 16px; font-size: 12px; font-weight: 900; letter-spacing: 0.25em; color: #22d3ee; cursor: pointer; transition: all 0.3s ease; }
        .btn-hover { background: #22d3ee; color: #020409; }
        .footnote { font-size: 8px; color: #475569; letter-spacing: 0.1em; margin-top: 24px; }
        @keyframes scaleIn { 0% { transform: scale(0.92); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}