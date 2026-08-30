import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Disc3, Music, AlertCircle, RefreshCw, Play, Pause,
} from 'lucide-react';
// import Navbar from '../../../Ui/Navbar';
import { useTheme } from '../../../Context/Theme';
import { useAudio } from '../../../Context/AudioContext';
import { getAlbumById } from '../../../api/Album.api';

function LoadingState() {
  return (
    <div className="animate-pulse">
      <div className="flex gap-6">
        <div className="bg-gray-300 dark:bg-gray-600 rounded-lg w-16 h-16" />
        <div className="flex-1 p-3">
          <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded w-full mb-2"></div>
          <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded w-3/4"></div>
        </div>
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-14 p-2 m-4 rounded-xl bg-neutral-200 dark:bg-neutral-400"></div>
      ))}
    </div>
  );
}

function ErrorMsg({ message, onRetry, dark }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <AlertCircle size={48}
        className='w-10 h-10 text-red-500' />
      <p className="text-sm text-red-500 max-w-xs">{message}</p>
      <button
        onClick={onRetry}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
          ${dark
            ? 'bg-neutral-800 text-white hover:bg-neutral-700'
            : 'bg-neutral-100 text-black hover:bg-neutral-200'
          }`}>
        <RefreshCw className="w-4 h-4" />
        Try again
      </button>
    </div>
  );
}

function SongRow({ song, index, isActive, isPlaying, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-colors
        ${isActive
          ? 'bg-neutral-200 dark:bg-neutral-700'
          : 'hover:bg-neutral-100 dark:hover:bg-neutral-300'
        }`}>

      <div className="w-6 text-center shrink-0">
        {isActive && isPlaying
          ? <Pause className='w-4 h-4 text-green-500' />
          : isActive
            ? <Play className='w-4 h-4 text-gray-500' />
            : <span className="text-sm text-gray-500">{index + 1}</span>
        }
      </div>

      <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-300 dark:bg-neutral-700 shrink-0">
        {song.thumbnail ? (
          <img
            src={song.thumbnail}
            alt={song.title}
            className="w-full h-full object-cover rounded-lg" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Music className="w-4 h-4 text-neutral-400" />
          </div>
        )}
      </div>

      {/* song title */}
      <p className={`text-sm font-medium truncate flex-1 ${isActive ? 'text-green-500' : ''}`}>
        {song.title}
      </p>

      {/* duration */}
      {song.duration && (
        <span className="text-sm text-neutral-400 shrink-0">
          {song.duration}
        </span>
      )}
    </div>
  );
}

function AlbumDetails() {

  const { albumId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const dark = theme === 'dark';

  //  AudioContext — all playback is handled here 
  const { togglePlay, playingTrack, isPlaying } = useAudio();

  //  Local state — only for fetching the album 
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //  API call: GET /music/get-album/:albumId 
  const fetchAlbum = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getAlbumById(albumId);

      // Response shape: { album: { title, artist, musics: [...] } }
      const { album: fetchedAlbum } = res.data;

      if (!fetchedAlbum) throw new Error('Album not found');

      setAlbum(fetchedAlbum);

    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Failed to load album. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [albumId]);

  useEffect(() => {
    fetchAlbum();
  }, [fetchAlbum]);


  const songs = album?.musics ?? [];
// console.log('Ek song ka object :', songs[0]);
  
  const formattedQueue = useMemo(() => songs.map(s => ({
    _id: s._id,
    url: s.url,
    title: s.title,
    thumbnail: s.thumbnail ?? null,
  })), [songs]);  // format songs into the shape AudioContext expects for its queue
  
  function handleSongClick(song) {
    const trackObj = {
      _id: song._id,
      url: song.url,
      title: song.title,
      thumbnail: song.thumbnail ?? null,
    };

    togglePlay(trackObj, formattedQueue); // formattedQueue already ready hai 
  }

  return (
    <>
    
      {/* pb-36 leaves space for the global audio player bar at the bottom */}
      <main className={`min-h-screen pt-20 pb-36 px-4 sm:px-6 lg:px-8 transition-colors duration-300
        ${dark ? 'bg-black text-white' : 'bg-white text-black'}`}
      >
        <div className="max-w-3xl mx-auto">

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-8 text-sm text-neutral-500
                       hover:text-current transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Albums
          </button>

          {/* Loading skeleton */}
          {loading && <LoadingState />}

          {/* Error */}
          {!loading && error && (
            <ErrorMsg message={error} onRetry={fetchAlbum} dark={dark} />
          )}

          {/* Album content */}
          {!loading && !error && album && (
            <>
              {/* ── Album header ── */}
              <div className="flex gap-6 mb-10">

                {/* Cover art */}
                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden
                                bg-neutral-100 dark:bg-neutral-800 shrink-0">
                  {album.coverImage ? (
                    <img
                      src={album.coverImage}
                      alt={album.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Disc3 className="w-16 h-16 text-neutral-400" />
                    </div>
                  )}
                </div>

                {/* Album info */}
                <div className="flex flex-col justify-end pb-2">
                  <p className="text-xs text-neutral-400 uppercase tracking-widest mb-1">Album</p>
                  <h1 className="text-2xl font-bold mb-2">{album.title}</h1>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {album.artist?.username ?? ''}
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    {songs.length} song{songs.length !== 1 ? 's' : ''}
                  </p>
                </div>

              </div>

              {/* ── Song list ── */}
              {songs.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16 text-center">
                  <Music className="w-10 h-10 text-neutral-400" />
                  <p className="text-sm text-neutral-500">No songs in this album yet</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {songs.map((song, index) => {
                    const isActive = playingTrack?._id === song._id;

                    return (
                      <SongRow
                        key={song._id}
                        song={song}
                        index={index}
                        isActive={isActive}
                        isPlaying={isActive && isPlaying}
                        onClick={() => handleSongClick(song)}
                      />
                    );
                  })}
                </div>
              )}
            </>
          )}

        </div>
      </main>
    </>
  );
}

export default AlbumDetails;