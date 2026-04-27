import { useNavigate } from 'react-router-dom'
import { Linkedin, Instagram, Facebook, Github, Music2, Mail, ArrowRight } from 'lucide-react'
import { useTheme } from '../Context/Theme'
import { useState } from 'react'

const SOCIAL = [
    { icon: Linkedin,  url: 'https://linkedin.com',  label: 'LinkedIn'  },
    { icon: Instagram, url: 'https://instagram.com', label: 'Instagram' },
    { icon: Facebook,  url: 'https://facebook.com',  label: 'Facebook'  },
    { icon: Github,    url: 'https://github.com',    label: 'Github'    },
]

const SUPPORT = [
    { label: 'FAQ',              path: '/faq'     },
    { label: 'Contact Us',       path: '/contact' },
    { label: 'Privacy Policy',   path: '/privacy' },
    { label: 'Terms of Service', path: '/terms'   },
]

const EXPLORE = [
    { label: 'Home',             path: '/'             },
    { label: 'Music Feed',       path: '/music-feed'   },
    { label: 'Album',            path: '/album'        },
    { label: 'About',            path: '/about'        },
]

export default function Footer() {
    const { theme }   = useTheme()
    const navigate    = useNavigate()
    const dark        = theme === 'dark'
    const [email, setEmail] = useState('')

    const bg      = dark ? 'bg-gray-950'  : 'bg-gray-50'
    const border  = dark ? 'border-gray-800' : 'border-gray-200'
    const text    = dark ? 'text-white'   : 'text-gray-900'
    const sub     = dark ? 'text-gray-400': 'text-gray-500'
    const linkHov = dark ? 'hover:text-white' : 'hover:text-gray-900'
    const inputCl = dark
        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-emerald-500'
        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-emerald-500'

    return (
        <footer className={`${bg} border-t ${border} transition-colors duration-200`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* ── Brand ── */}
                    <div className="flex flex-col gap-4">
                        <button onClick={() => navigate('/')} className="flex items-center gap-2 w-fit">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                                <Music2 size={16} className="text-white" />
                            </div>
                            <span className={`text-lg font-bold tracking-tight ${text}`}>MusicMenia</span>
                        </button>

                        <p className={`text-sm leading-relaxed ${sub}`}>
                            Discover, share, and celebrate music. A space where artists and fans come together.
                        </p>

                        {/* Social icons */}
                        <div className="flex gap-2 mt-1">
                            {SOCIAL.map(({ icon: Icon, url, label }) => (
                                <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                                    aria-label={label}
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-150
                                        ${dark
                                            ? 'border-gray-700 text-gray-400 hover:border-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10'
                                            : 'border-gray-200 text-gray-500 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50'
                                        }`}>
                                    <Icon size={15} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* ── Explore ── */}
                    <div className="flex flex-col gap-3">
                        <h3 className={`text-xs font-semibold uppercase tracking-widest ${sub}`}>Explore</h3>
                        <ul className="flex flex-col gap-2">
                            {EXPLORE.map(({ label, path }) => (
                                <li key={label}>
                                    <button
                                        onClick={() => navigate(path)}
                                        className={`text-sm transition-colors duration-150 ${sub} ${linkHov}`}
                                    >
                                        {label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── Support ── */}
                    <div className="flex flex-col gap-3">
                        <h3 className={`text-xs font-semibold uppercase tracking-widest ${sub}`}>Support</h3>
                        <ul className="flex flex-col gap-2">
                            {SUPPORT.map(({ label, path }) => (
                                <li key={label}>
                                    <button
                                        onClick={() => navigate(path)}
                                        className={`text-sm transition-colors duration-150 ${sub} ${linkHov}`}
                                    >
                                        {label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── Newsletter ── */}
                    <div className="flex flex-col gap-3">
                        <h3 className={`text-xs font-semibold uppercase tracking-widest ${sub}`}>Stay Updated</h3>
                        <p className={`text-sm ${sub}`}>Get the latest drops and artist news in your inbox.</p>

                        <div className="flex flex-col gap-2 mt-1">
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all ${inputCl}`}>
                                <Mail size={14} className="text-gray-400 flex-shrink-0" />
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="flex-1 bg-transparent outline-none text-sm"
                                />
                            </div>
                            <button
                                className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-colors duration-150"
                            >
                                Subscribe <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>

                </div>

                {/* ── Bottom bar ── */}
                <div className={`border-t ${border} mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2`}>
                    <p className={`text-xs ${sub}`}>
                        © {new Date().getFullYear()} MusicMenia. All rights reserved.
                    </p>
                    <p className={`text-xs ${sub}`}>
                        Made with <span className="text-emerald-500">♪</span> for music lovers
                    </p>
                </div>

            </div>
        </footer>
    )
}