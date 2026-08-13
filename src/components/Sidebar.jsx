import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Trophy,
  TrendingUp,
  DollarSign,
  Shirt,
  Image as ImageIcon,
  Users,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Bookings', href: '/dashboard/bookings', icon: Calendar },
  { name: 'Rankings', href: '/dashboard/rankings', icon: TrendingUp },
  { name: 'Tournaments', href: '/dashboard/tournaments', icon: Trophy },
  { name: 'Pricing', href: '/dashboard/pricing', icon: DollarSign },
  { name: 'Shop', href: '/dashboard/shop', icon: Shirt },
  { name: 'Media', href: '/dashboard/media', icon: ImageIcon },
];

const adminNavigation = [
  { name: 'Admin Panel', href: '/dashboard/admin', icon: Users },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const allNavItems = user?.role === 'admin'
    ? [...navigation, ...adminNavigation]
    : navigation;

  return (
    <>
      {/* Mobile Hamburger Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mobile-toggle"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop overlay for mobile drawer */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/dashboard" className="sidebar-brand" onClick={() => setIsOpen(false)}>
            <div className="sidebar-logo-icon">
              <Trophy size={24} />
            </div>
            <div>
              <h1 className="sidebar-title">Asha Indoor</h1>
              <p className="sidebar-subtitle">Cricket Practice</p>
            </div>
          </Link>
        </div>

        <nav className="sidebar-nav">
          {allNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href || (item.href !== '/dashboard' && location.pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button onClick={() => { setIsOpen(false); logout(); }} className="nav-link btn-full">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
