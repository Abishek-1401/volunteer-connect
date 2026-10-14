import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [devCode, setDevCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your registered email address.');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await api.post('/auth/forgot-password', { email: email.trim() });
      setMessage(res.data.message || 'Password reset instructions have been generated.');
      if (res.data.devResetCode) {
        setDevCode(res.data.devResetCode);
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.response?.data?.message || 'Error processing request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      padding: '40px 20px 80px 20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 180px)'
    }}>
      <div className="card" style={{
        maxWidth: '460px',
        width: '100%',
        padding: '36px',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px'
          }}>
            <Mail size={22} />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '6px' }}>
            Forgot Password?
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
            Enter your email and we'll generate a reset verification code.
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'var(--color-error-bg)',
            color: 'var(--color-error)',
            padding: '12px 14px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '18px',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div style={{
            backgroundColor: 'var(--color-success-bg)',
            color: 'var(--color-success)',
            border: '1px solid #BBF7D0',
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            fontSize: '0.875rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
              <CheckCircle2 size={18} />
              <span>{message}</span>
            </div>
            {devCode && (
              <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #86EFAC' }}>
                <span style={{ fontSize: '0.8125rem' }}>Your reset code: </span>
                <strong style={{ fontSize: '1.1rem', letterSpacing: '0.1em', color: '#14532D' }}>{devCode}</strong>
              </div>
            )}
            <button
              type="button"
              onClick={() => navigate('/reset-password', { state: { email, code: devCode } })}
              className="btn btn-primary btn-sm btn-full"
              style={{ marginTop: '12px' }}
            >
              Continue to Reset Password Form <ArrowRight size={14} />
            </button>
          </div>
        )}

        {!devCode && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="forgot-email">
                <span>Email Address</span>
              </label>
              <input
                id="forgot-email"
                type="email"
                placeholder="name@example.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary btn-full"
              style={{ marginTop: '10px', padding: '12px' }}
            >
              {isLoading ? 'Generating code...' : 'Send Reset Code'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link to="/login" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.875rem',
            color: 'var(--color-text-secondary)'
          }}>
            <ArrowLeft size={16} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
