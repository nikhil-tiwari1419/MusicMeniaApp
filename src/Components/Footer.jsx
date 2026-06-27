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
    const sub = dark ? 'text-gray-400' : 'text-gray-800 font-black'
    const colBorder = dark ? 'border-gray-600' : 'border-gray-300'
    const inputBg = dark ? 'bg-black border-gray-700 text-white placeholder-gray-600'
        : 'bg-white border-gray-400 text-black placeholder-gray-400'

    return (
        <footer
            className={`${bg} border-t-4 ${borderClr} transition-colors duration-0`}
            style={{ fontFamily: "'Courier New', monospace" }}
        >
            <div
                className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-b-4 ${borderClr}`}
            >
                {/* ── Brand ── */}
                <div className={`p-7 border-r-0 lg:border-r-2 ${colBorder} flex flex-col gap-4`}>
                    <p
                        className="text-sm text-blue-500 font-black  uppercase "
                    >
                        MusicMenia
                    </p>

                    <button
                        onClick={() => navigate('/')}
                        className={`flex items-center gap-3 w-fit`}
                    >
                        <div
                            className="w-10 h-10 flex items-center rounded bg-orange-400 justify-center flex-shrink-0"
                        >
                            <Music2 size={28} color="#000" />
                        </div>
                        <span className={`text-xl font-black tracking-widest uppercase underline underline-offset-4 ${text}`}>
                            MusicMenia
                        </span>
                    </button>

                    <p className={`text-xl leading-relaxed ${sub}`}>
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
                                className={`w-8 h-8 flex items-center justify-center border sm:border-3 rounded   transition-none ${dark
                                    ? 'border-gray-700 text-gray-400 hover:border-[#00ff88] hover:text-[#00ff88]'
                                    : 'border-gray-900 text-black hover:border-[#1400cc] hover:text-[#cc6600]'
                                    }`}
                            >
                                <Icon size={18} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* ── Explore ── */}
                <div className={`p-7 border-r-0 lg:border-r-2 ${colBorder} flex flex-col gap-4`}>
                    <p
                        className="text-sm bg-amber-300 px-3 rounded font-black tracking-widest uppercase text-black"

                    >
                        Explore
                    </p>
                    <ul className="flex flex-col">
                        {EXPLORE.map(({ label, path }) => (
                            <li key={label} className={`border-b ${colBorder}`}>
                                <button
                                    onClick={() => navigate(path)}
                                    className={`w-full text-left text-sm py-2 tracking-wide transition-none ${sub} hover:text-[#0037ff]`}
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
                        className="text-sm bg-amber-300 px-3 rounded font-black tracking-widest uppercase text-black"

                    >
                        Support
                    </p>
                    <ul className="flex flex-col">
                        {SUPPORT.map(({ label, path }) => (
                            <li key={label} className={`border-b ${colBorder}`}>
                                <button
                                    onClick={() => navigate(path)}
                                    className={`w-full text-left text-sm py-2 tracking-wide transition-none ${sub} hover:text-[#0051ff]`}
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
                        className="text-sm bg-amber-300 rounded px-3 font-black tracking-widest uppercase text-black"
                    >
                        Stay Updated
                    </p>
                    <p className={`text-sm leading-relaxed tracking-wide ${sub}`}>
                        Latest drops + artist news. No spam. Unsubscribe anytime.
                    </p>

                    <div className="flex flex-col gap-2 mt-1 ">
                        <div className={`flex items-center rounded border-2 ${dark ? 'border-gray-700 bg-black' : 'border-gray-400 bg-white'} focus-within:border-[#0037ff] transition-colors duration-0`}>
                            <div className={`w-9 flex items-center justify-center flex-shrink-0 ${sub}`}>
                                <Mail size={15} />
                            </div>
                            <input
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className={`flex-1 bg-transparent outline-none text-xs py-2 pr-2 font-mono 
                                    ${inputBg.split(' ')
                                        .filter(c => c.startsWith('text-') || c.startsWith('placeholder-')).join(' ')}`}
                            />
                        </div>
                        <button
                            className="flex rounded items-center justify-center gap-2 w-full py-2.5 text-xs font-black tracking-widest uppercase transition-none bg-blue-400"
                        >
                            Subscribe <ArrowRight size={15} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Bottom bar ── */}
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-2 px-7 py-4 ${dark ? 'bg-black' : 'bg-gray-50'}`}>
                <p className={`text-sm  tracking-wider ${sub}`}>
                    © {new Date().getFullYear()} MusicMenia. All rights reserved.
                </p>
                <a
                    href="http://linkedin.com/in/nikhil-tiwari-53743b339"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm px-3 rounded py-1 font-black tracking-widest uppercase underline underline-offset-4 ${dark ? 'text-gray-500 hover:text-gray-300' : 'text-black hover:text-blue-500'}`}

                >
                    Developed by Nikhil Tiwari
                </a>
                <p className={`text-xl  flex  font-black ${sub}`}>
                    Made with <span className='px-2'> <Music2 size={16} /></span>for music lovers
                </p>
            </div>
        </footer>
    )
}