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

  const roleColors = {
    admin: 'bg-red-400 text-black',
    artist: 'bg-yellow-400 text-black',
    user: 'bg-white text-black',
  }[user.role] || 'bg-white text-black';

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

  const bg = dark ? 'bg-zinc-950' : 'bg-white';
  const card = `border-2 border-black shadow-[4px_4px_0_#000] ${dark ? 'bg-zinc-900' : 'bg-white'}`;
  const labelText = dark ? 'text-zinc-400' : 'text-zinc-500';
  const valueText = dark ? 'text-white' : 'text-black';
  const divider = `border-t-2 ${dark ? 'border-zinc-800' : 'border-black/10'}`;

  return (
    <>
      <Navbar />

      <main className={`min-h-screen pt-20 pb-12 px-4 font-mono ${bg}`}>
        <div className="max-w-lg mx-auto space-y-4">

          {/* Avatar Card */}
          <div className={card}>

            {/* Banner — thick black stripe */}
            <div className={`h-5 w-full border-b-2 border-black ${
              user.role === 'admin' ? 'bg-red-400' :
              user.role === 'artist' ? 'bg-yellow-400' : 'bg-zinc-300'
            }`} />

            <div className="px-5 pb-5 pt-4">
              <div className="flex items-start justify-between mb-4">

                {/* Avatar — hard square */}
                <div className={`w-16 h-16 border-2 border-black shadow-[3px_3px_0_#000]
                  flex items-center justify-center text-2xl font-black
                  ${dark ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-black'}`}>
                  {initials}
                </div>

                {/* Role badge */}
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-black
                  px-3 py-1.5 border-2 border-black uppercase tracking-widest
                  shadow-[2px_2px_0_#000] ${roleColors}`}>
                  {roleIcon} {user.role}
                </span>
              </div>

              {/* Active dot + name */}
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2.5 h-2.5 bg-yellow-400 border-2 border-black flex-shrink-0" />
                <h1 className={`text-xl font-black uppercase tracking-tight ${valueText}`}>
                  {user.username}
                </h1>
              </div>
              <p className={`text-xs font-mono ${labelText}`}>{user.email}</p>
            </div>
          </div>

          {/* Info Sections */}
          {sections.map(({ title, rows }, si) => (
            <div key={title} className={card}>

              {/* Section header */}
              <div className={`px-5 py-2.5 border-b-2 border-black
                ${dark ? 'bg-zinc-800' : 'bg-black'}`}>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-white">
                  {title}
                </p>
              </div>

              <div className="px-5 py-1">
                {rows.map(({ icon, label, value }, i) => (
                  <div key={label}
                    className={`flex items-center justify-between py-3 gap-3 ${i !== 0 ? divider : ''}`}>

                    {/* Label side */}
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 border-2 border-black flex items-center justify-center flex-shrink-0
                        ${dark ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-black'}`}>
                        {icon}
                      </div>
                      <p className={`text-xs uppercase tracking-wider font-bold ${labelText}`}>{label}</p>
                    </div>

                    {/* Value side */}
                    <p className={`text-sm font-black capitalize truncate max-w-[55%] text-right ${valueText}`}>
                      {label === 'Account Status'
                        ? <span className="inline-flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-yellow-400 border border-black inline-block" />
                            {value}
                          </span>
                        : value
                      }
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