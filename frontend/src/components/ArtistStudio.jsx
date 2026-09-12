import React, { useState } from 'react';
import { X, Upload, Disc, Music, CheckCircle2, AlertCircle } from 'lucide-react';
import { uploadMusicTrack, createAlbum } from '../services/api';

export const ArtistStudio = ({ isOpen, onClose, tracks = [], onRefresh }) => {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'album'

  // Upload track state
  const [trackTitle, setTrackTitle] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Album state
  const [albumTitle, setAlbumTitle] = useState('');
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [creatingAlbum, setCreatingAlbum] = useState(false);

  const [message, setMessage] = useState({ type: '', text: '' });

  if (!isOpen) return null;

  const handleUploadTrack = async (e) => {
    e.preventDefault();
    if (!audioFile) {
      setMessage({ type: 'error', text: 'Please select an audio file (.mp3, .wav).' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('title', trackTitle);
      formData.append('music', audioFile);

      await uploadMusicTrack(formData);
      setMessage({ type: 'success', text: 'Track uploaded successfully to ImageKit CDN!' });
      setTrackTitle('');
      setAudioFile(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Upload error:', err);
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to upload track. Please try again.',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (selectedTracks.length === 0) {
      setMessage({ type: 'error', text: 'Select at least one track for the album.' });
      return;
    }

    setCreatingAlbum(true);
    setMessage({ type: '', text: '' });

    try {
      await createAlbum({
        title: albumTitle,
        musics: selectedTracks,
      });
      setMessage({ type: 'success', text: 'Album created successfully!' });
      setAlbumTitle('');
      setSelectedTracks([]);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Album creation error:', err);
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to create album. Please try again.',
      });
    } finally {
      setCreatingAlbum(false);
    }
  };

  const toggleTrackSelection = (trackId) => {
    setSelectedTracks((prev) =>
      prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#1A1A1E] border border-[#2E2E36] w-full max-w-lg rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-full hover:bg-[#202025] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center font-pixel font-bold">
            ARTIST
          </div>
          <div>
            <h3 className="font-pixel-heading text-lg text-white">CREATOR STUDIO</h3>
            <p className="text-xs text-gray-400 font-sans">
              Upload music to ImageKit cloud & curate albums
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-[#202025] border border-[#2E2E36] p-1 rounded-full mb-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab('upload');
              setMessage({ type: '', text: '' });
            }}
            className={`flex-1 py-2 text-xs font-pixel rounded-full flex items-center justify-center gap-2 transition-all ${
              activeTab === 'upload'
                ? 'bg-white text-black font-bold shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>UPLOAD TRACK</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('album');
              setMessage({ type: '', text: '' });
            }}
            className={`flex-1 py-2 text-xs font-pixel rounded-full flex items-center justify-center gap-2 transition-all ${
              activeTab === 'album'
                ? 'bg-white text-black font-bold shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Disc className="w-3.5 h-3.5" />
            <span>CREATE ALBUM</span>
          </button>
        </div>

        {/* Notification Message */}
        {message.text && (
          <div
            className={`mb-4 p-3 rounded-xl text-xs font-pixel flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Tab 1: Upload Music Track */}
        {activeTab === 'upload' && (
          <form onSubmit={handleUploadTrack} className="flex flex-col gap-4">
            <div>
              <label className="block text-[11px] font-pixel text-gray-300 mb-1">
                TRACK TITLE
              </label>
              <input
                type="text"
                required
                value={trackTitle}
                onChange={(e) => setTrackTitle(e.target.value)}
                placeholder="e.g. Neon Horizon"
                className="w-full bg-[#202025] border border-[#3A3A42] text-white text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-pixel text-gray-300 mb-1">
                AUDIO FILE (.MP3 / .WAV)
              </label>
              <div className="border-2 border-dashed border-[#3A3A42] hover:border-white/50 rounded-2xl p-6 text-center bg-[#202025]/50 transition-colors">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setAudioFile(e.target.files[0])}
                  className="hidden"
                  id="music-file-input"
                />
                <label
                  htmlFor="music-file-input"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Music className="w-8 h-8 text-gray-400" />
                  <span className="text-xs font-pixel text-gray-300">
                    {audioFile ? audioFile.name : 'Click to select audio file'}
                  </span>
                  <span className="text-[10px] text-gray-500 font-sans">
                    Audio will stream via ImageKit cloud CDN
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="mt-2 py-3 bg-white text-black font-pixel font-bold text-xs rounded-xl hover:bg-gray-200 transition-all active:scale-95 shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>{uploading ? 'UPLOADING TO IMAGEKIT...' : 'PUBLISH MUSIC TRACK'}</span>
            </button>
          </form>
        )}

        {/* Tab 2: Create Album */}
        {activeTab === 'album' && (
          <form onSubmit={handleCreateAlbum} className="flex flex-col gap-4">
            <div>
              <label className="block text-[11px] font-pixel text-gray-300 mb-1">
                ALBUM TITLE
              </label>
              <input
                type="text"
                required
                value={albumTitle}
                onChange={(e) => setAlbumTitle(e.target.value)}
                placeholder="e.g. Cyberpunk Melodies"
                className="w-full bg-[#202025] border border-[#3A3A42] text-white text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-pixel text-gray-300 mb-2">
                SELECT TRACKS TO INCLUDE ({selectedTracks.length} SELECTED)
              </label>

              {tracks.length === 0 ? (
                <p className="text-xs text-gray-500 font-pixel py-4 text-center border border-[#3A3A42] rounded-xl">
                  No uploaded tracks available yet. Upload tracks first!
                </p>
              ) : (
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                  {tracks.map((t) => {
                    const isSelected = selectedTracks.includes(t._id);
                    return (
                      <div
                        key={t._id}
                        onClick={() => toggleTrackSelection(t._id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-white/10 border-white text-white'
                            : 'bg-[#202025] border-[#3A3A42] text-gray-400 hover:text-white'
                        }`}
                      >
                        <span className="font-pixel truncate">{t.title}</span>
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                            isSelected ? 'bg-white border-white text-black' : 'border-gray-500'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3 h-3 fill-current" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={creatingAlbum}
              className="mt-2 py-3 bg-white text-black font-pixel font-bold text-xs rounded-xl hover:bg-gray-200 transition-all active:scale-95 shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Disc className="w-4 h-4" />
              <span>{creatingAlbum ? 'CREATING ALBUM...' : 'PUBLISH ALBUM'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
