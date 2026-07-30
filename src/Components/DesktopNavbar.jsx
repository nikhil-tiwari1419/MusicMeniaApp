import React from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Sun, Moon, Music2 } from 'lucide-react'
import { useTheme } from '../Context/Theme'
import { useAuth } from '../Context/useAuth'
import Usermenu from './Usermenu'
import { PUBLIC_LINKS, USER_LINKS, ARTIST_LINKS } from '../Ui/Navlinks'

const SIDEBAR_WIDTH = 'w-64'

export default function DesktopNavbar({ activeSection, scrollToSection }) {
    const navigate = useNavigate()
    const location = useLocation()
    const { theme, toggleTheme } = useTheme()
    const { user } = useAuth()
    const dark = theme === 'dark'
    const isPublicNav = !user

    const navLink = user
        ? user.role === 'artist' ? ARTIST_LINKS : USER_LINKS : PUBLIC_LINKS

    const navBg = dark ? 'bg-zinc-950 border-black' : 'bg-white border-black'
    const text = dark ? 'text-white' : 'text-black'
    const activeLink = 'bg-blue-400 text-black font-black'
    const inactiveLink = `font-bold ${dark ? 'text-zinc-400 hover:bg-zinc-800 hover:text-white' : 'text-zinc-500 hover:bg-zinc-100 hover:text-black'}`

    function ThemeBtn() {
        return (
            <button
                onClick={toggleTheme}
                className={`w-8 h-8 flex items-center rounded-xl justify-center border-2 cursor-pointer ${dark ? 'bg-zinc-800 text-blue-400 border-blue-600' : 'bg-white text-black'}`}
            >
                {dark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        )
    }

    return (
        <div>
            <aside className={`hidden md:flex md:flex-col fixed top-0 left-0 h-full ${SIDEBAR_WIDTH} z-50 border-r-2 ${navBg} ${text}`}>

                {/* Logo */}
                <button onClick={() => navigate('/')}
                    className={`flex items-center cursor-pointer gap-0 m-3 rounded border-2 overflow-hidden ${dark ? "border-blue-600" : "border-black"} shadow-[3px_3px_0] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all`}>
                    <div className="w-full h-10 gap-3 bg-blue-400 flex  items-center justify-center flex-shrink-0">
                        <Music2 size={25} className="text-black" />
                        <span className=" text-black text-lg tracking-tight font-semibold">MusicMenia</span>
                    </div>
                </button>

                {/* Nav links */}
                <nav className='flex pt-2 flex-col border-t-2 border-black overflow-y-auto'>
                    {navLink.map(link => {
                        const Icon = link.icon
                        const content = (
                            <>
                                {Icon && <Icon size={18} />}
                                <span className='truncate'>{link.label}</span>
                            </>
                        )
                        if (isPublicNav) {
                            return (
                                <button
                                    key={link.label}
                                    type='button'
                                    onClick={() => scrollToSection(link.section)}
                                    className={`flex item-center gap-3 px-4 py-3 text-sm font-semibold ${activeSection === link.section ? activeLink : inactiveLink}`}
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
                                    `flex items-center gap-3 px-4 py-2 text-sm font-bold m-2 rounded border-black transition-colors
                                ${isActive ? activeLink : inactiveLink}`
                                }
                            >
                                {content}
                            </NavLink>
                        )
                    })}

                </nav>
                {/* bottom controls */}
                <div className='mt-auto p-3 flex items-center justify-between'>
                    <ThemeBtn />
                    <Usermenu />
                </div>
            </aside>
        </div>
    )
}
