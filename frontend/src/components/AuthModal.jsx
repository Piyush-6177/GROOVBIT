import React, { useState } from 'react';
import { X, User, Lock, Mail, Music2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal = () => {
  const { isAuthModalOpen, authModalTab, closeAuthModal, login, register } = useAuth();
  const [activeTab, setActiveTab] = useState(authModalTab || 'login');

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // 'user' | 'artist'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (activeTab === 'login') {
        await login({ username, email, password });
      } else {
        await register({ username, email, password, role });
      }
      closeAuthModal();
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.response?.data?.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#1A1A1E] border border-[#2E2E36] w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-full hover:bg-[#202025] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <h3 className="font-pixel-heading text-xl text-white tracking-wider">GROOVBIT AUTH</h3>
          <p className="text-xs text-gray-400 font-sans mt-1">
            Access your 8-bit minimalist music universe
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-[#202025] border border-[#2E2E36] p-1 rounded-full mb-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-pixel rounded-full transition-all ${
              activeTab === 'login'
                ? 'bg-white text-black font-bold shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            LOGIN
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-pixel rounded-full transition-all ${
              activeTab === 'register'
                ? 'bg-white text-black font-bold shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            SIGN UP
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-pixel text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[11px] font-pixel text-gray-300 mb-1">
              USERNAME / EMAIL
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 w-4 h-4 text-gray-500" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full bg-[#202025] border border-[#3A3A42] text-white text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          {activeTab === 'register' && (
            <div>
              <label className="block text-[11px] font-pixel text-gray-300 mb-1">
                EMAIL ADDRESS
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#202025] border border-[#3A3A42] text-white text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-pixel text-gray-300 mb-1">
              PASSWORD
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#202025] border border-[#3A3A42] text-white text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          {activeTab === 'register' && (
            <div>
              <label className="block text-[11px] font-pixel text-gray-300 mb-1">
                ACCOUNT TYPE
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`py-2 px-3 rounded-xl border text-xs font-pixel flex items-center justify-center gap-2 transition-all ${
                    role === 'user'
                      ? 'bg-white text-black border-white font-bold shadow'
                      : 'bg-[#202025] text-gray-400 border-[#3A3A42] hover:text-white'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>LISTENER</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('artist')}
                  className={`py-2 px-3 rounded-xl border text-xs font-pixel flex items-center justify-center gap-2 transition-all ${
                    role === 'artist'
                      ? 'bg-white text-black border-white font-bold shadow'
                      : 'bg-[#202025] text-gray-400 border-[#3A3A42] hover:text-white'
                  }`}
                >
                  <Music2 className="w-3.5 h-3.5" />
                  <span>ARTIST</span>
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 py-3 bg-white text-black font-pixel font-bold text-xs rounded-xl hover:bg-gray-200 transition-all active:scale-95 shadow-lg disabled:opacity-50"
          >
            {loading
              ? 'PROCESSING...'
              : activeTab === 'login'
              ? 'SIGN IN TO GROOVBIT'
              : 'CREATE ACCOUNT'}
          </button>
        </form>
      </div>
    </div>
  );
};
