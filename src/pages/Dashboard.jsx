import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Calendar, TrendingUp, Trophy, Activity, Clock, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';

import ConfirmedBookingCountdown from '../components/ConfirmedBookingCountdown';

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalOvers: 0,
    upcomingTournaments: 0,
    rank: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [bookingsRes, rankingsRes, tournamentsRes] = await Promise.all([
          apiFetch('/bookings').catch(() => ({ bookings: [] })),
          apiFetch('/rankings').catch(() => ({ rankings: [] })),
          apiFetch('/tournaments').catch(() => ({ tournaments: [] })),
        ]);

        const bookingsList = bookingsRes.bookings || [];
        const rankingsList = rankingsRes.rankings || [];
        const tournamentsList = tournamentsRes.tournaments || [];

        setBookings(bookingsList);
        setRankings(rankingsList);
        setTournaments(tournamentsList);

        const userRanking = rankingsList.find((r) => r.userId === user?.id || r.userId?._id === user?.id);

        setStats({
          totalBookings: bookingsList.length,
          totalOvers: userRanking ? userRanking.totalOvers : 0,
          rank: userRanking ? userRanking.rank : 0,
          upcomingTournaments: tournamentsList.filter((t) => t.status === 'upcoming').length,
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <Sidebar />

      <main className="main-content">
        <div className="header-section">
          <h1 className="page-title">Welcome back, {user?.name}!</h1>
          <p className="page-subtitle">Here's your cricket practice overview</p>
        </div>

        {/* Confirmed Booking Countdown Banner (shown when Admin approves a booking) */}
        <ConfirmedBookingCountdown bookings={bookings} />

        {/* Stats Grid */}
        <div className="grid-stats">
          <div className="stat-card">
            <div>
              <p className="stat-label">Total Bookings</p>
              <p className="stat-value">{stats.totalBookings}</p>
            </div>
            <div className="stat-icon emerald">
              <Calendar size={24} />
            </div>
          </div>

          <div className="stat-card">
            <div>
              <p className="stat-label">Overs Practiced</p>
              <p className="stat-value">{stats.totalOvers}</p>
            </div>
            <div className="stat-icon blue">
              <Activity size={24} />
            </div>
          </div>

          <div className="stat-card">
            <div>
              <p className="stat-label">Your Rank</p>
              <p className="stat-value">#{stats.rank || '-'}</p>
            </div>
            <div className="stat-icon amber">
              <TrendingUp size={24} />
            </div>
          </div>

          <div className="stat-card">
            <div>
              <p className="stat-label">Upcoming Tournaments</p>
              <p className="stat-value">{stats.upcomingTournaments}</p>
            </div>
            <div className="stat-icon purple">
              <Trophy size={24} />
            </div>
          </div>
        </div>

        {/* Recent Bookings & Top Rankings */}
        <div className="grid-2">
          {/* Recent Bookings */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Recent Bookings</h2>
              <Link to="/dashboard/bookings" style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.875rem' }}>
                View All
              </Link>
            </div>
            <div className="card-body">
              {bookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                  <p>No bookings yet</p>
                  <Link to="/dashboard/bookings/new" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                    Book a session →
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {bookings.slice(0, 5).map((booking) => (
                    <div key={booking._id || booking.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: '#f8fafc', borderRadius: 'var(--radius-sm)' }}>
                      <div>
                        <p style={{ fontWeight: '600', textTransform: 'capitalize' }}>
                          {(booking.bookingType || 'session').replace('_', ' ')}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(booking.date).toLocaleDateString()}</p>
                      </div>
                      <span className={`badge badge-${booking.status === 'confirmed' ? 'success' : booking.status === 'pending' ? 'pending' : 'danger'}`}>
                        {booking.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Top Rankings */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Top Practitioners</h2>
              <Link to="/dashboard/rankings" style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.875rem' }}>
                View All
              </Link>
            </div>
            <div className="card-body">
              {rankings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                  <p>No rankings yet</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {rankings.slice(0, 5).map((ranking, index) => (
                    <div key={ranking.id || ranking._id || index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: '#f8fafc', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: index === 0 ? '#eab308' : index === 1 ? '#94a3b8' : '#d97706', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.75rem' }}>
                          {index + 1}
                        </span>
                        <div>
                          <p style={{ fontWeight: '600' }}>{ranking.userName || 'Player'}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ranking.totalAppointments} sessions</p>
                        </div>
                      </div>
                      <p style={{ fontWeight: '700' }}>{ranking.totalOvers} overs</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Tournaments */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Upcoming Tournaments</h2>
            <Link to="/dashboard/tournaments" style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.875rem' }}>
              View All
            </Link>
          </div>
          <div className="card-body">
            {tournaments.filter(t => t.status === 'upcoming').length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                <p>No upcoming tournaments</p>
              </div>
            ) : (
              <div className="grid-3">
                {tournaments.filter(t => t.status === 'upcoming').slice(0, 3).map((tournament) => (
                  <div key={tournament._id || tournament.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
                    <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{tournament.name}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      Start Date: {new Date(tournament.startDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
