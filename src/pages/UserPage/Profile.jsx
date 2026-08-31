import { useContext, useState } from 'react'
import { useTheme } from '../../Context/Theme'
import { AuthContext } from '../../Context/Auth'
import { Shield, Music2, User, Sun, Moon, Heart, ListMusic, Users, Bell, FileText, Scale } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === 'dark';
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate()

  // Simple local-only setting for now — not wired to a backend.
  // Flip to true/false just to control the switch's look and feel.
  const [notifications, setNotifications] = useState(true);

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  if (!user) return null;

  const initials = user?.username?.slice(0, 2).toUpperCase();

  const roleColors = {
    admin: 'bg-red-400 text-black',
    artist: 'bg-yellow-400 text-black',
    user: 'bg-white text-black',
  }[user.role] || 'bg-white text-black';

  const roleIcon = {
    admin: <Shield size={20} />,
    artist: <Music2 size={20} />,
    user: <User size={20} />
  }[user.role];

  const bg = dark ? 'bg-zinc-950' : 'bg-white';
  const card = `border-2 rounded ${dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-black'}`;
  const labelText = dark ? 'text-zinc-400' : 'text-zinc-500';
  const valueText = dark ? 'text-white' : 'text-black';
  const divider = dark ? 'border-zinc-800' : 'border-black/10';
  const rowHover = dark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100';

  // Quick links to the main sections of the app someone would want from
  // their profile — kept as plain data so the JSX below stays simple.
  const quickLinks = [
    { label: 'Liked Songs', icon: <Heart size={18} />, path: '/liked-songs' },
    { label: 'Local Feed', icon: <ListMusic size={18} />, path: '/Local-feed' },
    { label: 'Artists', icon: <Users size={18} />, path: '/artist' },
  ];

  return (
    <main className={`min-h-[95vh] pt-6 pb-12 px-4 ${bg}`}>
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 lg:gap-6 lg:items-start">

        {/* ── Left column: identity — sticky on desktop so it stays in view while the right column scrolls ── */}
        <div className="space-y-4 lg:sticky lg:top-6">

          {/* Avatar Card */}
          <div className={card}>
            <div className="px-5 pb-5 pt-4">
              <div className="flex items-start justify-between mb-4">

                {/* Avatar — hard square */}
                <div className={`w-16 h-16 rounded border-2 border-black 
                  flex items-center justify-center text-2xl font-black
                  ${dark ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-black'}`}>
                  {initials}
                </div>

                {/* Role badge */}
                <span className={`rounded inline-flex items-center gap-1.5 text-sm
                  px-3 py-1.5 border-2 border-black tracking-widest
                  shadow-[2px_2px_0_#000] ${roleColors}`}>
                  {roleIcon} {user.role}
                </span>
              </div>

              {/* Name + Logout, side by side */}
              <div className="flex items-center justify-between gap-3 mb-1">
                <h1 className={`text-xl font-black uppercase tracking-tight truncate ${valueText}`}>
                  {user.username}
                </h1>
                <button
                  onClick={handleLogout}
                  className={`flex-shrink-0 border-2 rounded bg-red-500 font-semibold text-sm px-3 py-1 transition-colors
                    ${dark ? "text-white border-red-500 hover:bg-red-600" : "text-black border-black hover:bg-white hover:border-red-500"}`}>
                  Logout
                </button>
              </div>
              <p className={`text-xs font-semibold ${labelText}`}>{user.email}</p>
            </div>
          </div>

          {/* Quick Links — jump straight to the rest of the app. Hidden here on desktop
              and shown in the right column instead, since this card sits fixed in the
              viewport and a tall link list would push the avatar off-screen on short windows. */}
          <div className={`${card} lg:hidden`}>
            {quickLinks.map((link, i) => (
              <button
                key={link.label}
                onClick={() => navigate(link.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                  ${i !== 0 ? `border-t-2 ${divider}` : ''} ${rowHover}`}
              >
                <span className={labelText}>{link.icon}</span>
                <span className={`text-sm font-bold ${valueText}`}>{link.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Right column: links + settings ── */}
        <div className="space-y-4">

          {/* Quick Links — desktop only here, laid out as a 3-up row instead of a stacked list */}
          <div className={`hidden lg:grid grid-cols-3 gap-4`}>
            {quickLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => navigate(link.path)}
                className={`${card} flex flex-col items-center justify-center gap-2 px-4 py-5 text-center transition-colors ${rowHover}`}
              >
                <span className={labelText}>{link.icon}</span>
                <span className={`text-sm font-bold ${valueText}`}>{link.label}</span>
              </button>
            ))}
          </div>

          {/* Appearance — theme toggle */}
          <div className={card}>
            <button
              onClick={toggleTheme}
              className={`w-full flex items-center justify-between px-4 py-3 transition-colors ${rowHover}`}
            >
              <span className={`text-sm font-bold ${valueText}`}>
                {dark ? 'Dark Mode' : 'Light Mode'}
              </span>
              <span className={valueText}>
                {dark ? <Sun size={20} /> : <Moon size={20} />}
              </span>
            </button>
          </div>

          {/* Settings */}
          <div className={card}>
            <p className={`px-4 pt-3 pb-1 text-xs font-black uppercase tracking-[0.2em] ${labelText}`}>
              Settings
            </p>

            {/* Notifications — simple on/off toggle, local state only for now */}
            <div className={`flex items-center justify-between px-4 py-3 border-t-2 ${divider}`}>
              <div className="flex items-center gap-3">
                <Bell size={18} className={labelText} />
                <span className={`text-sm font-bold ${valueText}`}>Notifications</span>
              </div>
              <button
                onClick={() => setNotifications(n => !n)}
                className={`w-11 h-6 rounded-full border-2 border-black transition-colors relative
                  ${notifications ? 'bg-green-400' : dark ? 'bg-zinc-700' : 'bg-zinc-200'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-black transition-all
                  ${notifications ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>
          </div>

          {/* Privacy Policy + Terms & Conditions */}
          <div className={`${card} lg:grid lg:grid-cols-2`}>
            <button
              onClick={() => navigate('/privacy-policy')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${rowHover}`}
            >
              <FileText size={18} className={labelText} />
              <span className={`text-sm font-bold ${valueText}`}>Privacy Policy</span>
            </button>
            <button
              onClick={() => navigate('/terms')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-t-2 lg:border-t-0 lg:border-l-2 ${divider} ${rowHover}`}
            >
              <Scale size={18} className={labelText} />
              <span className={`text-sm font-bold ${valueText}`}>Terms & Conditions</span>
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}