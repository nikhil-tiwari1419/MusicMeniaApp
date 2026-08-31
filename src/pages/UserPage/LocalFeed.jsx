import { useEffect, useMemo, useRef, useState } from "react";
import { useAudio } from "../../Context/AudioContext";
import { useTheme } from '../../Context/Theme';
import { useMusicFeed } from "../../hooks/useMusicFeed";
import DesktopMusicLayout from "../../Components/DesktopMusicLayout";
import MobileMusicLayout from "../../Components/MobileMusicLayout";

export default function LocalFeed() {
    const { theme } = useTheme();
    const dark = theme === 'dark';

    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const autoAdvanceRef = useRef(false);

    const {
        playingTrack, isPlaying, togglePlay, playNext, playPrevious,
        repeat, toggleRepeat, queue, progress, currentTime, duration,
        handleSeek, handleVolume, volume, stopMusic, registerQueueEndHandler,
    } = useAudio();

    const playingId = playingTrack?._id || null;

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(timer);
    }, [search]);

    const {
        data,
        isLoading,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        error,
        refetch,
    } = useMusicFeed(5);

    // Flatten all fetched pages into one array
    const musics = useMemo(
        () => data?.pages.flatMap(page => page.musics) ?? [],
        [data]
    );

    const total = data?.pages?.[0]?.pagination?.total ?? 0;

    // Auto-advance: when current queue ends, fetch next page instead of setPage
    useEffect(() => {
        function handleQueueEnd() {
            if (!hasNextPage) {
                stopMusic();
                return;
            }
            autoAdvanceRef.current = true;
            fetchNextPage();
        }
        registerQueueEndHandler(handleQueueEnd);
        return () => registerQueueEndHandler(null);
    }, [hasNextPage, fetchNextPage]);

    // Once new page lands, auto-play the first newly-added track
    const prevLengthRef = useRef(0);
    useEffect(() => {
        if (autoAdvanceRef.current && musics.length > prevLengthRef.current) {
            autoAdvanceRef.current = false;
            const newTrack = musics[prevLengthRef.current];
            togglePlay(newTrack, musics);
        }
        prevLengthRef.current = musics.length;
    }, [musics]);

    // Client-side search filter (same as before — searches whatever is already fetched)
    const filtered = useMemo(() => {
        if (!debouncedSearch) return musics;
        return musics.filter(m =>
            m.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            m.artist?.username?.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
    }, [musics, debouncedSearch]);

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
        musicLoad: isLoading,
        isFetchingNextPage,
        error: error?.message || null,
        filtered,
        playingId,
        playingTrack,
        togglePlay,
        playNext,
        playPrevious,
        repeat,
        toggleRepeat,
        queue,
        setSearch,
        search,
        fetchMusic: refetch,
        fetchNextPage,
        hasNextPage,
        progress,
        currentTime,
        duration,
        handleSeek,
        handleVolume,
        volume,
        isPlaying,
    };

    return (
        <main className={`min-h-screen ${bg} ${text} transition-colors duration-300`}>
            <div className={`sticky top-0 z-20 backdrop-blur-lg border-b ${headerBg}`}>
                <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                        <h1 className={`text-2xl font-mono tracking-tight ${text}`}>
                            Local Feed
                            {total > 0 && (
                                <span className={`ml-2 text-sm font-normal ${sub}`}>
                                    {total} Tracks
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
            <MobileMusicLayout {...sharedProps} />
        </main>
    );
}

