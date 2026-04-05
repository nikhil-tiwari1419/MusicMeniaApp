import { useNavigate } from 'react-router-dom'
import Navbar from '../Components/Navbar'
import { useTheme } from '../Context/Theme'
import { Headset, LayoutDashboard, Globe, Frame } from 'lucide-react'
import QnA from '../Components/QnA'
import LandingFooter from './LandingFooter'

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
    n1: "Export the highest quality lossless files of your music and follow your chosen distributor's guidelines for uploading.",
    n2: "Provide your metadata: album title, credits, release date, etc.",
    n3: "Upload cover art for your release.",
    img: "Leith_v1.jpg"
  },
  {
    icon: <LayoutDashboard strokeWidth={2.5} size={50} />,
    label: "Access your Dashboard",
    desc1: "Give a face and name to your music by setting up your profile",
    n1: "Once your music is on Spotify you can access your artist profile and your Spotify for Artists dashboard, where you can track performance and manage your content.",
    n2: "After claiming your Spotify for Artists profile, you'll get full access to the profile and a Registered Artist label in the About section of your profile",
    n3: "Customize your profile by adding photos, a bio, links to your social media, merch, and playlists.",
    img: "Meryl_Akiyo_v1.jpg"
  },
  {
    icon: <Globe strokeWidth={2.5} size={50} />,
    label: "Prepare for release",
    desc1: "Ahead of release day, make sure to:",
    n1: "Optimize your artist profile.",
    n2: "Pitch our playlist editors.",
    n3: "Upload a Canvas to your tracks.",
    img: "Tokischa_v1.jpg"
  },
]

const steps = [
  { label: "Sign Up", img: "/loginImg.png" },
  { label: "Pick your role", img: "/roleImg.png" },
  { label: "Explore or Upload", img: "/exploreImg.png" },
  { label: "Connect & Grow", img: "/growImg.png" }
]

export default function LandingPage() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const dark = theme === "dark"

  return (
    // ✅ Fix 1: overflow-x-hidden on root
    <div className={`min-h-screen overflow-x-hidden ${dark ? "bg-gray-950 text-white" : "bg-white text-gray-900"}`}>
      <Navbar />

      {/* ── Hero ── */}
      <section className={`pt-24 pb-16 px-4 sm:px-6 text-center border-b
        ${dark ? "bg-gray-900 border-gray-800" : "bg-gray-50 border-gray-50"}`}>

        <div className='flex flex-col max-w-7xl mx-auto w-full items-center justify-center sm:flex-row sm:justify-between sm:px-10 gap-6'>
          <span className="text-4xl sm:text-5xl lg:text-8xl font-mono font-bold tracking-tight text-left">
            <h1>Discover</h1>
            <h1>Create</h1>
            <h1>Share Music</h1>
          </span>

          {/* ✅ Fix 2: added max-w-sm to cap hero image width */}
          <img
            src="/spotify img.png"
            alt="Hero"
            className='w-full max-w-sm sm:max-w-xs lg:max-w-sm object-contain flex-shrink-0'
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
      <section className={`py-16 md:py-20 px-4 md:px-6 ${dark ? "bg-gray-900" : "bg-white"}`}>
        <h2 className={`text-center font-bold font-mono text-4xl md:text-6xl lg:text-5xl mb-8 md:mb-10
          ${dark ? "text-gray-100" : "text-gray-800"}`}>
          What you can do
        </h2>

        <div className="grid grid-cols-1 gap-4 md:gap-6 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <div
              key={f.label}
              className={`rounded p-5 md:p-6 transition-colors
                ${dark ? "bg-gray-800" : "bg-gray-50"}`}
            >
              <div className={`flex flex-col gap-4 md:gap-8 items-center
                ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>

              <div className=''>
                <img
                  src={f.img}
                  alt={f.label}
                  className=" sm:h-80 md:h-90 w-auto  object-cover rounded flex-shrink-0"
                />
              </div>

                <div className="flex-1 min-w-0"> {/* ✅ Fix 4: min-w-0 prevents flex child overflow */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl md:text-4xl">{f.icon}</span>
                    <span className="bg-emerald-200 text-black w-10 h-10 md:w-11 md:h-11 rounded-full font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                  </div>

                  <h3 className={`font-bold underline p-3 text-xl md:text-2xl mb-2
                    ${dark ? "text-white" : "text-gray-900"}`}>
                    {f.label}
                  </h3>

                  <p className={`text-xl md:text-2xl py-4 leading-relaxed
                    ${dark ? "text-gray-400" : "text-gray-500"}`}>
                    {f.desc1}
                  </p>

                  <ul className="tracking-tight text-left text-xl mt-3 list-disc px-5 space-y-1">
                    {f.n1 && <li className={dark ? "text-gray-300" : "text-gray-800"}>{f.n1}</li>}
                    {f.n2 && <li className={dark ? "text-gray-300" : "text-gray-800"}>{f.n2}</li>}
                    {f.n3 && <li className={dark ? "text-gray-300" : "text-gray-800"}>{f.n3}</li>}
                  </ul>
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className={`py-12 sm:py-20 px-4 sm:px-6 ${dark ? "bg-gray-900" : "bg-gray-50"}`}>
        <h2 className={`text-center text-xl sm:text-2xl font-bold font-sans mb-10 sm:mb-12
          ${dark ? "text-gray-100" : "text-gray-800"}`}>
          How it works For Listeners
        </h2>

        {/* ✅ Fix 5: grid cols on mobile, flex row on sm+ — images constrained */}
        <div className="grid grid-cols-1
         md:grid-cols-4 gap-26 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <div key={step.label} className="flex flex-col items-center gap-10">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-blue-800 flex items-center justify-center font-bold text-white text-sm sm:text-base flex-shrink-0">
                {i + 1}
              </div>
              <span className={`text-xl text-center ${dark ? "text-gray-400" : "text-gray-500"}`}>
                {step.label}
              </span>
          
              <img
                src={step.img}
                alt={step.label}
                className=" max-w-full md:h-auto h-50 items-center object-cover rounded"
              />
            </div>
          ))}
        </div>
      </section>

          {/* Qna section */}
          <section> 
            <QnA/>
          </section>

      <section className={`py-16 sm:py-20 px-4 sm:px-6 text-center
        ${dark ? "bg-gray-700" : "bg-purple-50 border-t border-purple-100"}`}>
        <h2 className={`text-xl sm:text-2xl font-bold mb-3 ${dark ? "text-white" : "text-gray-900"}`}>
          Ready to start?
        </h2>
        <p className={`mb-8 sm:mb-10 text-xl font-semibold ${dark ? "text-blue-300" : "text-yellow-500"}`}>
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

      <LandingFooter/>
    </div>
  )
}