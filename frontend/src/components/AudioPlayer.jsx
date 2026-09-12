import React, { useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export const AudioPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlayPause,
    seekTo,
    setVolumeLevel,
    toggleMute,
    nextTrack,
    previousTrack,
  } = useAudio();

  const progressBarRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(0);

  if (!currentTrack) return null;

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const effectiveDuration = duration || 0;
  const displayTime = isDragging ? dragTime : currentTime;
  const progressPercent = effectiveDuration > 0 ? (displayTime / effectiveDuration) * 100 : 0;

  const getTimeFromEvent = (e, rect) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    return (x / rect.width) * effectiveDuration;
  };

  const handlePointerDown = (e) => {
    if (effectiveDuration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const time = getTimeFromEvent(e, rect);
    setIsDragging(true);
    setDragTime(time);

    const handlePointerMove = (moveEvent) => {
      const t = getTimeFromEvent(moveEvent, rect);
      setDragTime(Math.max(0, Math.min(t, effectiveDuration)));
    };

    const handlePointerUp = (upEvent) => {
      const t = getTimeFromEvent(upEvent, rect);
      seekTo(Math.max(0, Math.min(t, effectiveDuration)));
      setIsDragging(false);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove);
    window.addEventListener('touchend', handlePointerUp);
  };

  return (
    <div className="h-16 bg-[#161618] border-t border-[#2A2A30] px-5 flex items-center justify-between shrink-0">
      {/* Left: Track Info */}
      <div className="flex items-center gap-3 w-1/4 min-w-0">
        <div className="w-10 h-10 rounded-lg bg-[#0C0C0E] overflow-hidden shrink-0">
          <img
            src={
              currentTrack.cover ||
              'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80'
            }
            alt={currentTrack.title}
            className="w-full h-full object-cover filter grayscale contrast-125"
          />
        </div>
        <div className="min-w-0">
          <h4 className="font-pixel font-bold text-xs text-white truncate">
            {currentTrack.title}
          </h4>
          <p className="text-[10px] text-gray-500 font-sans truncate">
            {currentTrack.artist?.username || 'Unknown Artist'}
          </p>
        </div>
      </div>

      {/* Center: Controls & Seek Bar */}
      <div className="flex flex-col items-center gap-1 w-2/4 max-w-lg">
        <div className="flex items-center gap-4">
          <button onClick={previousTrack} className="text-gray-400 hover:text-white transition-colors">
            <SkipBack className="w-3.5 h-3.5 fill-current" />
          </button>
          <button
            onClick={togglePlayPause}
            className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-px" />
            )}
          </button>
          <button onClick={nextTrack} className="text-gray-400 hover:text-white transition-colors">
            <SkipForward className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>

        {/* Draggable seek bar */}
        <div className="flex items-center gap-2 w-full">
          <span className="text-[9px] font-pixel-mono text-gray-500 w-7 text-right">
            {formatTime(displayTime)}
          </span>
          <div
            ref={progressBarRef}
            className="flex-1 h-3 flex items-center cursor-pointer group relative select-none"
            onMouseDown={handlePointerDown}
            onTouchStart={handlePointerDown}
          >
            <div className="absolute inset-x-0 h-1 bg-[#2A2A30] rounded-full group-hover:h-1.5 transition-all" />
            <div
              className="absolute left-0 h-1 bg-white rounded-full group-hover:h-1.5 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
            <div
              className="absolute w-2.5 h-2.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1/2"
              style={{ left: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[9px] font-pixel-mono text-gray-500 w-7">
            {formatTime(effectiveDuration)}
          </span>
        </div>
      </div>

      {/* Right: Volume */}
      <div className="flex items-center justify-end gap-2 w-1/4">
        <button onClick={toggleMute} className="text-gray-500 hover:text-white transition-colors">
          {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={(e) => setVolumeLevel(parseFloat(e.target.value))}
          className="w-20 h-1 bg-[#2A2A30] appearance-none rounded-full cursor-pointer accent-white"
        />
      </div>
    </div>
  );
};
