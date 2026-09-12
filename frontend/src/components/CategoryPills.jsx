import React from 'react';
import { useAudio } from '../context/AudioContext';

export const CategoryPills = ({ onViewAll, onCategorySelect }) => {
  const { activeCategory } = useAudio();

  const categories = ['Classic', '90s', 'New', 'Instrumental', 'Modern player'];

  return (
    <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar">
      {categories.map((cat) => {
        const isActive = activeCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onCategorySelect(cat)}
            className={`px-3.5 py-1 rounded-full text-[11px] font-pixel whitespace-nowrap transition-all duration-200 ${
              isActive
                ? 'bg-white text-black font-bold'
                : 'bg-transparent text-gray-300 border border-gray-500 hover:border-gray-300 hover:text-white'
            }`}
          >
            {cat}
          </button>
        );
      })}

      <button
        onClick={onViewAll}
        className="text-[11px] font-pixel text-gray-500 hover:text-white underline whitespace-nowrap ml-auto shrink-0 underline-offset-2 transition-colors"
      >
        View all
      </button>
    </div>
  );
};
