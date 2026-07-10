import React from 'react'
import { useTheme } from '../Context/Theme'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, EllipsisVertical, Share2, Heart, Play, SkipForward, Pause } from 'lucide-react'

function MusicPanal() {
  const path = useNavigate()
  return (
    <>
      <div className='min-h-screen bg-gray-300 text-black'>
      <h1 className='text-2xl text-red-400'>more feature are watting to use  nowonly arrow* is using</h1>

        {/* IMAGE SECTION */}
        <section
          className=''>
          {/* back  */}
          <span
            className='flex  justify-between pt-5 px-3'
          >

            <span
              onClick={() => path('/Local-feed')}>
              <ChevronDown size={44} />
            </span>

            <span> <EllipsisVertical size={44} /></span>

          </span>
          {/* <img src={Image.thumbnail} alt="" /> */}
        </section>


        {/* controls section */}
        <section>
          {/* icon controler */}
          <span className='flex justify-between px-7'><Heart size={24} /><Share2 size={24} /></span>
          {/* progress bar */}
          <span></span>
          {/* controlers */}
          <div className='flex justify-center gap-10'>
            <button> <SkipForward size={44} /></button>
            <button><Play size={44} /><Pause size={44} /></button>

          </div>
        </section>
      </div>
    </>
  )
}

export default MusicPanal
