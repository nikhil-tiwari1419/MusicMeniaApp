import React from 'react'

function Pageloader() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center gap-6'>
      
      {/* Spinner */}
      <div className='w-14 h-14 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin'></div>

      {/* Bouncing Dots */}
      <div className='flex gap-2'>
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className='w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce'
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      {/* Text */}
      <div className='text-center'>
        <p className='text-xl font-medium text-gray-800 dark:text-white'>Loading Page</p>
        <p className='text-sm text-gray-400 animate-pulse mt-1'>Please wait a moment...</p>
      </div>

    </div>
  )
}

export default Pageloader