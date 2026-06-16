import { useContext } from 'react'
import Navbar from '../../Components/Navbar'
import { useTheme } from '../../Context/Theme'
import { AuthContext } from '../../Context/Auth'
import { Mail, Shield, Calendar, Music2, User, Hash, Clock } from 'lucide-react'

export default function Profile() {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const { user } = useContext(AuthContext);

  const initials = user?.username?.slice(0, 2).toUpperCase();

  const joined = user?._id
    ? new Date(parseInt(user._id.slice(0, 8), 16) * 1000)
      .toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Unknown';

  const roleStyle = {
    admin: dark ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' : 'bg-rose-50 text-rose-600 border-rose-200',
    artist: dark ? 'bg-violet-500/15 text-violet-400 border-violet-500/30' : 'bg-violet-50 text-violet-600 border-violet-200',
    user: dark ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-600 border-emerald-200',
  }[user.role];

  const roleIcon = {
    admin: <Shield size={11} />,
    artist: <Music2 size={11} />,
    user: <User size={11} />
  }[user.role];

  const accountId = user?._id?.slice(-8).toUpperCase();

  const sections = [
    {
      title: 'Account Info',
      rows: [
        { icon: <Mail size={14} />, label: 'Email', value: user.email },
        { icon: <User size={14} />, label: 'Username', value: user.username },
        { icon: <Hash size={14} />, label: 'Account ID', value: `#${accountId}` },
      ]
    },
    {
      title: 'Membership',
      rows: [
        { icon: roleIcon, label: 'Role', value: user.role },
        { icon: <Calendar size={14} />, label: 'Member Since', value: joined },
        { icon: <Clock size={14} />, label: 'Account Status', value: 'Active' },
      ]
    }
  ];

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .s { animation: slideUp 0.4s cubic-bezier(.22,1,.36,1) forwards; opacity:0; }
      `}</style>

      <Navbar />

      <main className={`min-h-screen pt-20 pb-12 px-4 transition-colors ${dark ? 'bg-gray-950' : 'bg-gray-50'}`}>

        {/* bg glow */}
        <div className={`fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] rounded-full blur-[120px] pointer-events-none
          ${dark ? 'bg-emerald-500/5' : 'bg-emerald-400/10'}`} />

        <div className="max-w-lg mx-auto space-y-4">

          {/* Avatar Card */}
          <div className={`s rounded-2xl overflow-hidden border shadow-lg
            ${dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>

            {/* Banner */}
            <div className="relative h-24">
              <div className={`absolute inset-0 ${dark
                ? 'bg-gradient-to-br from-emerald-900/50 via-gray-900 to-gray-800'
                : 'bg-gradient-to-br from-emerald-100 via-teal-50 to-gray-100'}`} />
              <div className={`absolute -top-4 -right-4 w-28 h-28 rounded-full blur-2xl
                ${dark ? 'bg-emerald-500/15' : 'bg-emerald-300/30'}`} />
            </div>

            <div className="px-5 pb-5">
              {/* Avatar + Name row */}
              <div className="flex items-end justify-between -mt-8 mb-4">
                <div className="relative">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center
                    text-xl font-bold border-4 shadow-md
                    ${dark
                      ? 'bg-gradient-to-br from-emerald-800 to-teal-900 text-emerald-200 border-gray-900'
                      : 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white border-white'}`}>
                    {initials}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-gray-900" />
                </div>

                <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold
                  px-2.5 py-1 rounded-lg border uppercase tracking-wider ${roleStyle}`}>
                  {roleIcon} {user.role}
                </span>
              </div>

              <h1 className={`text-lg font-bold capitalize ${dark ? 'text-white' : 'text-gray-900'}`}>
                {user.username}
              </h1>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          </div>

          {/* Info Sections */}
          {sections.map(({ title, rows }, si) => (
            <div
              key={title}
              className={`s rounded-2xl border shadow-sm
                ${dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}
              style={{ animationDelay: `${(si + 1) * 80}ms` }}
            >
              <div className={`px-5 py-3 border-b text-xs font-semibold uppercase tracking-widest
                ${dark ? 'border-gray-800 text-gray-500' : 'border-gray-100 text-gray-400'}`}>
                {title}
              </div>

              <div className="px-5 py-2 divide-y divide-gray-800/50">
                {rows.map(({ icon, label, value }) => (
                  <div key={label} className="flex items-center justify-between py-3 gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0
                        ${dark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                        {icon}
                      </div>
                      <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
                    </div>
                    <p className={`text-sm font-medium capitalize truncate max-w-[55%] text-right
                      ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>
      </main>
    </>
  );
}
