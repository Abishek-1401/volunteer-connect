import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Building2, 
  Globe, 
  Calendar, 
  Clock, 
  Award, 
  Plus, 
  Edit3, 
  Trash2, 
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AddActivityModal from '../components/AddActivityModal';
import api from '../services/api';

const ProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  const isOwnProfile = currentUser && currentUser._id === id;

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/users/${id}`);
      setProfileUser(res.data.user);
      setActivities(res.data.activities || []);
    } catch (err) {
      console.error('Fetch profile error:', err);
      setError('Could not load volunteer profile.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);

  const handleActivitySaved = (savedActivity, updatedTotalHours) => {
    if (editingActivity) {
      setActivities(prev => prev.map(a => a._id === savedActivity._id ? savedActivity : a));
    } else {
      setActivities(prev => [savedActivity, ...prev]);
    }

    if (profileUser) {
      setProfileUser(prev => ({ ...prev, totalHours: updatedTotalHours }));
    }
    setEditingActivity(null);
  };

  const handleDeleteActivity = async (activityId) => {
    if (!window.confirm('Are you sure you want to remove this activity from your portfolio?')) return;

    try {
      const res = await api.delete(`/activities/${activityId}`);
      setActivities(prev => prev.filter(a => a._id !== activityId));
      if (profileUser) {
        setProfileUser(prev => ({ ...prev, totalHours: res.data.totalHours }));
      }
    } catch (err) {
      console.error('Delete activity error:', err);
      alert('Failed to delete activity.');
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', color: 'var(--color-text-secondary)' }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>Loading impact portfolio...</div>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '12px' }}>Profile Not Found</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
          {error || 'This user does not exist or may have been deleted.'}
        </p>
        <Link to="/explore" className="btn btn-primary">
          Explore Volunteers Directory
        </Link>
      </div>
    );
  }

  const isWorker = profileUser.role === 'worker';

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* Profile Banner */}
      <div style={{
        height: '220px',
        width: '100%',
        backgroundColor: '#0F766E',
        backgroundImage: profileUser.banner
          ? `url(${profileUser.banner})`
          : 'linear-gradient(135deg, #0F766E 0%, #115E59 50%, #042F2E 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }} />

      <div className="container" style={{ position: 'relative', marginTop: '-70px' }}>
        {/* Profile Header Card */}
        <div className="card" style={{ padding: '30px', marginBottom: '30px' }}>
          <div className="profile-header-flex">
            {/* Left: Avatar & Identity */}
            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <img
                src={profileUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profileUser.name)}&backgroundColor=0F766E`}
                alt={profileUser.name}
                style={{
                  width: '110px',
                  height: '110px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid var(--color-surface)',
                  boxShadow: 'var(--shadow-md)',
                  backgroundColor: 'var(--color-surface)'
                }}
              />

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
                    {profileUser.name}
                  </h1>
                  <span className={`badge ${isWorker ? 'badge-worker' : 'badge-teal'}`} style={{ fontSize: '0.8125rem' }}>
                    {isWorker ? 'Social Service Worker' : 'Volunteer'}
                  </span>
                </div>

                {isWorker ? (
                  <div style={{
                    fontSize: '0.9375rem',
                    color: 'var(--color-text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '6px'
                  }}>
                    <Building2 size={16} />
                    <strong>{profileUser.designation || 'Leader'}</strong> at <span>{profileUser.organization || 'NGO'}</span>
                  </div>
                ) : (
                  <div style={{
                    fontSize: '0.9375rem',
                    color: 'var(--color-text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '6px'
                  }}>
                    <Calendar size={16} />
                    <span>Availability: <strong>{profileUser.availability || 'Flexible'}</strong></span>
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)',
                  flexWrap: 'wrap'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={15} /> {profileUser.location}
                  </span>

                  {profileUser.website && (
                    <a
                      href={profileUser.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Globe size={15} /> Website <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Featured Total Hours Counter & Actions */}
            <div className="profile-actions-wrapper">
              {/* Highlighted Total Hours Counter */}
              <div style={{
                background: 'radial-gradient(circle at top right, var(--color-accent-light) 0%, var(--color-card) 75%)',
                border: '2px solid var(--color-accent-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '14px 22px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: 'var(--color-accent)',
                  lineHeight: 1
                }}>
                  {profileUser.totalHours || 0}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--color-text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginTop: '4px'
                }}>
                  Total Verified Hours
                </div>
              </div>

              {isOwnProfile && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <Link to="/settings" className="btn btn-outline btn-sm">
                    <Edit3 size={15} /> Edit Profile
                  </Link>
                  <button
                    onClick={() => {
                      setEditingActivity(null);
                      setIsActivityModalOpen(true);
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ gap: '6px' }}
                  >
                    <Plus size={16} /> Log Activity
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          {profileUser.bio && (
            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--color-border)' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                About
              </h3>
              <p style={{ color: 'var(--color-text)', lineHeight: 1.6, fontSize: '0.9375rem' }}>
                {profileUser.bio}
              </p>
            </div>
          )}

          {/* Causes & Skills Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '1px solid var(--color-border)'
          }}>
            {/* Causes / Focus Areas */}
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                {isWorker ? 'Focus Areas' : 'Causes Supported'}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {profileUser.causes && profileUser.causes.length > 0 ? (
                  profileUser.causes.map((c, i) => (
                    <span key={i} className="badge badge-teal">
                      {c}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>None specified</span>
                )}
              </div>
            </div>

            {/* Skills */}
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Skills & Talents
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {profileUser.skills && profileUser.skills.length > 0 ? (
                  profileUser.skills.map((s, i) => (
                    <span key={i} className="badge badge-gray">
                      {s}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>No skills listed yet</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Volunteer Activities Section (The Impact Portfolio) */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '18px'
          }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text)' }}>
                Volunteer Activities Portfolio
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                Documented community service records, project hours, and verified outcomes.
              </p>
            </div>

            {isOwnProfile && (
              <button
                onClick={() => {
                  setEditingActivity(null);
                  setIsActivityModalOpen(true);
                }}
                className="btn btn-primary btn-sm"
                style={{ gap: '6px' }}
              >
                <Plus size={16} /> Add Activity
              </button>
            )}
          </div>

          {/* Activities List */}
          {activities.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '50px 20px' }}>
              <Clock size={40} color="var(--color-text-muted)" style={{ margin: '0 auto 12px auto' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>
                No volunteer activities logged yet
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', maxWidth: '440px', margin: '0 auto 18px auto', fontSize: '0.875rem' }}>
                {isOwnProfile
                  ? 'Start building your portfolio by recording your volunteer shifts, events, and community projects.'
                  : 'This member has not yet published any volunteer activities.'}
              </p>
              {isOwnProfile && (
                <button
                  onClick={() => {
                    setEditingActivity(null);
                    setIsActivityModalOpen(true);
                  }}
                  className="btn btn-primary"
                >
                  Log Your First Activity
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activities.map((act) => (
                <div key={act._id} className="card card-hover" style={{ padding: '22px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '10px',
                    marginBottom: '10px'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                          {act.title}
                        </h3>
                        {act.cause && (
                          <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>
                            {act.cause}
                          </span>
                        )}
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        fontSize: '0.8125rem',
                        color: 'var(--color-text-secondary)',
                        marginTop: '4px'
                      }}>
                        <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>
                          {act.organization}
                        </span>
                        <span>• Date: {act.date}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {/* Hours Badge (Warm Orange 10% Accent) */}
                      <div style={{
                        backgroundColor: 'var(--color-accent-light)',
                        border: '1px solid var(--color-accent-border)',
                        color: 'var(--color-accent)',
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontWeight: 800,
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Clock size={14} />
                        <span>{act.hours} hrs</span>
                      </div>

                      {isOwnProfile && (
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={() => {
                              setEditingActivity(act);
                              setIsActivityModalOpen(true);
                            }}
                            className="btn btn-ghost btn-sm"
                            style={{ padding: '6px' }}
                            title="Edit activity"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteActivity(act._id)}
                            className="btn btn-ghost btn-sm"
                            style={{ padding: '6px', color: 'var(--color-error)' }}
                            title="Delete activity"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-line'
                  }}>
                    {act.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Activity Modal */}
      <AddActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => {
          setIsActivityModalOpen(false);
          setEditingActivity(null);
        }}
        onActivitySaved={handleActivitySaved}
        editingActivity={editingActivity}
      />
    </div>
  );
};

export default ProfilePage;
