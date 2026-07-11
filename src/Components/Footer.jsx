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


export default function Footer() {
    const { theme } = useTheme()
    const navigate = useNavigate()
    const dark = theme === 'dark'
    const [email, setEmail] = useState('')

    const bg = dark ? 'bg-black' : 'bg-white'
    const borderClr = dark ? 'border-white' : 'border-black'
    const text = dark ? 'text-white' : 'text-black'
    const sub = dark ? 'text-gray-400' : 'text-gray-800 font-semibold'
    const colBorder = dark ? 'border-gray-600' : 'border-gray-300'
    const inputBg = dark ? 'bg-black border-gray-700 text-white placeholder-gray-600'
        : 'bg-white border-gray-400 text-black placeholder-gray-400'

    return (
        <footer
            className={`${bg}  ${borderClr} transition-colors duration-0`}
        >
            <div
                className={`grid grid-cols-1 sm:grid-cols-2 ${borderClr}`}
            >
                {/* ── Brand ── */}
                <div className={`p-7 ${colBorder} flex flex-col gap-4`}>

                    <button
                        onClick={() => navigate('/')}
                        className={`flex items-center gap-3 w-fit`}
                    >
                        <div
                            className="w-10 h-10 flex items-center rounded bg-orange-400 justify-center flex-shrink-0"
                        >
                            <Music2 size={28} color="#000" />
                        </div>
                        <span className={`text-xl font-semibold tracking-widest uppercase underline underline-offset-4 ${text}`}>
                            MusicMenia
                        </span>
                    </button>
                    <p className={`text-xl leading-relaxed ${sub}`}>
                        Discover, share, and celebrate music. A space where artists and fans collide.
                    </p>
                </div>

                {/* ── Support ── */}
                <div className={`p-7 ${colBorder} flex flex-col gap-4`}>
                    <p
                        className="text-sm bg-amber-300 px-3 rounded font-semibold tracking-widest uppercase text-black"
                    >
                        Support
                    </p>
                    <ul className="flex justify-between">
                        {SUPPORT.map(({ label, path }) => (
                            <li key={label} className={` ${colBorder}`}>
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
            </div>

            {/* Bottom bar */}
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-2 px-7 py-4 ${dark ? 'bg-black' : 'bg-gray-50'}`}>
                <p className={`text-sm  tracking-wider ${sub}`}>
                    © {new Date().getFullYear()} MusicMenia. All rights reserved.
                </p>
                <a
                    href="http://linkedin.com/in/nikhil-tiwari-53743b339"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm px-3 rounded py-1 tracking-widest uppercase underline underline-offset-4 ${dark ? 'text-gray-500 hover:text-gray-300 ' : 'text-black hover:text-blue-500'}`}

                >
                    Developed by Nikhil Tiwari
                </a>
                <p className={`text-xl  flex  font-semibold ${sub}`}>
                    Every song <span className='px-2'> <Music2 size={26} strokeOpacity={80} /></span>Tells a Story
                </p>
            </div>
        </footer>
    )
}

