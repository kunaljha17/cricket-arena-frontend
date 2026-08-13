import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { apiFetch } from '../services/api';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states for Admin additions
  const [newBowler, setNewBowler] = useState({ name: '', description: '', pricePerOver: '', pricePerSession: '' });
  const [newTournament, setNewTournament] = useState({ name: '', description: '', startDate: '', endDate: '', entryFee: '', prizePool: '', imageUrl: '' });

  useEffect(() => {
    loadAdminData();
  }, []);

  async function loadAdminData() {
    try {
      const [bRes, tRes] = await Promise.all([
        apiFetch('/bookings').catch(() => ({ bookings: [] })),
        apiFetch('/tournaments').catch(() => ({ tournaments: [] })),
      ]);
      setBookings(bRes.bookings || []);
      setTournaments(tRes.tournaments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      await apiFetch(`/bookings/${bookingId}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      loadAdminData();
    } catch (err) {
      alert(err.message || 'Status update failed');
    }
  };

  const handleCreateBowlerRate = async (e) => {
    e.preventDefault();
    try {
      await apiFetch('/pricing/bowler', {
        method: 'POST',
        body: JSON.stringify({
          name: newBowler.name,
          description: newBowler.description,
          pricePerOver: Number(newBowler.pricePerOver),
          pricePerSession: Number(newBowler.pricePerSession),
        }),
      });
      alert('Bowling machine pricing tier added!');
      setNewBowler({ name: '', description: '', pricePerOver: '', pricePerSession: '' });
    } catch (err) {
      alert(err.message || 'Failed to add pricing');
    }
  };

  const handleCreateTournament = async (e) => {
    e.preventDefault();
    try {
      await apiFetch('/tournaments', {
        method: 'POST',
        body: JSON.stringify({
          ...newTournament,
          entryFee: Number(newTournament.entryFee),
          prizePool: Number(newTournament.prizePool),
        }),
      });
      alert('Tournament created successfully!');
      setNewTournament({ name: '', description: '', startDate: '', endDate: '', entryFee: '', prizePool: '', imageUrl: '' });
      loadAdminData();
    } catch (err) {
      alert(err.message || 'Failed to create tournament');
    }
  };

  return (
    <div className="app-wrapper">
      <Sidebar />
      <main className="main-content">
        <div className="header-section">
          <h1 className="page-title">Admin Control Center</h1>
          <p className="page-subtitle">Manage facility appointments, add rate cards, and launch tournaments</p>
        </div>

        {/* Admin Tabs */}
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`btn ${activeTab === 'bookings' ? 'btn-primary' : 'btn-outline'}`}
          >
            All User Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('add_pricing')}
            className={`btn ${activeTab === 'add_pricing' ? 'btn-primary' : 'btn-outline'}`}
          >
            Add Machine Rate
          </button>
          <button
            onClick={() => setActiveTab('add_tournament')}
            className={`btn ${activeTab === 'add_tournament' ? 'btn-primary' : 'btn-outline'}`}
          >
            Add Tournament
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            <p>Loading admin controls...</p>
          </div>
        ) : (
          <div>
            {/* Tab 1: Bookings Management */}
            {activeTab === 'bookings' && (
              <div className="card">
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Type</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b) => (
                        <tr key={b._id || b.id}>
                          <td style={{ fontWeight: '600' }}>
                            {b.userId?.name || 'User'}
                            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>{b.userId?.email}</span>
                          </td>
                          <td style={{ textTransform: 'capitalize' }}>
                            {(b.bookingType || 'session').replace('_', ' ')}
                          </td>
                          <td>{new Date(b.date).toLocaleDateString()}</td>
                          <td style={{ fontWeight: '700' }}>₹{b.totalAmount}</td>
                          <td>
                            <span className={`badge badge-${b.status === 'confirmed' ? 'success' : b.status === 'pending' ? 'pending' : 'danger'}`}>
                              {b.status}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              {b.status !== 'confirmed' && (
                                <button
                                  onClick={() => handleUpdateBookingStatus(b._id || b.id, 'confirmed')}
                                  className="btn btn-primary"
                                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                >
                                  Approve
                                </button>
                              )}
                              {b.status !== 'cancelled' && (
                                <button
                                  onClick={() => handleUpdateBookingStatus(b._id || b.id, 'cancelled')}
                                  className="btn btn-outline"
                                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#ef4444' }}
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 2: Add Machine Rate */}
            {activeTab === 'add_pricing' && (
              <div className="card" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>Add Bowling Machine Rate Tier</h2>
                <form onSubmit={handleCreateBowlerRate}>
                  <div className="form-group">
                    <label className="form-label">Machine Name</label>
                    <input
                      type="text"
                      required
                      value={newBowler.name}
                      onChange={(e) => setNewBowler({ ...newBowler, name: e.target.value })}
                      placeholder="E.g., RoboArm Pro 3000"
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      rows="2"
                      value={newBowler.description}
                      onChange={(e) => setNewBowler({ ...newBowler, description: e.target.value })}
                      placeholder="Feature details..."
                      className="form-control"
                    ></textarea>
                  </div>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Price Per Over (₹)</label>
                      <input
                        type="number"
                        required
                        value={newBowler.pricePerOver}
                        onChange={(e) => setNewBowler({ ...newBowler, pricePerOver: e.target.value })}
                        placeholder="200"
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Session Rate (₹)</label>
                      <input
                        type="number"
                        required
                        value={newBowler.pricePerSession}
                        onChange={(e) => setNewBowler({ ...newBowler, pricePerSession: e.target.value })}
                        placeholder="1000"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '1rem' }}>
                    Save Pricing Tier
                  </button>
                </form>
              </div>
            )}

            {/* Tab 3: Add Tournament */}
            {activeTab === 'add_tournament' && (
              <div className="card" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>Launch New Cricket Tournament</h2>
                <form onSubmit={handleCreateTournament}>
                  <div className="form-group">
                    <label className="form-label">Tournament Title</label>
                    <input
                      type="text"
                      required
                      value={newTournament.name}
                      onChange={(e) => setNewTournament({ ...newTournament, name: e.target.value })}
                      placeholder="E.g., Winter Super League 2025"
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      rows="2"
                      value={newTournament.description}
                      onChange={(e) => setNewTournament({ ...newTournament, description: e.target.value })}
                      className="form-control"
                    ></textarea>
                  </div>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Start Date</label>
                      <input
                        type="date"
                        required
                        value={newTournament.startDate}
                        onChange={(e) => setNewTournament({ ...newTournament, startDate: e.target.value })}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">End Date</label>
                      <input
                        type="date"
                        required
                        value={newTournament.endDate}
                        onChange={(e) => setNewTournament({ ...newTournament, endDate: e.target.value })}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Entry Fee (₹)</label>
                      <input
                        type="number"
                        required
                        value={newTournament.entryFee}
                        onChange={(e) => setNewTournament({ ...newTournament, entryFee: e.target.value })}
                        placeholder="2500"
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Prize Pool (₹)</label>
                      <input
                        type="number"
                        required
                        value={newTournament.prizePool}
                        onChange={(e) => setNewTournament({ ...newTournament, prizePool: e.target.value })}
                        placeholder="60000"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Banner Image URL</label>
                    <input
                      type="url"
                      value={newTournament.imageUrl}
                      onChange={(e) => setNewTournament({ ...newTournament, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="form-control"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '1rem' }}>
                    Publish Tournament
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
