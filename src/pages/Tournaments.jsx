import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { X } from 'lucide-react';
import { apiFetch } from '../services/api';

export default function Tournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [playerNames, setPlayerNames] = useState('');
  const [registering, setRegistering] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    async function loadTournaments() {
      try {
        const data = await apiFetch('/tournaments');
        setTournaments(data.tournaments || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadTournaments();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    setRegistering(true);

    try {
      const players = playerNames.split(',').map((p) => p.trim()).filter(Boolean);
      await apiFetch(`/tournaments/${selectedTournament._id || selectedTournament.id}/register`, {
        method: 'POST',
        body: JSON.stringify({
          teamName,
          playerNames: players,
        }),
      });

      setMsg({ type: 'success', text: 'Team registered successfully for tournament!' });
      setTimeout(() => {
        setSelectedTournament(null);
        setTeamName('');
        setPlayerNames('');
        setMsg({ type: '', text: '' });
      }, 1500);
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Registration failed' });
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="app-wrapper">
      <Sidebar />
      <main className="main-content">
        <div className="header-section">
          <h1 className="page-title">Cricket Tournaments</h1>
          <p className="page-subtitle">Compete in high-stakes indoor and outdoor cricket championships</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            <p>Loading tournaments...</p>
          </div>
        ) : (
          <div className="grid-3">
            {tournaments.map((tournament) => (
              <div key={tournament._id || tournament.id} className="card">
                {tournament.imageUrl && (
                  <img
                    src={tournament.imageUrl}
                    alt={tournament.name}
                    style={{ height: '180px', width: '100%', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span className="badge badge-success">{tournament.format || 'Knockout'}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{tournament.status}</span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>{tournament.name}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{tournament.description}</p>

                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span>Dates:</span>
                        <span style={{ fontWeight: '600' }}>
                          {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span>Entry Fee:</span>
                        <span style={{ fontWeight: '700', color: 'var(--primary)' }}>₹{tournament.entryFee}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Prize Pool:</span>
                        <span style={{ fontWeight: '700', color: '#d97706' }}>₹{tournament.prizePool}</span>
                      </div>
                    </div>
                  </div>

                  <button onClick={() => setSelectedTournament(tournament)} className="btn btn-primary btn-full">
                    Register Team
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {selectedTournament && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button onClick={() => setSelectedTournament(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>

              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                Register for {selectedTournament.name}
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Entry Fee: ₹{selectedTournament.entryFee}</p>

              {msg.text && (
                <div className={`badge badge-${msg.type === 'success' ? 'success' : 'danger'} btn-full`} style={{ padding: '0.75rem', marginBottom: '1rem' }}>
                  {msg.text}
                </div>
              )}

              <form onSubmit={handleRegister}>
                <div className="form-group">
                  <label className="form-label">Team Name</label>
                  <input
                    type="text"
                    required
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="E.g., Asha Super Strikers"
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Player Names (Comma separated)</label>
                  <textarea
                    rows="3"
                    value={playerNames}
                    onChange={(e) => setPlayerNames(e.target.value)}
                    placeholder="Virat, Rohit, Bumrah, Hardik, Rahul"
                    className="form-control"
                  ></textarea>
                </div>

                <button type="submit" disabled={registering} className="btn btn-primary btn-full" style={{ marginTop: '1rem' }}>
                  {registering ? 'Submitting Registration...' : 'Complete Registration'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
