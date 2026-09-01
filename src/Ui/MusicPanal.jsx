import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../Context/Theme'
import { useAudio } from '../Context/AudioContext' // adjust the hook name/path if your context exports it differently
import { ChevronDown, EllipsisVertical, Share2, Heart, Play, Pause, SkipBack, SkipForward, Repeat, Music2 } from 'lucide-react'

function fmt(s) {
  if (!s || isNaN(s)) return '0:00'
  return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`
}

function MusicPanal() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const dark = theme === 'dark'

  const {
    playingTrack: track,
    isPlaying,
    togglePlay,
    playNext,
    playPrevious,
    repeat,
    toggleRepeat,
    progress,
    currentTime,
    duration,
    handleSeek,
    likedSongs = [],
    onToggleLike,
    queue,
  } = useAudio()

  const bg = dark ? 'bg-zinc-950' : 'bg-white'
  const text = dark ? 'text-white' : 'text-black'
  const sub = dark ? 'text-zinc-400' : 'text-zinc-500'

  const currentQueueIndex = queue?.length > 0 && track
    ? queue.findIndex(t => t._id === track._id) : -1
  const hasNext = currentQueueIndex !== -1 && currentQueueIndex < (queue?.length || 0) - 1
  const hasPrev = currentQueueIndex > 0
  const isLiked = track && likedSongs.includes(track._id)

  // Nothing playing — bounce back rather than showing a broken player
  if (!track) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center gap-4 ${bg} ${text}`}>
        <Music2 size={40} className={sub} />
        <p className="font-black uppercase tracking-wide">Nothing is playing</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border-2 border-black rounded-xl font-semibold uppercase text-sm">
          Back to Feed
        </button>
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex flex-col ${bg} ${text}`}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-5">
        <button onClick={() => navigate(-1)} aria-label="Close">
          <ChevronDown size={28} />
        </button>
        <p className={`text-xs font-black uppercase tracking-widest ${sub}`}>Now Playing</p>
        <button aria-label="More options">
          <EllipsisVertical size={24} />
        </button>
      </div>

      {/* Artwork */}
      <div className="flex-1 flex items-center justify-center px-8 py-6">
        <div className="w-full max-w-sm aspect-square rounded-2xl border-2 border-black overflow-hidden shadow-[6px_6px_0_#000] bg-zinc-800">
          {track.thumbnail
            ? <img src={track.thumbnail} alt={track.title} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center">
                <Music2 size={64} className="text-zinc-500" />
              </div>
          }
        </div>
      </div>

      {/* Title + actions */}
      <div className="px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold  tracking-tight truncate">{track.title}</h1>
            <p className={`text-sm truncate ${sub}`}>{track.artist?.username || 'Unknown Artist'}</p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {onToggleLike && (
              <button onClick={() => onToggleLike(track._id)} aria-label="Like">
                <Heart size={24} className={isLiked ? 'fill-red-500 text-red-500' : sub} />
              </button>
            )}
            <button aria-label="Share">
              <Share2 size={22} className={sub} />
            </button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-6 mt-6">
        <div className="relative h-1.5 w-full rounded-full bg-zinc-300">
          <div className="h-full bg-blue-400 rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }} />
          <div
            className={`absolute top-1/2 h-3.5 w-3.5 border-2 rounded-full -translate-y-1/2 -translate-x-1/2 pointer-events-none
              ${dark ? 'bg-white border-black' : 'bg-blue-900 border-black'}`}
            style={{ left: `${progress}%` }}
          />
          <input
            type="range" min="0" max="100" step="0.5"
            value={Math.round(progress)}
            onChange={e => handleSeek(parseFloat(e.target.value))}
            className="absolute inset-0 w-full opacity-0 cursor-pointer h-6 -top-2.5"
          />
        </div>
        <div className={`flex justify-between mt-1.5 text-xs font-mono tabular-nums ${sub}`}>
          <span>{fmt(currentTime)}</span>
          <span>{fmt(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 px-6 mt-8 mb-15">
        <button onClick={toggleRepeat}
          className={`w-11 h-11 rounded-full border-2 border-black flex items-center justify-center transition-all
            ${repeat ? 'bg-violet-400' : dark ? 'bg-zinc-800' : 'bg-white'}`}>
          <Repeat size={18} />
        </button>

        <button onClick={playPrevious} disabled={!hasPrev}
          className={`w-12 h-12 rounded-full border-2 border-black flex items-center justify-center transition-all disabled:opacity-25
            ${dark ? 'bg-zinc-800' : 'bg-white'}`}>
          <SkipBack size={20} className="fill-current" />
        </button>

        <button onClick={() => togglePlay(track)}
          className="w-16 h-16 rounded-full border-2 border-black bg-yellow-400 flex items-center justify-center
            shadow-[4px_4px_0_#000] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all">
          {isPlaying
            ? <Pause size={26} className="text-black fill-black" />
            : <Play size={26} className="text-black fill-black ml-1" />
          }
        </button>

        <button onClick={playNext} disabled={!hasNext}
          className={`w-12 h-12 rounded-full border-2 border-black flex items-center justify-center transition-all disabled:opacity-25
            ${dark ? 'bg-zinc-800' : 'bg-white'}`}>
          <SkipForward size={20} className="fill-current" />
        </button>

        {/* Spacer to visually balance the repeat button on the left */}
        <div className="w-11 h-11" />
      </div>
    </div>
  )
}

export default MusicPanal
