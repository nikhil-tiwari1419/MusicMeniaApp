import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, ChevronDown, MessageSquareHeart } from 'lucide-react';
import { useAuth } from '../Context/Auth';
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

    //  User logged in nahi hai — Login button dikhao
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
                get-Access
            </button>
        </>
        );
    }

    //  User logged in hai — Avatar + Dropdown
    return (
        <div className="relative" ref={menuRef}>

            {/* Avatar Button */}
            <button
                onClick={() => setOpen(!open)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-xl border transition-colors cursor-pointer
                    ${dark
                        ? "border-gray-700 hover:bg-gray-800 text-white"
                        : "border-gray-200 hover:bg-gray-100 text-gray-800"
                    }`}
            >
                {/* Avatar circle with first letter */}
                <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {user.username?.charAt(0).toUpperCase()}
                </div>

                {/* Username — hidden on small screens */}
                <span className="hidden sm:block text-sm font-medium max-w-24 truncate">
                    {user.username}
                </span>

                <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
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
                    {/* User info */}
                    <div className={`px-4 py-3 border-b ${dark ? "border-gray-700" : "border-gray-100"}`}>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                                {user.username?.charAt(0).toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                                <p className={`text-sm font-semibold truncate ${dark ? "text-white" : "text-gray-900"}`}>
                                    {user.username}
                                </p>
                                <p className="text-xs text-gray-400 truncate">
                                    {user.email}
                                </p>
                            </div>
                        </div>  
                    </div>

                    {/* Menu items */}
                    <div className="p-1.5">
                        
                        <button 
                        onClick={()=> {navigate('/liked song'); setOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm trensition-color cursor-pointer 
                            ${dark ?
                                "hover:bg-gray-800 text-gray-300"
                                : "hover:bg-gray-50 text-gray-700"
                            }`}>
                                <MessageSquareHeart  size={15}/>
                                Liked Song
                        </button>
                        <button
                            onClick={() => { navigate('/your-post'); setOpen(false); }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer
                                ${dark
                                    ? "hover:bg-gray-800 text-gray-300"
                                    : "hover:bg-gray-50 text-gray-700"
                                }`}
                        >
                            <User size={15} />
                            Your Posts
                        </button>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors cursor-pointer"
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

