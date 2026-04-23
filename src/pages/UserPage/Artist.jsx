import React from 'react'
import Navbar from '../../Components/Navbar'
import { useTheme } from '../../Context/Theme'

function Artist() {
    const { theme } =useTheme()
    const dark = theme === 'dark'
  return (
    <>
    <Navbar/>
    <div className={`py-15 ${dark ? "bg-black text-white":"bg-white text-black"}`}>
     <h1 className='text-center text-2xl flex'>
      Artist page come soon.......
      </h1> 
    </div>
    </>
  )
}

export default Artist