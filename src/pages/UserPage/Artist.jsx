import React from 'react'
// import Navbar from '../../Ui/Navbar'
import { useTheme } from '../../Context/Theme'

function Artist() {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  return (
    <>
      <div className={`py-15 min-h-screen ${dark ? "bg-black text-white" : "bg-white text-black"}`}>
        {/* <Navbar /> */}
        <h1 className='text-center justify-center text-2xl p-10 flex'>
          -- The number of artist is Two --
        </h1>


        <div className='flex text-xl font-semibold gap-20 items-center justify-center'>
          <h1 className='bg-blue-400 rounded p-3'>1. Nikhil tiwari </h1>
          <h1 className='bg-blue-400 rounded p-3'>2. Suraj</h1>
        </div>
        <h1 className='text-center m-10 py-3 rounded-xl text-xl font-semibold text-cyan-500 '>Thankyou For  Reaching Here </h1>
        <h1 className='text-center mx-20 px-2 py-3 rounded-xl text-xl font-semibold text-emerald-500 '>enjoy Song's </h1>
       
      </div>
    </>
  )
}

export default Artist

