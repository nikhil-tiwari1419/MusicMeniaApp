import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, MessageSquareHeart, KeySquare, ChevronDown } from 'lucide-react';
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

    // Not logged in
    if (!user) {
        return (
            <div className="flex items-center gap-2">
                <button
                    onClick={() => navigate('/login')}
                    className={`px-3 py-1.5 border-2 border-black text-xs font-black uppercase tracking-widest font-mono
                    
                        ${dark ? 'bg-zinc-800 text-white' : 'bg-white text-black'}`}
                >
                    Login
                </button>
                <button
                    onClick={() => navigate('/login')}
                    className="px-3 py-1.5 border-2 border-black bg-yellow-400 text-black text-xs font-black uppercase tracking-widest font-mono"
                >
                    Get Access
                </button>
            </div>
        );
    }

    const isArtist = user?.role === 'artist';

    // Each item gets its own accent chip color so the icon reads as a tag, not decoration
    const items = [
        { label: 'Liked Songs', icon: MessageSquareHeart, to: '/liked-songs', accent: 'bg-pink-400' },
        ...(isArtist ? [{ label: 'Your Posts', icon: User, to: '/your-post', accent: 'bg-sky-400' }] : []),
        { label: 'Forgot Password', icon: KeySquare, to: '/forgot-password', accent: 'bg-amber-400' },
    ];

    return (
        <div className="relative" ref={menuRef}>

            {/* Avatar button */}
            <button
                onClick={() => setOpen(!open)}
                className={`flex items-center gap-1.5 pl-1 pr-2 py-1 border-2 border-black rounded
                    ${open ? 'shadow-none bg-yellow-400 text-black' : dark ? 'bg-zinc-800 text-white' : 'bg-white text-black'}`}
            >
                <span className={`w-7 h-7 flex items-center justify-center text-xs font-black font-mono border-2 rounded-sm
                    ${open ? 'border-black bg-black text-yellow-400' : dark ? 'border-white' : 'border-black'}`}>
                    {getInitials(user.username)}
                </span>
                <ChevronDown size={14} strokeWidth={3} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            <div
                className={`absolute right-0 top-[calc(100%+20px)] w-58 border-2 rounded z-50 overflow-hidden origin-bottom-right
                    
                    ${dark ? 'bg-zinc-900' : 'bg-white border-black'}
                    ${open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
            >
                {/* Little pointer nub tying it back to the avatar */}
                <div className={`absolute -bottom-[9px] right-4 w-4 h-4 border-b-2 border-r-2 border-black rotate-45
                    ${dark ? 'bg-zinc-900' : 'bg-white'}`} />

                {/* User info header */}
                <div className={`relative px-4 py-3.5 border-b-2 border-black flex items-center gap-3
                    ${dark ? 'bg-blue-300' : 'bg-violet-400'}`}
                >
                    <span className="w-10 h-10 flex-shrink-0 flex items-center justify-center text-sm font-black font-mono
                        border-2 border-black rounded-sm bg-white text-black">
                        {getInitials(user.username)}
                    </span>
                    <div className="min-w-0">
                        <p className="text-sm font-black uppercase tracking-wider truncate text-black">
                            {user.username}
                        </p>
                        <p className="text-xs truncate mt-0.5 text-black/70 font-mono">
                            {user.email}
                        </p>
                    </div>
                </div>

                {/* Menu items */}

                <div className="py-1">
                    {items.map(({ label, icon: Icon, to, accent }) => (
                        <button
                            key={to}
                            onClick={() => { navigate(to); setOpen(false); }}
                            className={`group w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold tracking-wide text-left transition-colors
                                ${dark ? 'text-zinc-200 hover:bg-zinc-800' : 'text-black hover:bg-zinc-100'}`}
                        >
                            <span className={`w-6 h-6 flex-shrink-0 flex items-center justify-center border-2 border-black rounded-sm ${accent} text-black`}>
                                <Icon size={12} strokeWidth={2.5} />
                            </span>
                            {label}
                        </button>
                    ))}

                    <div className={`mx-3 my-1 border-t-2 border-dashed ${dark ? 'border-zinc-700' : 'border-zinc-200'}`} />

                    {/* Logout — red accent, flips on hover */}

                    <button
                        onClick={handleLogout}
                        className="group w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold tracking-wide text-left
                            text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                    >
                        <span className="w-6 h-6 flex-shrink-0 flex items-center justify-center border-2 border-black rounded-sm bg-white text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                            <LogOut size={12} strokeWidth={2.5} />
                        </span>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserMenu;