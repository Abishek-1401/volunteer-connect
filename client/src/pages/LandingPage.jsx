import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Sparkles, 
  Compass, 
  Award, 
  Users, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2,
  Building2,
  TreePine,
  GraduationCap,
  Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  // Quick 1-click demo login helper
  const handleQuickDemoLogin = async (email, password) => {
    try {
      await login(email, password);
      navigate('/home');
    } catch (err) {
      console.error('Demo login error:', err);
      // Fallback navigate to login page
      navigate('/login');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '60px', paddingBottom: '60px' }}>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        background: 'radial-gradient(circle at top right, var(--color-primary-light) 0%, transparent 60%)',
        padding: 'clamp(40px, 8vw, 70px) 0 clamp(30px, 6vw, 50px) 0',
        borderBottom: '1px solid var(--color-border)',
        overflow: 'hidden'
      }}>
        <div className="container hero-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '40px',
          alignItems: 'center'
        }}>
          {/* Hero Left Content */}
          <div style={{ textAlign: 'left' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--color-primary-light)',
              border: '1px solid var(--color-primary-border)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              color: 'var(--color-primary)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              marginBottom: '20px'
            }}>
              <Heart size={14} fill="#F97316" color="#F97316" />
              The Social Network for Changemakers & Nonprofits
            </div>

            <h1 style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: 'var(--color-text)',
              marginBottom: '20px',
              letterSpacing: '-0.03em'
            }}>
              Turn Your Volunteer Work into a Living <span style={{ color: 'var(--color-primary)' }}>Impact Portfolio</span>
            </h1>

            <p style={{
              fontSize: '1.125rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
              marginBottom: '32px',
              maxWidth: '560px'
            }}>
              Connect with passionate volunteers and social service workers. Track verified service hours, showcase real community outcomes, and inspire the next wave of community action.
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link to="/signup" className="btn btn-primary btn-lg" style={{ gap: '8px' }}>
                <span>Start Your Impact Portfolio</span>
                <ArrowRight size={18} />
              </Link>

              <Link to="/explore" className="btn btn-outline btn-lg">
                <Compass size={18} />
                <span>Explore Changemakers</span>
              </Link>
            </div>

            {/* Micro value props */}
            <div style={{
              display: 'flex',
              gap: '20px',
              marginTop: '32px',
              flexWrap: 'wrap',
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="var(--color-primary)" />
                <span>Verified Service Hours</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="var(--color-primary)" />
                <span>Role-Based Profiles</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="var(--color-primary)" />
                <span>Zero Ads, 100% Impact</span>
              </div>
            </div>
          </div>

          {/* Hero Right Demo / Visual Card */}
          <div className="card fade-in" style={{
            padding: 'clamp(18px, 4vw, 28px)',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--color-border)',
            position: 'relative',
            backgroundColor: 'var(--color-card)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '18px',
              paddingBottom: '14px',
              borderBottom: '1px solid var(--color-border)',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <span className="badge badge-teal" style={{ marginBottom: '4px' }}>Live Portfolio Preview</span>
                <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--color-text)' }}>Maya Lin</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>San Francisco, CA • Volunteer</div>
              </div>

              {/* Total Hours Counter Badge (Orange 10% Accent) */}
              <div style={{
                textAlign: 'right',
                backgroundColor: 'var(--color-accent-light)',
                border: '1px solid var(--color-accent-border)',
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)'
              }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-accent)', lineHeight: 1 }}>76 hrs</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Total Contributed</div>
              </div>
            </div>

            {/* Sample Volunteer Activity Item */}
            <div style={{
              backgroundColor: 'var(--color-bg-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              marginBottom: '12px',
              borderLeft: '4px solid var(--color-primary)',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>Urban Canopy Reforestation</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>24 hrs</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                Green Earth Alliance • 180 native saplings planted
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--color-bg-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              marginBottom: '20px',
              borderLeft: '4px solid var(--color-accent)',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>Youth STEM & Robotics Mentor</span>
                <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>32 hrs</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                Bay Area Youth Tech • Taught Python to 40 middle schoolers
              </div>
            </div>

            {/* Quick Demo Test Buttons */}
            <div style={{
              backgroundColor: 'var(--color-primary-light)',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--color-primary-border)',
              textAlign: 'left'
            }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '8px' }}>
                ⚡ Test Drive with 1-Click Demo Accounts:
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleQuickDemoLogin('maya@volunteer.org', 'Password123!')}
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1, fontSize: '0.75rem', borderColor: 'var(--color-primary)' }}
                >
                  Login as Volunteer (Maya)
                </button>
                <button
                  onClick={() => handleQuickDemoLogin('marcus@greenearth.org', 'Password123!')}
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1, fontSize: '0.75rem', borderColor: 'var(--color-primary)' }}
                >
                  Login as NGO Lead (Marcus)
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px'
        }}>
          <div className="stat-box">
            <div className="stat-value">12,450+</div>
            <div className="stat-label">Hours of Verified Service</div>
          </div>
          <div className="stat-box" style={{ background: 'linear-gradient(135deg, #115E59 0%, #0F766E 100%)' }}>
            <div className="stat-value stat-accent-value">480+</div>
            <div className="stat-label">Community Action Projects</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">120+</div>
            <div className="stat-label">Verified NGO Partners</div>
          </div>
          <div className="stat-box" style={{ background: 'linear-gradient(135deg, #0F766E 0%, #042F2E 100%)' }}>
            <div className="stat-value stat-accent-value">100%</div>
            <div className="stat-label">Grassroots Driven</div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="container" style={{ textAlign: 'center' }}>
        <span className="badge badge-teal" style={{ marginBottom: '12px' }}>Platform Highlights</span>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '14px' }}>
          Designed Exclusively for Social Impact
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '640px', margin: '0 auto 40px auto' }}>
          Traditional social networks focus on clicks and noise. VolunteerConnect focuses on deeds, documented hours, and real community change.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          textAlign: 'left'
        }}>
          {/* Card 1 */}
          <div className="card card-hover">
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Award size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>
              Impact Portfolio & Hours Log
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Document every volunteer shift: title, NGO, dates, hours, and accomplishments. Perfect for college applications, career growth, and personal fulfillment.
            </p>
          </div>

          {/* Card 2 */}
          <div className="card card-hover">
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-accent-light)',
              color: 'var(--color-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Sparkles size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>
              Inspire Stories Feed
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Read authentic, uplifting stories from volunteers on the ground. Witness concrete metrics—trees planted, youth tutored, and meals served.
            </p>
          </div>

          {/* Card 3 */}
          <div className="card card-hover">
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Compass size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>
              Cause & Location Discovery
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Search volunteers and social workers by city, availability, and causes (Environment, Education, Health, Animals, Disaster relief, etc.).
            </p>
          </div>
        </div>
      </section>

      {/* Call to action section */}
      <section className="container">
        <div style={{
          background: 'linear-gradient(135deg, #0F766E 0%, #115E59 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '60px 40px',
          color: '#FFFFFF',
          textAlign: 'center',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px' }}>
            Ready to Make Your Contribution Visible?
          </h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 30px auto' }}>
            Join thousands of volunteers and social service workers building community resilience every single day.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link to="/signup" className="btn btn-accent btn-lg" style={{ gap: '8px' }}>
              <span>Create Free Account</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/explore" className="btn btn-outline btn-lg" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-primary)' }}>
              Explore Network
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
