import { Play, Pause, Music2 } from 'lucide-react';

//Animated bars shown next to the playing track number
function PlayingBars({ dark }) {
    return (
        <div className="flex gap-[2px] items-end h-4">
            {[1, 2, 3, 4].map(i => (
                <div
                    key={i}
                    className="w-[3px] rounded-full bg-blue-400"
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

/* ── Single track row ── */
function MobileTrackRow({ music, isPlaying, onPlay, dark, index }) {
    const sub = dark ? 'text-gray-400' : 'text-gray-500';
    const rowBg = isPlaying
        ? dark ? 'bg-emerald-500/10' : 'bg-emerald-50'
        : dark ? 'active:bg-gray-800/60' : 'active:bg-gray-100';

    return (
        <button
            onClick={() => onPlay(music._id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-150 text-left ${rowBg}`}
        >
            {/* Track number or animated bars */}
            <div className="w-5 flex-shrink-0 flex items-center justify-center">
                {isPlaying
                    ? <PlayingBars dark={dark} />
                    : <span className={`text-xs tabular-nums ${sub}`}>{index + 1}</span>
                }
            </div>

            {/* Thumbnail */}
            <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                {music.thumbnail
                    ? <img src={music.thumbnail} alt={music.title} className="w-full h-full object-cover" />
                    : (
                        <div className={`w-full h-full flex items-center justify-center ${dark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <Music2 size={16} className={sub} />
                        </div>
                    )
                }
            </div>

            {/* Title + artist */}
            <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate leading-tight ${isPlaying ? 'text-emerald-500' : dark ? 'text-white' : 'text-gray-900'}`}>
                    {music.title}
                </p>
                <p className={`text-xs truncate mt-0.5 ${sub}`}>
                    {music.artist?.username || 'Unknown Artist'}
                </p>
            </div>

            {/* Play / Pause icon on right */}
            <div className="flex-shrink-0 w-6 flex items-center justify-center">
                {isPlaying
                    ? <Pause size={15} className="text-emerald-500 fill-emerald-500" />
                    : <Play size={15} className={`${sub} opacity-40`} />
                }
            </div>
        </button>
    );
}

/* ── Skeleton row shown while loading ── */
function MobileSkeletonRow({ dark }) {
    const base = dark ? 'bg-gray-800' : 'bg-gray-200';
    return (
        <div className="flex items-center gap-3 px-3 py-2.5 animate-pulse">
            <div className={`w-5 h-3 rounded ${base}`} />
            <div className={`w-11 h-11 rounded-lg ${base}`} />
            <div className="flex-1 space-y-2">
                <div className={`h-3 rounded-full ${base} w-2/3`} />
                <div className={`h-2 rounded-full ${base} w-1/3`} />
            </div>
        </div>
    );
}

/* ── Sticky bottom player bar (shown when a track is playing) ── */
function MobilePlayerBar({ track, isPlaying, onToggle, progress, currentTime, duration, onSeek, dark }) {
    if (!track) return null;

    function fmt(s) {
        if (!s || isNaN(s)) return '0:00';
        return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
    }

    return (
        <div className={`fixed bottom-0 left-0 right-0 z-50 
            ${dark ? 'bg-gray-900/97 border-gray-700/50' : 'bg-white/97 border-gray-200'}
            border-t backdrop-blur-2xl`}
        >
            {/* Thin seekbar at very top of player */}
            <div className="relative h-1 w-full group">
                <div className={`h-full ${dark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div
                        className="h-full bg-emerald-500 transition-all duration-100"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                {/* Invisible range input overlaid for touch interaction */}
                <input
                    type="range" min="0" max="100"
                    value={Math.round(progress)} step="0.5"
                    onChange={e => onSeek(parseFloat(e.target.value))}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer h-6 -top-2.5"
                />
            </div>

            {/* Player row */}
            <div className="flex items-center gap-3 px-4 py-3 pb-5">
                {/* Thumbnail */}
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 shadow">
                    {track.thumbnail
                        ? <img src={track.thumbnail} alt={track.title} className="w-full h-full object-cover" />
                        : (
                            <div className={`w-full h-full flex items-center justify-center ${dark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                <Music2 size={14} className={dark ? 'text-gray-500' : 'text-gray-400'} />
                            </div>
                        )
                    }
                </div>

                {/* Title + time */}
                <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate ${dark ? 'text-white' : 'text-gray-900'}`}>
                        {track.title}
                    </p>
                    <p className={`text-xs mt-0.5 ${dark ? 'text-gray-500' : 'text-gray-400'} tabular-nums`}>
                        {fmt(currentTime)} / {fmt(duration)}
                    </p>
                </div>

                {/* Play / Pause button */}
                <button
                    onClick={() => onToggle(track._id)}
                    className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform shadow-lg shadow-emerald-500/30"
                >
                    {isPlaying
                        ? <Pause size={18} className="text-white fill-white" />
                        : <Play size={18} className="text-white fill-white ml-0.5" />
                    }
                </button>
            </div>
        </div>
    );
}

/* ════════════════════════════════════════════════════════════════
   MAIN MOBILE LAYOUT EXPORT
   Rendered inside LocalFeed only on mobile (sm:hidden wrapper there)
════════════════════════════════════════════════════════════════ */
export default function MobileMusicLayout({
    dark, musicLoad, error, filtered, playingId, playingTrack,
    togglePlay, page, setPage, setSearch, pagination, search, fetchMusic,
    progress, currentTime, duration, handleSeek
}) {
    const sub = dark ? 'text-gray-400' : 'text-gray-500';

    return (
        /* pb-28 = space so last track isn't hidden behind bottom player bar */
        <div className="sm:hidden pb-28">

            {/* Error */}
            {error && !musicLoad && (
                <div className={`mx-4 mt-4 rounded-2xl p-5 text-center border
                    ${dark ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
                    <p className="font-semibold text-sm">{error}</p>
                    <button onClick={fetchMusic} className="mt-3 px-4 py-1.5 bg-red-500 text-white text-xs rounded-lg">
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
                <div className="text-center py-20 px-6">
                    <Music2 size={40} className={`mx-auto mb-3 ${sub}`} />
                    <p className={`text-base font-bold mb-1 ${dark ? 'text-white' : 'text-gray-900'}`}>
                        {search ? 'No results found' : 'No music yet'}
                    </p>
                    <p className={`text-sm ${sub}`}>
                        {search ? `Nothing matches "${search}"` : 'Be the first to upload a track!'}
                    </p>
                    {search && (
                        <button onClick={() => setSearch('')}
                            className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm">
                            Clear search
                        </button>
                    )}
                </div>
            )}

            {/* Track list */}
            {!musicLoad && !error && filtered.length > 0 && (
                <>
                    {/* Section label */}
                    <div className="px-4 pt-4 pb-1">
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${sub}`}>
                            {filtered.length} tracks
                        </p>
                    </div>

                    <div className="px-1">
                        {filtered.map((music, i) => (
                            <div key={music._id}>
                                <MobileTrackRow
                                    music={music}
                                    isPlaying={playingId === music._id}
                                    onPlay={togglePlay}
                                    dark={dark}
                                    index={i}
                                />
                                {/* Subtle divider between rows */}
                                {i < filtered.length - 1 && (
                                    <div className={`ml-[3.75rem] h-px ${dark ? 'bg-gray-800' : 'bg-gray-100'}`} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Mobile pagination — prev/next only (compact) */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-5 mt-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className={`px-5 py-2 rounded-xl text-sm font-semibold border transition disabled:opacity-30
                                    ${dark ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700'}`}
                            >
                                ← Prev
                            </button>
                            <span className={`text-sm tabular-nums ${sub}`}>
                                {page} / {pagination.totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                disabled={page === pagination.totalPages}
                                className={`px-5 py-2 rounded-xl text-sm font-semibold border transition disabled:opacity-30
                                    ${dark ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700'}`}
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Bottom sticky player — always rendered, hidden when no track */}
            <MobilePlayerBar
                track={playingTrack}
                isPlaying={!!playingId}
                onToggle={togglePlay}
                progress={progress}
                currentTime={currentTime}
                duration={duration}
                onSeek={handleSeek}
                dark={dark}
            />
        </div>
    );
}