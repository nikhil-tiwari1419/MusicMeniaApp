import React, { useCallback, useEffect, useState } from 'react'
import { getArtist } from '../../api/Artist.api'
import { useTheme } from '../../Context/Theme'
import { useNavigate } from 'react-router-dom'

function Artist() {
  const { theme } = useTheme()
  const dark = theme === 'dark'

  const path = useNavigate();
  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchArtist = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getArtist()
      setArtists(res.data?.artists || res.data || [])
    } catch (err) {
      console.error(err)
      setError('Failed to load artists. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchArtist()
  }, [fetchArtist])

  // simple deterministic color for avatar fallback
  const avatarColors = [
    'from-pink-500 to-rose-500',
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-indigo-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
  ]
  const getColor = (i) => avatarColors[i % avatarColors.length]

  return (
    <div
      className={`min-h-[93vh] px-4 py-16 transition-colors duration-300 ${
        dark ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-black'
      }`}
    >
      {/* Header */}
      <div className="text-center mb-14">
        <p
          className={`text-xs tracking-[0.3em] uppercase mb-3 ${
            dark ? 'text-neutral-500' : 'text-neutral-400'
          }`}
        >
          Browse
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          {loading ? (
            'Loading artists…'
          ) : (
            <>
              All Artists
              <span className="block mt-2 text-sm font-medium text-neutral-400">
                {artists.length} {artists.length === 1 ? 'artist' : 'artists'} found
              </span>
            </>
          )}
        </h1>
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 max-w-6xl mx-auto">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={`rounded-2xl p-5 flex flex-col items-center gap-3 animate-pulse ${
                dark ? 'bg-neutral-900' : 'bg-neutral-200'
              }`}
            >
              <div className={`w-16 h-16 rounded-full ${dark ? 'bg-neutral-800' : 'bg-neutral-300'}`} />
              <div className={`h-3 w-16 rounded ${dark ? 'bg-neutral-800' : 'bg-neutral-300'}`} />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="max-w-md mx-auto text-center mb-10">
          <p className="text-red-500 font-medium mb-3">{error}</p>
          <button
            onClick={fetchArtist}
            className="px-5 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && artists.length === 0 && (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🎤</p>
          <p className={`text-lg ${dark ? 'text-neutral-500' : 'text-neutral-400'}`}>
            No artists found yet.
          </p>
        </div>
      )}

      {/* Artist grid */}
      {!loading && !error && artists.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 max-w-6xl mx-auto">
          {artists.map((artist, i) => (
            <div
              key={artist._id || artist.id || i}
              className={`group rounded-2xl p-5 flex flex-col items-center gap-3 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
                dark
                  ? 'bg-neutral-900 hover:bg-neutral-800'
                  : 'bg-white hover:shadow-xl shadow-sm border border-neutral-200'
              }`}
            >
              {artist.avatar ? (
                <img
                  src={artist.avatar}
                  alt={artist.username}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-transparent group-hover:ring-cyan-400 transition-all"
                />
              ) : (
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${getColor(
                    i
                  )} flex items-center justify-center text-lg font-bold text-white ring-2 ring-transparent group-hover:ring-cyan-400 transition-all`}
                >
                  {artist.username?.[0]?.toUpperCase() || '?'}
                </div>
              )}
              <p className="text-sm font-semibold text-center truncate w-full">
                {artist.username}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="text-center mt-20 space-y-2">
        
          <button 
          onClick={()=> path('/contact')}
          className='border rounded cursor-pointer p-2 text-3xl text-indigo-700'
          >Want to Become artist Click Here </button> 
        <p className="text-lg font-semibold text-cyan-500">Thank You For Reaching Here</p>
        <p className="text-lg font-semibold text-emerald-500">Enjoy Song's 🎶</p>
      </div>
    </div>
  )
}

export default Artist

