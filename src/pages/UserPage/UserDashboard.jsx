import { useAuth } from '../../Context/useAuth'
import { useTheme } from '../../Context/Theme'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../Ui/Navbar'
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
    const card = `border-2 border-black rounded-xl shadow-[4px_4px_0_#000] ${dark ? 'bg-zinc-800' : 'bg-white'}`
    const btn = `border-2 rounded-xl border-black shadow-[3px_3px_0_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-100`

    return (
        <>
            <Navbar />

            <main className={`min-h-screen  ${text} ${bg}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 flex flex-col gap-8">


                    {/* ── Hero ── */}
                    <section className={`relative rounded-xl overflow-hidden
                        ${dark ? 'bg-zinc-900 border-white shadow-[2px_2px]' : 'bg-blue-200 border-black shadow-[2px_2px]'}`}>

                        <div className="px-6 py-4 sm:px-10 sm:py-12">

                            <img src="" alt="" />

                            <span className="text-xl flex flex-col sm:text-4xl font-semibold">
                                Hello
                                <h1 className={`text-4xl rounded px-2 ${dark ? "border-white" : "border-black"}  inline-block`}>
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
                                    className={`${card} ${btn} p-5 flex flex-col gap-3 text-left`}
                                >
                                    <div>
                                        <p className={`text-xl underline underline-offset-4 tracking-wider ${text}`}>{label}</p>

                                        <p className={`text-[18px] font-black mt-0.5 font-mono ${sub}`}>{desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>

                </div>
            </main>
            <>
                <section className=''>
                
                </section>

            </>

            <Footer />
        </>
    )
}