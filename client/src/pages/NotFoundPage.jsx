import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '100px 20px',
      minHeight: 'calc(100vh - 200px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{ fontSize: '5rem', fontWeight: 900, color: 'var(--color-primary)', lineHeight: 1, marginBottom: '12px' }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '12px' }}>
        Page Not Found
      </h2>
      <p style={{ color: 'var(--color-text-secondary)', maxWidth: '440px', marginBottom: '28px' }}>
        The community page or volunteer portfolio you were looking for doesn't exist or has moved.
      </p>

      <div style={{ display: 'flex', gap: '12px' }}>
        <Link to="/" className="btn btn-primary" style={{ gap: '6px' }}>
          <Home size={16} /> Return Home
        </Link>
        <Link to="/explore" className="btn btn-outline" style={{ gap: '6px' }}>
          <Compass size={16} /> Explore Directory
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
