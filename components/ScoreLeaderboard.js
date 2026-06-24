import React, { useState, useEffect } from 'react';

export default function ScoreLeaderboard({
  currentScore,
  currentTime
}) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [localHighScore, setLocalHighScore] = useState(0);
  const [lastRunScore, setLastRunScore] = useState(0);
  const [lastRunTime, setLastRunTime] = useState(0);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(
          `/api/leaderboard?t=${Date.now()}`
        );

        const data = await res.json();

        setLeaderboard(data.slice(0, 5));
      } catch (err) {
        console.error(
          'Leaderboard fetch error:',
          err
        );
      }
    };

    fetchLeaderboard();

    setLocalHighScore(
      Number(localStorage.getItem('bike_high_score')) || 0
    );

    setLastRunScore(
      Number(localStorage.getItem('bike_last_run_score')) || 0
    );

    setLastRunTime(
      Number(localStorage.getItem('bike_last_run_time')) || 0
    );
  }, [currentScore]);

  return (
    <div className="leaderboard-panel">
      <div className="tech-header">
        GLOBAL LEADERBOARD
      </div>

      <div className="rank-list">
        {leaderboard.map((entry, index) => (
          <div
            key={index}
            className="score-row"
          >
            <span className="label">
              {index + 1}. {entry.username}
            </span>

            <span className="value">
              {entry.score.toLocaleString()}
              <span className="unit">m</span>

              <span className="time-unit">
                {' '}
                ({formatTime(entry.time)})
              </span>
            </span>
          </div>
        ))}
      </div>

      <div className="stats-footer">

        {/* LOCAL HIGH SCORE */}

        <div className="score-row">
          <span className="label">
            HIGH SCORE
          </span>

          <span className="value text-pink-400">
            🏆 {localHighScore.toLocaleString()}
            <span className="unit">m</span>
          </span>
        </div>

        {/* PREVIOUS RUN */}

        <div className="score-row mt-2">
          <span className="label">
            PREVIOUS RUN
          </span>

          <span className="value">
            {lastRunScore.toLocaleString()}
            <span className="unit">m</span>

            <span className="time-unit">
              {' '}
              [{formatTime(lastRunTime)}]
            </span>
          </span>
        </div>

        {/* CURRENT RUN */}

        <div className="score-row mt-2 pt-2 border-t border-slate-800">
          <span className="label text-cyan-400 font-bold">
            CURRENT RUN
          </span>

          <span className="value text-cyan-400">
            {Math.round(currentScore).toLocaleString()}
            <span className="unit">m</span>

            <span className="time-unit">
              {' '}
              [{formatTime(currentTime)}]
            </span>
          </span>
        </div>
      </div>

      <style jsx>{`
        .leaderboard-panel {
          background: rgba(2, 4, 9, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(6, 182, 212, 0.3);
          padding: 16px;
          border-radius: 12px;
          font-family: monospace;
          width: 100%;
          box-shadow: 0 0 15px rgba(6, 182, 212, 0.15);
        }

        .tech-header {
          font-size: 9px;
          color: #22d3ee;
          font-weight: bold;
          margin-bottom: 12px;
          letter-spacing: 0.2em;
          border-bottom: 1px solid #1e293b;
          padding-bottom: 4px;
        }

        .rank-list {
          margin-bottom: 12px;
        }

        .score-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 6px 0;
        }

        .label {
          font-size: 13px;
          color: #94a3b8;
        }

        .value {
          font-size: 15px;
          color: white;
          font-weight: 900;
        }

        .unit {
          color: #64748b;
          font-size: 12px;
        }

        .time-unit {
          color: #64748b;
          font-size: 11px;
        }

        .mt-2 {
          margin-top: 8px;
        }

        .pt-2 {
          padding-top: 8px;
        }

        .border-t {
          border-top: 1px solid #1e293b;
        }
      `}</style>
    </div>
  );
}