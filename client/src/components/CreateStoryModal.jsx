import React, { useState } from 'react';
import { X, Sparkles, Image, Tag, Award } from 'lucide-react';
import { CAUSES_LIST } from '../constants';
import api from '../services/api';

const STORY_PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80'
];

const CreateStoryModal = ({ isOpen, onClose, onStoryCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    keyImpact: '',
    hoursServed: '',
    cause: CAUSES_LIST[0],
    coverImage: STORY_PRESET_IMAGES[0],
    story: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    if (!formData.keyImpact.trim()) errs.keyImpact = 'Key impact metric is required';
    if (!formData.story.trim()) errs.story = 'Story narrative is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await api.post('/stories', {
        ...formData,
        hoursServed: parseFloat(formData.hoursServed) || 0
      });

      onStoryCreated(res.data.story);
      onClose();
    } catch (err) {
      console.error('Publish story error:', err);
      setErrors({ form: err.response?.data?.message || 'Failed to publish story.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-accent-light)',
              color: 'var(--color-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)' }}>
                Share an Impact Story
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                Inspire new volunteers and showcase what real community action makes possible.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {errors.form && (
          <div style={{
            backgroundColor: 'var(--color-error-bg)',
            color: 'var(--color-error)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px',
            fontSize: '0.875rem'
          }}>
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label">
              <span>Story Title *</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Turning a Concrete Lot into a Thriving Urban Micro-Forest"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`form-input ${errors.title ? 'error' : ''}`}
            />
            {errors.title && <div className="field-error">{errors.title}</div>}
          </div>

          {/* Key Impact Metric */}
          <div className="form-group">
            <label className="form-label">
              <span>Key Impact Metric / Achievement *</span>
              <span className="form-label-optional">e.g. "500 Trees Planted", "80 Animals Rescued"</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 120 Children Tutored & 1,500 Books Distributed"
              value={formData.keyImpact}
              onChange={(e) => setFormData({ ...formData, keyImpact: e.target.value })}
              className={`form-input ${errors.keyImpact ? 'error' : ''}`}
            />
            {errors.keyImpact && <div className="field-error">{errors.keyImpact}</div>}
          </div>

          {/* Cause & Hours */}
          <div className="modal-form-row">
            <div className="form-group">
              <label className="form-label">
                <span>Cause Area</span>
              </label>
              <select
                value={formData.cause}
                onChange={(e) => setFormData({ ...formData, cause: e.target.value })}
                className="form-select"
              >
                {CAUSES_LIST.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Hours Invested</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 50"
                value={formData.hoursServed}
                onChange={(e) => setFormData({ ...formData, hoursServed: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          {/* Cover Photo */}
          <div className="form-group">
            <label className="form-label">
              <span>Cover Photo URL</span>
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              className="form-input"
              style={{ marginBottom: '8px' }}
            />
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
              {STORY_PRESET_IMAGES.map((imgUrl, i) => (
                <img
                  key={i}
                  src={imgUrl}
                  alt={`Preset ${i}`}
                  onClick={() => setFormData({ ...formData, coverImage: imgUrl })}
                  style={{
                    width: '56px',
                    height: '38px',
                    borderRadius: 'var(--radius-sm)',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: formData.coverImage === imgUrl ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    opacity: formData.coverImage === imgUrl ? 1 : 0.7
                  }}
                />
              ))}
            </div>
          </div>

          {/* Narrative Story */}
          <div className="form-group">
            <label className="form-label">
              <span>The Inspiring Narrative *</span>
            </label>
            <textarea
              rows={5}
              placeholder="Describe the initial challenge, how volunteers came together, what obstacles were overcome, and how this transformed lives..."
              value={formData.story}
              onChange={(e) => setFormData({ ...formData, story: e.target.value })}
              className={`form-textarea ${errors.story ? 'error' : ''}`}
            />
            {errors.story && <div className="field-error">{errors.story}</div>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-accent"
              style={{ gap: '6px' }}
            >
              <Sparkles size={16} />
              <span>{isSubmitting ? 'Publishing...' : 'Publish Impact Story'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStoryModal;
