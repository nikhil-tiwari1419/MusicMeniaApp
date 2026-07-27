import React, { useContext, useState } from 'react'
import axios from 'axios'
import { useTheme } from '../Context/Theme'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../Context/Auth'
import {ChevronLeft , Mail  , Instagram , Twitter , HelpCircle} from 'lucide-react'
import toast from "react-hot-toast";

function ContactPage() {
const API = import.meta.env.VITE_API_URL;

  const { theme } = useTheme()
  const dark = theme === 'dark'
  const path = useNavigate()
  const { user } = useContext(AuthContext)

  const bg = dark ? 'bg-zinc-950' : 'bg-white'
  const text = dark ? 'text-white' : 'text-black'
  const sub = dark ? 'text-zinc-400' : 'text-zinc-600'
  const card = `border-2 rounded p-5 ${dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-black'}`
  const inputClass = `w-full rounded px-4 py-2.5 text-sm outline-none border-2 transition-colors
    ${dark ? 'bg-zinc-800 border-zinc-700 text-white focus:border-blue-500' : 'bg-white border-black text-black focus:border-blue-500'}`

  const [form, Setform] = useState({ username: user?.username || '', subject: 'General', message: '' })
  const [loading, setLoading] = useState(false)

  function handlechange(e) {
    Setform({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.username || !form.message) {
      toast.error('Please fill your message box')
      return
    }

    setLoading(true)
    try {
      await axios.post(`${API}/contact/new`, form, { withCredentials: true })
      toast.success("Message sent! We'll get back  to u soon ")
      Setform({ username: user?.username || '', subject: "General", message: '' })

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again')
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <main className={`min-h-screen pt-6 pb-16 p-2 ${bg} ${text}`}>
      <div className='max-w-2xl mx-auto space-y-4'>
        <button
          onClick={() => path(-1)}
          className={`flex items-center gap-1 text-sm font-bold mb-2 ${sub} hover:${text}`}
        >
          <ChevronLeft size={18} /> Back
        </button>
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Contact Us</h1>
          <p className={`text-sm mt-1 ${sub}`}>
            Questions, feedback, or a copyright concern? We'd love to hear from you.
          </p>
        </div>

        {/* Static contact info */}
        <div className={card}>
          <h2 className="text-sm font-black uppercase tracking-wide mb-3">Reach Us Directly</h2>

          <a href="mailto:developernikhil14@gmail.com"
            className={`flex items-center gap-3 py-2 text-sm font-bold hover:underline ${text}`}>
            <Mail size={18} className={sub} />
            support@musicmenia.app
          </a>

          <a href="https://instagram.com/musicmenia" target="_blank" rel="noreferrer"
            className={`flex items-center gap-3 py-2 text-sm font-bold hover:underline ${text}`}>
            <Instagram size={18} className={sub} />
            @musicmenia
          </a>

          <a href="https://twitter.com/musicmenia" target="_blank" rel="noreferrer"
            className={`flex items-center gap-3 py-2 text-sm font-bold hover:underline ${text}`}>
            <Twitter size={18} className={sub} />
            @musicmenia
          </a>

          <button onClick={() => navigate('/')}
            className={`flex items-center gap-3 py-2 text-sm font-bold hover:underline ${text}`}>
            <HelpCircle size={18} className={sub} />
            Check our FAQs first
          </button>

          <p className={`text-xs mt-2 ${sub}`}>We usually reply within 24–48 hours.</p>
        </div>
        {/* contact form  */}
        {!user ? (
          <div className={card}>
            <p> Please log in to send us a message directly</p>
            <button onClick={() => path('/login')}
              className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors">
              Go to Login</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={card}>
            <h2 className="text-sm font-black uppercase tracking-wide mb-4">Send Us a Message</h2>

            <div className="flex flex-col gap-3">
              <div>
                <label className={`text-xs font-bold uppercase tracking-wide ${sub}`}>Name</label>
                <input
                  name="username"
                  value={form.username}
                  onChange={handlechange}
                  placeholder="Your name"
                  className={`${inputClass} mt-1`}
                />
              </div>

              {/* Email — read-only, always the logged-in account's email.
                  Shown so the user can see where the reply will go,
                  but it's not an editable input and nothing here is
                  sent to the backend — the server looks it up itself. */}
              <div>
                <label className={`text-xs font-bold uppercase tracking-wide ${sub}`}>Email</label>
                <div className={`${inputClass} mt-1 opacity-70 cursor-not-allowed`}>
                  {user.email}
                </div>
              </div>

              <div>
                <label className={`text-xs font-bold uppercase tracking-wide ${sub}`}>Subject</label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handlechange}
                  className={`${inputClass} mt-1`}
                >
                  <option>General</option>
                  <option>Bug Report</option>
                  <option>Want's to artist</option>
                  <option>Account Issue</option>
                  <option>Copyright Concern</option>
                  <option>Feedback</option>
                </select>
              </div>

              <div>
                <label className={`text-xs font-bold uppercase tracking-wide ${sub}`}>Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handlechange}
                  placeholder="How can we help?"
                  rows={5}
                  className={`${inputClass} mt-1 resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60
                  text-white font-bold py-3 rounded transition-colors mt-2"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>

        )}
      </div>
    </main>
  )
}

export default ContactPage




