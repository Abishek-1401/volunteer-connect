import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Sparkles, 
  Clock, 
  Users, 
  Compass, 
  PlusCircle, 
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CompleteProfileBanner from '../components/CompleteProfileBanner';
import CreatePostBox from '../components/CreatePostBox';
import PostCard from '../components/PostCard';
import { CAUSES_LIST } from '../constants';
import api from '../services/api';

const HomePage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [topVolunteers, setTopVolunteers] = useState([]);
  const [selectedCause, setSelectedCause] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch feed posts
  const fetchPosts = async (causeFilter = 'All') => {
    setIsLoading(true);
    try {
      const url = causeFilter === 'All' ? '/posts' : `/posts?cause=${encodeURIComponent(causeFilter)}`;
      const res = await api.get(url);
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error('Failed to load feed:', err);
      setError('Could not load community feed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch top volunteers for sidebar
  const fetchTopVolunteers = async () => {
    try {
      const res = await api.get('/users/explore?role=volunteer');
      setTopVolunteers((res.data.users || []).slice(0, 4));
    } catch (err) {
      console.error('Failed to load top volunteers:', err);
    }
  };

  useEffect(() => {
    fetchPosts(selectedCause);
  }, [selectedCause]);

  useEffect(() => {
    fetchTopVolunteers();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handlePostDeleted = (postId) => {
    setPosts(prev => prev.filter(p => p._id !== postId));
  };

  return (
    <div style={{ padding: '30px 20px 60px 20px' }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)',
        gap: '30px',
        alignItems: 'flex-start'
      }}>
        {/* Main Feed Column */}
        <div>
          {/* Welcome & Complete Profile Banner */}
          <CompleteProfileBanner />

          {/* Create Post Component */}
          <CreatePostBox onPostCreated={handlePostCreated} />

          {/* Causes Filter Scroll Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '12px',
            marginBottom: '20px',
            scrollbarWidth: 'thin'
          }}>
            <button
              onClick={() => setSelectedCause('All')}
              className={`tag-selectable ${selectedCause === 'All' ? 'selected' : ''}`}
              style={{ fontWeight: 600 }}
            >
              All Causes
            </button>
            {CAUSES_LIST.map((cause) => (
              <button
                key={cause}
                onClick={() => setSelectedCause(cause)}
                className={`tag-selectable ${selectedCause === cause ? 'selected' : ''}`}
              >
                {cause}
              </button>
            ))}
          </div>

          {/* Posts Feed */}
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--color-text-secondary)' }}>
              <div style={{ fontSize: '1rem', fontWeight: 600 }}>Loading community updates...</div>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-error)' }}>
              {error}
            </div>
          ) : posts.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '14px' }}>
                No posts found for <strong>{selectedCause}</strong> yet.
              </p>
              <button
                onClick={() => setSelectedCause('All')}
                className="btn btn-outline-primary btn-sm"
              >
                Reset Filter to All
              </button>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post._id} post={post} onDelete={handlePostDeleted} />
            ))
          )}
        </div>

        {/* Right Sidebar Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* User Quick Portfolio Card */}
          {user && (
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'User')}&backgroundColor=0F766E`}
                  alt={user?.name || 'User'}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text)' }}>
                    {user?.name || 'Volunteer'}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                    {user.role === 'worker' ? (user.organization || 'Social Worker') : (user.location || 'Volunteer')}
                  </div>
                </div>
              </div>

              {/* Total Hours Badge in Card */}
              <div style={{
                backgroundColor: 'var(--color-primary-light)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px',
                border: '1px solid var(--color-primary-border)'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Total Hours Logged</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1.1 }}>
                    {user.totalHours || 0} hrs
                  </div>
                </div>
                <Award size={28} color="var(--color-primary)" />
              </div>

              <Link
                to={`/profile/${user._id}`}
                className="btn btn-primary btn-sm btn-full"
                style={{ gap: '6px' }}
              >
                <span>Go to My Portfolio</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}

          {/* Inspire Stories Highlight Box */}
          <div className="card" style={{
            background: 'linear-gradient(145deg, #FFF7ED 0%, #FFFFFF 100%)',
            border: '1px solid var(--color-accent-border)',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent)', fontWeight: 700, marginBottom: '6px' }}>
              <Sparkles size={18} />
              <span>Need Inspiration?</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
              Discover verified impact stories from volunteers who restored urban ecosystems, tutored students, and rescued animals.
            </p>
            <Link to="/stories" className="btn btn-accent btn-sm btn-full" style={{ gap: '6px' }}>
              <span>Read Impact Stories</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Top Volunteers in the Network */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text)' }}>
                Active Volunteers
              </div>
              <Link to="/explore" style={{ fontSize: '0.8125rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                View all
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {topVolunteers.map((vol) => (
                <Link
                  key={vol._id}
                  to={`/profile/${vol._id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textDecoration: 'none',
                    padding: '6px 8px',
                    borderRadius: 'var(--radius-md)',
                    transition: 'background-color var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={vol.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(vol.name)}`}
                      alt={vol.name}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text)' }}>
                        {vol.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                        {vol.location}
                      </div>
                    </div>
                  </div>
                  <span className="badge badge-orange" style={{ fontSize: '0.7rem' }}>
                    {vol.totalHours || 0} hrs
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
