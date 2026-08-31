import { useEffect, useRef } from 'react';
import { Play, Pause, Music2, Heart, MoveRight, MoveLeft } from 'lucide-react';
import MusicUIUser from './MusicUIUser';
import { useNavigate } from 'react-router-dom';


function PlayingBars() {
    return (
        <div className="flex gap-[2px] items-end h-">
            {[1, 2, 3, 4].map(i => (
                <div
                    key={i}
                    className="w-[5px] bg-red-400"
                    style={{
                        animation: `mBar${i} 0.7s ease-in-out infinite`,
                        animationDelay: `${i * 0.12}s`,
                        height: `${5 + i * 3}px`,
                    }}
                />
            ))}
        </div>
    );
}


function MobileTrackRow({ music, isPlaying, onPlay, dark, index, isActuallyPlaying, isLiked, onToggleLike }) {
    const sub = dark ? 'text-white' : 'text-zinc-500';

    return (
        <button
            onClick={() => onPlay(music)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors 
                ${isPlaying
                    ? 'bg-blue-400'
                    : dark ? 'bg-zinc-900 active:bg-zinc-800' : 'bg-white active:bg-zinc-100'}`}
        >
            {/* Track number or bars */}
            <div className="w-5 flex-shrink-0 flex items-center justify-center">
                {isPlaying
                    ? <PlayingBars />
                    : <span className={`text-sm tabular-nums font-semibold  ${sub}`}>{index + 1}</span>
                }
            </div>

            {/* Thumbnail — square, hard border */}
            <div className="w-14 h-14 rounded overflow-hidden flex-shrink-0 ">
                {music.thumbnail
                    ? <img src={music.thumbnail} alt={music.title} loading="lazy" className="w-full h-full object-cover" />
                    : <div className={`w-full h-full flex items-center justify-center ${dark ? 'bg-zinc-700' : 'bg-zinc-200'}`}>
                        <Music2 size={16} className={isPlaying ? 'text-black' : sub} />
                    </div>
                }
            </div>

            {/* Title + artist */}
            <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold tracking-wider truncate leading-tight 
                    ${isPlaying ? 'text-black' : dark ? 'text-white' : 'text-black'}`}>
                    {music.title}
                </p>
                <p className={`text-sm truncate mt-0.5  ${isPlaying ? 'text-black/60' : sub}`}>
                    {music.artist?.username || 'Unknown Artist'}
                </p>
            </div>

            {/* Like button */}
            {onToggleLike && (
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleLike(music._id); }}
                    className={`flex-shrink-0 w-7 h-7 rounded-2xl flex items-center justify-center transition-all
                        active:scale-90 ${isPlaying ? 'bg-black/50' : dark ? 'bg-zinc-800' : 'bg-white'}`}
                >
                    <Heart size={17} className={isLiked
                        ? isPlaying ? 'fill-pink-600 text-yellow-400' : 'fill-black text-black'
                        : isPlaying ? 'text-white' : sub} />
                </button>
            )}

            {/* Play/Pause icon */}
            <div className="flex-shrink-0 w-6 flex items-center justify-center">
                {isActuallyPlaying
                    ? <Pause size={18} className={isPlaying ? 'text-black fill-black' : 'text-black fill-black'} />
                    : <Play size={18} className={`${sub} opacity-80`} />
                }
            </div>
        </button>
    );
}

function MobileSkeletonRow({ dark }) {
    const base = dark ? 'bg-zinc-800' : 'bg-zinc-200';
    return (
        <div className={`flex items-center gap-3 px-3 py-2.5 animate-pulse  ${dark ? 'bg-zinc-900' : 'bg-white'}`}>
            <div className={`w-5 h-3 ${base}`} />
            <div className={`w-11 h-11 border-2 border-black ${base}`} />
            <div className="flex-1 space-y-2">
                <div className={`h-3 ${base} w-2/3`} />
                <div className={`h-2 ${base} w-1/3`} />
            </div>
        </div>
    );
}

