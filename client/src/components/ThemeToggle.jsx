import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ showLabel = false, className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`theme-toggle-btn ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: showLabel ? '8px 14px' : '8px',
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        color: 'var(--color-text)',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
        userSelect: 'none'
      }}
    >
      <div style={{
        position: 'relative',
        width: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {isDark ? (
          <Sun size={18} color="#FBBF24" style={{ transition: 'transform 200ms ease', transform: 'rotate(0deg)' }} />
        ) : (
          <Moon size={18} color="#6366F1" style={{ transition: 'transform 200ms ease', transform: 'rotate(0deg)' }} />
        )}
      </div>

      {showLabel && (
        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
