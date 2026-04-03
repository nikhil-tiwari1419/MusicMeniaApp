import { useNavigate } from 'react-router-dom'
import Navbar from '../Components/Navbar'
import { useTheme } from '../Context/Theme'
import { Headset, LayoutDashboard, Globe, Frame } from 'lucide-react'

const features = [
  {
    icon: <Frame strokeWidth={3} size={50} />,
    label: "Choose A Distributer",
    desc1: "Music gets uploaded to Spotify via a distributor. For a fee or commission, distributors will handle the licensing and distribution to Spotify and other streaming services, and pay you royalties when listeners stream.Check out our directory for our preferred and recommended providers:",
    img: "distributer.png"
  },
  {
    icon: <Headset strokeWidth={3} size={50} />,
    label: "Upload Your music",
    desc1: "Make sure your music is release-ready before uploading via your distributor.",
    n1: "Export the highest quality lossless files of your music and follow your chosen distributor’s guidelines for uploading.",
    n2: "Provide your metadata: album title, credits, release date, etc.",
    n3: "Upload cover art for your release.",
    img: "Leith_v1.jpg"
  },
  {
    icon: <LayoutDashboard strokeWidth={2.5} size={50} />,
    label: "Access your Dashboard",
    desc1: "Give a face and name to your music by setting up your profile",
    n1: "Once your music is on Spotify you can access your artist profile and your Spotify for Artists dashboard, where you can track performance and manage your content.",
    n2: "After claiming your Spotify for Artists profile, you’ll get full access to the profile and a Registered Artist label in the About section of your profile",
    n3: "Customize your profile by adding photos, a bio, links to your social media, merch, and playlists.",

    img: "Meryl_Akiyo_v1.jpg"
  },
  {
    icon: <Globe strokeWidth={3} size={50} />,
    label: "Prepare for release",
    desc1: "Ahead of release day, make sure to:",
    n1: "Optimize your artist profile.",
    n2: "Pitch our playlist editors.",
    n3: "Upload a Canvas to your tracks.",

    img: "Tokischa_v1.jpg"
  },
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
      <section className={`pt-24 pb-16  sm:px-6 text-center border-b
        ${dark ? "bg-gray-900 border-gray-800" : "bg-gray-50 border-gray-50"}`}>

        {/* Fixed: stack on mobile, side-by-side on sm+ */}
        <div className='flex flex-col max-w-7xl mx-auto w-full items-center justify-center sm:flex-row sm:justify-between sm:px-10'>

          <span className="text-4xl sm:text-5xl lg:text-8xl font-mono font-bold tracking-tight text-left">
            <h1>Discover</h1>
            <h1>Create</h1>
            <h1>Share Music</h1>
          </span>
          {/* Hero image: constrained on mobile */}
          <img
            src="/spotify img.png"
            alt="Hero"
            className='w-full max-w-xs sm:max-w-none sm:h-64 lg:h-80 object-contain flex-shrink-0'
          />
        </div>

        <p className={`mt-6 text-base sm:text-lg mb-8 sm:mb-10 ${dark ? "text-gray-400" : "text-gray-500"}`}>
          Short music clips from artists around you
        </p>

        <div className="flex gap-3 sm:gap-4 justify-center flex-wrap">
          <button
            onClick={() => navigate('/login')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-3 rounded-full font-semibold transition-colors cursor-pointer text-sm sm:text-base"
          >
            Explore Feed
          </button>
          <button
            onClick={() => navigate('/login')}
            className={`border border-green-500 px-6 sm:px-8 py-3 rounded-full font-semibold transition-colors cursor-pointer text-sm sm:text-base
              ${dark ? "text-green-400 hover:bg-green-950" : "text-green-600 hover:bg-green-50"}`}
          >
            Join Free
          </button>
        </div>
      </section>

      {/* ── Features ── */}
      <section className={`py-16 sm:py-20  sm:px-6 ${dark ? "bg-gray-900" : "bg-white"}`}>

        <h2 className={`text-center font-bold font-mono text-2xl lg:text-5xl sm:text-4xl  mb-8 sm:mb-10
          ${dark ? "text-gray-100" : "text-gray-800"}`}>
          What you can do
        </h2>
        <div className="grid grid-cols-1  gap-4 px-5 sm:gap-6 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <div
              key={f.label}
              className={`border rounded  p-5 sm:p-6 text-center transition-colors
                ${dark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}
            >

              <div className={`flex flex-col ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'} gap-4 items-center sm:gap-8`}>

                <img
                  src={f.img}
                  alt={f.label}
                  className="w-full  h-full sm:h-80 sm:w-80  object-cover rounded flex-shrink-0"
                />

                <div className='flex-1'>
                  <div className='flex items-center gap-3 mb-3'>
                    <span className="text-3xl sm:text-4xl mb-3">{f.icon}</span>
                    <span className='bg-emerald-200 text-black  w-10 h-10 sm:w-11 sm:h-11 rounded-full font-bold py-2 px-3.5'>{i + 1}</span>
                  </div>

                  <h3 className={`font-bold underline p-3 sm:text-2xl text-xl  mb-2 ${dark ? "text-white" : "text-gray-900"}`}>
                    {f.label}
                  </h3>

                  <p className={`sm:text-2xl text-xl py-4  leading-relaxed ${dark ? "text-gray-400" : "text-gray-500"}`}>
                    {f.desc1}
                  </p>

                  <ul className='tracking-tight text-left text-xl  justify-between mt-3 list-disc px-5'>
                    {f.n1 && <li className={`mt-2 ${dark ? "text-gray-300" : "text-gray-800"}`}>{f.n1}</li>}
                    {f.n2 && <li className={`mt-1 ${dark ? "text-gray-300" : "text-gray-800"}`}>{f.n2}</li>}
                    {f.n3 && <li className={`mt-1 ${dark ? "text-gray-300" : "text-gray-800"}`}>{f.n3}</li>}
                  </ul>
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works  ── */}
      <section className={`py-2 sm:py-20 px-4 sm:px-6 ${dark ? "bg-gray-900" : "bg-gray-50"}`}>
        <h2 className={`text-center text-xl sm:text-2xl font-bold font-sans mb-10 sm:mb-12
          ${dark ? "text-gray-100" : "text-gray-800"}`}>
          How it works For Listeners
        </h2>

        {/* Fixed: 2-col grid on mobile, single row on sm+ */}
        <div className="grid grid-cols-2 sm:flex sm:items-start sm:justify-center sm:flex-wrap gap-y-8 gap-x-3 max-w-2xl mx-auto">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gray-500 flex items-center justify-center font-bold text-white text-sm sm:text-base">
                  {i + 1}
                </div>
                <span className={`text-xs text-center w-20 ${dark ? "text-gray-400" : "text-gray-500"}`}>
                  {step}
                </span>
              </div>
              {/* Connector: only on sm+ and not after last item */}
              {i < steps.length - 1 && (
                <div className={`hidden sm:block w-10 h-px mb-5 ${dark ? "bg-gray-700" : "bg-gray-300"}`} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={`py-16 sm:py-20 px-4 sm:px-6 text-center
        ${dark ? "bg-gray-900" : "bg-purple-50 border-t border-purple-100"}`}>
        <h2 className={`text-xl sm:text-2xl font-bold mb-3 ${dark ? "text-white" : "text-gray-900"}`}>
          Ready to start?
        </h2>
        <p className={`mb-8 sm:mb-10 text-sm sm:text-base ${dark ? "text-blue-300" : "text-yellow-500"}`}>
          Join thousands of listeners and artists on MusicMenia
        </p>
        <div className="flex gap-3 sm:gap-4 justify-center flex-wrap">
          <button
            onClick={() => navigate('/login')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-3 rounded-full font-semibold transition-colors cursor-pointer text-sm sm:text-base"
          >
            Join as Listener
          </button>
          <button
            onClick={() => navigate('/login')}
            className={`border border-green-500 px-6 sm:px-8 py-3 rounded-full font-semibold transition-colors cursor-pointer text-sm sm:text-base
              ${dark ? "text-green-400 hover:bg-green-950" : "text-green-600 hover:bg-green-100"}`}
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