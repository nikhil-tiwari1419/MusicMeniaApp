import Navbar from '../../Components/Navbar'
import Footer from '../../Components/Footer'
import { useTheme } from '../../Context/Theme'
import { Music2, Users, Headphones, Radio } from 'lucide-react'

const STATS = [
    { label: 'Artists', value: '10K+' },
    { label: 'Tracks',  value: '50K+' },
    { label: 'Listeners', value: '200K+' },
    { label: 'Countries', value: '80+' },
]

const FEATURES = [
    { icon: Music2,     title: 'Share Your Music',    desc: 'Upload and distribute your tracks to a global audience instantly.' },
    { icon: Headphones, title: 'Discover Sounds',     desc: 'Explore curated feeds and find your next favourite artist.' },
    { icon: Users,      title: 'Build Community',     desc: 'Connect with fans, collaborate with artists, grow together.' },
    { icon: Radio,      title: 'Live & Local Feed',   desc: 'Stay tuned to what artists around you are creating right now.' },
]

export default function About() {
    const { theme } = useTheme()
    const dark = theme === 'dark'

    const bg      = dark ? 'bg-gray-950'  : 'bg-gray-50'
    const card    = dark ? 'bg-gray-900 border-gray-800'  : 'bg-white border-gray-200'
    const text    = dark ? 'text-white'   : 'text-gray-900'
    const sub     = dark ? 'text-gray-400': 'text-gray-500'
    const accent  = 'text-emerald-500'
    const statBg  = dark ? 'bg-gray-800/60' : 'bg-emerald-50'

    return (
        <>
            <Navbar />
            <main className={`min-h-screen ${bg} ${text} transition-colors duration-200`}>

                {/* ── Hero ── */}
                <section className="relative overflow-hidden px-4 pt-24 pb-20 text-center">
                    {/* Soft glow */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-3xl" />
                    </div>

                    <div className="relative max-w-2xl mx-auto">
                        <span className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full border mb-6
                            ${dark ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-emerald-300 text-emerald-600 bg-emerald-50'}`}>
                            <Music2 size={12} /> Our Story
                        </span>
                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5 leading-tight">
                            Music that <span className={accent}>connects</span> the world
                        </h1>
                        <p className={`text-base sm:text-lg leading-relaxed ${sub}`}>
                            MusicMenia is a platform built for artists and fans alike — a place where creativity thrives,
                            sounds travel borders, and every voice deserves to be heard.
                        </p>
                    </div>
                </section>

                {/* ── Stats ── */}
                <section className="max-w-4xl mx-auto px-4 pb-16">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {STATS.map(({ label, value }) => (
                            <div key={label} className={`rounded-2xl px-5 py-6 text-center ${statBg}`}>
                                <p className={`text-3xl font-bold ${accent}`}>{value}</p>
                                <p className={`text-sm mt-1 ${sub}`}>{label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Mission ── */}
                <section className="max-w-4xl mx-auto px-4 pb-16">
                    <div className={`rounded-3xl border p-8 sm:p-10 ${card}`}>
                        <p className={`text-xs font-semibold uppercase tracking-widest ${accent} mb-3`}>Our Mission</p>
                        <p className={`text-lg sm:text-xl leading-relaxed ${sub}`}>
                            Whether you're an aspiring musician sharing your first track or a fan hunting for the next
                            big sound — MusicMenia gives you the tools, community, and stage to make it happen.
                            We believe music is universal, and access to it should be too.
                        </p>
                    </div>
                </section>

                {/* ── Features ── */}
                <section className="max-w-4xl mx-auto px-4 pb-24">
                    <h2 className={`text-xl font-bold mb-6 ${text}`}>What we offer</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {FEATURES.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className={`flex gap-4 p-6 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${card}`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                                    ${dark ? 'bg-emerald-500/15' : 'bg-emerald-50'}`}>
                                    <Icon size={18} className={accent} />
                                </div>
                                <div>
                                    <p className={`font-semibold text-sm mb-1 ${text}`}>{title}</p>
                                    <p className={`text-sm leading-relaxed ${sub}`}>{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </main>
            <Footer />
        </>
    )
}
