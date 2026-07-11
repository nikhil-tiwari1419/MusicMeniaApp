import { Play, Pause, Music2, Volume2, Heart, SkipBack, SkipForward, Repeat, MoveLeft, MoveRight } from 'lucide-react';
import RecentlyPlayed from './RecentlyPlayed';

function EqBars({ size = 'sm' }) {
    const w = size === 'lg' ? 'w-1' : 'w-[3px]';
    const heights = size === 'lg'
        ? [[8, 18], [12, 6], [18, 10], [10, 20]]
        : [[5, 12], [8, 4], [12, 7], [7, 14]];

    return (
        <div className="flex gap-[4px] items-end">
            {heights.map(([a], i) => (
                <div key={i} className={`${w} bg-blue-400 rounded-xl `}
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

function DesktopMusicCard({ music, isPlaying, isActuallyPlaying, onPlay, dark, progress, isLiked, onToggleLike }) {
    return (
        <div
            className={`group relative rounded-2xl border-2 border-black transition-all duration-150 cursor-pointer
                ${isPlaying
                    ? 'bg-blue-400 shadow-[4px_4px_0_#000]'
                    : dark
                        ? 'bg-zinc-900 shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000] hover:-translate-x-[2px] hover:-translate-y-[2px]'
                        : 'bg-white shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000] hover:-translate-x-[2px] hover:-translate-y-[2px]'
                }`}
        >
            {/* Thumbnail */}
            <div className="relative rounded-2xl aspect-square overflow-hidden border-b-2 border-black bg-zinc-800">
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

                {/* Like button */}
                {onToggleLike && (
                    <button onClick={(e) => { e.stopPropagation(); onToggleLike(music._id); }}
                        className="absolute top-2 left-2 p-1.5 border-2 border-black bg-white hover:bg-yellow-400 transition-colors">
                        <Heart size={14} className={isLiked ? 'fill-black text-black' : 'text-black'} />
                    </button>
                )}
            </div>

            {/* Info */}
            <div className="px-3 pt-2.5 pb-3">
                <h3 className={`font-black text-sm truncate uppercase tracking-tight ${isPlaying ? 'text-black' : dark ? 'text-white' : 'text-black'}`}>
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

export default function DesktopMusicLayout({
    dark, musicLoad, error, filtered, playingId, playingTrack, isPlaying,
    togglePlay, playNext, playPrevious, repeat, toggleRepeat, queue,
    page, setPage, setSearch, pagination, search, fetchMusic,
    progress, currentTime, duration, handleSeek, handleVolume, volume,
    likedSongs = [], onToggleLike
}) {
    const currentQueueIndex = queue?.length > 0 && playingTrack
        ? queue.findIndex(t => t._id === playingTrack._id) : -1;
    const hasNext = currentQueueIndex !== -1 && currentQueueIndex < (queue?.length || 0) - 1;
    const hasPrev = currentQueueIndex > 0;

    const btnBase = `rounded-xl border-2 font-black text-xs uppercase tracking-widest transition-all duration-100
        shadow-[3px_3px_0_#000] hover:shadow-[1px_1px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px]
        active:shadow-none active:translate-x-[3px] active:translate-y-[3px]`;

    return (
        <div className={`hidden md:block max-w-7xl mx-auto px-4 pt-20 pb-20 ${dark ? 'bg-zinc-950' : 'bg-white'}`}>

            {/* ── Now Playing Bar ── */}
            {playingId && playingTrack && (
                <div className={`fixed bottom-0 left-0 right-0 z-50  border-black
                    ${dark ? 'bg-zinc-900' : 'bg-white'}`}>

                    {/* Progress bar — full width, raw */}
                    <div className="relative h-2 w-full bg-zinc-300 border-black">
                        <div className="h-full bg-blue-400 transition-all duration-100"
                            style={{ width: `${progress}%` }} />

                        <div
                            className={`
                    absolute
                    top-1/2
                    h-4
                    w-4
                    border-2
                    ${dark ? " bg-white" : "bg-blue-900"}
                    rounded-full
                    -translate-y-1/2
                    -translate-x-1/2
                    pointer-event-none
`}
                            style={{ left: `${progress}%` }}
                        />
                        <input type="range" min="0" max="100" step="0.5"
                            value={Math.round(progress)}
                            onChange={e => handleSeek(parseFloat(e.target.value))}
                            className="absolute inset-0 w-full opacity-0 cursor-pointer h-full" />
                    </div>

                    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

                        {/* Left: Track info */}
                        <div className="w-1/3 flex items-center gap-3 min-w-0">
                            <div className="relative  w-10 h-10 border-2 border-black flex-shrink-0 bg-zinc-800 overflow-hidden">
                                {playingTrack.thumbnail
                                    ? <img src={playingTrack.thumbnail} alt={playingTrack.title} className="w-full h-full object-cover" />
                                    : <div className="w-full h-full flex items-center justify-center">
                                        <Music2 size={16} className="text-zinc-500" />
                                    </div>}
                                {isPlaying && (
                                    <div className="absolute  inset-0 bg-black/50 flex items-center justify-center">
                                        <EqBars size="sm" />
                                    </div>
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className={`font-black text-sm truncate uppercase tracking-tight ${dark ? 'text-white' : 'text-black'}`}>
                                    {playingTrack.title}
                                </p>
                                <p className={`text-xs truncate font-mono ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                    {playingTrack.artist?.username || 'Unknown Artist'}
                                </p>
                            </div>
                        </div>

                        {/* Center: Controls */}
                        <div className="flex items-center gap-2">
                            <button onClick={toggleRepeat}
                                className={`w-8 h-8 border-2 flex items-center justify-center rounded transition-all
                                    ${repeat
                                        ? 'bg-violet-400 shadow-[2px_2px]'
                                        : dark ? 'bg-zinc-800 border-white' : 'bg-white border-black '}`}>
                                <Repeat size={16} className={dark && !repeat ? 'text-zinc-400' : 'text-black'} />
                            </button>

                            <button onClick={playPrevious} disabled={!hasPrev}
                                className={`w-8 h-8 rounded border-2 border-black flex items-center justify-center transition-all disabled:opacity-25
                                    ${dark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-white hover:bg-blue-100 text-black'}`}>
                                <SkipBack size={13} className="fill-current" />
                            </button>

                            <button onClick={() => togglePlay(playingTrack)}
                                className={`w-11 h-11 rounded border-2 ${dark ? "bg-green-500  border-white" : "bg-pink-400 border-black"}  flex items-center justify-center
                                    shadow-[3px_3px] hover:shadow-[1px_1px]
                                    hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100`}>
                                {isPlaying
                                    ? <Pause size={18} className="text-black fill-black" />
                                    : <Play size={18} className="text-black fill-black ml-0.5" />}
                            </button>

                            <button onClick={playNext} disabled={!hasNext}
                                className={`w-8 h-8 rounded border-2 ${dark ? "" : ""} border-black flex items-center justify-center transition-all disabled:opacity-25
                                    ${dark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-white hover:bg-blue-100 text-black'}`}>
                                <SkipForward size={13} className="fill-current" />
                            </button>
                        </div>

                        {/* Right: Volume + Time */}
                        <div className="w-1/3 flex justify-end items-center gap-3">
                            <Volume2 size={20} className={dark ? 'text-zinc-200' : 'text-black'} />
                            <div className="w-24 relative h-2 rounded  border">
                                <div className={` h-full ${dark ? "bg-white border-white" : "bg-black border-black"} transition-all duration-100 `}
                                    style={{ width: `${volume * 100}%` }} />
                                <input type="range" min="0" max="1" step="0.02" value={volume}
                                    onChange={e => handleVolume(parseFloat(e.target.value))}
                                    className="absolute inset-0 w-full opacity-0 cursor-pointer h-full" />
                            </div>
                            <span className={`text-sm tabular-nums font-mono ${dark ? 'text-zinc-200' : 'text-black'}`}>
                                {fmt(currentTime)} / {fmt(duration)}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Main Split Layout ── */}
            <div className="flex gap-0">

                {/* LEFT — Recently Played */}
                <aside className="w-1/2 flex-shrink-0 pr-6 border-r-2 border-black">
                    <div className="sticky top-22">
                        <p className={`text-xs font-black uppercase tracking-[0.2em] mb-4 pb-2 border-b-2 border-black ${dark ? 'text-zinc-400' : 'text-black'}`}>
                            Recently Played
                        </p>
                        <RecentlyPlayed />
                    </div>
                </aside>

                {/* RIGHT — Music Grid */}
                <main className="flex-1 min-w-0 pl-6">
                    <p className={`text-xs font-black uppercase tracking-[0.2em] mb-4 pb-2 border-b-2 border-black ${dark ? 'text-zinc-400' : 'text-black'}`}>
                        All Music
                    </p>

                    {/* Error */}
                    {error && !musicLoad && (
                        <div className="border-2 border-black bg-red-400 shadow-[4px_4px_0_#000] p-5 mb-5 text-center">
                            <p className="font-black uppercase mb-3">{error}</p>
                            <button onClick={fetchMusic}
                                className={`${btnBase} px-4 py-2 bg-black text-white`}>
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
                        <div className={`border-2 border-black shadow-[4px_4px_0_#000] text-center py-20 px-8 ${dark ? 'bg-zinc-900' : 'bg-white'}`}>
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
                                            isLiked={likedSongs.includes(music._id)}
                                            onToggleLike={onToggleLike}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {pagination?.totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-10">
                                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                        className={`rounded-full ${btnBase} px-4 py-2 disabled:opacity-30 ${dark ? 'bg-zinc-800 text-white' : 'bg-white text-black'}`}>
                                        <MoveLeft strokeWidth={3} />
                                    </button>
                                    <div className="flex gap-1">
                                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                                            <button key={p} onClick={() => setPage(p)}
                                                className={`w-9 rounded-full h-9 border-2 border-black font-black text-sm transition-all duration-100
                                                    ${page === p
                                                        ? 'bg-blue-400 shadow-[2px_2px_0_#000]'
                                                        : dark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-white text-black hover:bg-zinc-100'}`}>
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                    <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}
                                        className={`rounded-full ${btnBase} px-4 py-2 disabled:opacity-30 ${dark ? 'bg-zinc-800 text-white' : 'bg-white text-black'}`}>
                                       <MoveRight strokeWidth={3} />
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