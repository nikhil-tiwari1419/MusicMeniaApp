import { useState, useRef, useEffect } from 'react'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useNavigate, NavLink } from 'react-router-dom';
import { useTheme } from '../Context/Theme';
import { useAuth } from '../Context/Auth';
import UserMenu from '../Components/Usermenu';

const userlink = [
  { label: 'Home', path: '/' },
  { label: 'Music-Feed', path: '/Local-Feed' },
  { label: "Album'S", path: '/album' },
  { label: 'About-Us', path: '/about' },
  { label: 'Artist', path: '/About-Artist' }

];

const artistLikns = [
  { label: 'Home', path: '/artist-Dashboard' },
  { label: 'Upload Track', path: '/create-music' },
  { label: 'My-Album', path: '/album' },
  { label: 'My-Post', path: '/album' },
  { label: 'About-Me', path: '/about' },
  { label: 'About Music_menia', path: '/about' },

]


function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const dark = theme === "dark";
  const menuRef = useRef(null);

  const navLinks = user?.role === "artist" ? artistLikns : user?.role === "user" ? userlink : [];


  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className={`fixed top-0 w-full z-50 border-b
      ${dark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}>

      <div className="flex items-center justify-between px-4 sm:px-8 md:px-16 py-3">

        {/* Logo */}
        <div className="flex cursor-pointer flex-shrink-0" onClick={() => navigate('/')}>
          <span className="bg-gray-900 text-white text-lg font-mono py-1 pl-3 pr-1 rounded-l-xl">Music</span>
          <span className="bg-blue-400 text-black text-lg font-mono py-1 pr-3 pl-1 rounded-r-xl">Menia</span>
        </div>

        {/* Desktop Links — Login/Signup removed, handled by UserMenu */}
        <ul className="hidden md:flex gap-1 font-medium">
          {navLinks.map(link => (
            <li key={link.label}>
              <NavLink to={link.path}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg transition-colors cursor-pointer block
                  ${isActive
                    ? "text-blue-500 font-semibold"
                    : dark ? "hover:bg-gray-800" : "hover:bg-gray-100"}`
                }>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right side controls */}
        <div className="flex items-center gap-2">

          {/* Theme toggle */}
          <button onClick={toggleTheme}
            className={`p-2 rounded-full border transition-colors
              ${dark ? "text-yellow-400 border-gray-700 hover:bg-gray-800" : "text-gray-600 border-gray-200 hover:bg-gray-100"}`}>
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* ✅ UserMenu — login/logout/avatar */}
          <UserMenu />

          {/* Hamburger — mobile only */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors
              ${dark ? "hover:bg-gray-800 text-white" : "hover:bg-gray-100 text-gray-800"}`}
            onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div ref={menuRef}
          className={`md:hidden border-t px-4 py-3
            ${dark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"}`}>
          <ul className="flex flex-col gap-1">
            {navLinks.map(link => (
              <li key={link.label}>
                <NavLink to={link.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                    ${isActive
                      ? "text-blue-500 bg-blue-50 font-semibold"
                      : dark ? "hover:bg-gray-800" : "hover:bg-gray-50 text-gray-700"}`
                  }>
                  {link.label}
                </NavLink>
              </li>
            ))}

            {/* Mobile — show user info or login */}
            <li className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              {user ? (
                <div className={`px-3 py-2 rounded-xl text-sm ${dark ? "text-gray-300" : "text-gray-700"}`}>
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              ) : (
                <NavLink to="/login" onClick={() => setOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-sm font-medium text-blue-500 hover:bg-blue-50 transition-colors">
                  Login / Signup
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Navbar;
