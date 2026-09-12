import React from 'react';
import { Home, Heart, Music, Disc, Tag } from 'lucide-react';

export const LeftNav = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'favorites', icon: Heart, label: 'Favorites' },
    { id: 'tracks', icon: Music, label: 'Tracks' },
    { id: 'albums', icon: Disc, label: 'Albums' },
    { id: 'categories', icon: Tag, label: 'Tags' },
  ];

  return (
    <aside className="w-14 flex flex-col items-center py-6 gap-5 shrink-0">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            title={item.label}
            className={`p-2 rounded-lg transition-all duration-200 group relative ${
              isActive
                ? 'bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" strokeWidth={isActive ? 2.5 : 1.5} />

            {/* Tooltip */}
            <span className="absolute left-14 bg-[#242428] text-white text-[9px] font-pixel px-2 py-1 rounded border border-[#3A3A42] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              {item.label}
            </span>
          </button>
        );
      })}
    </aside>
  );
};
