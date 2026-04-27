import { useContext } from 'react'
import Navbar from '../../Components/Navbar'
import { useTheme } from '../../Context/Theme'
import { AuthContext } from '../../Context/Auth'
import { Mail, Shield, Calendar, Music2, User } from 'lucide-react'

export default function Profile() {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const { user } = useContext(AuthContext);

  const initials = user?.username?.slice(0, 2).toUpperCase();

  const joined = user?._id
    ? new Date(parseInt(user._id.slice(0, 8), 16) * 1000)
      .toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Unknown';

  const roleStyle = {
    admin: dark ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' : 'bg-rose-50 text-rose-600 border-rose-200',
    artist: dark ? 'bg-violet-500/15 text-violet-400 border-violet-500/30' : 'bg-violet-50 text-violet-600 border-violet-200',
    user: dark ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-600 border-emerald-200',
  }[user.role];

  const roleIcon = { admin: <Shield size={11} />, artist: <Music2 size={11} />, user: <User size={11} /> }[user.role];

  const rows = [
    { icon: <Mail size={14} />, label: 'Email', value: user.email },
    { icon: roleIcon, label: 'Role', value: user.role },
    { icon: <Calendar size={14} />, label: 'Member Since', value: joined },
  ];

  return (
    <>
      <style>{`
                @keyframes slideUp {
                    from { opacity:0; transform:translateY(20px); }
                    to   { opacity:1; transform:translateY(0); }
                }
                .s { animation: slideUp 0.45s cubic-bezier(.22,1,.36,1) forwards; opacity:0; }
            `}</style>

      <Navbar />

      <main className={`min-h-screen py-15 px-4 transition-colors ${dark ? 'bg-gray-950' : 'bg-gray-50'}`}>

        {/* bg glow */}
        <div className={`fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] rounded-full blur-[120px] pointer-events-none
                    ${dark ? 'bg-emerald-500/5' : 'bg-emerald-400/10'}`} />

        <div className="max-w-sm mx-auto">
          <div className={`s rounded-3xl overflow-hidden border shadow-xl
                        ${dark ? 'bg-gray-900 border-gray-800 shadow-black/40' : 'bg-white border-gray-200 shadow-gray-200'}`}>

            {/* Banner */}
            <div className="relative h-28 overflow-hidden">
              <div className={`absolute inset-0 ${dark
                ? 'bg-gradient-to-br from-emerald-900/60 via-gray-900 to-gray-800'
                : 'bg-gradient-to-br from-emerald-100 via-teal-50 to-gray-100'}`} />
              <div className={`absolute -top-6 -right-6 w-32 h-32 rounded-full blur-2xl
                                ${dark ? 'bg-emerald-500/15' : 'bg-emerald-300/30'}`} />
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `radial-gradient(circle, ${dark ? '#10b981' : '#6ee7b7'} 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }} />
            </div>

            <div className="px-6 pb-7">
              {/* Avatar */}
              <div className="relative -mt-10 mb-4">
                <div className={`w-[76px] h-[76px] rounded-2xl flex items-center justify-center
                                    text-2xl font-bold border-4 shadow-lg
                                    ${dark
                    ? 'bg-gradient-to-br from-emerald-800 to-teal-900 text-emerald-200 border-gray-900'
                    : 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white border-white shadow-emerald-200'}`}>
                  {initials}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-gray-900" />
              </div>

              {/* Name + badge */}
              <div className="mb-5">
                <h1 className={`text-xl font-bold mb-2 capitalize ${dark ? 'text-white' : 'text-gray-900'}`}>
                  {user.username}
                </h1>
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold
                                    px-2.5 py-1 rounded-lg border uppercase tracking-wider ${roleStyle}`}>
                  {roleIcon} {user.role}
                </span>
              </div>

              <div className={`h-px mb-5 ${dark ? 'bg-gray-800' : 'bg-gray-100'}`} />

              {/* Info rows */}
              <div className="space-y-4">
                {rows.map(({ icon, label, value }, i) => (
                  <div key={label} className="s flex items-start gap-3" style={{ animationDelay: `${i * 60}ms` }}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                                            ${dark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                      {icon}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-[10px] uppercase tracking-widest font-semibold mb-0.5
                                                ${dark ? 'text-gray-600' : 'text-gray-400'}`}>{label}</p>
                      <p className={`text-sm font-medium truncate capitalize
                                                ${dark ? 'text-gray-200' : 'text-gray-800'}`}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* card shadow reflection */}
          <div className={`mx-6 h-4 rounded-b-3xl blur-sm -mt-2 opacity-20
                        ${dark ? 'bg-gray-800' : 'bg-gray-300'}`} />
        </div>
      </main>
    </>
  );
}