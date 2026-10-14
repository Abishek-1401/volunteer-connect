import React from 'react';
import { Heart, Globe, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#FFFFFF',
      borderTop: '1px solid var(--color-border)',
      padding: '40px 0 24px 0',
      marginTop: 'auto'
    }}>
      <div className="container" style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '30px',
        marginBottom: '30px'
      }}>
        {/* Brand info */}
        <div style={{ maxWidth: '360px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 800,
            fontSize: '1.2rem',
            color: 'var(--color-text)',
            marginBottom: '12px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <Heart size={18} fill="#F97316" color="#F97316" />
            </div>
            <span>Volunteer<span style={{ color: 'var(--color-primary)' }}>Connect</span></span>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
            The dedicated platform empowering volunteers and social service workers to document impact, showcase volunteer portfolios, and ignite social change together.
          </p>
        </div>

        {/* Quick links */}
        <div style={{ display: 'flex', gap: '50px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '12px' }}>
              Platform
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem' }}>
              <Link to="/explore" style={{ color: 'var(--color-text-secondary)' }}>Explore Volunteers</Link>
              <Link to="/stories" style={{ color: 'var(--color-text-secondary)' }}>Inspire Impact Feed</Link>
              <Link to="/signup" style={{ color: 'var(--color-text-secondary)' }}>Join as Volunteer</Link>
              <Link to="/signup" style={{ color: 'var(--color-text-secondary)' }}>Join as NGO / Worker</Link>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '12px' }}>
              Values & Community
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={14} color="var(--color-primary)" /> Privacy-First Architecture
              </span>
              <span style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} color="var(--color-accent)" /> Verified Impact Tracking
              </span>
              <span style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Globe size={14} color="var(--color-primary)" /> Grassroots Initiatives
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{
        borderTop: '1px solid var(--color-border)',
        paddingTop: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
        fontSize: '0.8125rem',
        color: 'var(--color-text-secondary)'
      }}>
        <div>
          © {new Date().getFullYear()} VolunteerConnect Platform. Empowering community changemakers.
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>Terms & Privacy Policy</span>
          <span>Community Guidelines</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
