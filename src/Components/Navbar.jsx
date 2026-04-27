import { useState, useRef, useEffect } from 'react'
import { Menu, X, Sun, Moon, Music2 } from 'lucide-react'
import { useNavigate, NavLink } from 'react-router-dom'
import { useTheme } from '../Context/Theme'
import { useAuth } from '../Context/useAuth'
import UserMenu from '../Components/Usermenu'

const USER_LINKS = [
    { label: 'Home',       path: '/user-Dashboard' },
    { label: 'Music Feed', path: '/Local-Feed'      },
    { label: 'Album',      path: '/album'           },
    { label: 'Artist',     path: '/artist'          },
    { label: 'About',      path: '/about'           },
    { label: 'Profile',    path: '/Profile'         },
]

const ARTIST_LINKS = [
    { label: 'Home',         path: '/artist-Dashboard' },
    { label: 'Upload Track', path: '/create-music'     },
    { label: 'Album',        path: '/Admin-album'      },
    { label: 'My Posts',     path: '/your-post'        },
    { label: 'About',        path: '/about-company'    },
]

export default function Navbar() {
    const [open, setOpen]        = useState(false)
    const drawerRef              = useRef(null)
    const navigate               = useNavigate()
    const { theme, toggleTheme } = useTheme()
    const { user }               = useAuth()
    const dark                   = theme === 'dark'

    const navLinks = user?.role === 'artist' ? ARTIST_LINKS : user?.role === 'user' ? USER_LINKS : []

    // Lock body scroll when drawer open
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [open])

    // Close drawer on outside click
    useEffect(() => {
        const handler = e => {
            if (drawerRef.current && !drawerRef.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    // ── theme tokens ──
    const bg       = dark ? 'bg-gray-950/90 border-gray-800' : 'bg-white/90 border-gray-200'
    const text     = dark ? 'text-white'    : 'text-gray-900'
    const sub      = dark ? 'text-gray-400' : 'text-gray-500'
    const hov      = dark ? 'hover:bg-gray-800/70' : 'hover:bg-gray-100'
    const drawerBg = dark ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-100'

    function ThemeBtn() {
        return (
            <button
                onClick={toggleTheme}
                className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors
                    ${dark
                        ? 'border-gray-700 text-yellow-400 hover:bg-gray-800'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-100'}`}
            >
                {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
        )
    }

    return (
        <>
            {/* ══════════════════════════════════════════
                TOP BAR  — always fixed, z-50
            ══════════════════════════════════════════ */}
            <header className={`fixed top-0 w-full z-50 border-b backdrop-blur-md transition-colors duration-200 ${bg} ${text}`}>
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-14">

                    {/* Logo */}
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-sm">
                            <Music2 size={16} className="text-white" />
                        </div>
                        <span className="text-base font-bold tracking-tight">MusicMenia</span>
                    </button>

                    {/* Desktop nav links */}
                    <nav className="hidden md:flex items-center gap-0.5">
                        {navLinks.map(link => (
                            <NavLink key={link.label} to={link.path}
                                className={({ isActive }) =>
                                    `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                                    ${isActive
                                        ? 'text-emerald-500 bg-emerald-500/10'
                                        : `${sub} ${hov}`}`
                                }>
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Right controls */}
                    <div className="flex items-center gap-2">
                        <div className="hidden md:block"><ThemeBtn /></div>
                        <UserMenu />
                        {/* Hamburger — mobile only */}
                        <button
                            onClick={() => setOpen(o => !o)}
                            aria-label="Open menu"
                            className={`md:hidden w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${hov}`}
                        >
                            <Menu size={18} />
                        </button>
                    </div>
                </div>
            </header>

            {/* ══════════════════════════════════════════
                BACKDROP — rendered in the root DOM,
                NOT inside <header>, so fixed works
            ══════════════════════════════════════════ */}
            {open && (
                <div
                    className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* ══════════════════════════════════════════
                DRAWER — rendered in the root DOM,
                slides in from the right
            ══════════════════════════════════════════ */}
            <div
                ref={drawerRef}
                className={`fixed top-0 right-0 h-full w-72 z-[70] border-l shadow-2xl md:hidden
                    flex flex-col transition-transform duration-300 ease-in-out
                    ${drawerBg} ${text}
                    ${open ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Drawer header */}
                <div className={`flex items-center justify-between px-5 h-14 border-b flex-shrink-0
                    ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
                            <Music2 size={14} className="text-white" />
                        </div>
                        <span className="text-sm font-bold">MusicMenia</span>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        aria-label="Close menu"
                        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${hov}`}
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Nav links */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5">
                    {navLinks.map(link => (
                        <NavLink key={link.label} to={link.path}
                            onClick={() => setOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors
                                ${isActive
                                    ? 'text-emerald-500 bg-emerald-500/10'
                                    : `${text} ${hov}`}`
                            }>
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Drawer footer */}
                <div className={`px-4 pb-8 pt-4 border-t flex-shrink-0 flex flex-col gap-3
                    ${dark ? 'border-gray-800' : 'border-gray-100'}`}>

                    {/* User info or login */}
                    {user ? (
                        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl
                            ${dark ? 'bg-gray-800/60' : 'bg-gray-50'}`}>
                            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {user.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div className="min-w-0">
                                <p className={`text-sm font-semibold truncate ${text}`}>{user.username}</p>
                                <p className={`text-xs truncate ${sub}`}>{user.email}</p>
                            </div>
                        </div>
                    ) : (
                        <NavLink to="/login" onClick={() => setOpen(false)}
                            className="block text-center py-2.5 rounded-xl text-sm font-semibold
                                bg-emerald-500 hover:bg-emerald-400 text-white transition-colors">
                            Login / Sign up
                        </NavLink>
                    )}

                    {/* Theme toggle */}
                    <div className="flex items-center justify-between px-1">
                        <span className={`text-xs ${sub}`}>{dark ? 'Dark mode' : 'Light mode'}</span>
                        <ThemeBtn />
                    </div>
                </div>
            </div>
        </>
    )
}