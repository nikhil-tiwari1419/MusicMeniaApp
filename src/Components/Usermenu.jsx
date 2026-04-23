import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, ChevronDown, MessageSquareHeart } from 'lucide-react';
import { useAuth } from '../Context/useAuth';
import { useTheme } from '../Context/Theme';

function UserMenu() {
    const { user, logout } = useAuth();
    const { theme } = useTheme();
    const dark = theme === 'dark';
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
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
            <>
                <button
                    onClick={() => navigate('/login')}
                    className="px-5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sx font-semibold font-mono rounded-full transition-colors cursor-pointer"
                >
                    Login
                </button>
                <button
                    onClick={() => navigate('/login')}
                    className="px-5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sx font-semibold font-mono rounded-full transition-colors cursor-pointer"
                >
                    Get Access
                </button>
            </>
        );
    }

    const isArtist = user?.role === "artist";

    return (
        <div className="relative" ref={menuRef}>
            {/* Avatar */}
            <button
                onClick={() => setOpen(!open)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-xl border transition-colors cursor-pointer
                    ${dark
                        ? "border-gray-700 hover:bg-gray-800 text-white"
                        : "border-gray-200 hover:bg-gray-100 text-gray-800"
                    }`}
            >
                <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                    {user.username?.charAt(0).toUpperCase()}
                </div>

                <span className="hidden sm:block text-sm font-medium max-w-24 truncate">
                    {user.username}
                </span>

                <ChevronDown
                    size={14}
                    className={`transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown */}
            {open && (
                <div className={`absolute right-0 top-11 w-56 rounded-xl border shadow-xl z-50 overflow-hidden
                    ${dark
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                    }`}
                >
                    {/* User Info */}
                    <div className={`px-4 py-3 border-b ${dark ? "border-gray-700" : "border-gray-100"}`}>
                        <p className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-900"}`}>
                            {user.username}
                        </p>
                        <p className="text-xs text-gray-400">
                            {user.email}
                        </p>
                    </div>

                    {/* Menu */}
                    <div className="p-1.5">

                        {/* Liked Songs */}
                        <button
                            onClick={() => { navigate('/liked-songs'); setOpen(false); }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                                ${dark
                                    ? "hover:bg-gray-800 text-gray-300"
                                    : "hover:bg-gray-50 text-gray-700"
                                }`}
                        >
                            <MessageSquareHeart size={15} />
                            Liked Songs
                        </button>

                        {/* Your Posts (Artist only logic) */}
                        <button
                            disabled={!isArtist}
                            onClick={() => {
                                if (isArtist) {
                                    navigate('/your-post');
                                    setOpen(false);
                                }
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                                ${isArtist
                                    ? (dark
                                        ? "hover:bg-gray-800 text-gray-300 cursor-pointer"
                                        : "hover:bg-gray-50 text-gray-700 cursor-pointer")
                                    : "opacity-50 cursor-not-allowed text-gray-400"
                                }`}
                        >
                            <User size={15} />
                            Your Posts
                        </button>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-blue-500 hover:bg-red-50 dark:hover:text-red-500 transition-colors cursor-pointer"
                        >
                            <LogOut size={15} />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserMenu;

