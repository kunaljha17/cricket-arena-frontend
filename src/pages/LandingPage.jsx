import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trophy,
  Zap,
  Target,
  TrendingUp,
  Users,
  Star,
  ArrowRight,
  Check,
  Menu,
  X,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './landing.css';

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileNavOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Static data for landing page showcase (no API calls needed)
  const topPerformers = [
    { name: 'Virat Kohli', overs: 156, sessions: 28, medal: '🥇', rank: 1, tier: 'gold' },
    { name: 'Rohit Sharma', overs: 142, sessions: 25, medal: '🥈', rank: 2, tier: 'silver' },
    { name: 'Jasprit Bumrah', overs: 128, sessions: 22, medal: '🥉', rank: 3, tier: 'bronze' },
  ];

  const tournaments = [
    {
      name: 'Asha Indoor T20 Championship 2024',
      description: 'Premier T20 tournament with exciting prizes. Open for all amateur cricket teams.',
      entryFee: '2,000',
      prizePool: '50,000',
      teams: '12/16',
      format: 'Knockout',
      emoji: '🏆',
    },
    {
      name: 'Weekend Cricket League',
      description: 'Regular weekend league for serious cricketers. Compete every Saturday & Sunday.',
      entryFee: '1,500',
      prizePool: '25,000',
      teams: '8/8',
      format: 'League',
      emoji: '🏏',
    },
  ];

  const pricingPlans = [
    {
      name: 'Standard Machine',
      desc: 'Adjustable speed & angle for all skill levels',
      price: 150,
      session: 800,
      duration: '60 min',
      features: ['Speed & Spin Controls', 'Leather & Synthetic Balls', 'Personal Session Coach'],
      featured: false,
    },
    {
      name: 'Premium Machine',
      desc: 'Spin variations & programmable deliveries',
      price: 250,
      session: 1200,
      duration: '60 min',
      features: ['All Standard Features', 'Programmable Sequences', 'Video Analysis Included'],
      featured: true,
    },
    {
      name: 'Fast Bowling Machine',
      desc: 'High-speed machine for advanced players (140+ kmph)',
      price: 300,
      session: 1500,
      duration: '45 min',
      features: ['140+ kmph Deliveries', 'Advanced Swing Settings', 'Pro-Level Training'],
      featured: false,
    },
  ];

  return (
    <div className="landing-page">
      {/* ━━━━━━━━━━━━ Sticky Navigation ━━━━━━━━━━━━ */}
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <a href="#" className="landing-nav-brand" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <div className="landing-nav-logo">
            <Trophy size={22} />
          </div>
          <span className="landing-nav-title">Asha Indoor</span>
        </a>

        <ul className="landing-nav-links">
          <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Features</a></li>
          <li><a href="#tournaments" onClick={(e) => { e.preventDefault(); scrollToSection('tournaments'); }}>Tournaments</a></li>
          <li><a href="#performers" onClick={(e) => { e.preventDefault(); scrollToSection('performers'); }}>Top Performers</a></li>
          <li><a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}>Pricing</a></li>
        </ul>

        <div className="landing-nav-actions">
          <Link to="/login" className="btn-nav-login">Sign In</Link>
          <Link to="/register" className="btn-nav-register">Register Free</Link>
          <button
            className="landing-mobile-toggle"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileNavOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav Drawer */}
      <div className={`mobile-nav-drawer ${mobileNavOpen ? 'open' : ''}`}>
        <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Features</a>
        <a href="#tournaments" onClick={(e) => { e.preventDefault(); scrollToSection('tournaments'); }}>Tournaments</a>
        <a href="#performers" onClick={(e) => { e.preventDefault(); scrollToSection('performers'); }}>Top Performers</a>
        <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}>Pricing</a>
      </div>

      {/* ━━━━━━━━━━━━ Hero Banner ━━━━━━━━━━━━ */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Star size={14} /> #1 Indoor Cricket Platform in the City
          </div>

          <h1 className="hero-title">
            Elevate Your <span>Cricket Game</span> to the Next Level
          </h1>

          <p className="hero-subtitle">
            Professional bowling machines, premium ground nets, competitive tournaments, 
            and a thriving cricket community — all under one roof.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="btn-hero-primary">
              Register Now <ArrowRight size={18} />
            </Link>
            <a href="#features" className="btn-hero-secondary" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>
              Explore Features
            </a>
          </div>

          <div className="hero-stats-row">
            <div className="hero-stat">
              <div className="hero-stat-value">500+</div>
              <div className="hero-stat-label">Active Players</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">₹75,000+</div>
              <div className="hero-stat-label">Prize Pools</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">3</div>
              <div className="hero-stat-label">Bowling Machines</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">24/7</div>
              <div className="hero-stat-label">Practice Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━ Blinking Offer Ticker ━━━━━━━━━━━━ */}
      <div className="offer-ticker">
        <div className="offer-ticker-inner">
          <span className="offer-ticker-text">
            🔥 LIMITED TIME OFFER: Flat 20% OFF your first booking!
          </span>
          <span className="offer-ticker-divider"></span>
          <span className="offer-ticker-text">
            🏏 Register now & start practicing today!
          </span>
          <span className="offer-ticker-divider"></span>
          <span className="offer-ticker-text">
            💰 Win up to ₹50,000 in our T20 Championship!
          </span>
        </div>
      </div>

      {/* ━━━━━━━━━━━━ Features Section ━━━━━━━━━━━━ */}
      <section className="landing-section" id="features">
        <div className="section-header">
          <div className="section-badge"><Zap size={14} /> Why Choose Us</div>
          <h2 className="section-title">Everything You Need to Train Like a Pro</h2>
          <p className="section-subtitle">
            State-of-the-art facilities, professional coaching support, and a competitive environment.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon green">
              <Target size={28} />
            </div>
            <h3 className="feature-title">Bowling Machines</h3>
            <p className="feature-desc">
              Standard, premium & fast machines with speed control, spin variations, and programmable sequences.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon blue">
              <Users size={28} />
            </div>
            <h3 className="feature-title">Ground Practice</h3>
            <p className="feature-desc">
              Individual to full-team net practice with floodlights, professional turf, and protective enclosures.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon amber">
              <TrendingUp size={28} />
            </div>
            <h3 className="feature-title">Rankings & Leaderboard</h3>
            <p className="feature-desc">
              Track your progress, compete with others, and climb the practice leaderboard to become #1.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon purple">
              <Trophy size={28} />
            </div>
            <h3 className="feature-title">Tournaments</h3>
            <p className="feature-desc">
              Compete in T20 championships and weekend leagues with massive prize pools up to ₹50,000.
            </p>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━ Tournament Earnings Showcase ━━━━━━━━━━━━ */}
      <div className="tournament-section" id="tournaments">
        <div className="landing-section">
          <div className="section-header">
            <div className="section-badge"><Trophy size={14} /> Win Big</div>
            <h2 className="section-title">Compete & Earn Real Prize Money 💰</h2>
            <p className="section-subtitle">
              Top performers win massive cash prizes. Register your team and compete in our high-stakes tournaments.
            </p>
          </div>

          <div className="tournament-grid">
            {tournaments.map((t, i) => (
              <div className="tournament-card" key={i}>
                <div className="tournament-card-banner">
                  <span className="tournament-trophy">{t.emoji}</span>
                </div>
                <div className="tournament-card-body">
                  <div className="prize-badge" style={{ marginBottom: '0.75rem' }}>
                    🏆 Prize Pool
                  </div>
                  <div className="prize-amount">₹{t.prizePool}</div>
                  <h3 className="tournament-name" style={{ marginTop: '1rem' }}>{t.name}</h3>
                  <p className="tournament-desc">{t.description}</p>

                  <div className="tournament-meta">
                    <div className="tournament-meta-row">
                      <span className="tournament-meta-label">Entry Fee</span>
                      <span className="tournament-meta-value" style={{ color: 'var(--primary)' }}>₹{t.entryFee}</span>
                    </div>
                    <div className="tournament-meta-row">
                      <span className="tournament-meta-label">Format</span>
                      <span className="tournament-meta-value">{t.format}</span>
                    </div>
                    <div className="tournament-meta-row">
                      <span className="tournament-meta-label">Teams Registered</span>
                      <span className="tournament-meta-value">{t.teams}</span>
                    </div>
                  </div>

                  <Link to="/register" className="btn btn-primary btn-full">
                    Register Your Team <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━ Top Performers Section ━━━━━━━━━━━━ */}
      <section className="landing-section" id="performers">
        <div className="section-header">
          <div className="section-badge"><Star size={14} /> Leaderboard</div>
          <h2 className="section-title">Top Performers of the Month</h2>
          <p className="section-subtitle">
            Our most dedicated players ranked by total overs practiced. Train hard, climb the ranks!
          </p>
        </div>

        <div className="performers-grid">
          {topPerformers.map((p) => (
            <div className={`performer-card ${p.tier}`} key={p.rank}>
              <div className="performer-medal">{p.medal}</div>
              <div className={`performer-rank ${p.tier}-bg`}>#{p.rank}</div>
              <h3 className="performer-name">{p.name}</h3>

              <div className="performer-stats">
                <div className="performer-stat-item">
                  <div className="performer-stat-value">{p.overs}</div>
                  <div className="performer-stat-label">Overs</div>
                </div>
                <div className="performer-stat-item">
                  <div className="performer-stat-value">{p.sessions}</div>
                  <div className="performer-stat-label">Sessions</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━━━━━━━━━━ Pricing Preview Section ━━━━━━━━━━━━ */}
      <section className="landing-section" id="pricing">
        <div className="section-header">
          <div className="section-badge"><Zap size={14} /> Transparent Pricing</div>
          <h2 className="section-title">Bowling Machine Rates</h2>
          <p className="section-subtitle">
            Choose the perfect plan for your practice sessions. No hidden fees, no surprises.
          </p>
        </div>

        <div className="pricing-grid">
          {pricingPlans.map((plan, i) => (
            <div className={`pricing-card ${plan.featured ? 'featured' : ''}`} key={i}>
              <h3 className="pricing-name">{plan.name}</h3>
              <p className="pricing-desc">{plan.desc}</p>

              <div className="pricing-amount">
                <span className="pricing-currency">₹</span>
                <span className="pricing-value">{plan.price}</span>
              </div>
              <div className="pricing-unit">per over</div>
              <div className="pricing-session-info">
                Session: ₹{plan.session} / {plan.duration}
              </div>

              <ul className="pricing-features">
                {plan.features.map((f, j) => (
                  <li key={j}>
                    <span className="check-icon"><Check size={12} /></span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className={`btn-pricing ${plan.featured ? 'btn-pricing-primary' : 'btn-pricing-outline'}`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━━━━━━━━━━ Registration CTA Banner ━━━━━━━━━━━━ */}
      <section className="cta-section">
        <div className="cta-banner">
          <div className="cta-content">
            <h2 className="cta-title">Join 500+ Cricketers at Asha Indoor</h2>
            <p className="cta-subtitle">
              Start practicing with professional machines, compete in tournaments, and track your progress.
            </p>
            <Link to="/register" className="cta-register-btn">
              Register for Free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━ Footer ━━━━━━━━━━━━ */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>🏏 Asha Indoor Cricket</h3>
            <p>
              Premium indoor cricket facilities with professional bowling machines, net practice grounds,
              and competitive tournaments for all skill levels.
            </p>
          </div>

          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Features</a></li>
              <li><a href="#tournaments" onClick={(e) => { e.preventDefault(); scrollToSection('tournaments'); }}>Tournaments</a></li>
              <li><a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}>Pricing</a></li>
              <li><Link to="/register">Register</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Facilities</h4>
            <ul>
              <li><a href="#">Bowling Machines</a></li>
              <li><a href="#">Ground Practice</a></li>
              <li><a href="#">Team Coaching</a></li>
              <li><a href="#">Cricket Shop</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Contact</h4>
            <ul>
              <li>
                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={14} /> Asha Indoor, City Center
                </a>
              </li>
              <li>
                <a href="tel:+919876543210" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={14} /> +91 98765 43210
                </a>
              </li>
              <li>
                <a href="mailto:info@ashaindoor.com" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={14} /> info@ashaindoor.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} Asha Indoor Cricket. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
