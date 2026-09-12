import React from 'react';
import { Play } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export const PlaylistList = ({ albums = [] }) => {
  const { currentTrack, isPlaying, playTrack } = useAudio();

  const defaultPlaylists = [
    {
      _id: 'pl-1',
      title: 'Best of Eren',
      songsCount: 32,
      cover: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    },
    {
      _id: 'pl-2',
      title: 'Best of Eren',
      songsCount: 32,
      cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    },
  ];

  const displayItems = albums.length > 0 ? albums : defaultPlaylists;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-pixel text-base font-bold text-white">
        Favorite Playlists ({displayItems.length})
      </h3>

      <div className="flex flex-col gap-2.5">
        {displayItems.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between py-2 group"
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Circular avatar thumbnail */}
              <div className="w-11 h-11 rounded-full overflow-hidden bg-[#0C0C0E] shrink-0">
                <img
                  src={
                    item.cover ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
                  }
                  alt={item.title}
                  className="w-full h-full object-cover filter grayscale contrast-125"
                />
              </div>

              <div className="min-w-0">
                <h4 className="font-sans font-bold text-sm text-white truncate">
                  {item.title}
                </h4>
                <span className="text-[11px] text-gray-500 font-sans">
                  {item.songsCount || item.musics?.length || 32} songs in this list
                </span>
              </div>
            </div>

            {/* Outlined circular play button */}
            <button className="w-9 h-9 rounded-full border border-gray-500 group-hover:border-gray-300 text-gray-400 group-hover:text-white flex items-center justify-center transition-colors shrink-0 ml-3">
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
