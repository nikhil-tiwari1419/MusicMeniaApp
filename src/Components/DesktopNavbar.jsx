import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Music2 } from 'lucide-react'
import { useTheme } from '../Context/Theme'
import { useAuth } from '../Context/useAuth'
import Usermenu from './Usermenu'
import { PUBLIC_LINKS, USER_LINKS, ARTIST_LINKS } from '../Ui/Navlinks'

const NAVBAR_HEIGHT = 'h-16'

export default function DesktopNavbar({ activeSection, scrollTosection }) {
    const navigate = useNavigate()
    const { theme } = useTheme()
    const { user } = useAuth()
    const dark = theme === 'dark'
    const isPublicNav = !user

    const navLink = user
        ? user.role === 'artist' ? ARTIST_LINKS : USER_LINKS : PUBLIC_LINKS

    const navBg = dark ? 'bg-zinc-950 border-black' : 'bg-white border-black'
    const text = dark ? 'text-white' : 'text-black'  
    const activeLink = 'bg-blue-200 text-black font-black'
    const inactiveLink = `font-bold ${dark ? 'text-zinc-400 hover:bg-zinc-800 hover:text-white' : 'text-zinc-500 hover:bg-zinc-100 hover:text-black'}`

    return (
        <header className={`hidden md:flex items-center fixed top-0 left-0 w-full ${NAVBAR_HEIGHT} z-50 border-2 px-4 gap-4 ${navBg} ${text}`}>

            {/* Logo */}
            <button onClick={() => navigate('/')}
                className={`flex items-center cursor-pointer gap-0 rounded overflow-hidden flex-shrink-0 ${dark ? "border-green-600" : "border-blue-800"}`}>
                <div className="h-10 px-3 gap-2 bg-green-400 flex items-center justify-center">
                    <Music2 size={22} className="text-black" />
                    <span className="text-lg tracking-tight font-semibold">MusicMenia</span>
                </div>
            </button>

            {/* Nav links */}
            <nav className='flex no-scrollbar items-center gap-1 overflow-x-auto flex-1'>
                {navLink.map(link => {
                    const Icon = link.icon
                    const content = (
                        <>
                            {Icon && <Icon size={20}  />}
                            <span className='truncate underline lg:text-xl'>{link.label}</span>
                        </>
                    )
                    if (isPublicNav) {
                        return (
                            <button
                                key={link.label}
                                type='button'
                                onClick={() => scrollTosection(link.section)}
                                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded whitespace-nowrap ${activeSection === link.section ? activeLink : inactiveLink}`}
                            >
                                {content}
                            </button>
                        )
                    }
                    return (
                        <NavLink
                            key={link.label}
                            to={link.path}
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-4 py-2 text-sm font-bold rounded whitespace-nowrap transition-colors
                                ${isActive ? activeLink : inactiveLink}`
                            }
                        >
                            {content}
                        </NavLink>
                    )
                })}
            </nav>

            {/* right controls */}
            <div className='flex items-center gap-3 flex-shrink-0'>
                <Usermenu />
            </div>
        </header>
    )
}

