import { useState, useRef, useEffect } from 'react'
import { Menu, X, Sun, Moon, Music2 } from 'lucide-react'
import { useNavigate, NavLink, useLocation } from 'react-router-dom'
import { useTheme } from '../Context/Theme'
import { useAuth } from '../Context/useAuth'
import UserMenu from '../Components/Usermenu'

const PUBLIC_LINKS = [
    { label: 'Home', section: 'home' },
    { label: 'Workflow for Artists', section: 'artist-workflow' },
    { label: 'Workflow for Listeners', section: 'listener-workflow' },
    { label: 'FAQs', section: 'faqs' },
]

const USER_LINKS = [
    { label: 'Home', path: '/user-Dashboard' },
    { label: 'Music Feed', path: '/Local-Feed' },
    { label: 'Album', path: '/album' },
    { label: 'Artist', path: '/artist' },
    { label: 'About', path: '/about' },
    { label: 'Profile', path: '/Profile' },
]

const ARTIST_LINKS = [
    { label: 'Home', path: '/artist-Dashboard' },
    { label: 'Upload Track', path: '/create-music' },
    { label: 'Album', path: '/Artist-album' },
    { label: 'My Posts', path: '/your-post' },
    { label: 'Profile', path: '/Profile' },
    { label: 'About', path: '/about' },
]

