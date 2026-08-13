import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { ArrowLeft } from 'lucide-react';
import { apiFetch } from '../services/api';

export default function NewBooking() {
  const navigate = useNavigate();
  const [bookingType, setBookingType] = useState('bowler_machine');
  const [bowlerRates, setBowlerRates] = useState([]);
  const [groundRates, setGroundRates] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState('');
  const [selectedGround, setSelectedGround] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState(60);
  const [numberOfOvers, setNumberOfOvers] = useState(5);
  const [notes, setNotes] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPricing() {
      try {
        const [bRes, gRes] = await Promise.all([
          apiFetch('/pricing/bowler').catch(() => ({ pricing: [] })),
          apiFetch('/pricing/ground').catch(() => ({ pricing: [] })),
        ]);
        const bPricing = bRes.pricing || [];
        const gPricing = gRes.pricing || [];

        setBowlerRates(bPricing);
        setGroundRates(gPricing);

        if (bPricing.length > 0) setSelectedMachine(bPricing[0]._id || bPricing[0].id);
        if (gPricing.length > 0) setSelectedGround(gPricing[0]._id || gPricing[0].id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPricing();
  }, []);

  useEffect(() => {
    if (bookingType === 'bowler_machine') {
      const machine = bowlerRates.find((m) => (m._id || m.id) === selectedMachine);
      if (machine) {
        setTotalAmount(machine.pricePerOver * numberOfOvers);
      }
    } else {
      const ground = groundRates.find((g) => (g._id || g.id) === selectedGround);
      if (ground) {
        setTotalAmount((ground.pricePerHour * duration) / 60);
      }
    }
  }, [bookingType, selectedMachine, selectedGround, numberOfOvers, duration, bowlerRates, groundRates]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!date) {
      setError('Please select a date and time');
      return;
    }

    setSubmitting(true);
    try {
      await apiFetch('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          bookingType,
          bowlerMachineId: bookingType === 'bowler_machine' ? selectedMachine : null,
          groundPricingId: bookingType === 'ground' ? selectedGround : null,
          date,
          duration: Number(duration),
          numberOfOvers: bookingType === 'bowler_machine' ? Number(numberOfOvers) : null,
          totalAmount,
          notes,
        }),
      });

      navigate('/dashboard/bookings');
    } catch (err) {
      setError(err.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading pricing & options...</p>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <Sidebar />
      <main className="main-content">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <button onClick={() => navigate('/dashboard/bookings')} className="btn btn-outline" style={{ marginBottom: '1.5rem' }}>
            <ArrowLeft size={16} />
            <span>Back to Bookings</span>
          </button>

          <div className="card">
            <div className="card-header" style={{ background: '#0f172a', color: 'white' }}>
              <div>
                <h1 className="card-title">New Session Booking</h1>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Reserve your practice slot at Asha Indoor Cricket Center</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="card-body">
              {error && <div className="badge badge-danger btn-full" style={{ padding: '0.75rem', marginBottom: '1rem' }}>{error}</div>}

              {/* Category Selector */}
              <div className="form-group">
                <label className="form-label">Select Booking Category</label>
                <div className="grid-2">
                  <div
                    onClick={() => setBookingType('bowler_machine')}
                    style={{
                      padding: '1rem',
                      border: bookingType === 'bowler_machine' ? '2px solid var(--primary)' : '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      background: bookingType === 'bowler_machine' ? 'var(--primary-light)' : 'white',
                      cursor: 'pointer',
                    }}
                  >
                    <h3 style={{ fontWeight: '700' }}>Bowler Machine</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Paced & spin deliveries per over.</p>
                  </div>

                  <div
                    onClick={() => setBookingType('ground')}
                    style={{
                      padding: '1rem',
                      border: bookingType === 'ground' ? '2px solid var(--primary)' : '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      background: bookingType === 'ground' ? 'var(--primary-light)' : 'white',
                      cursor: 'pointer',
                    }}
                  >
                    <h3 style={{ fontWeight: '700' }}>Ground Practice</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Nets or full ground booking.</p>
                  </div>
                </div>
              </div>

              {/* Package Dropdown */}
              {bookingType === 'bowler_machine' ? (
                <div className="form-group">
                  <label className="form-label">Machine Tier</label>
                  <select
                    value={selectedMachine}
                    onChange={(e) => setSelectedMachine(e.target.value)}
                    className="form-control"
                  >
                    {bowlerRates.map((m) => (
                      <option key={m._id || m.id} value={m._id || m.id}>
                        {m.name} — ₹{m.pricePerOver}/over
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">Ground Package / Net Size</label>
                  <select
                    value={selectedGround}
                    onChange={(e) => setSelectedGround(e.target.value)}
                    className="form-control"
                  >
                    {groundRates.map((g) => (
                      <option key={g._id || g.id} value={g._id || g.id}>
                        {g.name} ({g.groundSize.replace('_', ' ')}) — ₹{g.pricePerHour}/hr
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Date & Overs/Duration */}
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Session Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="form-control"
                  />
                </div>

                {bookingType === 'bowler_machine' ? (
                  <div className="form-group">
                    <label className="form-label">Number of Overs</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={numberOfOvers}
                      onChange={(e) => setNumberOfOvers(Number(e.target.value))}
                      className="form-control"
                    />
                  </div>
                ) : (
                  <div className="form-group">
                    <label className="form-label">Duration (Minutes)</label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="form-control"
                    >
                      <option value={30}>30 Minutes</option>
                      <option value={60}>1 Hour (60 Mins)</option>
                      <option value={90}>1.5 Hours (90 Mins)</option>
                      <option value={120}>2 Hours (120 Mins)</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Additional Notes</label>
                <textarea
                  rows="3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="E.g., Left-arm spin setup, fast pace practice..."
                  className="form-control"
                ></textarea>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Estimated Total</p>
                  <p style={{ fontSize: '1.75rem', fontWeight: '800' }}>₹{totalAmount}</p>
                </div>

                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Confirming...' : 'Confirm & Reserve Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
