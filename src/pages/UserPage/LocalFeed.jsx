import { useEffect, useState, useRef } from "react";
import { useAudio } from "../../Context/AudioContext";
import { useTheme } from '../../Context/Theme';
import axios from 'axios';
import Navbar from '../../Components/Navbar';
import DesktopMusicLayout from "../../Components/DesktopMusicLayout";
import MobileMusicLayout from "../../Components/MobileMusicLayout";

const API = import.meta.env.VITE_API_URL;

export default function LocalFeed() {
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

    //Globle audio engine from context 
    const {
        playingTrack,
        isPlaying,
        togglePlay,
        progress,
        currentTime,
        duration,
        handleSeek,
        handleVolume,
        volume } = useAudio();

        // Derive playingId from the full track object
        const playingId = playingTrack?._id || null;


        // fetch music
    useEffect(() => { fetchMusic(); }, [page]);

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
                setpagination(res.data.pagination);
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Failed to load music');
        } finally {
            setMusicLoad(false);
        }
    }
    //client side filter search
    const filtered = musics.filter(m =>
        m.title?.toLowerCase().includes(search.toLowerCase()) ||
        m.artist?.username?.toLowerCase().includes(search.toLowerCase())
    );


    const bg = dark ? 'bg-gray-950' : 'bg-gray-50';
    const text = dark ? 'text-white' : 'text-gray-900';
    const sub = dark ? 'text-gray-400' : 'text-gray-500';

    const inputBg = dark
        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400';

    const headerBg = dark
        ? 'bg-gray-950/85 border-gray-800'
        : 'bg-gray-50/50 border-gray-200';


    const sharedProps = {
        dark,
        musicLoad,
        error,
        filtered,       // already-filtered track array
        playingId,      // _id string or null
        playingTrack,   // full track object or null
        togglePlay,     // fn(id) — the only play control both layouts use
        page,
        setPage,
        setSearch,
        pagination,
        search,
        fetchMusic,
        // Audio controls (for seekbar/volume in both layouts)
        progress,
        currentTime,
        duration,
        handleSeek,
        handleVolume,
        volume,
        isPlaying,
    };

    return (
        <>
            {/* ── Global CSS animations (shared by both layouts) ──
                mBar1-4  : the equaliser bar bounce
                fadeUp   : card entrance animation
                These are here (not in layouts) because they are
                global @keyframes — defining them twice causes no bug
                but is wasteful.
            */}
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

                {/* ════════════════════════════════════════════════
                    STICKY HEADER  —  shared by both layouts
                    Lives here (not in layouts) because it's truly
                    shared and must not duplicate.
                ════════════════════════════════════════════════ */}
                <div className={`sticky top-13 z-20 backdrop-blur-lg border-b ${headerBg}`}>
                    <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                            <h1 className={`text-2xl font-bold tracking-tight ${text}`}>
                                Local Feed
                                {pagination && (
                                    <span className={`ml-2 text-sm font-normal ${sub}`}>
                                        {pagination.total} tracks
                                    </span>
                                )}
                            </h1>
                            <p className={`text-sm ${sub}`}>Discover music from artists around you</p>
                        </div>

                        {/* Search input */}
                        <div className="relative w-full sm:w-72">
                            <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub}`}
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search songs or artists..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm outline-none
                                    transition-all focus:ring-2 focus:ring-emerald-500/50 ${inputBg}`}
                            />
                        </div>
                    </div>
                </div>

                {/* ════════════════════════════════════════════════
                    LAYOUT COMPONENTS
                    Each handles its own visibility:
                      DesktopMusicLayout → hidden sm:block  (inside it)
                      MobileMusicLayout  → sm:hidden         (inside it)
                    So both are always rendered in the tree but only
                    one is visible at a time via CSS breakpoints.
                ════════════════════════════════════════════════ */}
                <DesktopMusicLayout {...sharedProps} />
                <MobileMusicLayout  {...sharedProps} />

            </main>
        </>
    )
}
