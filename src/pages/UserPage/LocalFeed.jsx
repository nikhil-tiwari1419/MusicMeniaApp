import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import { useTheme } from '../../Context/Theme';

const API = import.meta.env.VITE_API_URL;

// ─── Mini Audio Player ───────────────────────────────────────────────
function MusicCard({ music, isPlaying, onPlay, dark }) {
    const audioRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.play().catch(() => {});
        } else {
            audio.pause();
        }
    }, [isPlaying]);

    function handleTimeUpdate() {
        const audio = audioRef.current;
        if (!audio) return;
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100 || 0);
    }

    function handleLoadedMetadata() {
        setDuration(audioRef.current?.duration || 0);
    }

    function handleSeek(e) {
        const audio = audioRef.current;
        if (!audio) return;
        const val = parseFloat(e.target.value);
        audio.currentTime = (val / 100) * audio.duration;
        setProgress(val);
    }

    function handleVolume(e) {
        const val = parseFloat(e.target.value);
        setVolume(val);
        if (audioRef.current) audioRef.current.volume = val;
    }

    function formatTime(s) {
        if (!s || isNaN(s)) return '0:00';
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec.toString().padStart(2, '0')}`;
    }

    const card = dark
        ? 'bg-gray-900 border-gray-700/50'
        : 'bg-white border-gray-200';

    const sub = dark ? 'text-gray-400' : 'text-gray-500';
    const bar = dark ? 'bg-gray-700' : 'bg-gray-200';

    return (
        <div
            className={`group relative rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${card} ${isPlaying ? 'ring-2 ring-emerald-500/60' : ''}`}
            style={{ boxShadow: isPlaying ? '0 0 32px rgba(16,185,129,0.15)' : undefined }}
        >
            {/* Thumbnail */}
            <div className="relative aspect-square overflow-hidden bg-gray-800">
                {music.thumbnail ? (
                    <img
                        src={music.thumbnail}
                        alt={music.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className={`w-full h-full flex items-center justify-center ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <span style={{ fontSize: 48 }}>🎵</span>
                    </div>
                )}

                {/* Play overlay */}
                <div
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-300 cursor-pointer
                        ${isPlaying ? 'bg-black/20' : 'bg-black/0 group-hover:bg-black/40'}`}
                    onClick={() => onPlay(music._id)}
                >
                    <button
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300
                            bg-emerald-500 hover:bg-emerald-400 hover:scale-110 shadow-xl
                            ${isPlaying ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100'}`}
                    >
                        {isPlaying ? (
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Playing indicator */}
                {isPlaying && (
                    <div className="absolute top-3 right-3 flex gap-0.5 items-end h-5">
                        {[1, 2, 3, 4].map(i => (
                            <div
                                key={i}
                                className="w-1 bg-emerald-400 rounded-full"
                                style={{
                                    animation: `musicBar${i} 0.8s ease-in-out infinite`,
                                    animationDelay: `${i * 0.1}s`,
                                    height: `${8 + i * 4}px`
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-4">
                <h3 className={`font-bold text-base truncate mb-0.5 ${dark ? 'text-white' : 'text-gray-900'}`}>
                    {music.title}
                </h3>
                <p className={`text-sm truncate mb-3 ${sub}`}>
                    {music.artist?.username || 'Unknown Artist'}
                </p>

                {/* Progress bar */}
                <div className="space-y-2">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={progress}
                        onChange={handleSeek}
                        className="w-full h-1 rounded-full appearance-none cursor-pointer accent-emerald-500"
                        style={{ background: `linear-gradient(to right, #10b981 ${progress}%, ${dark ? '#374151' : '#e5e7eb'} ${progress}%)` }}
                    />
                    <div className={`flex justify-between text-xs ${sub}`}>
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Volume */}
                <div className="flex items-center gap-2 mt-3">
                    <svg className={`w-4 h-4 flex-shrink-0 ${sub}`} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                    </svg>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        onChange={handleVolume}
                        className="flex-1 h-1 rounded-full appearance-none cursor-pointer accent-emerald-500"
                        style={{ background: `linear-gradient(to right, #10b981 ${volume * 100}%, ${dark ? '#374151' : '#e5e7eb'} ${volume * 100}%)` }}
                    />
                </div>
            </div>

            <audio
                ref={audioRef}
                src={music.url}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => onPlay(null)}
            />
        </div>
    );
}

// ─── Skeleton Card ───────────────────────────────────────────────────
function SkeletonCard({ dark }) {
    const base = dark ? 'bg-gray-700' : 'bg-gray-200';
    const card = dark ? 'bg-gray-900 border-gray-700/50' : 'bg-white border-gray-200';
    return (
        <div className={`rounded-2xl border overflow-hidden animate-pulse ${card}`}>
            <div className={`aspect-square ${base}`} />
            <div className="p-4 space-y-3">
                <div className={`h-4 rounded-full ${base} w-3/4`} />
                <div className={`h-3 rounded-full ${base} w-1/2`} />
                <div className={`h-1 rounded-full ${base} w-full mt-4`} />
            </div>
        </div>
    );
}

// ─── Main Component ──────────────────────────────────────────────────
export default function LocalFeed() {
    const { theme } = useTheme();                         
    const dark = theme === 'dark';

    const [musics, setMusics] = useState([]);             
    const [musicLoad, setMusicLoad] = useState(true);
    const [error, setError] = useState(null);
    const [playingId, setPlayingId] = useState(null);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [search, setSearch] = useState('');

    
    useEffect(() => {
        fetchMusic();
    }, [page]);

    async function fetchMusic() {
        try {
            setMusicLoad(true);
            setError(null);
            const res = await axios.get(                    
                `${API}/music/get-music?page=${page}&limit=12`,
                { withCredentials: true }
            );
            if (res.data.musics) {                        
                setMusics(res.data.musics);
                setPagination(res.data.pagination);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to load music');
        } finally {
            setMusicLoad(false);
        }
    }

    function handlePlay(id) {
        setPlayingId(prev => prev === id ? null : id);
    }

    // Filter by search
    const filtered = musics.filter(m =>
        m.title?.toLowerCase().includes(search.toLowerCase()) ||
        m.artist?.username?.toLowerCase().includes(search.toLowerCase())
    );

    const bg = dark ? 'bg-gray-950' : 'bg-gray-50';
    const text = dark ? 'text-white' : 'text-gray-900';
    const sub = dark ? 'text-gray-400' : 'text-gray-500';
    const inputBg = dark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400';

    return (
        <>
            {/* Keyframe animations */}
            <style>{`
                @keyframes musicBar1 { 0%,100%{height:8px} 50%{height:16px} }
                @keyframes musicBar2 { 0%,100%{height:12px} 50%{height:6px} }
                @keyframes musicBar3 { 0%,100%{height:16px} 50%{height:10px} }
                @keyframes musicBar4 { 0%,100%{height:10px} 50%{height:18px} }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .fade-up {
                    animation: fadeUp 0.4s ease forwards;
                    opacity: 0;
                }
            `}</style>

            <Navbar />

            <main className={`min-h-screen ${bg} ${text} transition-colors duration-300`}>

                {/* ── Header ── */}
                <div className={`sticky top-0 z-20 backdrop-blur-md border-b ${dark ? 'bg-gray-950/80 border-gray-800' : 'bg-gray-50/80 border-gray-200'}`}>
                    <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Local Feed
                                {pagination && (
                                    <span className={`ml-2 text-sm font-normal ${sub}`}>
                                        {pagination.total} tracks
                                    </span>
                                )}
                            </h1>
                            <p className={`text-sm ${sub}`}>Discover music from artists around you</p>
                        </div>

                        {/* Search */}
                        <div className="relative w-full sm:w-72">
                            <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search songs or artists..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-emerald-500/50 ${inputBg}`}
                            />
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-8">

                    {/* ── Now Playing Banner ── */}
                    {playingId && (() => {
                        const m = musics.find(x => x._id === playingId);
                        if (!m) return null;
                        return (
                            <div className={`mb-6 px-5 py-3 rounded-2xl flex items-center gap-4 border
                                ${dark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'}`}>
                                <div className="flex gap-0.5 items-end h-5">
                                    {[1,2,3,4].map(i => (
                                        <div key={i} className="w-1 bg-emerald-500 rounded-full"
                                            style={{ animation: `musicBar${i} 0.8s ease-in-out infinite`, animationDelay: `${i*0.1}s`, height: `${8+i*4}px` }} />
                                    ))}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-emerald-600 text-xs font-semibold uppercase tracking-wider">Now Playing</p>
                                    <p className={`font-bold truncate ${dark ? 'text-white' : 'text-gray-900'}`}>{m.title}</p>
                                </div>
                                <button
                                    onClick={() => setPlayingId(null)}
                                    className={`text-xs px-3 py-1 rounded-lg border transition ${dark ? 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20' : 'border-emerald-300 text-emerald-600 hover:bg-emerald-100'}`}
                                >
                                    Stop
                                </button>
                            </div>
                        );
                    })()}

                    {/* ── Error State ── */}
                    {error && (
                        <div className={`rounded-2xl p-6 mb-6 text-center border ${dark ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
                            <p className="text-2xl mb-2">⚠️</p>
                            <p className="font-semibold">{error}</p>
                            <button
                                onClick={fetchMusic}
                                className="mt-3 px-4 py-2 bg-red-500 text-white text-sm rounded-xl hover:bg-red-600 transition"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* ── Loading Skeletons ── */}
                    {musicLoad && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <SkeletonCard key={i} dark={dark} />
                            ))}
                        </div>
                    )}

                    {/* ── Empty State ── */}
                    {!musicLoad && !error && filtered.length === 0 && (
                        <div className="text-center py-24">
                            <p className="text-6xl mb-4">🎵</p>
                            <h3 className={`text-xl font-bold mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
                                {search ? 'No results found' : 'No music yet'}
                            </h3>
                            <p className={sub}>
                                {search ? `Nothing matches "${search}"` : 'Be the first to upload a track!'}
                            </p>
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm hover:bg-emerald-600 transition"
                                >
                                    Clear search
                                </button>
                            )}
                        </div>
                    )}

                    {/* ── Music Grid ── */}
                    {!musicLoad && !error && filtered.length > 0 && (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {filtered.map((music, i) => (
                                    <div
                                        key={music._id}
                                        className="fade-up"
                                        style={{ animationDelay: `${i * 50}ms` }}
                                    >
                                        <MusicCard
                                            music={music}
                                            isPlaying={playingId === music._id}
                                            onPlay={handlePlay}
                                            dark={dark}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* ── Pagination ── */}
                            {pagination && pagination.totalPages > 1 && (
                                <div className="flex items-center justify-center gap-3 mt-10">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className={`px-4 py-2 rounded-xl text-sm font-semibold border transition disabled:opacity-40
                                            ${dark ? 'border-gray-700 hover:bg-gray-800 text-gray-300' : 'border-gray-300 hover:bg-gray-100 text-gray-700'}`}
                                    >
                                        ← Prev
                                    </button>

                                    <div className="flex gap-1">
                                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                                            <button
                                                key={p}
                                                onClick={() => setPage(p)}
                                                className={`w-9 h-9 rounded-xl text-sm font-bold transition
                                                    ${page === p
                                                        ? 'bg-emerald-500 text-white'
                                                        : dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                        disabled={page === pagination.totalPages}
                                        className={`px-4 py-2 rounded-xl text-sm font-semibold border transition disabled:opacity-40
                                            ${dark ? 'border-gray-700 hover:bg-gray-800 text-gray-300' : 'border-gray-300 hover:bg-gray-100 text-gray-700'}`}
                                    >
                                        Next →
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}

