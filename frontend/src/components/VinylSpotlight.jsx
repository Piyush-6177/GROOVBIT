import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Maximize2, Plus } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export const VinylSpotlight = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    seekTo,
    nextTrack,
    previousTrack,
  } = useAudio();

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // More bars for finer waveform detail matching reference
  const numBars = 40;
  const progressRatio = duration > 0 ? currentTime / duration : 0;
  const activeBarsIndex = Math.floor(progressRatio * numBars);

  return (
    <div className="flex flex-col gap-4">
      {/* Vinyl Turntable — no wrapper card, breathes directly on the surface */}
      <div className="relative w-full aspect-square max-w-[320px] mx-auto bg-gradient-to-b from-[#9A9A9F] via-[#6E6E73] to-[#48484D] p-3.5 rounded-2xl border border-[#B0B0B8]">
        {/* Corner screws */}
        <div className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full bg-[#505055] border border-[#404045]" />
        <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#505055] border border-[#404045]" />
        <div className="absolute bottom-2.5 left-2.5 w-2 h-2 rounded-full bg-[#505055] border border-[#404045]" />
        <div className="absolute bottom-2.5 right-10 text-[6px] font-pixel text-[#808085] flex items-center">
          33⅓ RPM
        </div>
        {/* Volume knob bottom-right */}
        <div className="absolute bottom-3 right-3 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#808085] to-[#505055] border border-[#404045]" />

        {/* Platter */}
        <div className="w-full h-full rounded-full bg-[#0C0C0E] border-[3px] border-[#28282D] flex items-center justify-center relative overflow-hidden">
          {/* Vinyl */}
          <div
            className={`w-[92%] h-[92%] rounded-full flex items-center justify-center transition-all duration-300 ${
              isPlaying ? 'animate-spin-slow' : 'animate-spin-slow animate-spin-paused'
            }`}
            style={{
              background:
                'repeating-radial-gradient(circle, #0A0A0C 0px, #0A0A0C 2px, #12121A 3px, #0A0A0C 4px)',
            }}
          >
            {/* Groove rings */}
            <div className="w-[72%] h-[72%] rounded-full border border-white/5 flex items-center justify-center">
              <div className="w-[52%] h-[52%] rounded-full border border-white/8 flex items-center justify-center">
                {/* Center label */}
                <div className="w-[50%] h-[50%] rounded-full bg-gradient-to-br from-[#D0D0D0] to-[#F5F5F5] border-2 border-black/60 flex flex-col items-center justify-center text-center">
                  <span className="text-[6px] font-pixel font-bold text-black leading-tight truncate w-full px-1">
                    {currentTrack?.title || 'GROOVBIT'}
                  </span>
                  <span className="text-[5px] font-pixel text-gray-600 mt-px">33⅓ RPM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tonearm */}
          <div
            className={`absolute top-3 right-4 w-14 h-24 pointer-events-none transition-transform duration-700 origin-top-right ${
              isPlaying ? 'rotate-[14deg]' : 'rotate-0'
            }`}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-[#6E6E73] border-2 border-[#303035]" />
            <div className="w-0.5 h-16 bg-gradient-to-b from-[#B0B0B8] to-[#505055] ml-1.5" />
            <div className="w-2.5 h-4 bg-[#1C1C1E] rounded-sm -ml-0.5 border border-white/30" />
          </div>
        </div>
      </div>

      {/* Track Title & Badge — large, commanding pixel font */}
      <div className="flex items-start justify-between gap-3 mt-1 px-1">
        <div className="flex-1 min-w-0">
          <h2 className="text-[28px] font-pixel font-bold text-white tracking-wide leading-tight truncate">
            {currentTrack?.title || 'The Suffering'}
          </h2>
          <div className="flex items-center gap-2.5 mt-1.5">
            <span className="text-[11px] font-pixel text-gray-300 px-2.5 py-0.5 rounded-full border border-gray-500">
              {currentTrack?.category || 'Classic'}
            </span>
          </div>
        </div>

        {/* Like counter */}
        <div className="flex items-center gap-1 text-white font-pixel text-sm mt-1 shrink-0">
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          <span>{currentTrack?.likes || 392}</span>
        </div>
      </div>

      {/* Waveform Visualizer — finer bars, amber/warm tint on active */}
      <div className="flex flex-col gap-1.5 px-1">
        <div className="flex items-center justify-between text-[11px] font-pixel-mono text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration || 215)}</span>
        </div>

        <div
          className="flex items-end justify-between gap-px h-10 cursor-pointer group"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const ratio = clickX / rect.width;
            seekTo(ratio * (duration || 215));
          }}
        >
          {Array.from({ length: numBars }).map((_, index) => {
            const isActive = index <= activeBarsIndex;
            // More varied waveform heights for realistic audio fingerprint
            const heights = [
              20, 35, 55, 80, 45, 95, 65, 30, 85, 100, 50, 35, 90, 70, 45,
              80, 95, 55, 30, 65, 85, 42, 58, 32, 72, 88, 50, 28, 75, 92,
              60, 38, 82, 48, 68, 25, 78, 55, 40, 70,
            ];
            const heightPercent = heights[index % heights.length];

            return (
              <div
                key={index}
                className={`flex-1 rounded-sm transition-colors duration-100 ${
                  isActive
                    ? 'bg-amber-100/90'
                    : 'bg-[#3A3A42] group-hover:bg-[#4A4A52]'
                } ${isPlaying && isActive ? 'animate-wave-bar' : ''}`}
                style={{
                  height: `${heightPercent}%`,
                  animationDelay: `${(index % 7) * 0.1}s`,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Playback Controls — generous spacing */}
      <div className="flex items-center justify-center gap-7 mt-1 px-1">
        <button className="text-gray-500 hover:text-white transition-colors">
          <Maximize2 className="w-4 h-4" strokeWidth={1.5} />
        </button>

        <button
          onClick={previousTrack}
          className="text-gray-300 hover:text-white transition-transform active:scale-90"
        >
          <SkipBack className="w-5 h-5 fill-current" />
        </button>

        {/* Large central play/pause */}
        <button
          onClick={togglePlayPause}
          className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 fill-current" />
          ) : (
            <Play className="w-6 h-6 fill-current ml-0.5" />
          )}
        </button>

        <button
          onClick={nextTrack}
          className="text-gray-300 hover:text-white transition-transform active:scale-90"
        >
          <SkipForward className="w-5 h-5 fill-current" />
        </button>

        <button className="text-gray-500 hover:text-white transition-colors">
          <Shuffle className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
};