function MobilePlayerBar({ track, isActuallyPlaying, onToggle, currentTime, duration, dark }) {
    if (!track) return null;
    const path = useNavigate()
    function fmt(s) {
        if (!s || isNaN(s)) return '0:00';
        return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
    }

    return (
        <div
            onClick={() => path('/music_panel')}
            className={`flex items-center justify-between fixed bottom-10.5 left-0 px-4 py-2 right-0 z-5 
            ${dark ? 'bg-zinc-900' : 'bg-gray-300'}`}>

            <div
                className="flex items-center gap-3 py-1 pb-1">

                {/* Thumbnail */}
                <div className="w-10 h-10 border-2 rounded overflow-hidden flex-shrink-0 shadow-[2px_2px]">
                    {track.thumbnail
                        ? <img src={track.thumbnail} alt={track.title} className="w-full h-full object-cover" />
                        : <div className={`w-full h-full flex items-center justify-center ${dark ? 'bg-zinc-700' : 'bg-zinc-200'}`}>
                            <Music2 size={14} className={dark ? 'text-zinc-500' : 'text-zinc-400'} />
                        </div>
                    }
                </div>

                {/* Title + time */}
                <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold  tracking-tight truncate  ${dark ? 'text-white' : 'text-black'}`}>
                        {track.title}
                    </p>
                    <p className={`text-sm mt-0.5  tabular-nums ${dark ? 'text-zinc-500' : 'text-zinc-900 '}`}>
                        {fmt(currentTime)} / {fmt(duration)}
                    </p>
                </div>
            </div>
            {/* Play/Pause */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onToggle(track);
                }}
                className={`right-10 w-11 h-11 border-2 rounded ${dark ? "" : "border-black"} bg-yellow-400 flex items-center justify-center flex-shrink-0
                        shadow-[3px_3px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all `}>
                {isActuallyPlaying
                    ? <Pause size={18} className="text-black fill-black" />
                    : <Play size={18} className="text-black fill-black ml-0.5" />
                }
            </button>
        </div>
    );
}

export default function MobileMusicLayout({
    dark, musicLoad, isFetchingNextPage, error, filtered, playingId, playingTrack,
    togglePlay, toggleRepeat, queue,
    setSearch, search, fetchMusic, fetchNextPage, hasNextPage,
    currentTime, duration, handleSeek, isPlaying,
    likedSongs = [], onToggleLike
}) {


    const sentinelRef = useRef(null);

    useEffect(() => {
        if (!hasNextPage || !sentinelRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const sub = dark ? 'text-blue-400' : 'text-zinc-500';

    const currentQueueIndex = queue?.length > 0 && playingTrack
        ? queue.findIndex(t => t._id === playingTrack._id) : -1;
    const hasNext = currentQueueIndex !== -1 && currentQueueIndex < (queue?.length || 0) - 1;
    const hasPrev = currentQueueIndex > 0;

    

    return (
        <div className={`md:hidden pb-28 ${dark ? 'bg-zinc-950' : 'bg-white'}`}>

            {/* Error */}
            {error && !musicLoad && (
                <div className="mx-4 mt-14 border bg-red-400 p-5 text-center">
                    <p className="font-black uppercase text-sm text-black mb-3">{error}</p>
                    <button onClick={fetchMusic}
                        className="px-4 py-1.5 border-2 border-black bg-black text-white text-xs font-black uppercase
                            shadow-[2px_2px_0_#fff] hover:shadow-none transition-all">
                        Try Again
                    </button>
                </div>
            )}

            {/* Skeletons */}
            {musicLoad && (
                <div className="py-2">
                    {Array.from({ length: 10 }).map((_, i) => <MobileSkeletonRow key={i} dark={dark} />)}
                </div>
            )}

            {/* Empty state */}

            {!musicLoad && !error && filtered.length === 0 && (
                <div className={`mx-4 mt-17 border-2 rounded-xl shadow-[4px_4px] text-center py-16 px-6
                    ${dark ? 'bg-zinc-900' : 'bg-white border-black'}`}>
                    <Music2 size={36} className={`mx-auto mb-3 ${sub}`} />
                    <p className={`text-base font-black uppercase tracking-tight mb-1 font-mono ${dark ? 'text-white' : 'text-black'}`}>
                        {search ? 'No results' : 'No music yet'}
                    </p>
                    <p className={`text-xs font-mono ${sub}`}>
                        {search ? `Nothing matches "${search}"` : 'Be the first to upload a track!'}
                    </p>
                    {search && (
                        <button onClick={() => setSearch('')}
                            className="mt-4 rounded px-4 py-2 border-2 border-black bg-yellow-400 text-black text-xs font-black uppercase
                                shadow-[3px_3px_0_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all">
                            Clear Search
                        </button>
                    )}
                </div>
            )}

            {/* Track list */}
            {!musicLoad && !error && filtered.length > 0 && (
                <>
                    {/* Section label */}
                    <div className={`px-4 pt-5 pb-2   ${dark ? 'bg-zinc-900' : 'bg-zinc-100'}`}>
                        <p className={`text-sm   tracking-[0.2em]  ${sub}`}>
                            {filtered.length} tracks
                        </p>
                    </div>

                    <div>
                        {filtered.map((music, i) => (
                            <MobileTrackRow
                                key={String(music._id)}
                                music={music}
                                isPlaying={String(playingId) === String(music._id)}
                                isActuallyPlaying={isPlaying && String(playingId) === String(music._id)}
                                onPlay={(track) => togglePlay(track, filtered)}
                                dark={dark}
                                index={i}
                                isLiked={likedSongs.includes(music._id)}
                                onToggleLike={onToggleLike}
                            />
                        ))}
                    </div>

                    {/* Infinite scroll sentinel — jab ye screen pe dikhega, next page auto-fetch hoga */}
                    {hasNextPage && (
                        <div ref={sentinelRef} className="py-6 flex items-center justify-center">
                            {isFetchingNextPage && (
                                <p className={`text-xs font-mono ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                    Loading more...
                                </p>
                            )}
                        </div>
                    )}
                </>
            )}

            <section>
                <MusicUIUser />
            </section>

            <MobilePlayerBar
                track={playingTrack}
                isActuallyPlaying={!!playingId && isPlaying}
                onToggle={togglePlay}
                // progress={progress}
                currentTime={currentTime}
                duration={duration}
                onSeek={handleSeek}
                dark={dark}
                // playNext={playNext}
                // playPrevious={playPrevious}
                // repeat={repeat}
                toggleRepeat={toggleRepeat}
                hasNext={hasNext}
                hasPrev={hasPrev}
            />
        </div>
    );
}

