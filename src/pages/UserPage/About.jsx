import React from 'react'
import Navbar from '../../Components/Navbar'
import Footer from '../../Components/Footer'
import { useTheme } from '../../Context/Theme'

function About() {
  const theme = useTheme();
  const dark = theme === "dark";

  return(
    <>
    <Navbar/>
    <div className={`min-h-screen ${dark ? "bg-gray-800 text-white":"bg-gray-100 text-black"}`}>
        <div className='max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 pt-20'>
            <h1 className='text-4xl font-bold mb-6'>About Music Menia</h1>
            <p className='text-lg mb-4'>
                Music Menia is a platform dedicated to connecting music lovers and artists. We provide a space for artists to share their music and for fans to discover new sounds. Our mission is to create a vibrant community where creativity thrives and music is celebrated.
            </p>
            <p className='text-lg mb-4'>
                Whether you're an aspiring musician looking to share your work or a fan searching for your next favorite track, Music Menia is here to support you. Join us in our journey to make the world a more musical place!
            </p>
        </div>
    </div>
    <Footer/>
    </>
  )
}

export default About
