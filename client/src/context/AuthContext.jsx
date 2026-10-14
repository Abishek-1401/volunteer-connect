import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('volunteer_token') || null);
  const [loading, setLoading] = useState(true);
  const [newSignupPrompt, setNewSignupPrompt] = useState(false);

  // Load user profile on startup if token exists
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        if (res.data?.user && res.data.user._id) {
          setUser(res.data.user);
        } else {
          localStorage.removeItem('volunteer_token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Session verification failed:', err);
        localStorage.removeItem('volunteer_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  // Login
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: receivedToken, user: receivedUser } = res.data;

    localStorage.setItem('volunteer_token', receivedToken);
    setToken(receivedToken);
    setUser(receivedUser);
    return res.data;
  };

  // Register
  const register = async (registrationData) => {
    const res = await api.post('/auth/register', registrationData);
    const { token: receivedToken, user: receivedUser } = res.data;

    localStorage.setItem('volunteer_token', receivedToken);
    setToken(receivedToken);
    setUser(receivedUser);
    setNewSignupPrompt(true);
    return res.data;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('volunteer_token');
    setToken(null);
    setUser(null);
    setNewSignupPrompt(false);
  };

  // Update local user state
  const updateUser = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  const dismissNewSignupPrompt = () => {
    setNewSignupPrompt(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
        newSignupPrompt,
        dismissNewSignupPrompt
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
