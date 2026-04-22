import { useEffect, useState } from 'react';
import { useTheme } from '../../Context/Theme';
import Musics from '../../Components/Musics';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

// ── Skeleton Card ─────────────────────────────────────────
function SkeletonCard({ dark }) {
    const base = dark ? 'bg-gray-700/60' : 'bg-gray-200';
    const card = dark ? 'bg-gray-800/60 border-gray-700/40' : 'bg-white border-gray-200';
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

export default function Mypost() {
    const [load, setLoad] = useState(true);
    const [musics, setMusics] = useState([]);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [deleteId, setDeleteId] = useState(null); // tracks which is being deleted

    const { theme } = useTheme();
    const dark = theme === 'dark';
    const navigate = useNavigate();

    useEffect(() => {
        fetchMusics();
    }, []);

    async function fetchMusics() {
        try {
            setLoad(true);
            setError(null);
            const res = await axios.get(`${API}/music/my-music`, { withCredentials: true });
            if (res.data.musics) {
                setMusics(res.data.musics);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to load your music');
        } finally {
            setLoad(false);
        }
    }

    async function handleDelete(postId) {
        if (!window.confirm('Are you sure you want to delete this track?')) return;
        setDeleteId(postId);
        try {
            await axios.delete(`${API}/music/delete-music/${postId}`, { withCredentials: true });
            setMusics(prev => prev.filter(m => m._id !== postId));
            toast.success('Track deleted successfully');
        } catch (err) {
            console.error('Error deleting:', err);
            toast.error(err.response?.data?.message || 'Failed to delete track');
        } finally {
            setDeleteId(null);
        }
    }

    // Filter by search
    const filtered = musics.filter(m =>
        m.title?.toLowerCase().includes(search.toLowerCase())
    );

    // ── Theme tokens ──────────────────────────────────────
    const bg      = dark ? 'bg-gray-950'              : 'bg-gray-50';
    const text     = dark ? 'text-white'               : 'text-gray-900';
    const sub      = dark ? 'text-gray-400'            : 'text-gray-500';
    const card     = dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
    const inputBg  = dark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400';
    const headerBg = dark ? 'bg-gray-950/80 border-gray-800' : 'bg-gray-50/80 border-gray-200';

    return (
        <div className={`min-h-screen ${bg} ${text} transition-colors duration-300`}>

            <style>{`
                @keyframes fadeUp {
                    from { opacity:0; transform:translateY(16px); }
                    to   { opacity:1; transform:translateY(0); }
                }
                .fade-up { animation: fadeUp 0.35s ease forwards; opacity: 0; }
            `}</style>

            {/* ── Sticky Header ── */}
            <div className={`sticky top-0 z-20 backdrop-blur-md border-b ${headerBg}`}>
                <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/artist-Dashboard')}
                            className={`p-2 rounded-xl border transition hover:scale-105 ${dark ? 'border-gray-700 hover:bg-gray-800 text-gray-400' : 'border-gray-300 hover:bg-gray-100 text-gray-600'}`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">My Tracks</h1>
                            <p className={`text-xs ${sub}`}>
                                {load ? 'Loading...' : `${musics.length} track${musics.length !== 1 ? 's' : ''} uploaded`}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        {/* Search */}
                        <div className="relative flex-1 sm:w-64">
                            <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search your tracks..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className={`w-full pl-9 pr-4 py-2 rounded-xl border text-sm outline-none transition focus:ring-2 focus:ring-emerald-500/40 ${inputBg}`}
                            />
                        </div>

                        {/* Upload button */}
                        <button
                            onClick={() => navigate('/create-music')}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold rounded-xl transition whitespace-nowrap"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Upload
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">

                {/* ── Stats Strip ── */}
                {!load && musics.length > 0 && (
                    <div className={`grid grid-cols-3 gap-3 mb-8 p-4 rounded-2xl border ${card}`}>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-emerald-500">{musics.length}</p>
                            <p className={`text-xs ${sub}`}>Total Tracks</p>
                        </div>
                        <div className="text-center border-x ${dark ? 'border-gray-700' : 'border-gray-200'}">
                            <p className="text-2xl font-bold text-blue-400">
                                {musics.filter(m => m.thumbnail).length}
                            </p>
                            <p className={`text-xs ${sub}`}>With Thumbnail</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-purple-400">
                                {musics.filter(m => !m.thumbnail).length}
                            </p>
                            <p className={`text-xs ${sub}`}>No Thumbnail</p>
                        </div>
                    </div>
                )}

                {/* ── Error State ── */}
                {error && (
                    <div className={`rounded-2xl p-6 mb-6 text-center border ${dark ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
                        <p className="text-3xl mb-2">⚠️</p>
                        <p className="font-semibold mb-3">{error}</p>
                        <button
                            onClick={fetchMusics}
                            className="px-4 py-2 bg-red-500 text-white text-sm rounded-xl hover:bg-red-600 transition"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* ── Loading Skeletons ── */}
                {load && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <SkeletonCard key={i} dark={dark} />
                        ))}
                    </div>
                )}

                {/* ── Empty State ── */}
                {!load && !error && musics.length === 0 && (
                    <div className={`rounded-2xl border p-16 text-center ${card}`}>
                        <p className="text-6xl mb-4">🎵</p>
                        <h3 className={`text-xl font-bold mb-2 ${text}`}>No tracks yet</h3>
                        <p className={`text-sm mb-6 ${sub}`}>Upload your first track and share it with the world</p>
                        <button
                            onClick={() => navigate('/create-music')}
                            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition"
                        >
                            Upload First Track
                        </button>
                    </div>
                )}

                {/* ── No Search Results ── */}
                {!load && !error && musics.length > 0 && filtered.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-4xl mb-3">🔍</p>
                        <p className={`font-semibold ${text}`}>No tracks match "{search}"</p>
                        <button
                            onClick={() => setSearch('')}
                            className="mt-3 text-sm text-emerald-500 hover:text-emerald-400 transition"
                        >
                            Clear search
                        </button>
                    </div>
                )}

                {/* ── Music Grid ── */}
                {!load && !error && filtered.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filtered.map((music, i) => (
                            <div
                                key={music._id}
                                className="fade-up relative"
                                style={{ animationDelay: `${i * 50}ms` }}
                            >
                                {/* Delete loading overlay */}
                                {deleteId === music._id && (
                                    <div className="absolute inset-0 z-10 bg-black/50 rounded-2xl flex items-center justify-center">
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}
                                <Musics musics={music} onDelete={handleDelete} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
