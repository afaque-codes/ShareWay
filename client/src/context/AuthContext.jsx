import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch, setAccessToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login', defaultRole: 'PASSENGER' });

  // On mount, check if user has an active session via /api/auth/refresh or /api/auth/me
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await apiFetch('/api/auth/refresh', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          setUser(data.data.user);
          setAccessToken(data.data.accessToken);

          // Fetch full profile (including driver details if applicable)
          const profileRes = await apiFetch('/api/auth/me');
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            setUser(profileData.data.user);
            setDriver(profileData.data.driver);
          }
        }
      } catch (err) {
        console.log('No active session.');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async ({ email, password, expectedRole }) => {
    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, expectedRole }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || 'Login failed. Please check your credentials.');
    }

    setUser(data.data.user);
    setAccessToken(data.data.accessToken);

    // Fetch full profile
    const profileRes = await apiFetch('/api/auth/me');
    if (profileRes.ok) {
      const profileData = await profileRes.json();
      setDriver(profileData.data.driver);
    }

    setAuthModal({ isOpen: false, mode: 'login', defaultRole: 'PASSENGER' });
    return data.data.user;
  };

  const register = async (formData) => {
    const res = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || 'Registration failed.');
    }

    setUser(data.data.user);
    setAccessToken(data.data.accessToken);

    // Fetch full profile
    const profileRes = await apiFetch('/api/auth/me');
    if (profileRes.ok) {
      const profileData = await profileRes.json();
      setDriver(profileData.data.driver);
    }

    setAuthModal({ isOpen: false, mode: 'login', defaultRole: 'PASSENGER' });
    return data.data.user;
  };

  const logout = async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setDriver(null);
      setAccessToken(null);
    }
  };

  const openAuthModal = (mode = 'login', defaultRole = 'PASSENGER') => {
    setAuthModal({ isOpen: true, mode, defaultRole });
  };

  const closeAuthModal = () => {
    setAuthModal((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        driver,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        authModal,
        openAuthModal,
        closeAuthModal,
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
