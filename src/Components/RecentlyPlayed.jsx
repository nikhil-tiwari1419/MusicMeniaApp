import { useEffect, useState, useRef } from "react";
import { useAudio } from "../Context/AudioContext";
import { useTheme } from "../Context/Theme";
import { History, X, Play, Pause, Music2 } from "lucide-react";

function RecentlyPlayed() {
    const { recentlyPlayed, togglePlay, playingTrack, isPlaying } = useAudio();
    const [open, setOpen] = useState(false);
    const { theme } = useTheme();
    const dark = theme === "dark";
    const dropdownRef = useRef(null);

    useEffect(() => {
        const isMobile = window.innerWidth < 640;
        if (open && isMobile) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
        };
        const handleEscape = (e) => { if (e.key === "Escape") setOpen(false); };
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleEscape);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [open]);

    const SongCard = ({ song, index }) => {
        const isActive = playingTrack?._id === song._id;
        return (
            <div
                onClick={() => togglePlay(song, recentlyPlayed)}
                className={`group flex items-center justify-between p-2.5 border-2 border-black cursor-pointer transition-all duration-100
                    shadow-[3px_3px_0_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]
                    ${isActive && isPlaying
                        ? 'bg-yellow-400'
                        : dark ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-white hover:bg-zinc-50'
                    }`}>
                <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 border-2 border-black overflow-hidden">
                            {song.thumbnail
                                ? <img src={song.thumbnail} alt={song.title} loading="lazy" className="w-full h-full object-cover" />
                                : <div className={`w-full h-full flex items-center justify-center ${dark ? 'bg-zinc-700' : 'bg-zinc-200'}`}>
                                    <Music2 size={14} className={dark ? 'text-zinc-500' : 'text-zinc-400'} />
                                </div>
                            }
                        </div>
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            {isActive && isPlaying
                                ? <Pause size={14} className="text-white fill-white" />
                                : <Play size={14} className="text-white fill-white" />
                            }
                        </div>
                    </div>
                    <div className="flex flex-col min-w-0">
                        <h3 className={`font-black text-xs uppercase tracking-tight truncate font-mono
                            ${isActive && isPlaying ? 'text-black' : dark ? 'text-white' : 'text-black'}`}>
                            {song.title}
                        </h3>
                        <p className={`text-[10px] font-mono truncate ${isActive && isPlaying ? 'text-black/60' : 'text-zinc-400'}`}>
                            {song.artist?.username || "Unknown Artist"}
                        </p>
                    </div>
                </div>
                <span className={`text-[10px] font-black flex-shrink-0 ml-2 font-mono
                    ${isActive && isPlaying ? 'text-black' : dark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    #{index + 1}
                </span>
            </div>
        );
    };

    const EmptyState = () => (
        <div className={`flex flex-col items-center justify-center py-15 border-2 border-black border-dashed
            ${dark ? 'bg-zinc-900' : 'bg-zinc-50'}`}>
            <Music2 size={28} className={`mb-2 ${dark ? 'text-zinc-600' : 'text-zinc-400'}`} />
            <h3 className={`text-xs font-black uppercase tracking-widest font-mono ${dark ? 'text-white' : 'text-black'}`}>
                No Recently Played
            </h3>
            <p className={`text-[10px] font-mono mt-1 ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                Songs you play will appear here
            </p>
        </div>
    );

    const Trigger = () => (
        <div
            onClick={() => setOpen(prev => !prev)}
            className={`flex items-center gap-3 p-3 cursor-pointer border-2 border-black transition-all duration-100
                shadow-[4px_4px_0_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]
                ${open
                    ? 'bg-yellow-400'
                    : dark ? 'bg-zinc-800' : 'bg-white'
                }`}
        >
            <div className={`w-9 h-9 border-2 border-black flex items-center justify-center flex-shrink-0
                ${open ? 'bg-black' : dark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                <History size={16} className={open ? 'text-yellow-400' : dark ? 'text-white' : 'text-black'} />
            </div>
            <div>
                <h2 className={`text-xs font-black uppercase tracking-[0.15em] font-mono
                    ${open ? 'text-black' : dark ? 'text-white' : 'text-black'}`}>
                    Recently Played
                </h2>
                <p className={`text-[10px] font-mono ${open ? 'text-black/60' : 'text-zinc-400'}`}>
                    Your latest tracks
                </p>
            </div>
        </div>
    );

    return (
        <>
            {/* ── DESKTOP: dropdown ── */}
            <div className="hidden sm:block" ref={dropdownRef}>
                <Trigger />

                {open && (
                    <div className={`absolute top-full left-0 mt-5 w-full z-50 border-2 border-black shadow-[6px_6px_0_#000] overflow-hidden
                        ${dark ? 'bg-zinc-900' : 'bg-white'}`}>

                        {/* Header */}
                        <div className={`flex items-center justify-between px-4 py-2.5 border-b-2 border-black
                            ${dark ? 'bg-zinc-800' : 'bg-black'}`}>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] font-mono text-white">
                                Recently Played
                            </span>
                            <button
                                onClick={() => setOpen(false)}
                                className="w-6 h-6 border-2 border-white flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
                            >
                                <X size={12} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-3 max-h-80 no-scrollbar overflow-auto space-y-2">
                            {recentlyPlayed?.length > 0
                                ? recentlyPlayed.map((song, index) => (
                                    <SongCard key={song._id} song={song} index={index} />
                                ))
                                : <EmptyState />
                            }
                        </div>
                    </div>
                )}
            </div>

            {/* ── MOBILE: modal ── */}
            <div className="sm:hidden">
                <Trigger />

                {open && (
                    <div
                        className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 p-4"
                        onClick={() => setOpen(false)}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className={`w-full max-w-lg max-h-[90vh] flex flex-col border-2 border-black shadow-[6px_6px_0_#000]
                                ${dark ? 'bg-zinc-900' : 'bg-white'}`}
                        >
                            {/* Modal header */}
                            <div className={`flex items-center justify-between px-5 py-3 border-b-2 border-black flex-shrink-0
                                ${dark ? 'bg-zinc-800' : 'bg-black'}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 border-2 border-white flex items-center justify-center">
                                        <History size={14} className="text-yellow-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-xs font-black uppercase tracking-widest font-mono text-white">
                                            Recently Played
                                        </h2>
                                        <p className="text-[10px] font-mono text-zinc-400">Your latest tracks</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="w-8 h-8 border-2 border-white flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>

                            {/* Modal content */}
                            <div className="overflow-y-auto flex-1 p-4 space-y-2">
                                {recentlyPlayed?.length > 0
                                    ? recentlyPlayed.map((song, index) => (
                                        <SongCard key={song._id} song={song} index={index} />
                                    ))
                                    : <EmptyState />
                                }
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default RecentlyPlayed;