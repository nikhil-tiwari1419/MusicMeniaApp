import { Play, Pause, Music2, Volume2 } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════
   DESKTOP MUSIC LAYOUT
   - Grid of album-art cards (2 → 5 columns depending on screen)
   - Hover reveals play button over thumbnail
   - Animated bars badge on playing card
   - Now Playing banner at top
   - Full seekbar + volume slider in card footer
   Props received from LocalFeed (via sharedProps spread):
     dark, musicLoad, error, filtered, playingId, playingTrack,
     togglePlay, page, setPage, setSearch, pagination, search,
     fetchMusic, progress, currentTime, duration, handleSeek, handleVolume, volume
════════════════════════════════════════════════════════════════ */

/* ── Animated equaliser bars ── */
function EqBars({ size = 'sm' }) {
    const w = size === 'lg' ? 'w-1' : 'w-[3px]';
    const heights = size === 'lg'
        ? [[8, 18], [12, 6], [18, 10], [10, 20]]
        : [[5, 12], [8, 4], [12, 7], [7, 14]];

    return (
        <div className="flex gap-[2px] items-end">
            {heights.map(([a, b], i) => (
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

/* ════════════════════════════════════════════════════════════════
   DESKTOP MUSIC CARD
   Shows thumbnail, title, artist. When playing shows full controls.
   Props:
     music       – the track object { _id, title, thumbnail, artist, url }
     isPlaying   – boolean, true if this card's track is the active one
     onPlay      – fn(id) toggles play/pause for this track
     dark        – boolean theme flag
     progress    – 0-100 seekbar value (only meaningful when isPlaying)
     currentTime – seconds elapsed
     duration    – total seconds
     onSeek      – fn(val 0-100) seeks audio
     volume      – 0-1 float
     onVolume    – fn(val 0-1) changes volume
════════════════════════════════════════════════════════════════ */
function DesktopMusicCard({ music, isPlaying, onPlay, dark, progress, currentTime, duration, onSeek, volume, onVolume }) {
    const card = dark ? 'bg-gray-900 border-gray-700/40' : 'bg-white border-gray-200';
    const sub = dark ? 'text-gray-400' : 'text-gray-500';
    const trackBg = dark ? 'bg-gray-700' : 'bg-gray-200';

    return (
        <div
            className={`group relative rounded-2xl border overflow-hidden transition-all duration-300
                hover:-translate-y-1 hover:shadow-2xl ${card}
                ${isPlaying ? 'ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-500/10' : ''}`}
        >
            {/* ── Thumbnail area ── */}
            <div className="relative aspect-square overflow-hidden bg-gray-800">
                {music.thumbnail
                    ? <img src={music.thumbnail} alt={music.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    : (
                        <div className={`w-full h-full flex items-center justify-center ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                            <Music2 size={36} className="text-gray-500" />
                        </div>
                    )
                }

                {/* Play overlay — visible on hover, or always when playing */}
                <div
                    onClick={() => onPlay(music._id)}
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
                        {isPlaying
                            ? <Pause size={20} className="text-white fill-white" />
                            : <Play size={20} className="text-white fill-white ml-0.5" />
                        }
                    </button>
                </div>

                {/* Eq badge top-right when playing */}
                {isPlaying && (
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1.5 flex items-end gap-[2px] h-7">
                        <EqBars size="sm" />
                    </div>
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

/* ════════════════════════════════════════════════════════════════
   MAIN DESKTOP LAYOUT EXPORT
   Rendered inside LocalFeed only on desktop (hidden sm:block wrapper there)
════════════════════════════════════════════════════════════════ */
export default function DesktopMusicLayout({
    dark, musicLoad, error, filtered, playingId, playingTrack,
    togglePlay, page, setPage, setSearch, pagination, search, fetchMusic,
    progress, currentTime, duration, handleSeek, handleVolume, volume
}) {
    const sub = dark ? 'text-gray-400' : 'text-gray-500';

    return (
        <div className="hidden sm:block max-w-7xl mx-auto px-4 py-8">

            {/* ── Now Playing banner (desktop only) ── */}
            {playingId && playingTrack && (
                <div className={`mb-7 px-5 py-3.5 rounded-2xl flex items-center gap-4 border
                    ${dark ? 'bg-emerald-500/8 border-emerald-500/25' : 'bg-emerald-50 border-emerald-200'}`}>
                    <EqBars size="lg" />
                    <div className="flex-1 min-w-0">
                        <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest">Now Playing</p>
                        <p className={`font-bold truncate mt-0.5 ${dark ? 'text-white' : 'text-gray-900'}`}>
                            {playingTrack.title}
                            <span className={`ml-2 text-sm font-normal ${sub}`}>
                                · {playingTrack.artist?.username || 'Unknown Artist'}
                            </span>
                        </p>
                    </div>
                    <button
                        onClick={() => togglePlay(playingId)}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-semibold transition
                            ${dark ? 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/15' : 'border-emerald-300 text-emerald-600 hover:bg-emerald-100'}`}
                    >
                        <Pause size={12} className="fill-current" /> Stop
                    </button>
                </div>
            )}

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
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filtered.map((music, i) => (
                            <div
                                key={music._id}
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
                                    isPlaying={playingId === music._id}
                                    onPlay={togglePlay}
                                    dark={dark}
                                    progress={progress}
                                    currentTime={currentTime}
                                    duration={duration}
                                    onSeek={handleSeek}
                                    volume={volume}
                                    onVolume={handleVolume}
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
                                    <button key={p} onClick={() => setPage(p)}
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