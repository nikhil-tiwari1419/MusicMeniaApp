import { Play, Pause, Music2, Volume2, Heart, SkipBack, SkipForward, Repeat } from 'lucide-react';
import RecentlyPlayed from './RecentlyPlayed';

function EqBars({ size = 'sm' }) {
    const w = size === 'lg' ? 'w-1' : 'w-[3px]';
    const heights = size === 'lg'
        ? [[8, 18], [12, 6], [18, 10], [10, 20]]
        : [[5, 12], [8, 4], [12, 7], [7, 14]];

    return (
        <div className="flex gap-[2px] items-end">
            {heights.map(([a], i) => (
                <div key={i} className={`${w} bg-emerald-400 rounded-full`}
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

function DesktopMusicCard({ music, isPlaying, isActuallyPlaying, onPlay, dark, progress, currentTime, duration, onSeek, isLiked, onToggleLike }) {
    const card = dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
    const sub = dark ? 'text-gray-400' : 'text-gray-500';

    return (
        <div className={`group relative rounded-xl border overflow-hidden transition-all duration-300
            hover:-translate-y-1 hover:shadow-xl ${card}
            ${isPlaying ? 'ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-500/10' : ''}`}>

            {/* Thumbnail */}
            <div className="relative aspect-square overflow-hidden bg-gray-800">
                {music.thumbnail
                    ? <img src={music.thumbnail} alt={music.title} loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    : <div className={`w-full h-full flex items-center justify-center ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <Music2 size={32} className="text-gray-500" />
                    </div>
                }

                {/* Play overlay */}
                <div onClick={() => onPlay(music)}
                    className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-all duration-200
                        ${isPlaying ? 'bg-black/25' : 'bg-black/0 group-hover:bg-black/45'}`}>
                    <button
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200
                            bg-emerald-500 hover:bg-emerald-400 hover:scale-105 shadow-xl
                            ${isPlaying ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100'}`}>
                        {isActuallyPlaying
                            ? <Pause size={18} className="text-white fill-white" />
                            : <Play size={18} className="text-white fill-white ml-0.5" />}
                    </button>
                </div>

                {/* EQ badge */}
                {isPlaying && (
                    <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-end gap-[2px] h-6">
                        <EqBars size="sm" />
                    </div>
                )}

                {/* Like button */}
                {onToggleLike && (
                    <button onClick={(e) => { e.stopPropagation(); onToggleLike(music._id); }}
                        className="absolute top-2 left-2 p-1.5 rounded-full bg-black/40 hover:bg-black/60 transition-colors">
                        <Heart size={14} className={isLiked ? 'fill-emerald-500 text-emerald-500' : 'text-white'} />
                    </button>
                )}
            </div>

            {/* Info */}
            <div className="px-3 pt-2.5 pb-3 space-y-2">
                <div>
                    <h3 className={`font-semibold text-sm truncate ${dark ? 'text-white' : 'text-gray-900'}`}>
                        {music.title}
                    </h3>
                    <p className={`text-xs truncate mt-0.5 ${sub}`}>
                        {music.artist?.username || 'Unknown Artist'}
                    </p>
                </div>
            </div>
        </div>
    );
}

function DesktopSkeletonCard({ dark }) {
    const base = dark ? 'bg-gray-800' : 'bg-gray-200';
    const card = dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
    return (
        <div className={`rounded-xl border overflow-hidden animate-pulse ${card}`}>
            <div className={`aspect-square ${base}`} />
            <div className="p-3 space-y-2">
                <div className={`h-3 rounded-full ${base} w-3/4`} />
                <div className={`h-2.5 rounded-full ${base} w-1/2`} />
                <div className={`h-0.5 rounded-full ${base} w-full mt-3`} />
            </div>
        </div>
    );
}

export default function DesktopMusicLayout({
    dark, musicLoad, error, filtered, playingId, playingTrack, isPlaying,
    togglePlay, playNext, playPrevious, repeat, toggleRepeat, queue,
    page, setPage, setSearch, pagination, search, fetchMusic,
    progress, currentTime, duration, handleSeek, handleVolume, volume,
    likedSongs = [], onToggleLike
}) {
    const sub = dark ? 'text-gray-400' : 'text-gray-500';

    const currentQueueIndex = queue?.length > 0 && playingTrack
        ? queue.findIndex(t => t._id === playingTrack._id) : -1;
    const hasNext = currentQueueIndex !== -1 && currentQueueIndex < (queue?.length || 0) - 1;
    const hasPrev = currentQueueIndex > 0;

    return (
        <div className="hidden sm:block max-w-7xl mx-auto px-4 pt-20 pb-32">

            {/* ── Bottom Now Playing Bar ── */}
            {playingId && playingTrack && (
                <div className={`fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-xl
                    ${dark ? 'bg-gray-950/90 border-gray-800' : 'bg-white/90 border-gray-200'}`}>

                    {/* Progress bar */}
                    <div className="relative h-0.5 w-full max-w-xl mx-auto mt-2 group">
                        <div className={`h-0.5 w-full rounded-full overflow-hidden ${dark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                            <div className="h-full bg-emerald-500 rounded-full transition-all duration-100"
                                style={{ width: `${progress}%` }} />
                        </div>
                        <div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-emerald-500 pointer-events-none"
                            style={{ left: `calc(${progress}% - 5px)` }} />
                        <input type="range" min="0" max="100" step="0.5"
                            value={Math.round(progress)}
                            onChange={e => handleSeek(parseFloat(e.target.value))}
                            className="absolute inset-0 w-full h-4 -top-1.5 opacity-0 cursor-pointer" />
                    </div>

                    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

                        {/* Left: Track info */}
                        <div className="w-1/3 flex items-center gap-3 min-w-0">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                                {playingTrack.thumbnail
                                    ? <img src={playingTrack.thumbnail} alt={playingTrack.title} className="w-full h-full object-cover" />
                                    : <div className="w-full h-full flex items-center justify-center">
                                        <Music2 size={16} className="text-gray-500" />
                                    </div>}
                                {isPlaying && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <EqBars size="sm" />
                                    </div>
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className={`font-semibold text-sm truncate ${dark ? 'text-white' : 'text-gray-900'}`}>
                                    {playingTrack.title}
                                </p>
                                <p className={`text-xs truncate ${sub}`}>
                                    {playingTrack.artist?.username || 'Unknown Artist'}
                                </p>
                            </div>
                        </div>

                        {/* Center: Controls */}
                        <div className="flex items-center gap-2">
                            <button onClick={toggleRepeat}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all
                                    ${repeat ? 'bg-emerald-500/20 text-emerald-400' : dark ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-800' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}>
                                <Repeat size={14} />
                            </button>

                            <button onClick={playPrevious} disabled={!hasPrev}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition disabled:opacity-25
                                    ${dark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
                                <SkipBack size={14} className="fill-current" />
                            </button>

                            <button onClick={() => togglePlay(playingTrack)}
                                className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center active:scale-95 transition shadow-lg shadow-emerald-500/30">
                                {isPlaying
                                    ? <Pause size={18} className="text-white fill-white" />
                                    : <Play size={18} className="text-white fill-white ml-0.5" />}
                            </button>

                            <button onClick={playNext} disabled={!hasNext}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition disabled:opacity-25
                                    ${dark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
                                <SkipForward size={14} className="fill-current" />
                            </button>
                        </div>

                        {/* Right: Volume */}
                        <div className="w-1/3 flex justify-end items-center gap-3">
                            <Volume2 size={15} className={sub} />
                            <div className="w-24 relative h-1 rounded-full"
                                style={{ background: dark ? '#374151' : '#e5e7eb' }}>
                                <div className="h-full bg-emerald-500/80 rounded-full transition-all duration-100"
                                    style={{ width: `${volume * 100}%` }} />
                                <input type="range" min="0" max="1" step="0.02" value={volume}
                                    onChange={e => handleVolume(parseFloat(e.target.value))}
                                    className="absolute inset-0 w-full opacity-0 cursor-pointer h-full" />
                            </div>
                            {/* Time */}
                            <span className={`text-xs tabular-nums ${sub}`}>
                                {fmt(currentTime)} / {fmt(duration)}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Main Split Layout ── */}
            <div className="flex gap-6">

                {/* LEFT — Recently Played (fixed width sidebar) */}
                <aside className="w-1/2 flex-shrink-0">
                    <div className={`sticky top-22`}>
                        <p className={`text-xs font-semibold uppercase tracking-widest mb-3 ${sub}`}>
                            Recently Played
                        </p>
                        <RecentlyPlayed />
                    </div>
                </aside>

                {/* Divider */}
                <div className={`w-px self-stretch ${dark ? 'bg-gray-800' : 'bg-gray-200'}`} />

                {/* RIGHT — Music Grid */}
                <main className="flex-1 min-w-0 ">
                    <p className={`text-xs font-semibold uppercase tracking-widest mb-3 ${sub}`}>
                        All Music
                    </p>

                    {/* Error */}
                    {error && !musicLoad && (
                        <div className={`rounded-xl p-5 mb-5 text-center border
                            ${dark ? 'bg-red-500/10 border-red-500/25 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
                            <p className="font-semibold mb-2">{error}</p>
                            <button onClick={fetchMusic}
                                className="px-4 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition">
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Skeletons */}
                    {musicLoad && (
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {Array.from({ length: 8 }).map((_, i) => <DesktopSkeletonCard key={i} dark={dark} />)}
                        </div>
                    )}

                    {/* Empty */}
                    {!musicLoad && !error && filtered.length === 0 && (
                        <div className="text-center py-20">
                            <Music2 size={40} className={`mx-auto mb-3 ${sub}`} />
                            <p className={`text-lg font-bold mb-1 ${dark ? 'text-white' : 'text-gray-900'}`}>
                                {search ? 'No results found' : 'No music yet'}
                            </p>
                            <p className={`text-sm ${sub}`}>
                                {search ? `Nothing matches "${search}"` : 'Be the first to upload a track!'}
                            </p>
                            {search && (
                                <button onClick={() => setSearch('')}
                                    className="mt-4 px-4 py-1.5 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600 transition">
                                    Clear search
                                </button>
                            )}
                        </div>
                    )}

                    {/* Grid */}
                    {!musicLoad && !error && filtered.length > 0 && (
                        <>
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                                            currentTime={currentTime}
                                            duration={duration}
                                            onSeek={handleSeek}
                                            isLiked={likedSongs.includes(music._id)}
                                            onToggleLike={onToggleLike}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {pagination?.totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-8">
                                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                        className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition disabled:opacity-30
                                            ${dark ? 'border-gray-700 hover:bg-gray-800 text-gray-300' : 'border-gray-300 hover:bg-gray-100 text-gray-700'}`}>
                                        ← Prev
                                    </button>
                                    <div className="flex gap-1">
                                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                                            <button key={p} onClick={() => setPage(p)}
                                                className={`w-8 h-8 rounded-lg text-sm font-semibold transition
                                                    ${page === p ? 'bg-emerald-500 text-white' : dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}>
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                    <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}
                                        className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition disabled:opacity-30
                                            ${dark ? 'border-gray-700 hover:bg-gray-800 text-gray-300' : 'border-gray-300 hover:bg-gray-100 text-gray-700'}`}>
                                        Next →
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}