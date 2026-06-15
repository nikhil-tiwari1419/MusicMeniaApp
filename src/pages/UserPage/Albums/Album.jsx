// Album.jsx  —  shows a grid of all albums
// Clicking an album navigates to AlbumDetail.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Disc3, Music, AlertCircle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../../../Components/Navbar';
import { useTheme } from '../../../Context/Theme';

// ─── Constants ────────────────────────────────────────────────
const API        = import.meta.env.VITE_API_URL;
const PAGE_LIMIT = 10;


// ─── 1. LoadingGrid  (shown while fetching) ───────────────────
function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: PAGE_LIMIT }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-square rounded-xl bg-neutral-200 dark:bg-neutral-600 mb-3" />
          <div className="h-4 rounded bg-neutral-200 dark:bg-neutral-600 mb-2 w-3/4" />
          <div className="h-3 rounded bg-neutral-200 dark:bg-neutral-800 w-1/2" />
        </div>
      ))}
    </div>
  );
}


// ─── 2. ErrorMessage  (shown when API call fails) ─────────────
function ErrorMessage({ message, onRetry, dark }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <AlertCircle className="w-10 h-10 text-red-500" />
      <p className="text-sm text-red-500 max-w-xs">{message}</p>
      <button
        onClick={onRetry}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
          ${dark
            ? 'bg-neutral-800 text-white hover:bg-neutral-700'
            : 'bg-neutral-100 text-black hover:bg-neutral-200'
          }`}
      >
        <RefreshCw className="w-4 h-4" />
        Try again
      </button>
    </div>
  );
}


// ─── 3. EmptyState  (shown when no albums exist) ──────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <Music className="w-10 h-10 text-neutral-400" />
      <p className="text-sm text-neutral-500 dark:text-neutral-400">No albums found</p>
    </div>
  );
}


// ─── 4. AlbumCard  (one card in the grid) ─────────────────────
// Clicking it navigates to /album/:id  (AlbumDetail page)
function AlbumCard({ album, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer"
    >
      {/* Cover image or fallback icon */}
      <div className="relative aspect-square rounded-xl overflow-hidden mb-3
                      bg-neutral-100 dark:bg-neutral-800">
        {album.coverImage ? (
          <img
            src={album.coverImage}
            alt={album.title}
            className="w-full h-full object-cover transition-transform duration-300
                       group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Disc3 className="w-10 h-10 text-neutral-400" />
          </div>
        )}
      </div>

      {/* Album title */}
      <p className="font-medium text-sm truncate">{album.title}</p>

      {/* Artist name  —  artist is a populated object { _id, username, email } */}
      {album.artist && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
          {album.artist?.username ?? album.artist}
        </p>
      )}
    </div>
  );
}


// ─── 5. Pagination  (prev / next page buttons) ────────────────
// Only renders when there is more than 1 page
function Pagination({ pagination, page, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { totalPages, totalAlbums } = pagination;

  return (
    <div className="flex items-center justify-between pt-6 border-t
                    border-neutral-200 dark:border-neutral-800">

      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        {totalAlbums} album{totalAlbums !== 1 ? 's' : ''}
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-2 rounded-lg transition-colors
                     disabled:opacity-40 disabled:cursor-not-allowed
                     hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="text-sm tabular-nums">{page} / {totalPages}</span>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-2 rounded-lg transition-colors
                     disabled:opacity-40 disabled:cursor-not-allowed
                     hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}


// ─── 6. Album  (main page component) ─────────────────────────
// FLOW:
//   mount → fetchAlbums() → show grid
//   page changes → fetchAlbums(newPage)
//   click card → navigate to /album/:id
function Album() {
  const navigate    = useNavigate();
  const { theme }   = useTheme();
  const dark        = theme === 'dark';

  // state
  const [albums,     setAlbums]     = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [page,       setPage]       = useState(1);

  // ── API call ───────────────────────────────────────────────
  const fetchAlbums = useCallback(async (currentPage = 1) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(`${API}/music/get-album`, {
        params: { page: currentPage, limit: PAGE_LIMIT },
        withCredentials: true,
      });

      // API response shape: { album: [...], pagination: {...} }
      const { album: fetchedAlbums, pagination: fetchedPagination } = res.data;

      if (!Array.isArray(fetchedAlbums)) {
        throw new Error('Unexpected response from server');
      }

      setAlbums(fetchedAlbums);
      setPagination(fetchedPagination ?? null);

    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Failed to load albums. Please try again.';
      setError(message);
      setAlbums([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // fetch on mount + whenever page changes
  useEffect(() => {
    fetchAlbums(page);
  }, [page, fetchAlbums]);

  // ── Handlers ──────────────────────────────────────────────
  function handlePageChange(newPage) {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleAlbumClick(albumId) {
    navigate(`/album/${albumId}`);   // goes to AlbumDetail.jsx
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <>
      <Navbar />

      <main className={`min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300
        ${dark ? 'bg-black text-white' : 'bg-white text-black'}`}
      >
        <div className="max-w-6xl mx-auto">

          {/* Page heading */}
          <div className="flex items-center gap-3 mb-8">
            <Disc3 className="w-6 h-6 text-neutral-400" />
            <h1 className="text-xl font-semibold tracking-tight">Albums</h1>
          </div>

          {/* Loading */}
          {loading && <LoadingGrid />}

          {/* Error */}
          {!loading && error && (
            <ErrorMessage
              message={error}
              onRetry={() => fetchAlbums(page)}
              dark={dark}
            />
          )}

          {/* Empty */}
          {!loading && !error && albums.length === 0 && <EmptyState />}

          {/* Grid + Pagination */}
          {!loading && !error && albums.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                {albums.map((album) => (
                  <AlbumCard
                    key={album._id}
                    album={album}
                    onClick={() => handleAlbumClick(album._id)}
                  />
                ))}
              </div>

              <Pagination
                pagination={pagination}
                page={page}
                onPageChange={handlePageChange}
              />
            </>
          )}

        </div>
      </main>
    </>
  );
}

export default Album;