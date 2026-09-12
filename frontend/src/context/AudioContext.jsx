import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const AudioContext = createContext();

// Sample demo tracks for fallback when DB is empty
export const DEMO_TRACKS = [
  {
    _id: 'demo-1',
    title: 'The Suffering',
    uri: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    artist: { username: 'Emily Bryan' },
    category: 'Classic',
    likes: 392,
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
  },
  {
    _id: 'demo-2',
    title: 'Daily Chaos',
    uri: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=chill-abstract-intention-12099.mp3',
    artist: { username: 'Emily Bryan' },
    category: '90s',
    likes: 215,
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
  },
  {
    _id: 'demo-3',
    title: 'Simple Things',
    uri: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=the-cradle-of-your-soul-15700.mp3',
    artist: { username: 'Ryan Poppin' },
    category: 'Instrumental',
    likes: 184,
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
  },
  {
    _id: 'demo-4',
    title: 'Neon Horizon',
    uri: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=electronic-future-beats-117997.mp3',
    artist: { username: 'Bryan Thomas' },
    category: 'New',
    likes: 412,
    cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80',
  },
];

export const AudioProvider = ({ children }) => {
  const audioRef = useRef(new Audio());
  const [currentTrack, setCurrentTrack] = useState(DEMO_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playlist, setPlaylist] = useState(DEMO_TRACKS);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      nextTrack();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [playlist, currentTrack]);

  const playTrack = (track, newPlaylist = null) => {
    const audio = audioRef.current;
    if (newPlaylist && newPlaylist.length > 0) {
      setPlaylist(newPlaylist);
    }

    if (currentTrack?._id === track._id && audio.src) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().then(() => setIsPlaying(true)).catch(console.error);
      }
      return;
    }

    setCurrentTrack(track);
    audio.src = track.uri;
    audio.currentTime = 0;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.error('Audio play error:', err);
        setIsPlaying(false);
      });
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!currentTrack) return;

    if (!audio.src) {
      audio.src = currentTrack.uri;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error('Audio play error:', err);
          setIsPlaying(false);
        });
    }
  };

  const seekTo = (time) => {
    const audio = audioRef.current;
    if (audio.src) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolumeLevel = (newVolume) => {
    const audio = audioRef.current;
    setVolume(newVolume);
    audio.volume = newVolume;
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (isMuted) {
      audio.volume = volume || 0.8;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const nextTrack = () => {
    if (!playlist.length) return;
    const currentIndex = playlist.findIndex((t) => t._id === currentTrack?._id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    playTrack(playlist[nextIndex]);
  };

  const previousTrack = () => {
    if (!playlist.length) return;
    const currentIndex = playlist.findIndex((t) => t._id === currentTrack?._id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    playTrack(playlist[prevIndex]);
  };

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        playlist,
        activeCategory,
        setActiveCategory,
        setPlaylist,
        playTrack,
        togglePlayPause,
        seekTo,
        setVolumeLevel,
        toggleMute,
        nextTrack,
        previousTrack,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
