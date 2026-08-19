import React, { useEffect, useState } from 'react';

export default function ScoreLeaderboard({
  currentScore = 0,
  currentTime = 0
}) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [localHighScore, setLocalHighScore] = useState(0);
  const [lastRunScore, setLastRunScore] = useState(0);
  const [lastRunTime, setLastRunTime] = useState(0);

  const formatTime = (seconds) => {
    const totalSeconds = Math.max(0, Math.floor(Number(seconds) || 0));
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  useEffect(() => {
    let cancelled = false;

    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(
          `/api/leaderboard?t=${Date.now()}`,
          {
            cache: 'no-store'
          }
        );

        if (!res.ok) {
          throw new Error(`Leaderboard request failed: ${res.status}`);
        }

        const data = await res.json();

        if (!cancelled && Array.isArray(data)) {
          setLeaderboard(data.slice(0, 5));
        }
      } catch (err) {
        console.error('Leaderboard fetch error:', err);
      }
    };

    fetchLeaderboard();

    if (typeof window !== 'undefined') {
      setLocalHighScore(
        Number(localStorage.getItem('bike_high_score')) || 0
      );

      setLastRunScore(
        Number(localStorage.getItem('bike_last_run_score')) || 0
      );

      setLastRunTime(
        Number(localStorage.getItem('bike_last_run_time')) || 0
      );
    }

    return () => {
      cancelled = true;
    };
  }, [currentScore]);

  return (
    <div className="leaderboard-panel">
      <div className="tech-header">
        <span>GLOBAL LEADERBOARD</span>
        <span className="live-indicator">● LIVE</span>
      </div>

      <div className="rank-list">
        {leaderboard.length > 0 ? (
          leaderboard.map((entry, index) => (
            <div
              key={`${entry.username || 'player'}-${index}`}
              className="score-row"
            >
              <span className="label">
                <span className="rank">
                  {index + 1}.
                </span>

                <span className="username">
                  {entry.username || 'PLAYER'}
                </span>
              </span>

              <span className="value">
                {Number(entry.score || 0).toLocaleString()}
                <span className="unit">m</span>

                <span className="time-unit">
                  {formatTime(entry.time)}
                </span>
              </span>
            </div>
          ))
        ) : (
          <div className="empty-state">
            NO GLOBAL RECORDS
          </div>
        )}
      </div>

      <div className="stats-footer">
        {/* HIGH SCORE */}
        <div className="score-row">
          <span className="label">
            HIGH SCORE
          </span>

          <span className="value high-score">
            <span className="trophy">🏆</span>
            {localHighScore.toLocaleString()}
            <span className="unit">m</span>
          </span>
        </div>

        {/* PREVIOUS RUN */}
        <div className="score-row">
          <span className="label">
            PREVIOUS RUN
          </span>

          <span className="value">
            {lastRunScore.toLocaleString()}
            <span className="unit">m</span>

            <span className="time-unit">
              [{formatTime(lastRunTime)}]
            </span>
          </span>
        </div>

        {/* CURRENT RUN */}
        <div className="score-row current-row">
          <span className="label current-label">
            CURRENT RUN
          </span>

          <span className="value current-value">
            {Math.round(currentScore).toLocaleString()}
            <span className="unit">m</span>

            <span className="time-unit">
              [{formatTime(currentTime)}]
            </span>
          </span>
        </div>
      </div>

      <style jsx>{`
        .leaderboard-panel {
          width: 100%;
          box-sizing: border-box;

          padding: clamp(10px, 2vw, 16px);

          border: 1px solid rgba(6, 182, 212, 0.28);
          border-radius: 12px;

          background: rgba(2, 4, 9, 0.86);

          -webkit-backdrop-filter: blur(12px);
          backdrop-filter: blur(12px);

          font-family:
            "SFMono-Regular",
            Consolas,
            "Liberation Mono",
            monospace;

          box-shadow:
            0 0 15px rgba(6, 182, 212, 0.1);

          overflow: hidden;

          box-sizing: border-box;
        }

        .tech-header {
          display: flex;
          justify-content: space-between;
          align-items: center;

          width: 100%;

          padding-bottom: 6px;
          margin-bottom: 7px;

          border-bottom: 1px solid rgba(30, 41, 59, 0.9);

          color: #22d3ee;

          font-size: clamp(7px, 1.5vw, 9px);
          font-weight: 800;

          letter-spacing: 0.16em;

          white-space: nowrap;
        }

        .live-indicator {
          color: rgba(34, 211, 238, 0.65);

          font-size: 7px;
          letter-spacing: 0.08em;
        }

        .rank-list {
          width: 100%;
          margin: 0 0 8px;
        }

        .score-row {
          display: flex;

          justify-content: space-between;
          align-items: center;

          width: 100%;

          min-width: 0;

          margin: 4px 0;

          gap: 8px;

          line-height: 1.15;
        }

        .label {
          display: flex;
          align-items: center;

          min-width: 0;

          color: #94a3b8;

          font-size: clamp(8px, 1.8vw, 12px);

          white-space: nowrap;

          overflow: hidden;
          text-overflow: ellipsis;
        }

        .rank {
          flex: 0 0 auto;

          width: 22px;

          color: #475569;

          font-size: 9px;
        }

        .username {
          min-width: 0;

          overflow: hidden;
          text-overflow: ellipsis;
        }

        .value {
          flex: 0 0 auto;

          color: #f8fafc;

          font-size: clamp(9px, 2vw, 14px);

          font-weight: 900;

          white-space: nowrap;

          text-align: right;
        }

        .unit {
          margin-left: 2px;

          color: #64748b;

          font-size: clamp(7px, 1.6vw, 11px);

          font-weight: 600;
        }

        .time-unit {
          margin-left: 5px;

          color: #475569;

          font-size: clamp(7px, 1.5vw, 10px);

          font-weight: 500;
        }

        .stats-footer {
          width: 100%;

          padding-top: 7px;

          border-top: 1px solid rgba(30, 41, 59, 0.9);
        }

        .high-score {
          color: #f472b6;
        }

        .trophy {
          margin-right: 3px;

          font-size: 10px;
        }

        .current-row {
          margin-top: 6px;

          padding-top: 6px;

          border-top: 1px solid rgba(30, 41, 59, 0.9);
        }

        .current-label,
        .current-value {
          color: #22d3ee;
        }

        .empty-state {
          padding: 8px 0;

          color: #475569;

          font-size: 8px;

          letter-spacing: 0.12em;

          text-align: center;
        }

        /* -----------------------------------------
           SMALL PHONES
           ----------------------------------------- */

        @media (max-width: 480px) {
          .leaderboard-panel {
            padding: 9px 10px;

            border-radius: 10px;
          }

          .tech-header {
            padding-bottom: 5px;
            margin-bottom: 5px;

            font-size: 7px;
          }

          .live-indicator {
            font-size: 6px;
          }

          .score-row {
            margin: 3px 0;

            gap: 5px;
          }

          .label {
            font-size: 8px;
          }

          .rank {
            width: 18px;

            font-size: 7px;
          }

          .value {
            font-size: 9px;
          }

          .unit {
            font-size: 7px;
          }

          .time-unit {
            margin-left: 3px;

            font-size: 7px;
          }

          .stats-footer {
            padding-top: 5px;
          }

          .current-row {
            margin-top: 4px;
            padding-top: 5px;
          }
        }

        /* -----------------------------------------
           VERY SMALL PHONES
           ----------------------------------------- */

        @media (max-width: 360px) {
          .leaderboard-panel {
            padding: 8px;
          }

          .tech-header {
            font-size: 6.5px;
          }

          .label {
            font-size: 7px;
          }

          .value {
            font-size: 8px;
          }

          .unit,
          .time-unit {
            font-size: 6.5px;
          }

          .rank {
            width: 16px;
          }

          .score-row {
            gap: 3px;
          }
        }

        /* -----------------------------------------
           LANDSCAPE / SHORT SCREENS
           ----------------------------------------- */

        @media (max-height: 600px) {
          .leaderboard-panel {
            padding: 7px 10px;
          }

          .tech-header {
            margin-bottom: 4px;
            padding-bottom: 4px;
          }

          .score-row {
            margin: 2px 0;
          }

          .stats-footer {
            padding-top: 4px;
          }

          .current-row {
            margin-top: 3px;
            padding-top: 4px;
          }
        }
      `}</style>
    </div>
  );
}
