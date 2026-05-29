import { Play, Pause, Music2, Volume2, Heart, SkipBack, SkipForward, Repeat } from 'lucide-react';
import RecentlyPlayed from './RecentlyPlayed';
/* ── Animated equaliser bars ── */
function EqBars({ size = 'sm' }) {
    const w = size === 'lg' ? 'w-1' : 'w-[3px]';
    const heights = size === 'lg'
        ? [[8, 18], [12, 6], [18, 10], [10, 20]]
        : [[5, 12], [8, 4], [12, 7], [7, 14]];

    return (
        <div className="flex gap-[2px] items-end">
            {heights.map(([a], i) => (
                <div
                    key={i}
                    className={`${w} bg-emerald-400 rounded-full`}
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

/* ── formatTime helper (self-contained, no external import needed) ── */
function fmt(s) {
    if (!s || isNaN(s)) return '0:00';
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
}

/*   DESKTOP MUSIC CARD*/

function DesktopMusicCard({ music, isPlaying, isActuallyPlaying, onPlay, dark, progress, currentTime, duration, onSeek, volume, onVolume, isLiked, onToggleLike }) {
    const card = dark ? 'bg-gray-900 border-gray-700/40' : 'bg-white border-gray-200';
    const sub = dark ? 'text-gray-400' : 'text-gray-500';

    return (
        <div
            className={`group relative rounded border overflow-hidden transition-all duration-300
                hover:-translate-y-1 hover:shadow-2xl ${card}
                ${isPlaying ? 'ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-500/10' : ''}`}
        >
            {/* ── Thumbnail area ── */}
            <div className="relative aspect-square overflow-hidden bg-gray-800">
                {music.thumbnail
                    ? <img src={music.thumbnail} alt={music.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    : (
                        <div className={`w-full h-full flex items-center justify-center ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                            <Music2 size={36} className="text-gray-500" />
                        </div>
                    )
                }

                {/* Play overlay — visible on hover, or always when playing */}
                <div
                    onClick={() => onPlay(music)}
                    className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-all duration-250
                        ${isPlaying ? 'bg-black/25' : 'bg-black/0 group-hover:bg-black/45'}`}
                >
                    <button
                        className={`w-13 h-13 rounded-full flex items-center justify-center transition-all duration-250
                            bg-emerald-500 hover:bg-emerald-400 hover:scale-110 shadow-xl shadow-emerald-900/40
                            ${isPlaying
                                ? 'opacity-100 scale-100'
                                : 'opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100'
                            }`}
                        style={{ width: 52, height: 52 }}

                    >
                        {isActuallyPlaying
                            ? <Pause size={20} className="text-white fill-white" />
                            : <Play size={20} className="text-white fill-white ml-0.5" />
                        }
                    </button>
                </div>


                {/* Eq badge top-right when playing */}
                {isPlaying && (
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1.5 flex items-end gap-[2px] h-7 z-10">
                        <EqBars size="sm" />
                    </div>
                )}
                {/* Like button top-left */}
                {onToggleLike && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleLike(music._id); }}
                        className="absolute top-3 left-3 p-1.5 rounded-full bg-black/40 hover:bg-black/60 transition-colors z-10"
                    >
                        <Heart size={16} className={isLiked ? 'fill-emerald-500 text-emerald-500' : 'text-white'} />
                    </button>
                )}
            </div>

            {/* ── Info row ── */}
            <div className="px-4 pt-3 pb-1">
                <h3 className={`font-bold text-sm truncate ${dark ? 'text-white' : 'text-gray-900'}`}>
                    {music.title}
                </h3>
                <p className={`text-xs truncate mt-0.5 ${sub}`}>
                    {music.artist?.username || 'Unknown Artist'}
                </p>
            </div>

            {/* ── Controls: always visible below info ── */}
            <div className="px-4 pb-4 pt-2 space-y-2">

                {/* Seekbar */}
                <div className="space-y-1">
                    <div className="relative h-1 rounded-full overflow-hidden group/seek cursor-pointer"
                        style={{ background: dark ? '#374151' : '#e5e7eb' }}>
                        <div
                            className="h-full bg-emerald-500 transition-all duration-100"
                            style={{ width: `${isPlaying ? progress : 0}%` }}
                        />
                        <input
                            type="range" min="0" max="100"
                            value={isPlaying ? Math.round(progress) : 0}
                            step="0.5"
                            onChange={e => isPlaying && onSeek(parseFloat(e.target.value))}
                            className="absolute inset-0 w-full opacity-0 cursor-pointer"
                        />
                    </div>
                    {/* Time labels */}
                    <div className={`flex justify-between text-[10px] tabular-nums ${sub}`}>
                        <span>{isPlaying ? fmt(currentTime) : '0:00'}</span>
                        <span>{isPlaying ? fmt(duration) : fmt(0)}</span>
                    </div>
                </div>

                {/* Volume row */}
                <div className="flex items-center gap-2">
                    <Volume2 size={13} className={sub} />
                    <div className="flex-1 relative h-1 rounded-full overflow-hidden cursor-pointer"
                        style={{ background: dark ? '#374151' : '#e5e7eb' }}>
                        <div
                            className="h-full bg-emerald-500/70"
                            style={{ width: `${volume * 100}%` }}
                        />
                        <input
                            type="range" min="0" max="1" step="0.02"
                            value={volume}
                            onChange={e => onVolume(parseFloat(e.target.value))}
                            className="absolute inset-0 w-full opacity-0 cursor-pointer"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Skeleton card ── */
function DesktopSkeletonCard({ dark }) {
    const base = dark ? 'bg-gray-800' : 'bg-gray-200';
    const card = dark ? 'bg-gray-900 border-gray-700/40' : 'bg-white border-gray-200';
    return (
        <div className={`rounded-2xl border overflow-hidden animate-pulse ${card}`}>
            <div className={`aspect-square ${base}`} />
            <div className="p-4 space-y-2">
                <div className={`h-3.5 rounded-full ${base} w-3/4`} />
                <div className={`h-2.5 rounded-full ${base} w-1/2`} />
                <div className={`h-1 rounded-full ${base} w-full mt-3`} />
                <div className={`h-1 rounded-full ${base} w-2/3 mt-1`} />
            </div>
        </div>
    );
}

// MAIN DESKTOP LAYOUT EXPORT

export default function DesktopMusicLayout({
    dark, musicLoad, error, filtered, playingId, playingTrack, isPlaying,
    togglePlay, playNext, playPrevious, repeat, toggleRepeat, queue,
    page, setPage, setSearch, pagination, search, fetchMusic,
    progress, currentTime, duration, handleSeek, handleVolume, volume,
    likedSongs = [], onToggleLike
}) {
    const sub = dark ? 'text-gray-400' : 'text-gray-500';

    // Determine if there is a next/previous track available in the queue
    const currentQueueIndex = queue?.length > 0 && playingTrack
        ? queue.findIndex(t => t._id === playingTrack._id)
        : -1;
    const hasNext = currentQueueIndex !== -1 && currentQueueIndex < (queue?.length || 0) - 1;
    const hasPrev = currentQueueIndex > 0;

    return (
        <div className="hidden sm:block max-w-7xl mx-auto px-4 pt-18 pb-32">

            {/* ── Now Playing banner (desktop only) ── */}
            {playingId && playingTrack && (
                <div className={`fixed bottom-0 left-0 right-0 z-50 border-t shadow-[0_-4px_10px_rgba(0,0,0,0.05)] backdrop-blur-xl
                    ${dark ? 'bg-gray-950/90 border-gray-800' : 'bg-white/90 border-gray-200'}`}>
                    
                    <div className="relative h-1 w-full group">
                        <div className={`h-full ${dark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                            <div
                                className="h-full bg-emerald-500 transition-all duration-100"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <input
                            type="range" min="0" max="100"
                            value={Math.round(progress)} step="0.5"
                            onChange={e => handleSeek(parseFloat(e.target.value))}
                            className="absolute inset-0 w-full opacity-0 cursor-pointer h-4 -top-1.5"
                        />
                    </div>

                    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                        
                        {/* ── Left: Thumbnail & Info ── */}
                        <div className="w-1/3 flex items-center gap-3 min-w-0">
                            <div className="relative w-12 h-12 rounded bg-gray-800 flex-shrink-0 overflow-hidden shadow-sm">
                                {playingTrack.thumbnail ? (
                                    <img src={playingTrack.thumbnail} alt={playingTrack.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className={`w-full h-full flex items-center justify-center ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                        <Music2 size={20} className={dark ? 'text-gray-500' : 'text-gray-400'} />
                                    </div>
                                )}
                                {isPlaying && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <EqBars size="sm" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`font-bold text-sm truncate ${dark ? 'text-white' : 'text-gray-900'}`}>
                                    {playingTrack.title}
                                </p>
                                <p className={`text-xs truncate mt-0.5 ${sub}`}>
                                    {playingTrack.artist?.username || 'Unknown Artist'}
                                </p>
                            </div>
                        </div>

                        {/* ── Center: Queue Controls ── */}
                        <div className="flex-1 flex justify-center items-center gap-2">
                            {/* Repeat / Play Again */}
                            <button
                                onClick={toggleRepeat}
                                title={repeat ? 'Repeat: On' : 'Repeat: Off'}
                                className={`relative w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
                                    ${repeat
                                        ? 'bg-emerald-500/20 text-emerald-400 shadow-sm shadow-emerald-500/20'
                                        : dark ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-800' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Repeat size={14} />
                                {repeat && (
                                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                )}
                            </button>

                            {/* Previous */}
                            <button
                                onClick={playPrevious}
                                disabled={!hasPrev}
                                title="Previous"
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-25
                                    ${dark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                            >
                                <SkipBack size={14} className="fill-current" />
                            </button>

                            {/* Play / Pause */}
                            <button
                                onClick={() => togglePlay(playingTrack)}
                                className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform shadow-lg shadow-emerald-500/30 ml-1 mr-1"
                            >
                                {isPlaying
                                    ? <Pause size={18} className="text-white fill-white" />
                                    : <Play size={18} className="text-white fill-white ml-0.5" />
                                }
                            </button>

                            {/* Next */}
                            <button
                                onClick={playNext}
                                disabled={!hasNext}
                                title="Next"
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-25
                                    ${dark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                            >
                                <SkipForward size={14} className="fill-current" />
                            </button>
                        </div>

                        {/* ── Right: Volume Control ── */}
                        <div className="w-1/3 flex justify-end items-center gap-3 pr-2">
                            <Volume2 size={16} className={sub} />
                            <div className="w-24 relative h-1.5 rounded-full overflow-hidden group/vol cursor-pointer"
                                style={{ background: dark ? '#374151' : '#e5e7eb' }}>
                                <div
                                    className="h-full bg-emerald-500/80 transition-all duration-100"
                                    style={{ width: `${volume * 100}%` }}
                                />
                                <input
                                    type="range" min="0" max="1" step="0.02"
                                    value={volume}
                                    onChange={e => handleVolume(parseFloat(e.target.value))}
                                    className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            )}
            
            {/* ── Recently Played ── */}
            <RecentlyPlayed />
            {/* ── Error ── */}
            {error && !musicLoad && (
                <div className={`rounded-2xl p-6 mb-6 text-center border
                    ${dark ? 'bg-red-500/10 border-red-500/25 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
                    <p className="font-semibold mb-2">{error}</p>
                    <button onClick={fetchMusic}
                        className="px-4 py-2 bg-red-500 text-white text-sm rounded-xl hover:bg-red-600 transition">
                        Try Again
                    </button>
                </div>
            )}

            {/* ── Skeletons ── */}
            {musicLoad && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {Array.from({ length: 10 }).map((_, i) => <DesktopSkeletonCard key={i} dark={dark} />)}
                </div>
            )}

            {/* ── Empty state ── */}
            {!musicLoad && !error && filtered.length === 0 && (
                <div className="text-center py-24">
                    <Music2 size={48} className={`mx-auto mb-4 ${sub}`} />
                    <p className={`text-xl font-bold mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
                        {search ? 'No results found' : 'No music yet'}
                    </p>
                    <p className={sub}>{search ? `Nothing matches "${search}"` : 'Be the first to upload a track!'}</p>
                    {search && (
                        <button onClick={() => setSearch('')}
                            className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm hover:bg-emerald-600 transition">
                            Clear search
                        </button>
                    )}
                </div>
            )}

            {/* ── Cards grid ── */}
            {!musicLoad && !error && filtered.length > 0 && (
                <>
                    <div className="grid pt-10 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filtered.map((music, i) => (
                            <div
                                key={String(music._id)}
                                className="fade-up"
                                style={{ animationDelay: `${i * 45}ms` }}
                            >
                                {/*
                                  Each card gets ALL audio state props.
                                  The card only SHOWS the seekbar/time for the
                                  currently playing track (isPlaying gate inside card).
                                */}
                                <DesktopMusicCard
                                    music={music}
                                    isPlaying={String(playingId) === String(music._id)}
                                    isActuallyPlaying={isPlaying && String(playingId) === String(music._id)}
                                    onPlay={(track) => togglePlay(track, filtered)}
                                    dark={dark}
                                    progress={progress}
                                    currentTime={currentTime}
                                    duration={duration}
                                    onSeek={handleSeek}
                                    volume={volume}
                                    onVolume={handleVolume}
                                    isLiked={likedSongs.includes(music._id)}
                                    onToggleLike={onToggleLike}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-3 mt-10">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition disabled:opacity-30
                                    ${dark ? 'border-gray-700 hover:bg-gray-800 text-gray-300' : 'border-gray-300 hover:bg-gray-100 text-gray-700'}`}
                            >
                                ← Prev
                            </button>
                            <div className="flex gap-1">
                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                                    <button key={`page-${p}`} onClick={() => setPage(p)}
                                        className={`w-9 h-9 rounded-xl text-sm font-bold transition
                                            ${page === p ? 'bg-emerald-500 text-white' : dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}>
                                        {p}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                disabled={page === pagination.totalPages}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition disabled:opacity-30
                                    ${dark ? 'border-gray-700 hover:bg-gray-800 text-gray-300' : 'border-gray-300 hover:bg-gray-100 text-gray-700'}`}
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}