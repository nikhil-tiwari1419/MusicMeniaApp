import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, MessageSquareHeart, KeySquare } from 'lucide-react';
import { useAuth } from '../Context/useAuth';
import { useTheme } from '../Context/Theme';

const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(/[\s_.-]+/).filter(p => p.length > 0);
    if (parts.length > 1) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.charAt(0).toUpperCase();
};

function UserMenu() {
    const { user, logout } = useAuth();
    const { theme } = useTheme();
    const dark = theme === 'dark';
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    async function handleLogout() {
        await logout();
        setOpen(false);
        navigate('/');
    }

    // ── Not logged in ──
    if (!user) {
        return (
            <div className="flex items-center gap-2">
                <button
                    onClick={() => navigate('/login')}
                    className={`px-3 py-1.5 border-2 border-black text-xs font-black uppercase tracking-widest font-mono
                        shadow-[2px_2px_0_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all
                        ${dark ? 'bg-zinc-800 text-white' : 'bg-white text-black'}`}
                >
                    Login
                </button>
                <button
                    onClick={() => navigate('/login')}
                    className="px-3 py-1.5 border-2 border-black bg-yellow-400 text-black text-xs font-black uppercase tracking-widest font-mono
                        shadow-[2px_2px_0_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                    Get Access
                </button>
            </div>
        );
    }

    const isArtist = user?.role === 'artist';

    const menuItem = `w-full  flex items-center gap-3 px-3 py-2.5 text-sm font-semibold  tracking-wide
        border-b-2  ${dark ? "border-white" : " border-black"}transition-colors cursor-pointer text-left`;

    return (
        <div className="relative" ref={menuRef}>

            {/* Avatar button */}
            <button
                onClick={() => setOpen(!open)}
                className={`w-9 h-9 border-2 rounded  flex items-center justify-center text-sm font-black font-mono
                    shadow-[2px_2px] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all
                    ${open ? 'bg-gray-400 text-black shadow-none translate-x-[2px] translate-y-[2px]' : dark ? 'bg-zinc-800 text-white' : 'bg-white text-black border-black'}`}
            >
                {getInitials(user.username)}
            </button>

            {/* Dropdown */}
            {open && (
                <div className={`absolute rounded right-0 top-12 w-59 border-2  shadow-[4px_4px] z-50 overflow-hidden
                    ${dark ? 'bg-zinc-900' : 'bg-white border-black'}`}
                >
                    {/* User info header */}
                    <div className={`px-4 py-3 border-b-2 border-black ${dark ? 'bg-cyan-800' : 'bg-violet-400'}`}>
                        <p className={`text-sm font-black uppercase tracking-wider truncate ${dark ? 'text-white' : 'text-black'}`}>
                            {user.username}
                        </p>
                        <p className={`text-sm truncate mt-0.5 ${dark ? 'text-zinc-200' : 'text-black'}`}>
                            {user.email}
                        </p>
                    </div>

                    {/* Menu items */}
                    <div>
                        <button
                            onClick={() => { navigate('/liked-songs'); setOpen(false); }}
                            className={`${menuItem} ${dark ? 'text-zinc-300 hover:bg-zinc-800' : 'text-black hover:bg-zinc-100'}`}
                        >
                            <MessageSquareHeart size={14} />
                            Liked Songs
                        </button>

                        {isArtist && (
                            <button
                                onClick={() => { navigate('/your-post'); setOpen(false); }}
                                className={`${menuItem} ${dark ? 'text-zinc-300 hover:bg-zinc-800' : 'text-black hover:bg-zinc-100'}`}
                            >
                                <User size={14} />
                                Your Posts
                            </button>
                        )}

                        <button
                            onClick={() => { navigate('/forgot-password'); setOpen(false); }}
                            className={`${menuItem} ${dark ? 'text-zinc-300 hover:bg-zinc-800' : 'text-black hover:bg-zinc-100'}`}
                        >
                            <KeySquare size={14} />
                            Forgot Password
                        </button>

                        {/* Logout — red accent */}
                        <button
                            onClick={handleLogout}
                            className={`${menuItem} border-b-0 text-red-500 hover:bg-red-500 hover:text-white`}
                        >
                            <LogOut size={14} />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserMenu;