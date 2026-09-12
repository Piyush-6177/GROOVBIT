import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('spotify_2d_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register'

  useEffect(() => {
    if (user) {
      localStorage.setItem('spotify_2d_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('spotify_2d_user');
    }
  }, [user]);

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    const userInfo = data.User || data.user;
    setUser(userInfo);
    setIsAuthModalOpen(false);
    return data;
  };

  const register = async (userData) => {
    const data = await registerUser(userData);
    const userInfo = data.user || data.User;
    setUser(userInfo);
    setIsAuthModalOpen(false);
    return data;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const isArtist = user?.role === 'artist';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isArtist,
        login,
        register,
        logout,
        isAuthModalOpen,
        authModalTab,
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
