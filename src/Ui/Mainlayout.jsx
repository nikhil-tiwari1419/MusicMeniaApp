import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from '../Components/Footer'
function Mainlayout() {
  return (
    <>
    <Navbar/>
    <Outlet/>
    </>
  )
}

export default Mainlayout

