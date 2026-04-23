import React from 'react'
import Navbar from '../../Components/Navbar'
import { useTheme } from '../../Context/Theme'

function Profile() {
  const { theme } = useTheme();
  const dark = theme === 'dark'
  return (
    <>
      <Navbar />
      <div className={`py-15 min-h-screen ${dark ? "bg-black text-white":"bg-white text-black"}`}>
        {/* header */}
        <div className='border rounded '>
          <img src="" alt=""
          className='border rounded-full '
          />
          <h1>Name:-</h1>
          <h1>email:-</h1>
          <h1>role:-</h1>
          

          
        </div>
      </div>
    </>
  )
}

export default Profile

