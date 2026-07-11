import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from '../Components/Footer'
function Mainlayout() {
  return (
    <>
      <Navbar />
      <div className="md:pl-64  md:pb-0">
        <Outlet />
      </div>
    </>
  )
}

export default Mainlayout

