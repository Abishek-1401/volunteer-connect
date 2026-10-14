import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Building2, Calendar, ArrowRight } from 'lucide-react';

const VolunteerCard = ({ user }) => {
  const isWorker = user.role === 'worker';

  return (
    <div className="card card-hover" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      position: 'relative',
      padding: '20px'
    }}>
      <div>
        {/* Top Header: Role badge & Hours */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px'
        }}>
          <span className={`badge ${isWorker ? 'badge-worker' : 'badge-teal'}`}>
            {isWorker ? 'Social Worker' : 'Volunteer'}
          </span>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: 'var(--color-accent)',
            backgroundColor: 'var(--color-accent-light)',
            padding: '3px 8px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--color-accent-border)'
          }}>
            <Clock size={13} />
            <span>{user.totalHours || 0} hrs</span>
          </div>
        </div>

        {/* User Info */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '14px' }}>
          <img
            src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=0F766E`}
            alt={user.name}
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid var(--color-primary-light)'
            }}
          />
          <div style={{ overflow: 'hidden' }}>
            <h3 style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              color: 'var(--color-text)',
              marginBottom: '2px',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden'
            }}>
              {user.name}
            </h3>

            {isWorker ? (
              <div style={{
                fontSize: '0.8125rem',
                color: 'var(--color-text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden'
              }}>
                <Building2 size={13} style={{ flexShrink: 0 }} />
                <span>{user.designation || 'Coordinator'} • {user.organization || 'NGO'}</span>
              </div>
            ) : (
              <div style={{
                fontSize: '0.8125rem',
                color: 'var(--color-text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Calendar size={13} />
                <span>Available: {user.availability || 'Flexible'}</span>
              </div>
            )}

            <div style={{
              fontSize: '0.8125rem',
              color: 'var(--color-text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '2px'
            }}>
              <MapPin size={13} />
              <span>{user.location}</span>
            </div>
          </div>
        </div>

        {/* Bio snippet */}
        {user.bio ? (
          <p style={{
            fontSize: '0.875rem',
            color: 'var(--color-text-secondary)',
            marginBottom: '16px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.5
          }}>
            {user.bio}
          </p>
        ) : (
          <p style={{
            fontSize: '0.8125rem',
            fontStyle: 'italic',
            color: 'var(--color-text-muted)',
            marginBottom: '16px'
          }}>
            Passionate about making a positive community difference.
          </p>
        )}

        {/* Causes Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
          {user.causes && user.causes.slice(0, 3).map((cause, i) => (
            <span key={i} className="badge badge-gray" style={{ fontSize: '0.7rem' }}>
              {cause}
            </span>
          ))}
          {user.causes && user.causes.length > 3 && (
            <span className="badge badge-gray" style={{ fontSize: '0.7rem' }}>
              +{user.causes.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <Link
        to={`/profile/${user._id}`}
        className="btn btn-outline-primary btn-sm btn-full"
        style={{ marginTop: 'auto', gap: '6px' }}
      >
        <span>View Impact Portfolio</span>
        <ArrowRight size={14} />
      </Link>
    </div>
  );
};

export default VolunteerCard;
