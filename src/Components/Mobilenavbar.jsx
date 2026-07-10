import React from 'react'
import { useAuth } from '../Context/useAuth'
import { useTheme } from '../Context/Theme'
import { PUBLIC_LINKS, USER_LINKS, ARTIST_LINKS } from '../Ui/Navlinks'
import { NavLink } from 'react-router-dom'

export default function Mobilenavbar({ activeSection, scrollToSection }) {

    const { theme } = useTheme()
    const { user } = useAuth()
    const dark = theme === 'dark'
    const isPublicNav = !user

    const navLinks = user
        ? user.role === 'artist' ? ARTIST_LINKS : USER_LINKS : PUBLIC_LINKS

    const navBg = dark ? 'bg-zinc-950 border-black' : 'bg-white border-black'
    const activeLink = 'bg-blue-400 text-black'
    const inactiveLink = dark ? 'text-zinc-400' : 'text-zinc-500'

    return (
        <nav className={`md:hidden fixed bottom-0 left-0 w-full z-50 flex items-stretch ${navBg}`}>
            {navLinks.map(link => {
                const Icon = link.icon
                const isActive = isPublicNav
                    ? activeSection === link.section
                    : undefined // NavLink figures its own active state out

                const inner = (
                    <>
                        {Icon && <Icon size={25} />}
                        
                    </>
                )

                if (isPublicNav) {
                    return (
                        <button
                            key={link.label}
                            type="button"
                            onClick={() => scrollToSection(link.section)}
                            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 border-r-2 border-black last:border-r-0 transition-colors
                                ${isActive ? activeLink : inactiveLink}`}
                        >
                            {inner}
                        </button>
                    )
                }

                return (
                    <NavLink
                        key={link.label}
                        to={link.path}
                        className={({ isActive }) =>
                            `flex-1 flex flex-col items-center justify-center gap-0.5 py-2  border-black last:border-r-0 transition-colors
                            ${isActive ? activeLink : inactiveLink}`
                        }
                    >
                        {inner}
                    </NavLink>
                )
            })}
        </nav>
    )
}
