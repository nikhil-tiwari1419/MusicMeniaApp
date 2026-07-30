import { useAuth } from '../../Context/useAuth'
import { useTheme } from '../../Context/Theme'
import { useNavigate } from 'react-router-dom'
// import Navbar from '../../Ui/Navbar'
import Footer from '../../Components/Footer'
import { Music2, Headphones, Radio, ListMusic, Play, TrendingUp, Users } from 'lucide-react'


const QUICK = [
    { label: 'Music Feed', path: '/Local-Feed', desc: 'Discover local tracks', color: "bg-violet-400 " },
    { label: 'My Albums', path: '/album', desc: 'Browse your collections', color: "bg-blue-500" },
    { label: 'Artists', path: '/artist', desc: 'Follow your favourites', color: "bg-green-400" },
    { label: 'Profile', path: '/Profile', desc: 'Manage your account', color: "bg-pink-400" },
]

export default function UserDashboard() {
    const { user } = useAuth()
    const { theme } = useTheme()
    const navigate = useNavigate()
    const dark = theme === 'dark'


    const bg = dark ? 'bg-gray-950' : 'bg-zinc-100'
    const text = dark ? 'text-white' : 'text-black'
    const sub = dark ? 'text-zinc-400 text-xl' : 'text-black text-xl'
    const card = ` rounded ${dark ? 'bg-zinc-800' : 'bg-blue-500'}`
    const btn = ` rounded   hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-100`

    return (
        <>
            {/* <Navbar /> */}

            <main className={`min-h-screen   ${text} ${bg}`}>
                <div className="max-w-7xl mx-auto px-2 sm:px-6 pt-5 flex flex-col gap-8">


                    {/* ── Hero ── */}
                    <section className={`relative rounded overflow-hidden
                        ${dark ? 'bg-zinc-900 border-white shadow-[2px_2px]' : 'bg-gray-200 border-black shadow-[2px_2px]'}`}>

                        <div className="px-6 py-4 sm:px-10 sm:py-12">

                            <img src="" alt="" />

                            <span className="text-xl flex flex-col sm:text-4xl font-semibold">
                                Hello
                                <h1 className={`text-4xl ${dark ? "border-white" : "border-black"}  inline-block`}>
                                    {user?.username || 'Listener'}
                                </h1>
                            </span>
                        </div>
                    </section>

                    {/* Quick Actions */}
                    <section>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {QUICK.map(({ label, path, desc }) => (
                                <button
                                    key={label}
                                    onClick={() => navigate(path)}
                                    className={`${card} ${btn} p-2 flex flex-col gap-3 text-left`}
                                >
                                    <div>
                                        <p className={`text-xl underline underline-offset-4 tracking-wider ${text}`}>{label}</p>

                                        {/* <p className={`text-[18px] font-black mt-0.5 font-mono ${sub}`}>{desc}</p> */}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>

                </div>

                <section className="max-w-7xl mx-auto px-2 sm:px-6 pt-5 pb-10">
                    <h2 className={`text-2xl font-semibold mb-3 ${text}`}>Your Sound</h2>

                    <div className="grid grid-cols-4 grid-rows-2 gap-3 h-[420px] sm:h-[360px]">

                        {/* Big tile — trending stat */}
                        <div className={`col-span-4 sm:col-span-2 row-span-2 rounded p-6 flex flex-col justify-between
            ${dark ? 'bg-violet-500 border-white' : 'bg-violet-400 border-black'}
            border shadow-[2px_2px] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-100`}>
                            <TrendingUp size={28} className="text-black" strokeWidth={2.5} />
                            <div>
                                <p className="text-5xl font-bold text-black">128</p>
                                <p className="text-black/80 font-medium">tracks played this week</p>
                            </div>
                        </div>

                        {/* Recently played */}
                        <button onClick={() => navigate('/Local-Feed')}
                            className={`col-span-2 sm:col-span-1 rounded p-4 flex flex-col justify-between text-left
            ${dark ? 'bg-zinc-800 border-white' : 'bg-blue-500 border-black'}
            border shadow-[2px_2px] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-100`}>
                            <Play size={22} className={dark ? 'text-white' : 'text-black'} />
                            <p className={`font-semibold ${dark ? 'text-white' : 'text-black'}`}>Resume last track</p>
                        </button>

                        {/* Top artists */}
                        <button onClick={() => navigate('/artist')}
                            className={`col-span-2 sm:col-span-1 rounded p-4 flex flex-col justify-between text-left
            ${dark ? 'bg-zinc-800 border-white' : 'bg-green-400 border-black'}
            border shadow-[2px_2px] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-100`}>
                            <Users size={22} className={dark ? 'text-white' : 'text-black'} />
                            <p className={`font-semibold ${dark ? 'text-white' : 'text-black'}`}>Top artists this week</p>
                        </button>

                        {/* Radio */}
                        <button
                            className={`col-span-2 sm:col-span-1 rounded p-4 flex flex-col justify-between text-left
            ${dark ? 'bg-zinc-800 border-white' : 'bg-pink-400 border-black'}
            border shadow-[2px_2px] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-100`}>
                            <Radio size={22} className={dark ? 'text-white' : 'text-black'} />
                            <p className={`font-semibold ${dark ? 'text-white' : 'text-black'}`}>Live radio</p>
                        </button>

                        {/* Playlists */}
                        <button
                            className={`col-span-2 sm:col-span-1 rounded p-4 flex flex-col justify-between text-left
            ${dark ? 'bg-zinc-800 border-white' : 'bg-orange-300 border-black'}
            border shadow-[2px_2px] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-100`}>
                            <ListMusic size={22} className={dark ? 'text-white' : 'text-black'} />
                            <p className={`font-semibold ${dark ? 'text-white' : 'text-black'}`}>Your playlists</p>
                        </button>

                    </div>
                </section>
            </main>

            <Footer />
        </>
    )
}