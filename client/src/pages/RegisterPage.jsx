import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, CheckCircle, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import RoleSelector from '../components/RoleSelector';
import { CAUSES_LIST, AVAILABILITY_OPTIONS } from '../constants';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('volunteer'); // 'volunteer' | 'worker'

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    terms: false,
    // Volunteer specific
    causes: [],
    availability: 'Flexible',
    // Worker specific
    organization: '',
    designation: '',
    website: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFieldErrors(prev => ({ ...prev, [field]: '' }));
    setGlobalError('');
  };

  const handleCauseToggle = (causeName) => {
    setFormData(prev => {
      const exists = prev.causes.includes(causeName);
      const nextCauses = exists
        ? prev.causes.filter(c => c !== causeName)
        : [...prev.causes, causeName];
      return { ...prev, causes: nextCauses };
    });
    setFieldErrors(prev => ({ ...prev, causes: '' }));
  };

  // Step 2 Validation (Common fields)
  const validateStep2 = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Full name is required.';
    }
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email format.';
    }
    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      errs.password = 'Password must be at least 8 characters long.';
    }
    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }
    if (!formData.location.trim()) {
      errs.location = 'City / location is required for community matching.';
    }
    if (!formData.terms) {
      errs.terms = 'You must agree to the Terms and Privacy Policy to proceed.';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 3 Validation (Role specific)
  const validateStep3 = () => {
    const errs = {};
    if (role === 'volunteer') {
      if (!formData.causes || formData.causes.length === 0) {
        errs.causes = 'Please select at least one cause you care about.';
      }
    } else {
      if (!formData.organization.trim()) {
        errs.organization = 'Organization / NGO name is required.';
      }
      if (!formData.designation.trim()) {
        errs.designation = 'Your role / designation is required.';
      }
      if (!formData.causes || formData.causes.length === 0) {
        errs.causes = 'Please select at least one focus area for your organization.';
      }
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const goToNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (validateStep2()) {
        setStep(3);
      }
    }
  };

  const goToPrevStep = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setIsLoading(true);
    setGlobalError('');

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role,
        location: formData.location.trim(),
        terms: formData.terms,
        causes: formData.causes,
        availability: role === 'volunteer' ? formData.availability : undefined,
        organization: role === 'worker' ? formData.organization.trim() : undefined,
        designation: role === 'worker' ? formData.designation.trim() : undefined,
        website: role === 'worker' ? formData.website.trim() : undefined
      });

      // Automatically logged in by AuthContext, redirect to Home with complete profile prompt!
      navigate('/home');
    } catch (err) {
      console.error('Registration failed:', err);
      if (err.response?.data?.field) {
        const field = err.response.data.field;
        // If field was in step 2 (e.g. email already exists), jump back to step 2 to show it
        if (['email', 'name', 'password', 'location'].includes(field)) {
          setStep(2);
        }
        setFieldErrors({ [field]: err.response.data.message });
      } else {
        setGlobalError(err.response?.data?.message || 'Registration could not be completed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      padding: '40px 20px 80px 20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      minHeight: 'calc(100vh - 180px)'
    }}>
      <div className="card" style={{
        maxWidth: '580px',
        width: '100%',
        padding: '36px',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border)'
      }}>
        {/* Step Progress Bar */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-primary)' }}>
            <span>Step {step} of 3</span>
            <span>
              {step === 1 && 'Choose Your Role'}
              {step === 2 && 'Account Information'}
              {step === 3 && (role === 'volunteer' ? 'Causes & Availability' : 'Organization Details')}
            </span>
          </div>
          <div style={{ height: '6px', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              backgroundColor: 'var(--color-primary)',
              width: `${(step / 3) * 100}%`,
              transition: 'width 300ms ease'
            }} />
          </div>
        </div>

        {/* Global Error Banner */}
        {globalError && (
          <div style={{
            backgroundColor: 'var(--color-error-bg)',
            color: 'var(--color-error)',
            padding: '12px 14px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{globalError}</span>
          </div>
        )}

        {/* STEP 1: CHOOSE ROLE */}
        {step === 1 && (
          <div className="fade-in">
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '8px', textAlign: 'center' }}>
              How will you be using VolunteerConnect?
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', textAlign: 'center', marginBottom: '28px' }}>
              Select your role to personalize your profile and community experience.
            </p>

            <RoleSelector selectedRole={role} onSelectRole={(r) => setRole(r)} />

            <button
              type="button"
              onClick={goToNextStep}
              className="btn btn-primary btn-full btn-lg"
              style={{ marginTop: '16px', gap: '8px' }}
            >
              <span>Continue as {role === 'volunteer' ? 'Volunteer' : 'Social Service Worker'}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* STEP 2: COMMON FIELDS */}
        {step === 2 && (
          <div className="fade-in">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '6px' }}>
              Create Your Account
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '24px' }}>
              Registering as <strong style={{ color: 'var(--color-primary)' }}>{role === 'volunteer' ? 'Volunteer' : 'Social Service Worker'}</strong>.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); goToNextStep(); }}>
              {/* Full Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  <span>Full Name *</span>
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="e.g. Maya Lin"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`form-input ${fieldErrors.name ? 'error' : ''}`}
                />
                {fieldErrors.name && <div className="field-error">{fieldErrors.name}</div>}
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  <span>Email Address *</span>
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.org"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`form-input ${fieldErrors.email ? 'error' : ''}`}
                />
                {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="reg-password">
                  <span>Password *</span>
                  <span className="form-label-optional">Min. 8 characters</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a secure password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`form-input ${fieldErrors.password ? 'error' : ''}`}
                    style={{ paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--color-text-secondary)',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">
                  <span>Confirm Password *</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`form-input ${fieldErrors.confirmPassword ? 'error' : ''}`}
                    style={{ paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--color-text-secondary)',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && <div className="field-error">{fieldErrors.confirmPassword}</div>}
              </div>

              {/* Location (City) */}
              <div className="form-group">
                <label className="form-label" htmlFor="location">
                  <span>Location (City, State / Country) *</span>
                  <span className="form-label-optional">Used for Explore filters</span>
                </label>
                <input
                  id="location"
                  type="text"
                  placeholder="e.g. San Francisco, CA or Austin, TX"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={`form-input ${fieldErrors.location ? 'error' : ''}`}
                />
                {fieldErrors.location && <div className="field-error">{fieldErrors.location}</div>}
              </div>

              {/* Terms checkbox */}
              <div className="form-group" style={{ marginTop: '8px' }}>
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={formData.terms}
                    onChange={(e) => handleInputChange('terms', e.target.checked)}
                  />
                  <span>
                    I agree to the <strong style={{ color: 'var(--color-text)' }}>Terms of Service</strong> and <strong style={{ color: 'var(--color-text)' }}>Privacy Policy</strong>.
                  </span>
                </label>
                {fieldErrors.terms && <div className="field-error">{fieldErrors.terms}</div>}
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={goToPrevStep}
                  className="btn btn-outline"
                  style={{ gap: '6px' }}
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-full"
                  style={{ gap: '6px' }}
                >
                  <span>Next: {role === 'volunteer' ? 'Causes & Availability' : 'Organization'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: ROLE SPECIFIC FIELDS */}
        {step === 3 && (
          <div className="fade-in">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '6px' }}>
              {role === 'volunteer' ? 'Your Passion & Availability' : 'Organization Information'}
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '24px' }}>
              {role === 'volunteer'
                ? 'Select the causes you are drawn to and when you are typically free to serve.'
                : 'Help volunteers find your initiative and verify your social mission.'}
            </p>

            <form onSubmit={handleSubmit}>
              {role === 'volunteer' ? (
                <>
                  {/* Volunteer: Causes (multi-select, required min 1) */}
                  <div className="form-group">
                    <label className="form-label">
                      <span>Causes you care about *</span>
                      <span className="form-label-optional">Pick at least 1</span>
                    </label>
                    <div className="tags-selectable-grid">
                      {CAUSES_LIST.map((cause) => {
                        const isSelected = formData.causes.includes(cause);
                        return (
                          <button
                            key={cause}
                            type="button"
                            onClick={() => handleCauseToggle(cause)}
                            className={`tag-selectable ${isSelected ? 'selected' : ''}`}
                          >
                            {isSelected ? '✓ ' : '+ '}
                            {cause}
                          </button>
                        );
                      })}
                    </div>
                    {fieldErrors.causes && <div className="field-error">{fieldErrors.causes}</div>}
                  </div>

                  {/* Volunteer: Availability (select, optional) */}
                  <div className="form-group" style={{ marginTop: '18px' }}>
                    <label className="form-label" htmlFor="availability">
                      <span>Availability</span>
                      <span className="form-label-optional">Optional</span>
                    </label>
                    <select
                      id="availability"
                      value={formData.availability}
                      onChange={(e) => handleInputChange('availability', e.target.value)}
                      className="form-select"
                    >
                      {AVAILABILITY_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  {/* Worker: Organization / NGO Name */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="organization">
                      <span>Organization / NGO Name *</span>
                    </label>
                    <input
                      id="organization"
                      type="text"
                      placeholder="e.g. Green Earth Alliance"
                      value={formData.organization}
                      onChange={(e) => handleInputChange('organization', e.target.value)}
                      className={`form-input ${fieldErrors.organization ? 'error' : ''}`}
                    />
                    {fieldErrors.organization && <div className="field-error">{fieldErrors.organization}</div>}
                  </div>

                  {/* Worker: Role / Designation */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="designation">
                      <span>Your Role / Designation *</span>
                    </label>
                    <input
                      id="designation"
                      type="text"
                      placeholder="e.g. Director of Volunteer Programs"
                      value={formData.designation}
                      onChange={(e) => handleInputChange('designation', e.target.value)}
                      className={`form-input ${fieldErrors.designation ? 'error' : ''}`}
                    />
                    {fieldErrors.designation && <div className="field-error">{fieldErrors.designation}</div>}
                  </div>

                  {/* Worker: Focus areas (multi-select, same list as causes) */}
                  <div className="form-group">
                    <label className="form-label">
                      <span>Focus Areas *</span>
                      <span className="form-label-optional">Pick at least 1</span>
                    </label>
                    <div className="tags-selectable-grid">
                      {CAUSES_LIST.map((cause) => {
                        const isSelected = formData.causes.includes(cause);
                        return (
                          <button
                            key={cause}
                            type="button"
                            onClick={() => handleCauseToggle(cause)}
                            className={`tag-selectable ${isSelected ? 'selected' : ''}`}
                          >
                            {isSelected ? '✓ ' : '+ '}
                            {cause}
                          </button>
                        );
                      })}
                    </div>
                    {fieldErrors.causes && <div className="field-error">{fieldErrors.causes}</div>}
                  </div>

                  {/* Worker: Organization website or social link (optional) */}
                  <div className="form-group" style={{ marginTop: '18px' }}>
                    <label className="form-label" htmlFor="website">
                      <span>Organization Website or Social Link</span>
                      <span className="form-label-optional">Optional</span>
                    </label>
                    <input
                      id="website"
                      type="url"
                      placeholder="https://yourngo.org"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="form-input"
                    />
                  </div>
                </>
              )}

              {/* Submit and Back Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
                <button
                  type="button"
                  onClick={goToPrevStep}
                  className="btn btn-outline"
                  style={{ gap: '6px' }}
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary btn-full btn-lg"
                  style={{ gap: '8px' }}
                >
                  {isLoading ? (
                    <span>Creating your portfolio...</span>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <UserPlus size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Bottom login link */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
            Log in instead
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
