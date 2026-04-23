import { useState, useRef, useEffect, use } from 'react'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useNavigate, NavLink } from 'react-router-dom';
import { useTheme } from '../Context/Theme';
import { useAuth } from '../Context/useAuth';
import UserMenu from '../Components/Usermenu';

const userlink = [
  { label: 'Home', path: '/user-Dashboard' },
  { label: 'Music-Feed', path: '/Local-Feed' },//All music feed
  { label: 'About', path: '/about' }, //About musicMenia
  { label: "Album", path: '/album' }, //All Album's in musicMenia
  { label: 'Profile', path: '/Profile' },//About Listener
  { label: 'Artist', path: '/artist' } //About Artist in musicMenia
];

const artistLikns = [
  { label: 'Home', path: '/artist-Dashboard' },//Artist Dashboard
  { label: 'Upload Track', path: '/create-music' },//Create Music
  { label: 'Album', path: '/Admin-album' },//Artist Albums
  { label: 'My-Post', path: '/your-post' },//Artist Post
  { label: 'About Music_menia', path: '/about-company' },//About musicMenia
];


function Navbar() {
  const [open, setOpen] = useState(false);


  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const dark = theme === "dark";
  const menuRef = useRef(null);

  const navLinks = user?.role === "artist" ? artistLikns : user?.role === "user" ? userlink : [];

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    }
  }, [open]);

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

      <div className="flex items-center justify-between px-4 sm:px-8 md:px-16 py-1">

        {/* Logo */}
        <div className="flex cursor-pointer font-semibold justify-center items-center  flex-shrink-0" onClick={() => navigate('/')}>
          <img src={` ${dark ? "/whitelogo.png" : "/logoo.png"}`}
            alt=""
            className='sm:h-15 h-10'
          />
        </div>

        {/* Desktop Links — Login/Signup */}
        <ul className="hidden md:flex gap-1 font-medium">
          {navLinks.map(link => (
            <li key={link.label}>
              <NavLink to={link.path}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg transition-colors cursor-pointer block
                  ${isActive
                    ? "text-blue-500 font-semibold"
                    : dark ? "hover:bg-gray-800" : "hover:bg-gray-300"}`
                }>
                {link.label}
              </NavLink>
            </li>

          ))}
          {/* Theme toggle */}
          <button onClick={toggleTheme}
            className={`p-2 rounded-full whitespace-nowrap  border-2 transition-colors
              ${dark ? "text-yellow-400 border-gray-700 hover:bg-gray-600" : "text-gray-600 border-gray-200 hover:bg-gray-200"}`}>
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </ul>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/*  UserMenu — login/logout/avatar */}
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

      {open && (
        <div
          className='fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden'
          onClick={() => setOpen(false)}
        />
      )}
      {/* Mobile Dropdown */}
      {open && (
        <div ref={menuRef}
          className={`md:hidden border-t top-0 px-4 py-5 relative z-50
          ${dark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"}`}>
          {/* Hamburger — mobile only */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors
              ${dark ? "hover:bg-gray-800 text-white" : "hover:bg-gray-100 text-gray-800"}`}
            onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>

          <ul className="flex flex-col gap-1">
            {navLinks.map(link => (
              <li key={link.label}>
                <NavLink to={link.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-5 rounded-xl text-xl font-semibold transition-colors
                  ${isActive
                      ? "text-black bg-gray-50 font-semibold"
                      : dark ? "hover:bg-gray-800" : "hover:bg-gray-50 text-gray-700"}`
                  }>
                  {link.label}
                </NavLink>

              </li>
            ))}


            {/* Theme toggle */}
            <button onClick={toggleTheme}
              className={`p-2 rounded-full whitespace-nowrap  border-2 transition-colors
              ${dark ? "text-yellow-400 border-gray-700 hover:bg-gray-600" : "text-gray-600 border-gray-200 hover:bg-gray-200"}`}>
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <li className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              {user ? (
                <div className={`px-3 py-2 rounded-xl text-xl ${dark ? "text-gray-300" : "text-gray-700"}`}>
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              ) : (
                <NavLink to="/login" onClick={() => setOpen(false)}
                  className="block px-3 py-1 rounded-xl text-xl font-medium text-blue-500 hover:bg-blue-50 transition-colors">
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

