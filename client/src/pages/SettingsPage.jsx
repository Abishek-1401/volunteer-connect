import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Lock, 
  LogOut, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Camera, 
  ShieldAlert,
  Plus,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CAUSES_LIST, SUGGESTED_SKILLS, AVAILABILITY_OPTIONS } from '../constants';
import api from '../services/api';

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80'
];

const SettingsPage = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'password'

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    banner: user?.banner || '',
    location: user?.location || '',
    causes: user?.causes || [],
    skills: user?.skills || [],
    availability: user?.availability || 'Flexible',
    organization: user?.organization || '',
    designation: user?.designation || '',
    website: user?.website || ''
  });

  const [newSkillInput, setNewSkillInput] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const isWorker = user?.role === 'worker';

  // Toggle Cause
  const handleToggleCause = (cause) => {
    setProfileForm(prev => {
      const exists = prev.causes.includes(cause);
      return {
        ...prev,
        causes: exists ? prev.causes.filter(c => c !== cause) : [...prev.causes, cause]
      };
    });
  };

  // Add Skill
  const handleAddSkill = (skill) => {
    const trimmed = skill.trim();
    if (!trimmed || profileForm.skills.includes(trimmed)) return;
    setProfileForm(prev => ({
      ...prev,
      skills: [...prev.skills, trimmed]
    }));
    setNewSkillInput('');
  };

  // Remove Skill
  const handleRemoveSkill = (skillToRemove) => {
    setProfileForm(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  // Submit Profile Form
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSuccess('');
    setProfileError('');

    try {
      const res = await api.put('/users/profile', profileForm);
      updateUser(res.data.user);
      setProfileSuccess('Profile details updated successfully!');
      setTimeout(() => setProfileSuccess(''), 4000);
    } catch (err) {
      console.error('Update profile error:', err);
      setProfileError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Submit Password Form
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setIsSavingPassword(true);
    try {
      const res = await api.put('/users/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordSuccess(res.data.message || 'Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordSuccess(''), 4000);
    } catch (err) {
      console.error('Change password error:', err);
      setPasswordError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ padding: '40px 20px 80px 20px' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '8px' }}>
          Account Settings
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '28px' }}>
          Manage your portfolio details, role attributes, and security.
        </p>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '12px',
          borderBottom: '1px solid var(--color-border)',
          marginBottom: '28px'
        }}>
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              padding: '12px 18px',
              border: 'none',
              background: 'none',
              fontWeight: 700,
              fontSize: '0.9375rem',
              cursor: 'pointer',
              color: activeTab === 'profile' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              borderBottom: activeTab === 'profile' ? '3px solid var(--color-primary)' : '3px solid transparent'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} /> Edit Profile & Portfolio
            </span>
          </button>

          <button
            onClick={() => setActiveTab('password')}
            style={{
              padding: '12px 18px',
              border: 'none',
              background: 'none',
              fontWeight: 700,
              fontSize: '0.9375rem',
              cursor: 'pointer',
              color: activeTab === 'password' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              borderBottom: activeTab === 'password' ? '3px solid var(--color-primary)' : '3px solid transparent'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={18} /> Password & Security
            </span>
          </button>
        </div>

        {/* TAB 1: EDIT PROFILE */}
        {activeTab === 'profile' && (
          <div className="card fade-in" style={{ padding: '32px' }}>
            {profileSuccess && (
              <div style={{
                backgroundColor: 'var(--color-success-bg)',
                color: 'var(--color-success)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.875rem'
              }}>
                <CheckCircle2 size={18} />
                <span>{profileSuccess}</span>
              </div>
            )}

            {profileError && (
              <div style={{
                backgroundColor: 'var(--color-error-bg)',
                color: 'var(--color-error)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.875rem'
              }}>
                <AlertCircle size={18} />
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit}>
              {/* Photo & Sample Avatars */}
              <div className="form-group">
                <label className="form-label">
                  <span>Profile Photo URL</span>
                </label>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '10px' }}>
                  <img
                    src={profileForm.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'User')}`}
                    alt="Preview"
                    style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-border)' }}
                  />
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={profileForm.avatar}
                    onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Or pick avatar:</span>
                  {SAMPLE_AVATARS.map((av, idx) => (
                    <img
                      key={idx}
                      src={av}
                      alt={`Preset ${idx}`}
                      onClick={() => setProfileForm({ ...profileForm, avatar: av })}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        border: profileForm.avatar === av ? '2px solid var(--color-primary)' : '1px solid var(--color-border)'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Name & Location */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Location (City)</label>
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="form-group">
                <label className="form-label">
                  <span>Bio & Mission Statement</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Share a short bio about what drives your service and what projects you want to contribute to..."
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="form-textarea"
                />
              </div>

              {/* Worker Specific Fields */}
              {isWorker && (
                <div style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '18px',
                  border: '1px solid var(--color-border)'
                }}>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '12px', color: 'var(--color-primary)' }}>
                    Social Service Organization Information
                  </div>
                  <div className="modal-form-row">
                    <div className="form-group">
                      <label className="form-label">Organization Name</label>
                      <input
                        type="text"
                        value={profileForm.organization}
                        onChange={(e) => setProfileForm({ ...profileForm, organization: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Your Role / Designation</label>
                      <input
                        type="text"
                        value={profileForm.designation}
                        onChange={(e) => setProfileForm({ ...profileForm, designation: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Website / Social URL</label>
                    <input
                      type="url"
                      value={profileForm.website}
                      onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>
              )}

              {/* Volunteer Availability */}
              {!isWorker && (
                <div className="form-group">
                  <label className="form-label">Availability</label>
                  <select
                    value={profileForm.availability}
                    onChange={(e) => setProfileForm({ ...profileForm, availability: e.target.value })}
                    className="form-select"
                  >
                    {AVAILABILITY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Causes Multi-Select */}
              <div className="form-group">
                <label className="form-label">
                  <span>{isWorker ? 'Organization Focus Areas' : 'Causes You Care About'}</span>
                </label>
                <div className="tags-selectable-grid">
                  {CAUSES_LIST.map((cause) => {
                    const isSelected = profileForm.causes.includes(cause);
                    return (
                      <button
                        key={cause}
                        type="button"
                        onClick={() => handleToggleCause(cause)}
                        className={`tag-selectable ${isSelected ? 'selected' : ''}`}
                      >
                        {isSelected ? '✓ ' : '+ '} {cause}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Skills Section */}
              <div className="form-group">
                <label className="form-label">
                  <span>Skills & Core Competencies</span>
                  <span className="form-label-optional">Type and press Add or pick suggestions</span>
                </label>

                {/* Selected Skills Chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                  {profileForm.skills.map((skill, i) => (
                    <span key={i} className="badge badge-teal" style={{ padding: '5px 10px', fontSize: '0.8125rem' }}>
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', marginLeft: '4px' }}
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Add custom skill (e.g. Graphic Design, First Aid, Cooking)..."
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill(newSkillInput);
                      }
                    }}
                    className="form-input"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill(newSkillInput)}
                    className="btn btn-outline"
                    style={{ gap: '4px' }}
                  >
                    <Plus size={16} /> Add
                  </button>
                </div>

                {/* Suggested skills pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                  {SUGGESTED_SKILLS.filter(s => !profileForm.skills.includes(s)).slice(0, 6).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleAddSkill(s)}
                      className="tag-selectable"
                      style={{ fontSize: '0.75rem', padding: '3px 10px' }}
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="btn btn-primary btn-lg"
                  style={{ gap: '8px' }}
                >
                  <Save size={18} />
                  <span>{isSavingProfile ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: CHANGE PASSWORD */}
        {activeTab === 'password' && (
          <div className="card fade-in" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>
              Change Password
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '24px' }}>
              Ensure your account is protected with a secure password containing at least 8 characters.
            </p>

            {passwordSuccess && (
              <div style={{
                backgroundColor: 'var(--color-success-bg)',
                color: 'var(--color-success)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.875rem'
              }}>
                <CheckCircle2 size={18} />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div style={{
                backgroundColor: 'var(--color-error-bg)',
                color: 'var(--color-error)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.875rem'
              }}>
                <AlertCircle size={18} />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password (min. 8 characters)</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSavingPassword}
                className="btn btn-primary"
                style={{ marginTop: '10px' }}
              >
                {isSavingPassword ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          </div>
        )}

        {/* Danger Zone: Log Out */}
        <div style={{
          marginTop: '36px',
          padding: '24px',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--color-card)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text)' }}>
              Sign Out of Your Account
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
              You will need to log back in to manage your volunteer portfolio.
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-outline"
            style={{ color: 'var(--color-error)', borderColor: '#FCA5A5', gap: '6px' }}
          >
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
