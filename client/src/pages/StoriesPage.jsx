import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Clock, Award, Plus, Building2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CreateStoryModal from '../components/CreateStoryModal';
import { CAUSES_LIST } from '../constants';
import api from '../services/api';

const StoriesPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [stories, setStories] = useState([]);
  const [selectedCause, setSelectedCause] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStories = async (causeFilter = 'All') => {
    setIsLoading(true);
    try {
      const url = causeFilter === 'All' ? '/stories' : `/stories?cause=${encodeURIComponent(causeFilter)}`;
      const res = await api.get(url);
      setStories(res.data.stories || []);
    } catch (err) {
      console.error('Fetch stories error:', err);
      setError('Could not load impact stories.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStories(selectedCause);
  }, [selectedCause]);

  const handleStoryCreated = (newStory) => {
    setStories(prev => [newStory, ...prev]);
  };

  const handleToggleInspire = async (storyId) => {
    if (!isAuthenticated) {
      alert('Please log in to react to impact stories!');
      return;
    }

    // Optimistic toggle
    setStories(prev => prev.map(s => {
      if (s._id === storyId) {
        const hasReaction = s.inspires && s.inspires.includes(user._id);
        const nextInspires = hasReaction
          ? s.inspires.filter(id => id !== user._id)
          : [...(s.inspires || []), user._id];
        return { ...s, inspires: nextInspires };
      }
      return s;
    }));

    try {
      const res = await api.post(`/stories/${storyId}/inspire`);
      // Update with server truth
      setStories(prev => prev.map(s => {
        if (s._id === storyId) {
          return {
            ...s,
            inspiresCount: res.data.inspiresCount
          };
        }
        return s;
      }));
    } catch (err) {
      console.error('Failed to toggle reaction:', err);
      fetchStories(selectedCause);
    }
  };

  return (
    <div style={{ padding: '40px 20px 80px 20px' }}>
      <div className="container">
        {/* Hero Banner for Inspire section */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '40px',
          marginBottom: '36px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
          background: 'radial-gradient(circle at top right, #FFF7ED 0%, #FFFFFF 60%)'
        }}>
          <div style={{ maxWidth: '640px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--color-accent-light)',
              border: '1px solid var(--color-accent-border)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              color: 'var(--color-accent)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              marginBottom: '12px'
            }}>
              <Sparkles size={14} />
              The Inspire Feed
            </div>
            <h1 style={{ fontSize: '2.3rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '10px' }}>
              Real Stories, Verified Community Impact
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
              Looking for inspiration or a reason to get started? Read how everyday volunteers and grassroots leaders transformed their communities one service hour at a time.
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  alert('Please sign in or create an account to share an impact story.');
                } else {
                  setIsModalOpen(true);
                }
              }}
              className="btn btn-accent btn-lg"
              style={{ gap: '8px' }}
            >
              <Plus size={18} />
              <span>Share Your Impact Story</span>
            </button>
          </div>
        </div>

        {/* Cause Filter Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '28px',
          scrollbarWidth: 'thin'
        }}>
          <button
            onClick={() => setSelectedCause('All')}
            className={`tag-selectable ${selectedCause === 'All' ? 'selected' : ''}`}
            style={{ fontWeight: 600 }}
          >
            All Impact Stories
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

        {/* Stories Grid */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-secondary)' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Loading inspiring stories...</div>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-error)' }}>
            {error}
          </div>
        ) : stories.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Sparkles size={40} color="var(--color-accent)" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
              No stories found in this category yet
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
              Be the first changemaker to publish an inspiring story for <strong>{selectedCause}</strong>!
            </p>
            <button onClick={() => setIsModalOpen(true)} className="btn btn-accent">
              Share First Story
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '28px'
          }}>
            {stories.map((story) => {
              const hasReaction = user && story.inspires && story.inspires.some(id => (typeof id === 'string' ? id : id._id) === user._id);
              const count = story.inspires?.length || 0;

              return (
                <div key={story._id} className="card card-hover" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  padding: 0
                }}>
                  {/* Cover Image */}
                  <div style={{ position: 'relative', height: '200px', backgroundColor: '#E2E8F0' }}>
                    <img
                      src={story.coverImage || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'}
                      alt={story.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px'
                    }}>
                      <span className="badge badge-teal" style={{ boxShadow: 'var(--shadow-sm)' }}>
                        {story.cause}
                      </span>
                    </div>

                    {story.hoursServed > 0 && (
                      <div style={{
                        position: 'absolute',
                        bottom: '12px',
                        right: '12px',
                        backgroundColor: 'rgba(15, 23, 42, 0.85)',
                        backdropFilter: 'blur(4px)',
                        color: '#FFFFFF',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Clock size={12} color="#FDBA74" />
                        <span>{story.hoursServed} hours invested</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Key Impact Metric Badge (Prominent highlight) */}
                    <div style={{
                      backgroundColor: 'var(--color-accent-light)',
                      border: '1px solid var(--color-accent-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '8px 12px',
                      marginBottom: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <Award size={18} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                      <div style={{
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        color: 'var(--color-accent)'
                      }}>
                        {story.keyImpact}
                      </div>
                    </div>

                    <h3 style={{
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: 'var(--color-text)',
                      marginBottom: '10px',
                      lineHeight: 1.35
                    }}>
                      {story.title}
                    </h3>

                    <p style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.6,
                      marginBottom: '20px',
                      flex: 1
                    }}>
                      {story.story}
                    </p>

                    {/* Author & Inspire Reaction Footer */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '16px',
                      borderTop: '1px solid var(--color-border)',
                      marginTop: 'auto'
                    }}>
                      <Link
                        to={`/profile/${story.author}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
                      >
                        <img
                          src={story.authorAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(story.authorName || 'User')}`}
                          alt={story.authorName}
                          style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text)' }}>
                            {story.authorName}
                          </div>
                          {story.organization && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                              {story.organization}
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Inspire Reaction Button (Warm Orange Accent) */}
                      <button
                        onClick={() => handleToggleInspire(story._id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: hasReaction ? 'var(--color-accent-light)' : 'none',
                          border: hasReaction ? '1px solid var(--color-accent-border)' : '1px solid var(--color-border)',
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-full)',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '0.8125rem',
                          color: hasReaction ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        <Sparkles
                          size={15}
                          color={hasReaction ? 'var(--color-accent)' : 'var(--color-text-secondary)'}
                          fill={hasReaction ? 'var(--color-accent)' : 'none'}
                        />
                        <span>Inspire ({count})</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Impact Story Modal */}
      <CreateStoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStoryCreated={handleStoryCreated}
      />
    </div>
  );
};

export default StoriesPage;
