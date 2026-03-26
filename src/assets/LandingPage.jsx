import { useNavigate } from 'react-router-dom'
import Navbar from '../Components/Navbar'
import { useTheme } from '../Context/Theme'

const features = [
  { icon: "🎧", label: "Listener",   desc: "Browse & save your favourite tracks" },
  { icon: "🎤", label: "Artist",     desc: "Upload tracks & grow your fanbase" },
  { icon: "🌍", label: "Community",  desc: "Connect with local music lovers" },
]

const steps = ["Sign Up", "Pick your role", "Explore or Upload", "Connect & Grow"]

export default function LandingPage() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const dark = theme === "dark"

  return (
    <div className={`min-h-screen ${dark ? "bg-gray-950 text-white" : "bg-white text-gray-900"}`}>
      <Navbar />

      {/* ── Hero ── */}
      <section className={`pt-28 pb-20 px-6 text-center border-b
        ${dark ? "bg-gray-900 border-gray-800" : "bg-gray-50 border-gray-200"}`}>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Discover · Create · Share Music
        </h1>
        <p className={`text-lg mb-10 ${dark ? "text-gray-400" : "text-gray-500"}`}>
          Short music clips from artists around you
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => navigate('/User-Dashboard')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-colors cursor-pointer"
          >
            Explore Feed
          </button>
          <button
            onClick={() => navigate('/login')}
            className={`border border-purple-500 px-8 py-3 rounded-full font-semibold transition-colors cursor-pointer
              ${dark ? "text-purple-400 hover:bg-purple-950" : "text-purple-600 hover:bg-purple-50"}`}
          >
            Join Free
          </button>
        </div>
      </section>

      {/* ── Features ── */}
      <section className={`py-20 px-6 ${dark ? "bg-gray-900" : "bg-white"}`}>
        <h2 className={`text-center text-xl font-semibold mb-10
          ${dark ? "text-gray-100" : "text-gray-800"}`}>
          What you can do
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {features.map((f) => (
            <div
              key={f.label}
              className={`border rounded-2xl p-6 text-center transition-colors
                ${dark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-gray-50 border-gray-200"}`}
            >
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className={`font-semibold mb-2 ${dark ? "text-white" : "text-gray-900"}`}>
                {f.label}
              </h3>
              <p className={`text-sm leading-relaxed ${dark ? "text-gray-400" : "text-gray-500"}`}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className={`py-20 px-6 ${dark ? "bg-gray-950" : "bg-gray-50"}`}>
        <h2 className={`text-center text-xl font-semibold mb-12
          ${dark ? "text-gray-100" : "text-gray-800"}`}>
          How it works
        </h2>
        <div className="flex items-center justify-center flex-wrap gap-3 max-w-2xl mx-auto">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-2">
                <div className="w-11 h-11 rounded-full bg-purple-600 flex items-center justify-center font-bold text-white">
                  {i + 1}
                </div>
                <span className={`text-xs text-center w-20 ${dark ? "text-gray-400" : "text-gray-500"}`}>
                  {step}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-10 h-px mb-5 ${dark ? "bg-gray-700" : "bg-gray-300"}`} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={`py-20 px-6 text-center
        ${dark ? "bg-indigo-950" : "bg-purple-50 border-t border-purple-100"}`}>
        <h2 className={`text-2xl font-bold mb-3 ${dark ? "text-white" : "text-gray-900"}`}>
          Ready to start?
        </h2>
        <p className={`mb-10 ${dark ? "text-purple-300" : "text-purple-500"}`}>
          Join thousands of listeners and artists on MusicMenia
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => navigate('/login?role=user')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-colors cursor-pointer"
          >
            Join as Listener
          </button>
          <button
            onClick={() => navigate('/login?role=artist')}
            className={`border border-purple-500 px-8 py-3 rounded-full font-semibold transition-colors cursor-pointer
              ${dark ? "text-purple-400 hover:bg-purple-950" : "text-purple-600 hover:bg-purple-100"}`}
          >
            Join as Artist
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={`py-6 text-center text-xs tracking-widest
        ${dark ? "bg-gray-950 text-gray-600" : "bg-gray-100 text-gray-400"}`}>
        🎵 DISCOVER · CREATE · SHARE
      </footer>
    </div>
  )
}
