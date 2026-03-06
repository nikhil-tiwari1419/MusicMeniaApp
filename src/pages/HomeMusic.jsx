import React from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import { useTheme } from '../Context/Theme'

function HomeMusic() {

  const { theme } = useTheme();

  const musicFeed = [
    {
      id: 1,
      name: "playlist",
      img: "image.png",
    },
    {
      id: 2,
      name: "playlist",
      img: "image.png",

    },
    {
      id: 3,
      name: "playlist",
      img: "image.png",

    },


  ]
  return (
    <>
      <Navbar />
      {/* landing page */}
      <div className={`min-h-screen pt-10 flex flex-col p-4 items-center  gap-6  ${theme === "dark"? "bg-gray-800 text-white":"bg-gray-50 text-black"}`}>
        {/* for posters */}
        <div className=' overflow-auto rounded-xl w-full max-w-7xl p-6 sm:p-8 lg:p-10 flex flex-col items-center justify-center gap-6'>
          <h1 className='text-3xl sm:text-4xl lg:text-4xl font-bold '> welcome to <span className='font-bold sm:text-4xl font-mono text-blue-400 underline underline-offset-4'> MusicMeniya</span>
          </h1>
          <p className='text-sm sm:text-base text-center'>
            Discover and crete a music and music playlist with other's
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl p-4'>
            {musicFeed?.map((itm, idx) => {
              return <div key={itm.id} className="p-4 sm:border-none border-2 border-blue-300  border-dashed rounded-lg">
                <p className="font-semibold">{idx + 1} {itm.name}</p>
                <img
                  src={itm.img}
                  alt={itm.name}
                  className="w-40 h-40 object-cover rounded-full"
                />
              </div>
            })}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default HomeMusic

