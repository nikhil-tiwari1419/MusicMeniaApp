import React from 'react'

function Musics({ musics, onDelete }) {
  if (!musics) return null; // adding guard return null if music not found 

  return (
    <div className='p-4'>
      <h2 className='font-semibold text-lg'> <span className='text-sm'>Song Name:-</span>  {musics.title}</h2>
      <p className='text-gray-500 text-sm'>artist:- {musics.artist?.username || 'Unknown Artist'}</p>

      <audio controls className='w-full mt-1 p-2'>
        <source src={musics.url} type='audio/mpeg' />
      </audio>

      {musics.thumbnail && (
        <img
          src={musics.thumbnail}
          alt={musics.title}
          className='w-full h-40 object-cover rounded-lg mt-2'
        />
      )}

      <button
        onClick={() => onDelete(musics._id)} 
        className='mt-3  px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm'>
        Delete Song 
      </button>
    </div>
  )
}

export default Musics
