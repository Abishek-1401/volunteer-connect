import React, { useState } from 'react';
import { Image, Send, Tag, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CAUSES_LIST } from '../constants';
import api from '../services/api';

const PRESET_IMAGES = [
  { label: 'Tree Planting', url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80' },
  { label: 'Food Drive', url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=80' },
  { label: 'Tutoring', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80' },
  { label: 'Animal Care', url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=900&q=80' }
];

const CreatePostBox = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [cause, setCause] = useState('General');
  const [image, setImage] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Please write some content for your post.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await api.post('/posts', {
        content: content.trim(),
        cause,
        image: image.trim()
      });

      setContent('');
      setImage('');
      setShowImageInput(false);
      setCause('General');
      if (onPostCreated) {
        onPostCreated(res.data.post);
      }
    } catch (err) {
      console.error('Create post failed:', err);
      setError(err.response?.data?.message || 'Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const userName = user?.name || 'Volunteer';
  const firstName = user?.name ? user.name.split(' ')[0] : 'Volunteer';

  return (
    <div className="card" style={{ marginBottom: '24px', padding: '20px' }}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userName)}&backgroundColor=0F766E`}
            alt={userName}
            style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
          />

          <div style={{ flex: 1 }}>
            <textarea
              placeholder={`What community impact did you make today, ${firstName}?`}
              value={content}
              onChange={(e) => { setContent(e.target.value); setError(''); }}
              rows={3}
              className="form-textarea"
              style={{
                resize: 'none',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9375rem'
              }}
            />

            {error && (
              <div style={{ color: 'var(--color-error)', fontSize: '0.8125rem', marginTop: '6px' }}>
                {error}
              </div>
            )}

            {/* Selected Image Preview */}
            {image && (
              <div style={{
                position: 'relative',
                marginTop: '10px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                maxHeight: '180px',
                border: '1px solid var(--color-border)'
              }}>
                <img src={image} alt="Upload preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  type="button"
                  onClick={() => setImage('')}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '26px',
                    height: '26px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <X size={15} />
                </button>
              </div>
            )}

            {/* Image URL input & Presets */}
            {showImageInput && !image && (
              <div style={{
                marginTop: '10px',
                padding: '12px',
                backgroundColor: 'var(--color-bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)'
              }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
                  Paste Photo URL or choose sample photo:
                </div>
                <input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="form-input"
                  style={{ marginBottom: '8px', fontSize: '0.8125rem', padding: '6px 10px' }}
                />
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImage(preset.url)}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.75rem', padding: '3px 8px' }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '12px',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {/* Photo toggle button */}
                <button
                  type="button"
                  onClick={() => setShowImageInput(!showImageInput)}
                  className="btn btn-ghost btn-sm"
                  style={{ gap: '4px', color: 'var(--color-primary)' }}
                >
                  <Image size={16} />
                  <span>{image ? 'Change Photo' : 'Add Photo'}</span>
                </button>

                {/* Cause dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag size={14} color="var(--color-text-secondary)" />
                  <select
                    value={cause}
                    onChange={(e) => setCause(e.target.value)}
                    className="form-select"
                    style={{
                      padding: '4px 8px',
                      fontSize: '0.8125rem',
                      width: 'auto',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    <option value="General">General Cause</option>
                    {CAUSES_LIST.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className="btn btn-primary btn-sm"
                style={{ gap: '6px' }}
              >
                {isSubmitting ? (
                  <span>Posting...</span>
                ) : (
                  <>
                    <span>Share Post</span>
                    <Send size={14} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePostBox;
