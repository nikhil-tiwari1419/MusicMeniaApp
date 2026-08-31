import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from '../Components/Footer'
function Mainlayout() {
  return (
    <>
      <Navbar />
      <main className="md:pt-16 min-h-screen  md:pb-0">
        <Outlet />
      </main>
    </>
  )
}

export default Mainlayout

