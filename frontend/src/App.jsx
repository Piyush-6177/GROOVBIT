import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { AudioProvider, useAudio, DEMO_TRACKS } from './context/AudioContext';
import { Header } from './components/Header';
import { LeftNav } from './components/LeftNav';
import { VinylSpotlight } from './components/VinylSpotlight';
import { CategoryPills } from './components/CategoryPills';
import { TrackCard } from './components/TrackCard';
import { PlaylistList } from './components/PlaylistList';
import { AudioPlayer } from './components/AudioPlayer';
import { AuthModal } from './components/AuthModal';
import { ArtistStudio } from './components/ArtistStudio';
import { fetchAllMusic, fetchAllAlbums } from './services/api';

function MainAppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [showAllTracks, setShowAllTracks] = useState(false);

  const [dbMusic, setDbMusic] = useState([]);
  const [dbAlbums, setDbAlbums] = useState([]);

  const { activeCategory, setActiveCategory } = useAudio();

  const loadBackendData = async () => {
    try {
      const musicData = await fetchAllMusic();
      if (musicData?.musics && musicData.musics.length > 0) {
        setDbMusic(musicData.musics);
      }

      const albumsData = await fetchAllAlbums();
      if (albumsData?.albums && albumsData.albums.length > 0) {
        setDbAlbums(albumsData.albums);
      }
    } catch (err) {
      console.log('Backend data fetch fallback to demo items:', err.message);
    }
  };

  useEffect(() => {
    loadBackendData();
  }, []);

  const allTracks = dbMusic.length > 0 ? [...dbMusic, ...DEMO_TRACKS] : DEMO_TRACKS;

  const filteredTracks = allTracks.filter((track) => {
    const matchesCategory =
      activeCategory === 'All' ||
      !track.category ||
      track.category.toLowerCase() === activeCategory.toLowerCase();

    const matchesSearch =
      !searchQuery ||
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist?.username?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleViewAll = () => {
    setActiveCategory('All');
    setShowAllTracks(true);
  };

  const handleCategorySelect = (cat) => {
    setActiveCategory(cat);
    setShowAllTracks(false);
  };

  const displayedTracks = showAllTracks ? filteredTracks : filteredTracks.slice(0, 3);

  return (
    <div className="w-full h-screen bg-[#1C1C1E] overflow-hidden flex flex-col font-sans selection:bg-white selection:text-black relative">
      {/* Top Header Bar */}
      <Header
        onOpenStudio={() => setIsStudioOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Body — sidebar + content */}
      <div className="flex flex-1 min-h-0">
        {/* Left Icon Sidebar */}
        <LeftNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dashboard Content Area */}
        <main className="flex-1 p-6 pr-7 overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-12 gap-10 h-full">
            {/* Left Column — Vinyl + Now Playing + Controls */}
            <div className="col-span-5 flex flex-col">
              <VinylSpotlight />
            </div>

            {/* Right Column — Categories + Cards + Playlists */}
            <div className="col-span-7 flex flex-col gap-5 overflow-y-auto no-scrollbar pr-1">
              {/* Music Categories heading */}
              <div className="flex items-end justify-between">
                <h2 className="font-pixel text-3xl font-bold text-white tracking-wide leading-tight">
                  Music<br />Categories
                </h2>
                {showAllTracks && (
                  <button
                    onClick={() => setShowAllTracks(false)}
                    className="text-[11px] font-pixel text-gray-400 hover:text-white underline underline-offset-2 mb-1"
                  >
                    Show less
                  </button>
                )}
              </div>

              <CategoryPills onViewAll={handleViewAll} onCategorySelect={handleCategorySelect} />

              {/* Track Cards Grid */}
              <div className={`grid gap-4 ${showAllTracks ? 'grid-cols-4' : 'grid-cols-3'}`}>
                {displayedTracks.map((track) => (
                  <TrackCard key={track._id} track={track} />
                ))}
              </div>

              {/* Favorite Playlists */}
              {!showAllTracks && <PlaylistList albums={dbAlbums} />}
            </div>
          </div>
        </main>
      </div>

      {/* Bottom Audio Player */}
      <AudioPlayer />

      {/* Modals */}
      <AuthModal />
      <ArtistStudio
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
        tracks={allTracks}
        onRefresh={loadBackendData}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AudioProvider>
        <MainAppContent />
      </AudioProvider>
    </AuthProvider>
  );
}
