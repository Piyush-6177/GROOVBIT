import React from 'react';
import { Search, Mail, Bell, User, LogOut, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Header = ({ onOpenStudio, searchQuery, setSearchQuery }) => {
  const { user, isAuthenticated, isArtist, logout, openAuthModal } = useAuth();

  return (
    <header className="flex items-center justify-between px-6 py-4">
      {/* Brand Logo */}
      <div className="font-pixel-heading text-xl font-bold  text-white tracking-widest shrink-0">
        GROOVBIT
      </div>

      {/* Search Bar — outlined pill, transparent bg */}
      <div className="relative flex-1 max-w-sm mx-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for songs, artists"
          className="w-full bg-transparent text-xs text-white pl-10 pr-4 py-2 rounded-full border border-[#3A3A42] focus:outline-none focus:border-gray-300 transition-colors font-sans placeholder:text-gray-500"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 shrink-0">
        {isArtist && (
          <button
            onClick={onOpenStudio}
            className="flex items-center gap-1.5 bg-white text-black text-[10px] px-3 py-1.5 rounded-full font-pixel font-semibold hover:bg-gray-200 transition-transform active:scale-95"
          >
            <Upload className="w-3 h-3" />
            <span>STUDIO</span>
          </button>
        )}

        <button className="text-gray-500 hover:text-white p-1.5 transition-colors">
          <Mail className="w-4 h-4" />
        </button>

        <button className="text-gray-500 hover:text-white p-1.5 transition-colors">
          <Bell className="w-4 h-4" />
        </button>

        {/* User Auth */}
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            {/* Pixel avatar block */}
            <div className="w-7 h-7 rounded-lg bg-[#2A2A30] border border-[#3A3A42] flex items-center justify-center text-white text-[9px] font-pixel overflow-hidden">
              {user.username ? user.username[0].toUpperCase() : 'U'}
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="text-gray-500 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => openAuthModal('login')}
              className="text-[10px] font-pixel text-gray-400 hover:text-white px-2 py-1 transition-colors"
            >
              LOGIN
            </button>
            <button
              onClick={() => openAuthModal('register')}
              className="text-[10px] font-pixel font-bold bg-white text-black px-3 py-1 rounded-full hover:bg-gray-200 transition-transform active:scale-95"
            >
              SIGN UP
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
