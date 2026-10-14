import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Users, X, Sparkles } from 'lucide-react';
import VolunteerCard from '../components/VolunteerCard';
import { CAUSES_LIST } from '../constants';
import api from '../services/api';

const ExplorePage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCause, setSelectedCause] = useState('All');
  const [selectedRole, setSelectedRole] = useState('all'); // 'all' | 'volunteer' | 'worker'
  const [locationInput, setLocationInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (selectedCause && selectedCause !== 'All') params.append('cause', selectedCause);
      if (selectedRole && selectedRole !== 'all') params.append('role', selectedRole);
      if (locationInput.trim()) params.append('location', locationInput.trim());

      const res = await api.get(`/users/explore?${params.toString()}`);
      setUsers(res.data.users || []);
    } catch (err) {
      console.error('Explore fetch error:', err);
      setError('Could not retrieve volunteers.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [search, selectedCause, selectedRole, locationInput]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCause('All');
    setSelectedRole('all');
    setLocationInput('');
  };

  const hasActiveFilters = search || selectedCause !== 'All' || selectedRole !== 'all' || locationInput;

  return (
    <div style={{ padding: '40px 20px 80px 20px' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span className="badge badge-teal" style={{ marginBottom: '10px' }}>
            Community Directory
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '10px' }}>
            Explore Volunteers & Social Workers
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1rem' }}>
            Find dedicated changemakers by causes, verified service hours, skills, and city.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="card" style={{ padding: '20px', marginBottom: '28px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr auto',
            gap: '12px',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            {/* Search input */}
            <div style={{ position: 'relative' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-secondary)'
                }}
              />
              <input
                type="text"
                placeholder="Search by name, organization, skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '38px' }}
              />
            </div>

            {/* Location filter */}
            <div style={{ position: 'relative' }}>
              <MapPin
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-secondary)'
                }}
              />
              <input
                type="text"
                placeholder="Filter by city (e.g. Seattle, Austin)..."
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '38px' }}
              />
            </div>

            {/* Role Filter Tabs */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setSelectedRole('all')}
                className={`btn btn-sm ${selectedRole === 'all' ? 'btn-primary' : 'btn-outline'}`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedRole('volunteer')}
                className={`btn btn-sm ${selectedRole === 'volunteer' ? 'btn-primary' : 'btn-outline'}`}
              >
                Volunteers
              </button>
              <button
                onClick={() => setSelectedRole('worker')}
                className={`btn btn-sm ${selectedRole === 'worker' ? 'btn-primary' : 'btn-outline'}`}
              >
                Social Workers
              </button>
            </div>
          </div>

          {/* Causes Filter Pills */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px',
            scrollbarWidth: 'thin'
          }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', flexShrink: 0 }}>
              Causes:
            </span>
            <button
              onClick={() => setSelectedCause('All')}
              className={`tag-selectable ${selectedCause === 'All' ? 'selected' : ''}`}
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

          {hasActiveFilters && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '14px',
              paddingTop: '12px',
              borderTop: '1px solid var(--color-border)',
              fontSize: '0.8125rem',
              color: 'var(--color-text-secondary)'
            }}>
              <span>Showing results for your active filters</span>
              <button
                onClick={clearFilters}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <X size={14} /> Reset all filters
              </button>
            </div>
          )}
        </div>

        {/* Directory Grid */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-secondary)' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Discovering changemakers...</div>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-error)' }}>
            {error}
          </div>
        ) : users.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Users size={40} color="var(--color-text-muted)" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>No profiles match your search</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
              Try loosening your cause or location filters to see more community members.
            </p>
            <button onClick={clearFilters} className="btn btn-primary">
              Clear All Filters
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '24px'
          }}>
            {users.map((item) => (
              <VolunteerCard key={item._id} user={item} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .card > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ExplorePage;
