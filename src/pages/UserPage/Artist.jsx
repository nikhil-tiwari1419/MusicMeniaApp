import React, { useCallback, useEffect, useState } from 'react'
import { getArtist } from '../../api/Artist.api'
import { useTheme } from '../../Context/Theme'

function Artist() {
  const { theme } = useTheme()
  const dark = theme === 'dark'

  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchArtist = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getArtist()
      // adjust this line to match your actual API response shape
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

  return (
    <div className={`py-15 min-h-[93vh] px-4 ${dark ? "bg-black text-white" : "bg-white text-black"}`}>
      <h1 className="text-center text-2xl p-10 font-semibold">
        {loading ? "Loading artists..." : `-- The number of artists is ${artists.length} --`}
      </h1>

      {error && (
        <p className="text-center text-red-500 mb-6">{error}</p>
      )}

      {!loading && !error && (
        <div className="flex flex-wrap text-xl font-semibold gap-6 items-center justify-center">
          {artists.length === 0 ? (
            <p className="text-gray-400">No artists found.</p>
          ) : (
            artists.map((artist, i) => (
              <h1
                key={artist._id || artist.id || i}
                className="bg-blue-400 text-white rounded p-3"
              >
                {i + 1}. {artist.username}
              </h1>
            ))
          )}
        </div>
      )}

      <h1 className="text-center m-10 py-3 rounded-xl text-xl font-semibold text-cyan-500">
        Thank You For Reaching Here
      </h1>
      <h1 className="text-center mx-20 px-2 py-3 rounded-xl text-xl font-semibold text-emerald-500">
        Enjoy Song's
      </h1>
    </div>
  )
}

export default Artist

