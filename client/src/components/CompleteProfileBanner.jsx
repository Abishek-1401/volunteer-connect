import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CompleteProfileBanner = () => {
  const { user, newSignupPrompt, dismissNewSignupPrompt } = useAuth();

  if (!user) return null;

  // Check if profile is incomplete (no bio, or no skills, or new signup)
  const isIncomplete = !user.bio || (user.skills && user.skills.length === 0) || newSignupPrompt;

  if (!isIncomplete) return null;

  return (
    <div style={{
      backgroundColor: 'var(--color-primary-light)',
      border: '1px solid var(--color-primary-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '16px 20px',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      flexWrap: 'wrap'
    }} className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-primary)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Sparkles size={18} color="#FDBA74" />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-primary)' }}>
            Complete your impact portfolio, {user?.name || 'Friend'}!
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
            Add a brief bio, showcase your skills, and log your volunteer hours to stand out on the Explore page.
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Link
          to={`/profile/${user._id}`}
          className="btn btn-primary btn-sm"
          style={{ gap: '6px' }}
        >
          View Portfolio <ArrowRight size={14} />
        </Link>
        <Link
          to="/settings"
          className="btn btn-outline btn-sm"
        >
          Edit Profile
        </Link>
        <button
          onClick={dismissNewSignupPrompt}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-text-secondary)',
            padding: '4px'
          }}
          title="Dismiss"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default CompleteProfileBanner;
