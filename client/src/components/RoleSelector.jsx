import React from 'react';
import { UserCheck, Building2, CheckCircle2 } from 'lucide-react';

const RoleSelector = ({ selectedRole, onSelectRole }) => {
  return (
    <div className="role-cards-grid">
      {/* Volunteer Card */}
      <div
        className={`role-card-option ${selectedRole === 'volunteer' ? 'selected' : ''}`}
        onClick={() => onSelectRole('volunteer')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectRole('volunteer'); }}
      >
        <div className="role-card-header">
          <div className="role-icon-box" style={{
            backgroundColor: selectedRole === 'volunteer' ? 'var(--color-primary)' : 'var(--color-primary-light)',
            color: selectedRole === 'volunteer' ? '#FFFFFF' : 'var(--color-primary)'
          }}>
            <UserCheck size={24} />
          </div>
          {selectedRole === 'volunteer' && (
            <CheckCircle2 size={22} color="var(--color-primary)" fill="var(--color-primary-light)" />
          )}
        </div>
        <div className="role-card-title">Volunteer</div>
        <div className="role-card-desc">
          I want to volunteer my time, document my service hours, build an impact portfolio, and discover meaningful causes.
        </div>
      </div>

      {/* Social Service Worker Card */}
      <div
        className={`role-card-option ${selectedRole === 'worker' ? 'selected' : ''}`}
        onClick={() => onSelectRole('worker')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectRole('worker'); }}
      >
        <div className="role-card-header">
          <div className="role-icon-box" style={{
            backgroundColor: selectedRole === 'worker' ? 'var(--color-primary)' : 'var(--color-primary-light)',
            color: selectedRole === 'worker' ? '#FFFFFF' : 'var(--color-primary)'
          }}>
            <Building2 size={24} />
          </div>
          {selectedRole === 'worker' && (
            <CheckCircle2 size={22} color="var(--color-primary)" fill="var(--color-primary-light)" />
          )}
        </div>
        <div className="role-card-title">Social Service Worker</div>
        <div className="role-card-desc">
          I represent an NGO, charity, or community initiative. I coordinate projects, guide volunteers, and share impact stories.
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
