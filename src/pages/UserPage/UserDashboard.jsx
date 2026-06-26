import { useAuth } from '../../Context/useAuth'
import { useTheme } from '../../Context/Theme'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../Components/Navbar'
import Footer from '../../Components/Footer'
import MusicUIUser from '../../Components/MusicUIUser'
import { Music2, Headphones, Radio, ListMusic, Play, TrendingUp, Users } from 'lucide-react'

const STATS = [
    { icon: ListMusic, label: 'Playlists', value: '0' },
    { icon: Headphones, label: 'Hours Listened', value: '0' },
    { icon: TrendingUp, label: 'Songs Saved', value: '0' },
    { icon: Users, label: 'Artists Followed', value: '0' },
]

const QUICK = [
    { icon: Radio, label: 'Music Feed', path: '/Local-Feed', desc: 'Discover local tracks' },
    { icon: ListMusic, label: 'My Albums', path: '/album', desc: 'Browse your collections' },
    { icon: Users, label: 'Artists', path: '/artist', desc: 'Follow your favourites' },
    { icon: Music2, label: 'Profile', path: '/Profile', desc: 'Manage your account' },
]

export default function UserDashboard() {
    const { user } = useAuth()
    const { theme } = useTheme()
    const navigate = useNavigate()
    const dark = theme === 'dark'

    const bg = dark ? 'bg-zinc-950' : 'bg-white'
    const text = dark ? 'text-white' : 'text-black'
    const sub = dark ? 'text-zinc-400' : 'text-zinc-500'
    const card = `border-2 border-black shadow-[4px_4px_0_#000] ${dark ? 'bg-zinc-900' : 'bg-white'}`
    const btn = `border-2 border-black shadow-[3px_3px_0_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-100`

    return (
        <>
            <Navbar />

            <main className={`min-h-screen ${bg} ${text} font-mono`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16 flex flex-col gap-8">

                    {/* ── Hero ── */}
                    <section className={`relative border-2 border-black shadow-[6px_6px_0_#000] overflow-hidden
                        ${dark ? 'bg-zinc-900' : 'bg-white'}`}>

                        {/* Yellow accent bar top */}
                        <div className="h-3 w-full bg-yellow-400 border-b-2 border-black" />

                        <div className="px-6 py-10 sm:px-10 sm:py-12">
                            {/* Badge */}
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em]
                                px-3 py-1.5 border-2 border-black bg-yellow-400 text-black mb-6">
                                <Music2 size={11} /> MusicMenia
                            </span>

                            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-tight mb-3">
                                Welcome back,{' '}
                                <span className="bg-yellow-400 px-2 border-2 border-black inline-block">
                                    {user?.username || 'Listener'}
                                </span>
                            </h1>

                            <p className={`text-sm max-w-md mb-6 ${sub}`}>
                                Listen to music — what your ears deserve. Pick up where you left off.
                            </p>

                            <button
                                onClick={() => navigate('/Local-Feed')}
                                className={`flex items-center gap-2 px-5 py-2.5 bg-black text-white text-xs font-black uppercase tracking-widest ${btn}`}
                            >
                                <Play size={13} className="fill-white" /> Start Listening
                            </button>
                        </div>
                    </section>

                    {/* ── Stats ── */}
                    <section>
                        <div className={`px-4 py-2 border-2 border-black mb-4 w-fit ${dark ? 'bg-zinc-800' : 'bg-black'}`}>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                                Your Activity
                            </h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {STATS.map(({ icon: Icon, label, value }) => (
                                <div key={label} className={`${card} p-5 flex flex-col gap-3`}>
                                    <div className={`w-9 h-9 border-2 border-black flex items-center justify-center
                                        ${dark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                                        <Icon size={16} className={dark ? 'text-zinc-300' : 'text-black'} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black">{value}</p>
                                        <p className={`text-[10px] uppercase tracking-wider mt-0.5 ${sub}`}>{label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ── Quick Actions ── */}
                    <section>
                        <div className={`px-4 py-2 border-2 border-black mb-4 w-fit ${dark ? 'bg-zinc-800' : 'bg-black'}`}>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                                Quick Access
                            </h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {QUICK.map(({ icon: Icon, label, path, desc }) => (
                                <button
                                    key={label}
                                    onClick={() => navigate(path)}
                                    className={`${card} ${btn} p-5 flex flex-col gap-3 text-left`}
                                >
                                    <div className={`w-9 h-9 border-2 border-black flex items-center justify-center
                                        ${dark ? 'bg-zinc-800' : 'bg-yellow-400'}`}>
                                        <Icon size={16} className={dark ? 'text-zinc-300' : 'text-black'} />
                                    </div>
                                    <div>
                                        <p className={`text-sm font-black uppercase tracking-tight ${text}`}>{label}</p>
                                        <p className={`text-[10px] mt-0.5 font-mono ${sub}`}>{desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* ── Music UI ── */}
                    <section>
                        <div className={`px-4 py-2 border-2 border-black mb-4 w-fit ${dark ? 'bg-zinc-800' : 'bg-black'}`}>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                                Playlists · Recently Played · Albums
                            </h2>
                        </div>
                        <MusicUIUser />
                    </section>

                </div>
            </main>

            <Footer />
        </>
    )
}