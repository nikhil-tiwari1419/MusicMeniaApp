import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../Context/Theme';
import { Sun, Moon } from 'lucide-react';

function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Create Music', path: '/create-music' },
    { label: 'LocalFeed', path: '/Local-Feed' },
    { label: 'About', path: '/about' },
    { label: 'Album', path: '/album' },
  ];

  return (
    <div className={`p-2  fixed w-full sm:px-20 justify-between flex border border-dashed ${theme === "dark"? "bg-gray-800 border-white ":" border-black bg-gray-100 text-black"}`}>


      {/* Logo */}
      <div className={`flex cursor-pointer font-bold ${theme === "dark" ? "text-white":" text-black"}`} 
      onClick={() => navigate('/')}>
        <span className='bg-gray-900 text-xl text-white py-1 pl-2 font-mono rounded-l-2xl pr-1'>Music</span>
        <span className='bg-blue-400 text-xl text-black  py-1 pr-2 font-mono rounded-r-2xl pl-1'>Menia</span>
      </div>

   

      {/* Desktop Links */}
      <ul className='hidden md:flex gap-6 font-semibold'>
        {navLinks.map((link) => (
          <li
            key={link.label}
            onClick={() => navigate(link.path)}
            className='cursor-pointer hover:text-blue-500 hover:underline underline-offset-2 transition-colors'
          >
            {link.label}
          </li>
        ))}
      </ul>

      {/* Hamburger - mobile only */}
      <button className='md:hidden text-black cursor-pointer' onClick={() => setOpen(!open)}>
        {open ? <X size={28} /> : <Menu size={28} />}
      </button>


      {/* Mobile menu */}
      {open && (
        <div className={`'md:hidden absolute top-0 text-black left-0 right-0 bg-blue-200 p-3 z-50 `}>
          <button className='text-black' onClick={() => setOpen(!open)}>
            {open ? <X size={28} /> : ""}
          </button>
          <ul className='flex flex-col gap-3  font-semibold'>
            {navLinks.map((link) => (
              <li
                key={link.label}
                onClick={() => { navigate(link.path); setOpen(false); }}
                className='cursor-pointer hover:text-blue-500 transition-colors pb-2'
              >
                {link.label}
              </li>
            ))}
          </ul>

        </div>
      )}

      {/* Day/Night toggle */}
    <button
      onClick={toggleTheme}
      className={`cursor-pointer p-2 rounded-lg transition-colors
                            ${theme === 'dark'
          ? 'text-yellow-400 border  hover:bg-gray-700'   // sun icon in dark
          : 'text-gray-700 border hover:bg-blue-50'}`}   // moon icon in light
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button> 
    </div>
  )
}

export default Navbar

