import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Heart, 
  Compass, 
  Home, 
  Sparkles, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  PlusCircle,
  Briefcase
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid var(--color-border)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px'
      }}>
        {/* Brand Logo */}
        <Link to={isAuthenticated ? '/home' : '/'} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 800,
          fontSize: '1.25rem',
          color: 'var(--color-text)',
          letterSpacing: '-0.02em'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 4px 10px rgba(15, 118, 110, 0.25)'
          }}>
            <Heart size={22} fill="#F97316" color="#F97316" />
          </div>
          <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            Volunteer<span style={{ color: 'var(--color-primary)' }}>Connect</span>
          </span>
        </Link>

        {/* Center Nav Links (Desktop) */}
        <div style={{
          display: 'none',
          gap: '8px',
          alignItems: 'center'
        }} className="desktop-nav-links">
          {isAuthenticated && (
            <NavLink
              to="/home"
              className={({ isActive }) => `btn btn-ghost btn-sm ${isActive ? 'active-nav-link' : ''}`}
              style={({ isActive }) => ({
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                fontWeight: isActive ? 700 : 500,
                backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent'
              })}
            >
              <Home size={18} />
              Home Feed
            </NavLink>
          )}

          <NavLink
            to="/explore"
            className={({ isActive }) => `btn btn-ghost btn-sm ${isActive ? 'active-nav-link' : ''}`}
            style={({ isActive }) => ({
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              fontWeight: isActive ? 700 : 500,
              backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent'
            })}
          >
            <Compass size={18} />
            Explore
          </NavLink>

          <NavLink
            to="/stories"
            className={({ isActive }) => `btn btn-ghost btn-sm ${isActive ? 'active-nav-link' : ''}`}
            style={({ isActive }) => ({
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              fontWeight: isActive ? 700 : 500,
              backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent'
            })}
          >
            <Sparkles size={18} color="var(--color-accent)" />
            Inspire Stories
          </NavLink>
        </div>

        {/* Right Action / Auth Buttons (Desktop) */}
        <div style={{
          display: 'none',
          alignItems: 'center',
          gap: '12px'
        }} className="desktop-nav-actions">
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'none',
                  border: '1px solid var(--color-border)',
                  padding: '5px 12px 5px 6px',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  transition: 'background-color var(--transition-fast)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <img
                  src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'User')}&backgroundColor=0F766E`}
                  alt={user?.name}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>
                    {user?.name || 'User'}
                  </div>
                  <div style={{
                    fontSize: '0.7rem',
                    color: user?.role === 'worker' ? '#2563EB' : 'var(--color-primary)',
                    fontWeight: 600,
                    textTransform: 'capitalize'
                  }}>
                    {user?.role === 'worker' ? 'Social Worker' : 'Volunteer'}
                  </div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: '210px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '6px',
                    zIndex: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px'
                  }}
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <Link
                    to={`/profile/${user?._id}`}
                    onClick={() => setUserDropdownOpen(false)}
                    className="btn btn-ghost btn-sm"
                    style={{ justifyContent: 'flex-start', width: '100%' }}
                  >
                    <User size={16} />
                    My Portfolio
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="btn btn-ghost btn-sm"
                    style={{ justifyContent: 'flex-start', width: '100%' }}
                  >
                    <Settings size={16} />
                    Settings
                  </Link>
                  <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '4px 0' }} />
                  <button
                    onClick={handleLogout}
                    className="btn btn-ghost btn-sm"
                    style={{ justifyContent: 'flex-start', width: '100%', color: 'var(--color-error)' }}
                  >
                    <LogOut size={16} />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Log In
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu hamburger toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-menu-btn"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px',
            color: 'var(--color-text)'
          }}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--color-border)',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {isAuthenticated ? (
            <>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                paddingBottom: '12px',
                borderBottom: '1px solid var(--color-border)'
              }}>
                <img
                  src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'User')}`}
                  alt={user?.name}
                  style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                />
                <div>
                  <div style={{ fontWeight: 700 }}>{user?.name || 'User'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>
                    {user?.role === 'worker' ? 'Social Service Worker' : 'Volunteer'}
                  </div>
                </div>
              </div>
              <Link to="/home" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                <Home size={18} /> Home Feed
              </Link>
              <Link to="/explore" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                <Compass size={18} /> Explore Volunteers
              </Link>
              <Link to="/stories" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                <Sparkles size={18} /> Inspire Stories
              </Link>
              <Link to={`/profile/${user?._id}`} onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                <User size={18} /> My Portfolio
              </Link>
              <Link to="/settings" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                <Settings size={18} /> Settings
              </Link>
              <button onClick={handleLogout} className="btn btn-outline" style={{ color: 'var(--color-error)', justifyContent: 'flex-start' }}>
                <LogOut size={18} /> Log Out
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link to="/explore" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                <Compass size={18} /> Explore Volunteers
              </Link>
              <Link to="/stories" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                <Sparkles size={18} /> Inspire Stories
              </Link>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-outline btn-full">
                Log In
              </Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary btn-full">
                Get Started Free
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Responsive CSS for desktop and mobile navigation */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav-links { display: flex !important; }
          .desktop-nav-actions { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 767px) {
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
