import { useEffect, useRef } from 'react';
import { Play, Pause, Music2, Volume2, Heart, SkipBack, SkipForward, Repeat } from 'lucide-react';
import RecentlyPlayed from './RecentlyPlayed';

function EqBars({ size = 'sm' }) {
    const w = size === 'lg' ? 'w-1' : 'w-[3px]';
    const heights = size === 'lg'
        ? [[8, 18], [12, 6], [18, 10], [10, 20]]
        : [[5, 12], [8, 4], [12, 7], [7, 14]];

    return (
        <div className="flex gap-[4px] items-end">
            {heights.map(([a], i) => (
                <div key={i} className={`${w} bg-blue-400 rounded-xl`}
                    style={{
                        animation: `mBar${i + 1} 0.7s ease-in-out infinite`,
                        animationDelay: `${i * 0.12}s`,
                        height: `${a}px`,
                    }}
                />
            ))}
        </div>
    );
}

function fmt(s) {
    if (!s || isNaN(s)) return '0:00';
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
}

function DesktopMusicCard({ music, isPlaying, isActuallyPlaying, onPlay, dark }) {
    return (
        <div
            className={`group relative rounded border border-black transition-all duration-150 cursor-pointer
                ${isPlaying
                    ? 'bg-blue-400 shadow-[4px_4px_0_#000]'
                    : dark
                        ? 'bg-zinc-900'
                        : 'bg-white'
                }`}
        >
            {/* Thumbnail */}
            <div className="relative rounded aspect-square overflow-hidden border-black bg-zinc-800">
                {music.thumbnail
                    ? <img src={music.thumbnail} alt={music.title} loading="lazy"
                        className="w-full h-full object-cover" />
                    : <div className={`w-full h-full flex items-center justify-center ${dark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                        <Music2 size={32} className={dark ? 'text-zinc-600' : 'text-zinc-400'} />
                    </div>
                }

                {/* Play overlay */}
                <div onClick={() => onPlay(music)}
                    className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/50 transition-all duration-150">
                    <button
                        className={`w-12 h-12 rounded-2xl border-2 border-black flex items-center justify-center transition-all duration-150
                            bg-blue-400 shadow-[3px_3px_0_#000]
                            ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        {isActuallyPlaying
                            ? <Pause size={18} className="text-black fill-black" />
                            : <Play size={18} className="text-black fill-black ml-0.5" />}
                    </button>
                </div>

                {/* EQ badge */}
                {isPlaying && (
                    <div className="absolute top-2 right-2 bg-black px-2 py-1 flex items-end gap-[2px] h-6">
                        <EqBars size="sm" />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="px-3 pt-2.5 pb-3">
                <h3 className={`font-semibold text-sm truncate tracking-tight ${isPlaying ? 'text-black' : dark ? 'text-white' : 'text-black'}`}>
                    {music.title}
                </h3>
                <p className={`text-xs truncate mt-0.5 font-mono ${isPlaying ? 'text-black/70' : dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {music.artist?.username || 'Unknown Artist'}
                </p>
            </div>
        </div>
    );
}

function DesktopSkeletonCard({ dark }) {
    return (
        <div className={`border-2 border-black shadow-[4px_4px_0_#000] rounded-xl animate-pulse ${dark ? 'bg-zinc-900' : 'bg-white'}`}>
            <div className={`aspect-square border-b-2 border-black ${dark ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
            <div className="p-3 space-y-2">
                <div className={`h-3 ${dark ? 'bg-zinc-700' : 'bg-zinc-300'} w-3/4`} />
                <div className={`h-2.5 ${dark ? 'bg-zinc-700' : 'bg-zinc-300'} w-1/2`} />
            </div>
        </div>
    );
}

// Now Playing Bar 

function NowPlayingBar({
    dark, playingTrack, isPlaying,
    togglePlay, playNext, playPrevious,
    repeat, toggleRepeat,
    queue,
    progress, currentTime, duration,
    handleSeek, handleVolume, volume,
}) {
    const currentQueueIndex =
        queue?.length > 0 && playingTrack
            ? queue.findIndex(t => t._id === playingTrack._id)
            : -1;
    const hasNext = currentQueueIndex !== -1 && currentQueueIndex < (queue?.length || 0) - 1;
    const hasPrev = currentQueueIndex > 0;

    return (
        <div
            className={`fixed bottom-0 left-0 right-0 z-50 border-t-2 border-black
                ${dark ? 'bg-zinc-900' : 'bg-white'}`}
        >
            {/* ── Seek bar — properly constrained with padding ── */}
            <div className="px-3 md:px-6 lg:px-8 pt-2 pb-1">
                <div className="relative h-1.5 bg-zinc-300 cursor-pointer rounded group">
                    <div
                        className="h-full bg-blue-400 transition-all duration-100 rounded"
                        style={{ width: `${progress}%` }}
                    />
                    {/* Thumb dot */}
                    <div
                        className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2
                            w-3 h-3 rounded-full border-2 border-black pointer-events-none
                            ${dark ? 'bg-white' : 'bg-blue-900'}`}
                        style={{ left: `${progress}%` }}
                    />
                    <input
                        type="range" min="0" max="100" step="0.1"
                        value={progress}
                        onChange={e => handleSeek(parseFloat(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>
            </div>

            {/* ── Three-zone row ── */}
            <div className="flex items-center justify-between gap-2 px-3 md:px-6 lg:px-8 py-2.5">

                {/* ── ZONE 1: Track info ── */}
                {/* min-w-0 is critical — without it flex children won't shrink below content size */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {/* Album art */}
                    <div className="relative flex-shrink-0 w-9 h-9 md:w-10 md:h-10 border-2 border-black bg-zinc-800 overflow-hidden">
                        {playingTrack.thumbnail
                            ? <img src={playingTrack.thumbnail} alt={playingTrack.title}
                                className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center">
                                <Music2 size={14} className="text-zinc-500" />
                            </div>
                        }
                        {isPlaying && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <EqBars size="sm" />
                            </div>
                        )}
                    </div>

                    {/* Title + artist — truncate so they never overflow */}
                    <div className="min-w-0">
                        <p className={`font-semibold text-xs md:text-sm truncate tracking-tight
                            ${dark ? 'text-white' : 'text-black'}`}>
                            {playingTrack.title}
                        </p>
                        <p className={`text-[10px] md:text-xs truncate font-mono
                            ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                            {playingTrack.artist?.username || 'Unknown Artist'}
                        </p>
                    </div>
                </div>

                {/* ── ZONE 2: Transport controls — flex-shrink-0 so they never collapse ── */}
                <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
                    {/* Repeat */}
                    <button
                        onClick={toggleRepeat}
                        title="Repeat"
                        className={`w-8 h-8 md:w-10 md:h-10 border-2 flex items-center justify-center rounded transition-all
                            ${repeat
                                ? 'bg-violet-400 border-black shadow-[2px_2px_0_#000]'
                                : dark
                                    ? 'bg-zinc-800 border-zinc-600 hover:border-zinc-400'
                                    : 'bg-white border-black hover:bg-zinc-100'
                            }`}
                    >
                        <Repeat size={14} className={dark && !repeat ? 'text-zinc-400' : 'text-black'} />
                    </button>

                    {/* Previous */}
                    <button
                        onClick={playPrevious}
                        disabled={!hasPrev}
                        title="Previous"
                        className={`w-8 h-8 md:w-10 md:h-10 rounded border-2 flex items-center justify-center transition-all disabled:opacity-25
                            ${dark
                                ? 'bg-zinc-800 border-zinc-600 hover:bg-zinc-700 text-zinc-300'
                                : 'bg-white border-black hover:bg-blue-100 text-black'}`}
                    >
                        <SkipBack size={15} className="fill-current" />
                    </button>

                    {/* Play / Pause — slightly larger, accent colour */}
                    <button
                        onClick={() => togglePlay(playingTrack)}
                        title={isPlaying ? 'Pause' : 'Play'}
                        className={`w-10 h-10 md:w-11 md:h-11 rounded border-2
                            ${dark ? 'bg-green-500 border-white' : 'bg-pink-400 border-black'}
                            flex items-center justify-center
                            shadow-[3px_3px_0_#000] hover:shadow-[1px_1px_0_#000]
                            hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100`}
                    >
                        {isPlaying
                            ? <Pause size={16} className="text-black fill-black" />
                            : <Play  size={16} className="text-black fill-black ml-0.5" />}
                    </button>

                    {/* Next */}
                    <button
                        onClick={playNext}
                        disabled={!hasNext}
                        title="Next"
                        className={`w-8 h-8 md:w-10 md:h-10 rounded border-2 flex items-center justify-center transition-all disabled:opacity-25
                            ${dark
                                ? 'bg-zinc-800 border-zinc-600 hover:bg-zinc-700 text-zinc-300'
                                : 'bg-white border-black hover:bg-blue-100 text-black'}`}
                    >
                        <SkipForward size={15} className="fill-current" />
                    </button>
                </div>

                {/* ── ZONE 3: Volume + time — hidden on small md, visible from lg ── */}
                <div className="hidden lg:flex items-center gap-2 flex-1 justify-end min-w-0">
                    {/* Volume icon + slider — disappear below xl to save space */}
                    <div className="hidden xl:flex items-center gap-2 flex-shrink-0">
                        <Volume2 size={16} className={dark ? 'text-zinc-300' : 'text-black'} />
                        <div className="w-20 relative h-1.5 rounded border border-black overflow-hidden">
                            <div
                                className={`h-full transition-all duration-100 ${dark ? 'bg-white' : 'bg-black'}`}
                                style={{ width: `${volume * 100}%` }}
                            />
                            <input
                                type="range" min="0" max="1" step="0.02" value={volume}
                                onChange={e => handleVolume(parseFloat(e.target.value))}
                                className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
                            />
                        </div>
                    </div>

                    {/* Time readout */}
                    <span className={`text-xs tabular-nums font-mono flex-shrink-0
                        ${dark ? 'text-zinc-300' : 'text-black'}`}>
                        {fmt(currentTime)}&thinsp;/&thinsp;{fmt(duration)}
                    </span>
                </div>
            </div>
        </div>
    );
}

//  Main layout 

export default function DesktopMusicLayout({
    dark, musicLoad, isFetchingNextPage, error, filtered, playingId, playingTrack, isPlaying,
    togglePlay, playNext, playPrevious, repeat, toggleRepeat, queue,
    setSearch, search, fetchMusic, fetchNextPage, hasNextPage,
    progress, currentTime, duration, handleSeek, handleVolume, volume,
}) {
    const btnBase = `rounded-full border-2 font-black text-xs uppercase tracking-widest transition-all duration-100`;

    const sentinelRef = useRef(null);

    useEffect(() => {
        if (!hasNextPage || !sentinelRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isFetchingNextPage) fetchNextPage();
            },
            { threshold: 0.5 }
        );

        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        // recent and music area 
        <div className={`hidden md:block max-w-7xl mx-auto px-4 border
            ${dark ? 'bg-zinc-950' : 'bg-white'}
            ${playingId && playingTrack ? 'pt-10' : ''}`}
        >
            {/* Now Playing Bar */}
            {playingId && playingTrack && (
                <NowPlayingBar
                    dark={dark}
                    playingTrack={playingTrack}
                    isPlaying={isPlaying}
                    togglePlay={togglePlay}
                    playNext={playNext}
                    playPrevious={playPrevious}
                    repeat={repeat}
                    toggleRepeat={toggleRepeat}
                    queue={queue}
                    progress={progress}
                    currentTime={currentTime}
                    duration={duration}
                    handleSeek={handleSeek}
                    handleVolume={handleVolume}
                    volume={volume}
                />
            )}

            {/* ── Main Split Layout ── */}
            <div className="flex gap-0 mb-10 max-h-[calc(100vh-280px)] overflow-hidden">

                {/* LEFT — Recently Played */}
                <aside className="w-1/3 flex-shrink-0 pr-6 border-r-2 border-black overflow-y-auto">
                    <div className="sticky top-0">
                        <p className={`text-xs font-black uppercase tracking-[0.2em] mb-4 pb-2 border-b-2 border-black ${dark ? 'text-zinc-400' : 'text-black'}`}>
                            Recently Played
                        </p>
                        <RecentlyPlayed />
                    </div>
                </aside>

                {/* RIGHT — Music Grid */}
                <main className="flex-1 min-w-0 pl-6 overflow-y-auto no-scrollbar">
                    <p className={`text-xs font-black uppercase tracking-[0.2em] mb-4 pb-2 border-b-2 border-black ${dark ? 'text-zinc-400' : 'text-black'}`}>
                        All Music
                    </p>

                    {/* Error */}
                    {error && !musicLoad && (
                        <div className="border-2 border-black bg-red-400 p-5 mb-5 text-center">
                            <p className="font-black uppercase mb-3">{error}</p>
                            <button onClick={fetchMusic}
                                className={`${btnBase} px-4 py-2 bg-black text-white`}>
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Skeletons */}
                    {musicLoad && (
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                            {Array.from({ length: 8 }).map((_, i) => <DesktopSkeletonCard key={i} dark={dark} />)}
                        </div>
                    )}

                    {/* Empty */}
                    {!musicLoad && !error && filtered.length === 0 && (
                        <div className={`border-2 border-black text-center py-20 px-8 ${dark ? 'bg-zinc-900' : 'bg-white'}`}>
                            <Music2 size={40} className={`mx-auto mb-3 ${dark ? 'text-zinc-600' : 'text-black'}`} />
                            <p className={`text-lg font-black uppercase mb-1 ${dark ? 'text-white' : 'text-black'}`}>
                                {search ? 'No results found' : 'No music yet'}
                            </p>
                            <p className={`text-sm font-mono mb-4 ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                {search ? `Nothing matches "${search}"` : 'Be the first to upload a track!'}
                            </p>
                            {search && (
                                <button onClick={() => setSearch('')}
                                    className={`${btnBase} px-4 py-2 bg-violet-400`}>
                                    Clear Search
                                </button>
                            )}
                        </div>
                    )}

                    {/* Grid */}
                    {!musicLoad && !error && filtered.length > 0 && (
                        <>
                            <div className="grid grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                                {filtered.map((music, i) => (
                                    <div key={String(music._id)} className="fade-up"
                                        style={{ animationDelay: `${i * 45}ms` }}>
                                        <DesktopMusicCard
                                            music={music}
                                            isPlaying={String(playingId) === String(music._id)}
                                            isActuallyPlaying={isPlaying && String(playingId) === String(music._id)}
                                            onPlay={(track) => togglePlay(track, filtered)}
                                            dark={dark}
                                            progress={progress}
                                        />
                                    </div>
                                ))}
                            </div>

                            {hasNextPage && (
                                <div ref={sentinelRef} className="py-10 flex items-center justify-center">
                                    {isFetchingNextPage && (
                                        <p className={`text-xs font-semibold tracking-widest ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                            Loading more...
                                        </p>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

