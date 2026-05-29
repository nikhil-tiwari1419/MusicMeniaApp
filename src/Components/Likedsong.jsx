import { useEffect, useState } from "react";
import { useAudio } from "../Context/AudioContext";
import { useTheme } from '../Context/Theme';
import axios from 'axios';
import Navbar from './Navbar';
import DesktopMusicLayout from "./DesktopMusicLayout";
import MobileMusicLayout from "./MobileMusicLayout";
import { handleError } from "../utils/errorHandler";

const API = import.meta.env.VITE_API_URL;

export default function Likedsong() {
    const { theme } = useTheme();
    const dark = theme === 'dark';
    // Data state
    const [musics, setMusics] = useState([]);
    const [musicLoad, setMusicLoad] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [pagination, setpagination] = useState(null);

    // ui state
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [likedSongs, setLikedSongs] = useState([]);

    //Global audio engine from context
    const {
        playingTrack,
        isPlaying,
        togglePlay,
        playNext,
        playPrevious,
        repeat,
        toggleRepeat,
        queue,
        progress,
        currentTime,
        duration,
        handleSeek,
        handleVolume,
        volume } = useAudio();

    const playingId = playingTrack?._id || null;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { fetchLikedMusic(); }, [page]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    async function fetchLikedMusic() {
        try {
            setMusicLoad(true);
            setError(null);
            // Assuming endpoint for liked music
            const res = await axios.get(`${API}/music/liked?page=${page}&limit=12`, { withCredentials: true });
            const fetchedMusics = res.data.musics || res.data.liked || [];
            setMusics(fetchedMusics);
            setLikedSongs(fetchedMusics.map(m => m._id));
            if (res.data.pagination) setpagination(res.data.pagination);
        } catch (error) {
            const message = handleError(error, "Failed to load liked music", {
                logMessage: "Failed to load liked music:",
            });
            setError(message);
        } finally {
            setMusicLoad(false);
        }
    }

    const handleToggleLike = async (musicId) => {
        const isLiked = likedSongs.includes(musicId);
        setLikedSongs(prev => isLiked ? prev.filter(id => id !== musicId) : [...prev, musicId]);
        // Also remove from local list instantly on LikedSongs page if unliked
        if (isLiked) {
            setMusics(prev => prev.filter(m => m._id !== musicId));
        }

        try {
            await axios.post(`${API}/music/like/${musicId}`, {}, { withCredentials: true });
        } catch (err) {
            handleError(err, "Failed to update like", {
                logMessage: "Failed to toggle like:",
            });
            // Revert state on error
            setLikedSongs(prev => !isLiked ? prev.filter(id => id !== musicId) : [...prev, musicId]);
            fetchLikedMusic();
        }
    };

    const filtered = musics.filter(m =>
        m.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        m.artist?.username?.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    const bg = dark ? 'bg-gray-950' : 'bg-gray-50';
    const text = dark ? 'text-white' : 'text-gray-900';
    const sub = dark ? 'text-gray-400' : 'text-gray-500';
    const inputBg = dark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400';
    const headerBg = dark ? 'bg-gray-950/85 border-gray-800' : 'bg-gray-50/50 border-gray-200';

    const sharedProps = {
        dark,
        musicLoad,
        error,
        filtered,
        playingId,
        playingTrack,
        togglePlay,
        playNext,
        playPrevious,
        repeat,
        toggleRepeat,
        queue,
        page,
        setPage,
        setSearch,
        pagination,
        search,
        fetchMusic: fetchLikedMusic,
        progress,
        currentTime,
        duration,
        handleSeek,
        handleVolume,
        volume,
        isPlaying,
        likedSongs,
        onToggleLike: handleToggleLike,
    };

    return (
        <>
            <style>{`
                @keyframes mBar1 { 0%,100%{height:5px}  50%{height:13px} }
                @keyframes mBar2 { 0%,100%{height:9px}  50%{height:4px}  }
                @keyframes mBar3 { 0%,100%{height:13px} 50%{height:7px}  }
                @keyframes mBar4 { 0%,100%{height:7px}  50%{height:15px} }
                @keyframes fadeUp {
                    from { opacity:0; transform:translateY(14px); }
                    to   { opacity:1; transform:translateY(0);    }
                }
                .fade-up { animation: fadeUp 0.32s ease forwards; opacity:0; }
            `}</style>

            <Navbar />

            <main className={`min-h-screen ${bg} ${text} transition-colors duration-300`}>
                <div className={`sticky top-13 z-20 backdrop-blur-lg border-b ${headerBg}`}>
                    <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                            <h1 className={`text-2xl font-bold tracking-tight ${text}`}>
                                Liked Songs
                                {pagination && (
                                    <span className={`ml-2 text-sm font-normal ${sub}`}>
                                        {pagination.total} tracks
                                    </span>
                                )}
                            </h1>
                            <p className={`text-sm ${sub}`}>Your favorite tracks</p>
                        </div>

                        <div className="relative w-full sm:w-72">
                            <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search liked songs..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-emerald-500/50 ${inputBg}`}
                            />
                        </div>
                    </div>
                </div>

                <DesktopMusicLayout {...sharedProps} />
                <MobileMusicLayout  {...sharedProps} />
            </main>
        </>
    )
}
