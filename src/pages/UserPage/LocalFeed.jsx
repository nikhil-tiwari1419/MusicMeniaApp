import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import { useAudio } from "../../Context/AudioContext";
import { useTheme } from '../../Context/Theme';
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
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [likedSongs, setLikedSongs] = useState([]);

    // Set to true right before we bump `page` to auto-advance into the
    // next pagination page after the current queue finishes. The effect
    // that watches `musics` checks this flag to decide whether to
    // auto-play the first track of the newly-fetched page.
    const autoAdvanceRef = useRef(false);

    //Globle audio engine from context 
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
        volume,
        stopMusic,
        registerQueueEndHandler,
    } = useAudio();

    // Derive playingId from the full track object
    const playingId = playingTrack?._id || null;

    useEffect(() => {
        if (debouncedSearch && page !== 1) {
            setPage(1);
        } else {
            fetchMusic();
        }
    }, [page, debouncedSearch]);

    // fetch liked songs
    useEffect(() => { fetchLikedSongs(); }, []);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    // Auto-advance across pagination pages --
    // Registered with AudioContext; called when the last track in the
    // CURRENT page's queue finishes playing. We move to the next page
    // (if one exists) and let the `musics`-watching effect below start
    // playback once the new page's tracks have loaded.
    useEffect(() => {
        function handleQueueEnd() {
            // Searching returns everything in one "page" already (limit 1000),
            // so pagination.totalPages will be 1 and we correctly fall through
            // to stopping playback below — nothing left to advance to.
            if (!pagination || page >= pagination.totalPages) {
                stopMusic();
                return;
            }
            autoAdvanceRef.current = true;
            setPage(p => p + 1);
        }

        registerQueueEndHandler(handleQueueEnd);

        // Unregister on cleanup so a stale closure never fires after
        // this component unmounts or these values change.
        return () => registerQueueEndHandler(null);
    }, [page, pagination]);

    // Once the next page's tracks land in `musics`, if we got here via
    // auto-advance, start playing the first track of the new page and
    // hand the whole new page to the context as the fresh queue.
    useEffect(() => {
        if (autoAdvanceRef.current && musics.length > 0) {
            autoAdvanceRef.current = false;
            togglePlay(musics[0], musics);
        }
    }, [musics]);

    async function fetchLikedSongs() {
        try {
            const res = await axios.get(`${API}/music/liked`, { withCredentials: true });
            const fetchedMusics = res.data.musics || res.data.liked || [];
            setLikedSongs(fetchedMusics.map(m => m._id));
        } catch (err) {
            console.error(err);
        }
    }

    const handleToggleLike = async (musicId) => {
        const isLiked = likedSongs.includes(musicId);
        setLikedSongs(prev => isLiked ? prev.filter(id => id !== musicId) : [...prev, musicId]);
        try {
            await axios.post(`${API}/music/like/${musicId}`, {}, { withCredentials: true });
        } catch (err) {
            console.error('Failed to toggle like:', err);
            setLikedSongs(prev => !isLiked ? prev.filter(id => id !== musicId) : [...prev, musicId]);
        }
    };

    async function fetchMusic() {
        try {
            setMusicLoad(true);
            setError(null);

            const currentLimit = debouncedSearch ? 1000 : 10;

            const res = await axios.get(
                `${API}/music/get-music?page=${page}&limit=${currentLimit}`,
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

    const filtered = musics.filter(m =>
        m.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        m.artist?.username?.toLowerCase().includes(debouncedSearch.toLowerCase())
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
        fetchMusic,
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

            <main className={`min-h-screen ${bg} ${text}  transition-colors duration-300`}>

                <div className={`sticky top-0 z-20 backdrop-blur-lg border-b ${headerBg}`}>
                    <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                            <h1 className={`text-2xl font-mono tracking-tight ${text}`}>
                                Local Feed
                                {pagination && (
                                    <span className={`ml-2 text-sm font-normal ${sub}`}>
                                        {pagination.total} Tracks
                                    </span>
                                )}
                            </h1>
                            <p className={`text-sm font-mono ${sub}`}>Discover music from artists around you</p>
                        </div>

                        <div className="relative w-full sm:w-92">
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
                                className={`font-semibold rounded-xl w-full pl-10 pr-4 py-2 border text-sm outline-none
                                    transition-all focus:ring-2 focus:ring-emerald-500/90 ${inputBg}`}
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

