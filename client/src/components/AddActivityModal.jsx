import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Building2, BookOpen, Tag } from 'lucide-react';
import { CAUSES_LIST } from '../constants';
import api from '../services/api';

const AddActivityModal = ({ isOpen, onClose, onActivitySaved, editingActivity }) => {
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    date: new Date().toISOString().split('T')[0],
    hours: '',
    description: '',
    cause: 'General'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingActivity) {
      setFormData({
        title: editingActivity.title || '',
        organization: editingActivity.organization || '',
        date: editingActivity.date || new Date().toISOString().split('T')[0],
        hours: editingActivity.hours || '',
        description: editingActivity.description || '',
        cause: editingActivity.cause || 'General'
      });
    } else {
      setFormData({
        title: '',
        organization: '',
        date: new Date().toISOString().split('T')[0],
        hours: '',
        description: '',
        cause: 'General'
      });
    }
    setErrors({});
  }, [editingActivity, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Activity title is required';
    if (!formData.organization.trim()) errs.organization = 'Organization name is required';
    if (!formData.date) errs.date = 'Date is required';
    const hrs = parseFloat(formData.hours);
    if (isNaN(hrs) || hrs <= 0) errs.hours = 'Please enter valid hours served (minimum 0.5)';
    if (!formData.description.trim()) errs.description = 'Activity description is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      let res;
      if (editingActivity) {
        res = await api.put(`/activities/${editingActivity._id}`, formData);
      } else {
        res = await api.post('/activities', formData);
      }

      onActivitySaved(res.data.activity, res.data.totalHours);
      onClose();
    } catch (err) {
      console.error('Save activity error:', err);
      setErrors({ form: err.response?.data?.message || 'Failed to save activity.' });
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
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)' }}>
              {editingActivity ? 'Edit Volunteer Activity' : 'Log Volunteer Activity'}
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              Add to your impact portfolio and keep your verified service hours updated.
            </p>
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
              <span>Activity / Project Title *</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Urban Canopy Tree Planting & Irrigation"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`form-input ${errors.title ? 'error' : ''}`}
            />
            {errors.title && <div className="field-error">{errors.title}</div>}
          </div>

          {/* Organization & Cause in 2 columns */}
          <div className="modal-form-row">
            <div className="form-group">
              <label className="form-label">
                <span>Organization / NGO *</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Green Earth Alliance"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className={`form-input ${errors.organization ? 'error' : ''}`}
              />
              {errors.organization && <div className="field-error">{errors.organization}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Cause</span>
              </label>
              <select
                value={formData.cause}
                onChange={(e) => setFormData({ ...formData, cause: e.target.value })}
                className="form-select"
              >
                <option value="General">General</option>
                {CAUSES_LIST.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Hours in 2 columns */}
          <div className="modal-form-row">
            <div className="form-group">
              <label className="form-label">
                <span>Date of Service *</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={`form-input ${errors.date ? 'error' : ''}`}
              />
              {errors.date && <div className="field-error">{errors.date}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Hours Served *</span>
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                placeholder="e.g. 4.5"
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                className={`form-input ${errors.hours ? 'error' : ''}`}
              />
              {errors.hours && <div className="field-error">{errors.hours}</div>}
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">
              <span>Description & Impact Outcomes *</span>
            </label>
            <textarea
              rows={4}
              placeholder="Detail your responsibilities, results achieved, people or areas assisted..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`form-textarea ${errors.description ? 'error' : ''}`}
            />
            {errors.description && <div className="field-error">{errors.description}</div>}
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
              className="btn btn-primary"
            >
              {isSubmitting ? 'Saving...' : (editingActivity ? 'Update Activity' : 'Add to Portfolio')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddActivityModal;
