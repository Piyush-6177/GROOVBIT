import React from 'react';
import { Play, Pause } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export const TrackCard = ({ track }) => {
  const { currentTrack, isPlaying, playTrack } = useAudio();
  const isCurrent = currentTrack?._id === track._id;
  const isTrackPlaying = isCurrent && isPlaying;

  const defaultCover =
    track.cover ||
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80';

  return (
    <div
      onClick={() => playTrack(track)}
      className="group cursor-pointer flex flex-col gap-2"
    >
      {/* Cover — tall portrait aspect ratio, no card border */}
      <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-[#0C0C0E]">
        <img
          src={defaultCover}
          alt={track.title}
          className="w-full h-full object-cover filter grayscale contrast-110 group-hover:scale-105 transition-transform duration-500"
        />

        {/* Hover overlay */}
        <div
          className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-200 ${
            isTrackPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-white/90 text-black flex items-center justify-center transition-transform group-hover:scale-110">
            {isTrackPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </div>
        </div>
      </div>

      {/* Track Info — pixel mono title, sans subtitle */}
      <div>
        <h4 className="font-pixel font-bold text-xs text-white truncate leading-tight">
          {track.title}
        </h4>
        <p className="text-[10px] text-gray-500 font-sans truncate mt-0.5">
          by {track.artist?.username || 'Unknown Artist'}
        </p>
      </div>
    </div>
  );
};
