import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, Calendar, ShieldCheck, Zap } from 'lucide-react';

export default function ConfirmedBookingCountdown({ bookings }) {
  // Filter all confirmed bookings
  const confirmedBookings = (bookings || []).filter((b) => b.status === 'confirmed');

  // Find nearest upcoming confirmed booking
  const upcomingConfirmed = confirmedBookings
    .filter((b) => new Date(b.date).getTime() + (b.duration || 60) * 60 * 1000 > Date.now())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const activeBooking = upcomingConfirmed[0];

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isLive: false,
    isExpired: false,
  });

  useEffect(() => {
    if (!activeBooking) return;

    const calculateTime = () => {
      const targetTime = new Date(activeBooking.date).getTime();
      const now = Date.now();
      const diff = targetTime - now;
      const durationMs = (activeBooking.duration || 60) * 60 * 1000;

      if (diff <= 0 && diff > -durationMs) {
        // Currently live/in progress
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true, isExpired: false });
      } else if (diff <= -durationMs) {
        // Expired
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isLive: false, isExpired: true });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds, isLive: false, isExpired: false });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [activeBooking]);

  if (!activeBooking) {
    return null; // No confirmed upcoming booking to show banner for
  }

  const bookingDate = new Date(activeBooking.date);
  const formattedDate = bookingDate.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = bookingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const sessionName =
    activeBooking.bowlerMachineId?.name ||
    activeBooking.groundPricingId?.name ||
    (activeBooking.bookingType === 'bowler_machine' ? 'Bowling Machine Session' : 'Ground Net Practice');

  return (
    <div
      className="confirmed-booking-banner"
      style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%)',
        color: 'white',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        marginBottom: '2rem',
        boxShadow: '0 10px 25px -5px rgba(5, 150, 105, 0.4)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background glow */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Header alert badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div
            style={{
              background: '#ecfdf5',
              color: '#047857',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: '800',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            <ShieldCheck size={16} /> Booking Confirmed by Admin
          </div>
          <span style={{ fontSize: '0.85rem', color: '#a7f3d0', fontWeight: '500' }}>
            {upcomingConfirmed.length > 1 ? `+${upcomingConfirmed.length - 1} other confirmed session(s)` : ''}
          </span>
        </div>

        {/* Main Details & Countdown Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '1.5rem',
            alignItems: 'center',
          }}
          className="confirmed-grid"
        >
          {/* Left Column: Details */}
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.4rem', color: '#ffffff' }}>
              🎉 {sessionName}
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#d1fae5', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Calendar size={16} /> <strong>{formattedDate}</strong> at <strong>{formattedTime}</strong>
              <span style={{ opacity: 0.6 }}>•</span>
              <Clock size={16} /> {activeBooking.duration} mins {activeBooking.numberOfOvers ? `(${activeBooking.numberOfOvers} overs)` : ''}
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: '#ecfdf5',
                }}
              >
                Amount Paid: ₹{activeBooking.totalAmount}
              </span>
              <span
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: '#ecfdf5',
                  textTransform: 'capitalize',
                }}
              >
                Type: {activeBooking.bookingType.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Right Column: Live Countdown */}
          <div style={{ textAlign: 'center' }}>
            {timeLeft.isLive ? (
              <div
                style={{
                  background: '#f59e0b',
                  color: '#451a03',
                  padding: '1rem 1.5rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: '800',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  animation: 'pulse-glow 2s infinite',
                }}
              >
                <Zap size={20} /> SESSION IS ACTIVE NOW!
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a7f3d0', fontWeight: '700', marginBottom: '0.5rem' }}>
                  Session Starts In
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  <div className="countdown-box">
                    <span className="countdown-number">{String(timeLeft.days).padStart(2, '0')}</span>
                    <span className="countdown-label">Days</span>
                  </div>
                  <div className="countdown-box">
                    <span className="countdown-number">{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="countdown-label">Hours</span>
                  </div>
                  <div className="countdown-box">
                    <span className="countdown-number">{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="countdown-label">Mins</span>
                  </div>
                  <div className="countdown-box">
                    <span className="countdown-number">{String(timeLeft.seconds).padStart(2, '0')}</span>
                    <span className="countdown-label">Secs</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
