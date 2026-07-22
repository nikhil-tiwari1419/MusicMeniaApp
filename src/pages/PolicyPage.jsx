import { useTheme } from '../Context/Theme'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

export default function PolicyPage() {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const navigate = useNavigate()

  const bg = dark ? 'bg-zinc-950' : 'bg-white'
  const text = dark ? 'text-white' : 'text-black'
  const sub = dark ? 'text-zinc-400' : 'text-zinc-600'
  const card = `border-2 rounded p-5 ${dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-black'}`

  const sections = [
    {
      title: '1. Information We Collect',
      body: `When you create a MusicMenia account, we collect basic details like your
        username, email address, and password (stored securely, never in plain text).
        If you upload music as an artist, we also store the track files, titles, and
        thumbnails you provide.`
    },
    {
      title: '2. How We Use Your Information',
      body: `We use your information to run your account (login, personalized feed,
        liked songs, recently played) and to let artists share music with listeners.
        We do not sell your personal data to third parties.`
    },
    {
      title: '3. Cookies & Sessions',
      body: `MusicMenia uses cookies/session tokens to keep you logged in and to
        remember your preferences, like your theme (dark or light mode). Disabling
        cookies in your browser may prevent you from staying logged in.`
    },
    {
      title: '4. Data Storage & Security',
      body: `Your data is stored on secure servers. We take reasonable measures to
        protect your information, but no method of online storage is 100% secure,
        so we can't guarantee absolute security.`
    },
    {
      title: '5. Third-Party Services',
      body: `We may use third-party services (such as cloud storage for audio files)
        to operate MusicMenia. These providers only access what's needed to perform
        their service and are not permitted to use your data for anything else.`
    },
    {
      title: "6. Children's Privacy",
      body: `MusicMenia is not intended for children under 13. We do not knowingly
        collect personal information from children under 13.`
    },
    {
      title: '7. Your Choices',
      body: `You can update your profile information, delete liked songs, or log out
        at any time from your Profile page. To request full account deletion, please
        contact us using the details below.`
    },
    {
      title: '8. Changes to This Policy',
      body: `We may update this Privacy Policy from time to time. Continued use of
        MusicMenia after changes means you accept the updated policy.`
    },
    {
      title: '9. Contact Us',
      body: `Questions about this policy? Reach out to us at
        support@musicmenia.app.`
    },
  ]

  return (
    <main className={`min-h-screen pt-6 pb-16 px-4 ${bg} ${text}`}>
      <div className="max-w-2xl mx-auto space-y-4">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-1 text-sm font-bold mb-2 ${sub} hover:${text}`}
        >
          <ChevronLeft size={18} /> Back
        </button>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Privacy Policy</h1>
          <p className={`text-sm mt-1 ${sub}`}>Last updated: July 2026</p>
        </div>

        <p className={`text-sm leading-relaxed ${sub}`}>
          This Privacy Policy explains how MusicMenia collects, uses, and protects
          your information when you use our app to discover, stream, or upload music.
        </p>

        {/* Policy sections */}
        {sections.map(({ title, body }) => (
          <div key={title} className={card}>
            <h2 className="text-sm font-black uppercase tracking-wide mb-2">{title}</h2>
            <p className={`text-sm leading-relaxed ${sub}`}>{body}</p>
          </div>
        ))}

      </div>
    </main>
  )
}
