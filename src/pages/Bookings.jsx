import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Plus, Calendar } from 'lucide-react';
import { apiFetch } from '../services/api';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const data = await apiFetch('/bookings');
        setBookings(data.bookings || []);
      } catch (err) {
        console.error('Failed to load bookings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  return (
    <div className="app-wrapper">
      <Sidebar />
      <main className="main-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 className="page-title">Your Bookings</h1>
            <p className="page-subtitle">Manage and track your ground & machine appointments</p>
          </div>
          <Link to="/dashboard/bookings/new" className="btn btn-primary">
            <Plus size={18} />
            <span>Book New Session</span>
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            <p>Loading your bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
            <Calendar size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>No Bookings Found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Schedule your first bowling machine or ground session today!</p>
            <Link to="/dashboard/bookings/new" className="btn btn-primary btn-full">
              <Plus size={18} />
              <span>Book Now</span>
            </Link>
          </div>
        ) : (
          <div className="card">
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Session Details</th>
                    <th>Date & Time</th>
                    <th>Duration / Overs</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id || booking.id}>
                      <td>
                        <p style={{ fontWeight: '600', textTransform: 'capitalize' }}>
                          {(booking.bookingType || 'session').replace('_', ' ')}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {booking.bowlerMachineId?.name || booking.groundPricingId?.name || 'Standard Session'}
                        </p>
                      </td>
                      <td>
                        {new Date(booking.date).toLocaleDateString(undefined, {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td>
                        {booking.duration} mins {booking.numberOfOvers ? `(${booking.numberOfOvers} overs)` : ''}
                      </td>
                      <td style={{ fontWeight: '700' }}>
                        ₹{booking.totalAmount}
                      </td>
                      <td>
                        <span className={`badge badge-${booking.status === 'confirmed' ? 'success' : booking.status === 'pending' ? 'pending' : 'danger'}`}>
                          {booking.status}
                        </span>
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
