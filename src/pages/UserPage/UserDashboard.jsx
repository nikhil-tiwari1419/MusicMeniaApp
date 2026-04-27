import { useAuth } from '../../Context/useAuth'
import { useTheme } from '../../Context/Theme'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../Components/Navbar'
import Footer from '../../Components/Footer'
import MusicUIUser from '../../Components/MusicUIUser'
import { Music2, Headphones, Radio, ListMusic, Play, TrendingUp, Users } from 'lucide-react'

const STATS = [
    { icon: ListMusic,  label: 'Playlists',       value: 'Loading..'    },
    { icon: Headphones, label: 'Hours Listened',   value: 'Loading..'   },
    { icon: TrendingUp, label: 'Songs Saved',      value: 'Loading..'  },
    { icon: Users,      label: 'Artists Followed', value: 'Loading..'   },
]

const QUICK = [
    { icon: Radio,     label: 'Music Feed',  path: '/Local-Feed',  desc: 'Discover local tracks'   },
    { icon: ListMusic, label: 'My Albums',   path: '/album',       desc: 'Browse your collections' },
    { icon: Users,     label: 'Artists',     path: '/artist',      desc: 'Follow your favourites'  },
    { icon: Music2,    label: 'Profile',     path: '/Profile',     desc: 'Manage your account'     },
]

export default function UserDashboard() {
    const { user }   = useAuth()
    const { theme }  = useTheme()
    const navigate   = useNavigate()
    const dark       = theme === 'dark'

    const bg    = dark ? 'bg-gray-950' : 'bg-gray-50'
    const text  = dark ? 'text-white'  : 'text-gray-900'
    const sub   = dark ? 'text-gray-400' : 'text-gray-500'
    const card  = dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'

    return (
        <>
            <Navbar />

            <main className={`min-h-screen ${bg} ${text} transition-colors duration-200`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16 flex flex-col gap-10">

                    {/* ── Hero ── */}
                    <section className="relative overflow-hidden rounded-3xl px-6 py-10 sm:px-10 sm:py-14 flex flex-col gap-4"
                        style={{ background: dark ? 'linear-gradient(135deg,#052e16 0%,#111827 100%)' : 'linear-gradient(135deg,#ecfdf5 0%,#f0fdf4 100%)' }}>

                        {/* Decorative glow */}
                        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />

                        <span className={`inline-flex items-center gap-1.5 w-fit text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full
                            ${dark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
                            <Music2 size={11} /> MusicMenia
                        </span>

                        <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
                            Welcome back,{' '}
                            <span className="text-emerald-500">{user?.username || 'Listener'}</span> 👋
                        </h1>

                        <p className={`text-sm sm:text-base ${sub} max-w-md`}>
                            Listen to music — what your ears deserve. Pick up where you left off.
                        </p>

                        <button
                            onClick={() => navigate('/Local-Feed')}
                            className="mt-2 w-fit flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-colors shadow-md"
                        >
                            <Play size={14} className="ml-0.5" /> Start Listening
                        </button>
                    </section>

                    {/* ── Stats ── */}
                    <section>
                        <h2 className={`text-xs font-semibold uppercase tracking-widest mb-4 ${sub}`}>Your Activity</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {STATS.map(({ icon: Icon, label, value }) => (
                                <div key={label} className={`rounded-2xl border p-5 flex flex-col gap-3 ${card}`}>
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center
                                        ${dark ? 'bg-emerald-500/15' : 'bg-emerald-50'}`}>
                                        <Icon size={17} className="text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className={`text-xs font-bold ${text}`}>{value}</p>
                                        <p className={`text-xs mt-0.5 ${sub}`}>{label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ── Quick Actions ── */}
                    <section>
                        <h2 className={`text-xs font-semibold uppercase tracking-widest mb-4 ${sub}`}>Quick Access</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {QUICK.map(({ icon: Icon, label, path, desc }) => (
                                <button
                                    key={label}
                                    onClick={() => navigate(path)}
                                    className={`group rounded-2xl border p-5 flex flex-col gap-3 text-left transition-all duration-200
                                        hover:-translate-y-0.5 hover:shadow-lg hover:border-emerald-500/40 ${card}`}
                                >
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors
                                        ${dark ? 'bg-gray-800 group-hover:bg-emerald-500/15' : 'bg-gray-100 group-hover:bg-emerald-50'}`}>
                                        <Icon size={17} className="text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className={`text-sm font-semibold ${text}`}>{label}</p>
                                        <p className={`text-xs mt-0.5 ${sub}`}>{desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* ── Music UI (existing component) ── */}
                    <section>
                        <h2 className={`text-xs font-semibold uppercase tracking-widest mb-4 ${sub}`}>Your Playlists</h2>
                        <MusicUIUser />
                    </section>

                </div>
            </main>

            <Footer />
        </>
    )
}