export default function Navbar() {
    const [open, setOpen] = useState(false)
    const [activeSection, setActiveSection] = useState('home')
    const drawerRef = useRef(null)
    const navigate = useNavigate()
    const location = useLocation()
    const { theme, toggleTheme } = useTheme()
    const { user } = useAuth()
    const dark = theme === 'dark'
    const isPublicNav = !user

    const navLinks = user
        ? user.role === 'artist' ? ARTIST_LINKS : USER_LINKS
        : PUBLIC_LINKS

    function scrollToSection(sectionId) {
        const scroll = () => {
            const element = document.getElementById(sectionId)
            if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
        if (window.location.pathname !== '/') {
            navigate(`/#${sectionId}`)
            setOpen(false)
            setTimeout(() => { scroll(); setActiveSection(sectionId) }, 150)
            return
        }
        setActiveSection(sectionId)
        scroll()
        setOpen(false)
    }

    useEffect(() => {
        if (!isPublicNav) return
        const hash = location.hash.replace('#', '')
        if (hash) setActiveSection(hash)
    }, [location.hash, isPublicNav])

    useEffect(() => {
        if (!isPublicNav || location.pathname !== '/') return
        const sections = PUBLIC_LINKS.map(l => document.getElementById(l.section)).filter(Boolean)
        if (!sections.length) return
        const observer = new IntersectionObserver(
            entries => {
                const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)
                if (visible.length) setActiveSection(visible[0].target.id)
            },
            { rootMargin: '-35% 0% -55% 0%', threshold: [0.3, 0.6] }
        )
        sections.forEach(s => observer.observe(s))
        return () => observer.disconnect()
    }, [isPublicNav, location.pathname])

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [open])

    useEffect(() => {
        const handler = e => {
            if (drawerRef.current && !drawerRef.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const navBg = dark ? 'bg-zinc-950 border-black' : 'bg-white border-black'
    const text = dark ? 'text-white' : 'text-black'
    const drawerBg = dark ? 'bg-zinc-900 border-black' : 'bg-white border-black'

    // Active link style — yellow highlight, brutalist
    const activeLink = 'bg-yellow-400 text-black font-black border-b-2 border-black'
    const inactiveLink = `font-bold ${dark ? 'text-zinc-400 hover:bg-zinc-800 hover:text-white' : 'text-zinc-500 hover:bg-zinc-100 hover:text-black'}`

    function ThemeBtn() {
        return (
            <button
                onClick={toggleTheme}
                className={`w-8 h-8 flex items-center rounded-xl justify-center border-2 cursor-pointer shadow-[2px_2px_0] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all
                    ${dark ? 'bg-zinc-800 text-blue-400 border-blue ' : 'bg-white text-black'}`}
            >
                {dark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
        )
    }

    return (
        <>
            {/* ── Top Bar ── */}
            <header className={`fixed top-0 w-full z-50 border-b-2 transition-colors duration-200 ${navBg} ${text}`}>
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-14">

                    {/* Logo */}
                    <button onClick={() => navigate('/')}
                        className={`flex rounded-xl items-center gap-0 flex-shrink-0 border-2 ${dark ? "border-blue-600":"border-black"}  shadow-[3px_3px_0] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all `}>
                        <div className="w-10 h-10 bg-blue-400 border-r-2 rounded-xl border-black flex items-center justify-center">
                            <Music2 size={20} className="text-black" />
                        </div>
                        <span className="px-3 text-xl font-black uppercase tracking-tight font-mono">MusicMenia</span>
                    </button>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-0 border-2 border-black shadow-[3px_3px_0_#000]">
                        {navLinks.map((link, i) => (
                            isPublicNav ? (
                                <button
                                    key={link.label}
                                    type="button"
                                    onClick={() => scrollToSection(link.section)}
                                    className={`px-4 py-2 text-xl font-mono transition-colors border-r-2 border-black last:border-r-0
                                        ${activeSection === link.section ? activeLink : inactiveLink}`}
                                >
                                    {link.label}
                                </button>
                            ) : (
                                <NavLink key={link.label} to={link.path}
                                    className={({ isActive }) =>
                                        `px-4 py-2 text-xl font-mono transition-colors border-r-2 border-black last:border-r-0
                                        ${isActive ? activeLink : inactiveLink}`
                                    }>
                                    {link.label}
                                </NavLink>
                            )
                        ))}
                    </nav>

                    {/* Right controls */}
                    <div className="flex items-center gap-2">
                        <div className="hidden md:block"><ThemeBtn /></div>
                        <UserMenu />
                        <button
                            onClick={() => setOpen(o => !o)}
                            aria-label="Open menu"
                            className={`md:hidden w-9 h-9 rounded flex items-center justify-center border-2 border-black
                                shadow-[2px_2px_0_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all
                                ${dark ? 'bg-zinc-800' : 'bg-white'}`}
                        >
                            <Menu size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Backdrop */}
            {open && (
                <div
                    className="fixed inset-0 z-[60] bg-black/70 md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* ── Drawer ── */}
            <div
                ref={drawerRef}
                className={`fixed top-0 right-0 h-full w-90 z-[70] border-l-4 border-black md:hidden
                    flex flex-col transition-transform duration-200 ease-in-out
                    ${drawerBg} ${text}
                    ${open ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Drawer header */}
                <div className={`flex items-center justify-between px-4 h-14 border-b-2 border-black flex-shrink-0
                    ${dark ? 'bg-zinc-800' : 'bg-blue-400'}`}>
                    <div className="flex items-center gap-2">
                        <Music2 size={18} className={`${dark ?"text-white":"text-black"}`} />
                        <span className="text-base font-black uppercase tracking-tight font-mono ">MusicMenia</span>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        aria-label="Close menu"
                        className="w-8 h-8 flex items-center justify-center border-2 border-black bg-white hover:bg-zinc-100 transition-colors"
                    >
                        <X size={15} className="text-black" />
                    </button>
                </div>
                    <hr />

                {/* Nav links */}
                <nav className="flex-1 overflow-y-auto flex flex-col border-b-2 border-black">
                    {navLinks.map(link => (
                        isPublicNav ? (
                            <button
                                key={link.label}
                                type="button"
                                onClick={() => scrollToSection(link.section)}
                                className={`flex items-center px-5 py-3.5 text-sm font-mono font-bold border-b-2 border-black transition-colors
                                    ${activeSection === link.section
                                        ? 'bg-green-400 text-black'
                                        : dark ? 'text-zinc-300 hover:bg-blue-200' : 'text-black hover:bg-green-500'}`}
                            >
                                {link.label}
                            </button>
                        ) : (
                            <NavLink key={link.label} to={link.path}
                                onClick={() => setOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center px-5 py-3.5 text-sm  font-bold border-b-2 border-black transition-colors
                                    ${isActive
                                        ? 'bg-green-400 text-black'
                                        : dark ? 'text-zinc-300 hover:bg-zinc-800' : 'text-black hover:bg-zinc-100'}`
                                }>
                                {link.label}
                            </NavLink>
                        )
                    ))}
                </nav>

                {/* Drawer footer */}
                <div className="px-4 pb-8 pt-4 flex flex-col gap-3">

                    {user ? (
                        <div className={`flex items-center gap-3 p-3 border-2 rounded-xl border-black shadow-[3px_3px_0_#000]
                            ${dark ? 'bg-zinc-800' : 'bg-white'}`}>
                            <div className="w-9 h-9 bg-yellow-400 border-2 border-black flex items-center justify-center text-black text-xl font-black flex-shrink-0">
                                {user.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div className="min-w-0">
                                <p className={`text-sm font-black uppercase truncate ${text}`}>{user.username}</p>
                                <p className={`text-xs font-mono truncate ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>{user.email}</p>
                            </div>
                        </div>
                    ) : (
                        <NavLink to="/login" onClick={() => setOpen(false)}
                            className="block text-center py-3 text-sm font-black uppercase tracking-widest font-mono
                                bg-yellow-400 border-2 border-black shadow-[3px_3px_0_#000]
                                hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all text-black">
                            Login / Sign up
                        </NavLink>
                    )}

                    <div className="flex items-center justify-between px-1">
                        <span className={`text-sm font-black uppercase tracking-wider font-mono ${dark ? 'text-zinc-400' : 'text-black'}`}>
                            {dark ? 'Dark mode' : 'Light mode'}
                        </span>
                        <ThemeBtn />
                    </div>
                </div>
            </div>
        </>
    )
}