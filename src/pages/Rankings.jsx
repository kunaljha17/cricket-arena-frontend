import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { apiFetch } from '../services/api';

export default function Rankings() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRankings() {
      try {
        const data = await apiFetch('/rankings');
        setRankings(data.rankings || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadRankings();
  }, []);

  return (
    <div className="app-wrapper">
      <Sidebar />
      <main className="main-content">
        <div className="header-section">
          <h1 className="page-title">Practice Rankings & Leaderboard</h1>
          <p className="page-subtitle">Top players ranked by total overs bowled on bowling machines</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            <p>Loading rankings...</p>
          </div>
        ) : (
          <div className="card">
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>Total Overs Practiced</th>
                    <th>Total Sessions</th>
                    <th>Last Practice Session</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((player, index) => (
                    <tr key={player.id || player._id || index}>
                      <td>
                        <span style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: index === 0 ? '#eab308' : index === 1 ? '#94a3b8' : index === 2 ? '#d97706' : '#e2e8f0',
                          color: index <= 2 ? 'white' : '#0f172a',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '0.75rem',
                        }}>
                          {index + 1}
                        </span>
                      </td>
                      <td style={{ fontWeight: '600' }}>{player.userName || 'Player'}</td>
                      <td style={{ fontWeight: '700', color: 'var(--primary)' }}>{player.totalOvers} overs</td>
                      <td>{player.totalAppointments} sessions</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        {player.lastPracticeDate ? new Date(player.lastPracticeDate).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
