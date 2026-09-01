import { useNavigate } from 'react-router-dom'
import Navbar from '../Ui/Navbar'
import { useTheme } from '../Context/Theme'
import { Headset, LayoutDashboard, Globe, Frame } from 'lucide-react'
import QnA from '../Components/QnA'
import LandingFooter from './LandingFooter'

const features = [
  {
    icon: <Frame strokeWidth={3} size={50} />,
    label: "Choose A Distributer",
    desc1: "Music gets uploaded to MusicMenia via a distributor. For a fee or commission, distributors will handle the licensing and distribution to MusicMenia and other streaming services, and pay you royalties when listeners stream.Check out our directory for our preferred and recommended providers:",
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
    n1: "Once your music is on MusicMenia you can access your artist profile and your MusicMenia for Artists dashboard, where you can track performance and manage your content.",
    n2: "After claiming your MusicMenia for Artists profile, you'll get full access to the profile and a Registered Artist label in the About section of your profile",
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
  { label: "Sign Up", img: "/loginImg.png", desc: "Create your free MusicMenia account in seconds via Google Auth or manual Email,Name and a specific password .  " },
  { label: "Be As an User", img: "/roleImg.png", desc: "Join as a user to reach every artist and access there entire Song's and album's ." },
  { label: "Explore Music", img: "/exploreImg.png", desc: "Discover new artist and there makers to listen there entire songs as per your choice " },
  { label: "Explore Artists", img: "/growImg.png", desc: "Follow an artist to never miss a update up to you -> Follow and Get ." },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const dark = theme === "dark"

  return (

    <div className={`min-h-screen overflow-x-hidden ${dark ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"}`}>
      <Navbar />

      {/* ── Hero ── */}
      <section id="home" className={`pt-10 pb-16 px-4 sm:px-6 text-center border-b
        ${dark ? "bg-gray-900 border-gray-800" : "bg-gray-50 border-gray-50"}`}>

        <div className='flex flex-col max-w-7xl mx-auto w-full items-center justify-center sm:flex-row sm:justify-between sm:px-10 gap-6'>
          <span className="text-5xl sm:text-5xl lg:text-8xl font-bold tracking-tight text-left">
            <h1>Get Your</h1>
            <h1>Music</h1>
            <h1>On Musicmenia</h1>
            <h1 className='font-semibold text-2xl md:text-4xl'>Reach millions of listeners and find your fans around the world.</h1>
          </span>


          <img
            src="/MusicMenia img.png"
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
            className={`border border-green-500 px-6 sm:px-8 py-3 rounded font-semibold transition-colors cursor-pointer text-xl sm:text-2xl
              ${dark ? "text-green-400 hover:bg-green-950" : "text-green-600 hover:bg-green-50"}`}
          >
            Join Free
          </button>
        </div>
      </section>

      {/*  Features section */}
      <section id="artist-workflow" className={`py-16 md:py-20 px-4 sm:px-6 lg:px-8 ${dark ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-center font-bold text-4xl md:text-6xl lg:text-5xl mb-8 md:mb-10
      ${dark ? "text-gray-100" : "text-gray-800"}`}>
            How Artist Can Publish Their Music On MusicMenia
          </h2>

          <div className="grid grid-cols-1 gap-4 md:gap-6">
            {features.map((f, i) => (
              <div
                key={f.label}
                className={`rounded p-5 md:p-6 font-semibold transition-colors
            ${dark ? "bg-gray-800" : "bg-gray-50"}`}
              >
                <div className={`flex flex-col gap-4 md:gap-8 items-center
            ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>

                  <div className="w-full flex justify-center md:w-auto md:block">
                    <img
                      src={f.img}
                      alt={f.label}
                      className="h-40 sm:h-56 md:h-80 w-full max-w-xs md:max-w-none md:w-72 object-cover rounded flex-shrink-0"
                    />
                  </div>

                  <div className="flex-1 min-w-0 w-full">
                    <h3 className={`font-bold p-3 text-xl md:text-4xl mb-2
                ${dark ? "text-white" : "text-gray-900"}`}>
                      {f.label}
                    </h3>

                    <p className={`text-lg md:text-2xl py-4 leading-relaxed
                ${dark ? "text-white" : "text-black"}`}>
                      {f.desc1}
                    </p>

                    <ul className="tracking-tight text-left text-lg md:text-xl mt-3 list-disc px-5 space-y-1">
                      {f.n1 && <li className={dark ? "text-gray-300" : "text-gray-800"}>{f.n1}</li>}
                      {f.n2 && <li className={dark ? "text-gray-300" : "text-gray-800"}>{f.n2}</li>}
                      {f.n3 && <li className={dark ? "text-gray-300" : "text-gray-800"}>{f.n3}</li>}
                    </ul>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  How it works  */}
      <section id="listener-workflow" className={`py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden ${dark ? "bg-gray-700" : "bg-gray-50"}}`}>
        <h2 className={`text-center font-bold text-4xl md:text-5xl mb-4
          ${dark ? "text-white" : "text-gray-800"}`}>
          How it works <span className="text-green-400">For Listeners</span>
        </h2>

        <div className="grid grid-cols-1
         sm:grid-cols-2 lg:grid-cols-2 gap-2 max-w-6xl mx-auto">
          {steps.map((step, i) => (
            <div key={step.label} className="flex flex-col items-center gap-4 rounded-2xl p-5 cursor-pointer ">
              <h3 className={`text-3xl font-bold text-center ${dark ? "text-white" : "text-gray-900"}`}>
                {step.label}</h3>
              <p className={`text-xl text-center leading-relaxed ${dark ? "text-gray-400" : "text-gray-500"}`}>
                {step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Qna section */}
      <section id="faqs">
        <QnA />
      </section>

      <section className={`py-16 sm:py-20 px-4 sm:px-6 text-center
        ${dark ? "bg-gray-900" : "bg-gray-50 border-t-green-200 border-gray-100"}`}>
        <h2 className={`text-2xl sm:text-4xl font-bold mb-3  ${dark ? "text-white" : "text-gray-900"}`}>
          Ready to Dive In? Join MusicMenia Today!
        </h2>
        <p className={`mb-8 sm:mb-10 text-2xl font-semibold ${dark ? "text-blue-300" : "text-green-500"}`}>
          Join thousands of listeners and artists on MusicMenia
        </p>
        <div className="flex gap-3 sm:gap-4 justify-center flex-wrap">
          <button
            onClick={() => navigate('/login')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-8 py-3 rounded items-center flex font-semibold transition-colors cursor-pointer text-xl sm:text-2xl"
          >
            Join Now
          </button>

        </div>
      </section>

      <LandingFooter />
    </div>
  )
}