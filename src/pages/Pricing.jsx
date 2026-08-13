import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Check } from 'lucide-react';
import { apiFetch } from '../services/api';

export default function Pricing() {
  const [bowlerPricing, setBowlerPricing] = useState([]);
  const [groundPricing, setGroundPricing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPricing() {
      try {
        const [bRes, gRes] = await Promise.all([
          apiFetch('/pricing/bowler'),
          apiFetch('/pricing/ground'),
        ]);
        setBowlerPricing(bRes.pricing || []);
        setGroundPricing(gRes.pricing || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPricing();
  }, []);

  return (
    <div className="app-wrapper">
      <Sidebar />
      <main className="main-content">
        <div className="header-section">
          <h1 className="page-title">Rates & Session Packages</h1>
          <p className="page-subtitle">Transparent pricing for bowler machines and ground net practice</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            <p>Loading pricing plans...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {/* Bowler Machine Rates */}
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>
                Bowling Machine Packages
              </h2>

              <div className="grid-3">
                {bowlerPricing.map((item) => (
                  <div key={item._id || item.id} className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>{item.name}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{item.description}</p>

                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Rate Per Over</p>
                      <p style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary)' }}>₹{item.pricePerOver}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        Session Rate: ₹{item.pricePerSession} ({item.sessionDuration} mins)
                      </p>
                    </div>

                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Check size={16} color="var(--primary)" /> Speed & Spin Controls
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Check size={16} color="var(--primary)" /> Leather & Synthetic Balls
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Ground Rates */}
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>
                Ground Practice Rates
              </h2>

              <div className="grid-3">
                {groundPricing.map((item) => (
                  <div key={item._id || item.id} className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>{item.name}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{item.description}</p>

                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Hourly Rate</p>
                      <p style={{ fontSize: '1.75rem', fontWeight: '800', color: '#2563eb' }}>₹{item.pricePerHour}<span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>/hr</span></p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Capacity: Up to {item.maxPlayers} players</p>
                    </div>

                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Check size={16} color="#2563eb" /> Floodlights & Professional Turf
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Check size={16} color="#2563eb" /> Protective Net Enclosures
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
