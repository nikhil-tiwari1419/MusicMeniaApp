import { useNavigate } from 'react-router-dom'
import { Linkedin, Instagram, Facebook, Github, Music2, Mail, ArrowRight } from 'lucide-react'
import { useTheme } from '../Context/Theme'
import { useState } from 'react'

const SOCIAL = [
    { icon: Linkedin, url: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Instagram, url: 'https://instagram.com', label: 'Instagram' },
    { icon: Facebook, url: 'https://facebook.com', label: 'Facebook' },
    { icon: Github, url: 'https://github.com', label: 'Github' },
]

const SUPPORT = [
    { label: 'FAQ', path: '/faq' },
    { label: 'Contact Us', path: '/contact' },
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
]

const EXPLORE = [
    { label: 'Home', path: '/' },
    { label: 'Music Feed', path: '/music-feed' },
    { label: 'Album', path: '/album' },
    { label: 'About', path: '/about' },
]

export default function Footer() {
    const { theme } = useTheme()
    const navigate = useNavigate()
    const dark = theme === 'dark'
    const [email, setEmail] = useState('')

    const bg = dark ? 'bg-black' : 'bg-white'
    const borderClr = dark ? 'border-white' : 'border-black'
    const text = dark ? 'text-white' : 'text-black'
    const sub = dark ? 'text-gray-400' : 'text-gray-600'
    const colBorder = dark ? 'border-gray-800' : 'border-gray-300'
    const inputBg = dark ? 'bg-black border-gray-700 text-white placeholder-gray-600'
        : 'bg-white border-gray-400 text-black placeholder-gray-400'

    return (
        <footer
            className={`${bg} border-t-4 ${borderClr} font-mono transition-colors duration-0`}
            style={{ fontFamily: "'Courier New', monospace" }}
        >
            <div
                className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-b-4 ${borderClr}`}
            >
                {/* ── Brand ── */}
                <div className={`p-7 border-r-0 lg:border-r-2 ${colBorder} flex flex-col gap-4`}>
                    <p
                        className="text-xs font-black tracking-widest uppercase"
                        style={{ color: '#00ff', borderBottom: '1px solid #00ff88', paddingBottom: 8 }}
                    >
                        MusicMenia
                    </p>

                    <button
                        onClick={() => navigate('/')}
                        className={`flex items-center gap-3 w-fit`}
                    >
                        <div
                            className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                            style={{ background: '#00ff88' }}
                        >
                            <Music2 size={18} color="#000" />
                        </div>
                        <span className={`text-base font-black tracking-widest uppercase ${text}`}>
                            MusicMenia
                        </span>
                    </button>

                    <p className={`text-xs leading-relaxed ${sub}`}>
                        Discover, share, and celebrate music. A space where artists and fans collide.
                    </p>

                    <div className="flex gap-1.5 mt-1">
                        {SOCIAL.map(({ icon: Icon, url, label }) => (
                            <a
                                key={label}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                className={`w-8 h-8 flex items-center justify-center border-2 transition-none ${dark
                                        ? 'border-gray-700 text-gray-400 hover:border-[#00ff88] hover:text-[#00ff88]'
                                        : 'border-gray-400 text-gray-500 hover:border-[#00cc6e] hover:text-[#00cc6e]'
                                    }`}
                            >
                                <Icon size={14} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* ── Explore ── */}
                <div className={`p-7 border-r-0 lg:border-r-2 ${colBorder} flex flex-col gap-4`}>
                    <p
                        className="text-xs font-black tracking-widest uppercase"
                        style={{ color: '#00ff88', borderBottom: '1px solid #00ff88', paddingBottom: 8 }}
                    >
                        Explore
                    </p>
                    <ul className="flex flex-col">
                        {EXPLORE.map(({ label, path }) => (
                            <li key={label} className={`border-b ${colBorder}`}>
                                <button
                                    onClick={() => navigate(path)}
                                    className={`w-full text-left text-xs py-2 tracking-wide transition-none ${sub} hover:text-[#00ff88]`}
                                >
                                    <span className={`${dark ? 'text-gray-700' : 'text-gray-300'}`}>→ </span>
                                    {label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* ── Support ── */}
                <div className={`p-7 border-r-0 lg:border-r-2 ${colBorder} flex flex-col gap-4`}>
                    <p
                        className="text-xs font-black tracking-widest uppercase"
                        style={{ color: '#00ff88', borderBottom: '1px solid #00ff88', paddingBottom: 8 }}
                    >
                        Support
                    </p>
                    <ul className="flex flex-col">
                        {SUPPORT.map(({ label, path }) => (
                            <li key={label} className={`border-b ${colBorder}`}>
                                <button
                                    onClick={() => navigate(path)}
                                    className={`w-full text-left text-xs py-2 tracking-wide transition-none ${sub} hover:text-[#00ff88]`}
                                >
                                    <span className={`${dark ? 'text-gray-700' : 'text-gray-300'}`}>→ </span>
                                    {label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* ── Newsletter ── */}
                <div className="p-7 flex flex-col gap-4">
                    <p
                        className="text-xs font-black tracking-widest uppercase"
                        style={{ color: '#00ff88', borderBottom: '1px solid #00ff88', paddingBottom: 8 }}
                    >
                        Stay Updated
                    </p>
                    <p className={`text-xs leading-relaxed tracking-wide ${sub}`}>
                        Latest drops + artist news. No spam. Unsubscribe anytime.
                    </p>

                    <div className="flex flex-col gap-2 mt-1">
                        <div className={`flex items-center border-2 ${dark ? 'border-gray-700 bg-black' : 'border-gray-400 bg-white'} focus-within:border-[#00ff88] transition-colors duration-0`}>
                            <div className={`w-9 flex items-center justify-center flex-shrink-0 ${sub}`}>
                                <Mail size={13} />
                            </div>
                            <input
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className={`flex-1 bg-transparent outline-none text-xs py-2 pr-2 font-mono ${inputBg.split(' ').filter(c => c.startsWith('text-') || c.startsWith('placeholder-')).join(' ')}`}
                                style={{ fontFamily: "'Courier New', monospace" }}
                            />
                        </div>
                        <button
                            className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-black tracking-widest uppercase transition-none"
                            style={{ background: '#00ff88', color: '#000' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#00e07a'}
                            onMouseLeave={e => e.currentTarget.style.background = '#00ff88'}
                            onMouseDown={e => e.currentTarget.style.background = '#00c96e'}
                            onMouseUp={e => e.currentTarget.style.background = '#00e07a'}
                        >
                            Subscribe <ArrowRight size={13} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Bottom bar ── */}
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-2 px-7 py-4 ${dark ? 'bg-black' : 'bg-gray-50'}`}>
                <p className={`text-xs tracking-widest uppercase ${sub}`}>
                    © {new Date().getFullYear()} MusicMenia. All rights reserved.
                </p>
                <a
                    href="http://linkedin.com/in/nikhil-tiwari-53743b339"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-xs tracking-widest uppercase underline underline-offset-4 ${dark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-black'}`}
                    style={{ fontFamily: "'Courier New', monospace" }}
                >
                    Developed by Nikhil Tiwari
                </a>
                <p className={`text-xs tracking-widest uppercase ${sub}`}>
                    Made with <span style={{ color: '#00ff88' }}>♪</span> for music lovers
                </p>
            </div>
        </footer>
    )
}