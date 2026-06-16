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

    // Mobile: lock scroll when modal open
    useEffect(() => {
        const isMobile = window.innerWidth < 640;
        if (open && isMobile) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    // Desktop: click outside closes dropdown
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
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

    const SongCard = ({ song, index }) => (
        <div
            onClick={() => togglePlay(song, recentlyPlayed)}
            className={`group flex items-center justify-between p-2 rounded-xl transition-all duration-200 cursor-pointer border
                ${dark
                    ? "bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                }`}
        >
            <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                    <img
                        src={song.thumbnail}
                        alt={song.title}
                        loading="lazy"
                        className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {playingTrack?._id === song._id && isPlaying
                            ? <Pause size={16} className="text-white fill-white" />
                            : <Play size={16} className="text-white fill-white" />
                        }
                    </div>
                </div>
                <div className="flex flex-col min-w-0">
                    <h3 className={`font-semibold text-sm truncate ${dark ? "text-white" : "text-black"}`}>
                        {song.title}
                    </h3>
                    <p className="text-xs text-gray-400 truncate">
                        {song.artist?.username || "Unknown Artist"}
                    </p>
                </div>
            </div>
            <span className={`text-xs font-medium flex-shrink-0 ml-2 ${dark ? "text-zinc-500" : "text-gray-400"}`}>
                #{index + 1}
            </span>
        </div>
    );

    const EmptyState = () => (
        <div className={`flex flex-col items-center justify-center py-12 rounded-xl border border-dashed
            ${dark ? "border-zinc-700 bg-zinc-900/50" : "border-gray-200 bg-gray-50"}`}>
            <Music2 size={32} className="text-gray-400 mb-2" />
            <h3 className={`text-sm font-semibold ${dark ? "text-white" : "text-black"}`}>
                No Recently Played
            </h3>
            <p className="text-xs text-gray-400 mt-1">Songs you play will appear here</p>
        </div>
    );

    // Shared trigger button
    const Trigger = () => (
        <div
            onClick={() => setOpen(prev => !prev)}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all duration-200
                ${dark
                    ? "bg-gray-900 border-gray-800 hover:bg-gray-800"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
        >
            <div className={`p-2 rounded-lg ${dark ? "bg-gray-800" : "bg-gray-100"}`}>
                <History size={18} className={dark ? "text-white" : "text-black"} />
            </div>
            <div>
                <h2 className={`text-xs font-semibold uppercase tracking-widest ${dark ? "text-white" : "text-black"}`}>
                    Recently Played
                </h2>
                <p className="text-xs text-gray-400">Your latest tracks</p>
            </div>
        </div>
    );

    return (
        <>
            {/* ── DESKTOP: dropdown ── */}
            <div className="hidden sm:block relative" ref={dropdownRef}>
                <Trigger />

                {open && (
                    <div className={`absolute top-full left-0 mt-2 w-full z-50 rounded-2xl border shadow-2xl overflow-hidden
                        ${dark
                            ? "bg-gray-900 border-gray-800"
                            : "bg-white border-gray-200"
                        }`}
                    >
                        {/* Dropdown header */}
                        <div className={`flex items-center justify-between px-4 py-3 border-b
                            ${dark ? "border-gray-800" : "border-gray-100"}`}>
                            <span className={`text-xs font-semibold uppercase tracking-widest
                                ${dark ? "text-gray-400" : "text-gray-500"}`}>
                                Recently Played
                            </span>
                            <button
                                onClick={() => setOpen(false)}
                                className={`p-1.5 rounded-lg 
                                    ${dark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
                            >
                                <X size={14} />
                            </button>
                        </div>

                        {/* Dropdown content */}
                        <div className="p-3 h-90 no-scrollbar overflow-auto space-y-2">
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
                        className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 backdrop-blur-md p-4"
                        onClick={() => setOpen(false)}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className={`w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl border shadow-2xl
                                ${dark
                                    ? "bg-gray-900 border-gray-800"
                                    : "bg-white border-gray-200"
                                }`}
                        >
                            {/* Modal header */}
                            <div className={`flex items-center justify-between px-5 py-4 border-b flex-shrink-0
                                ${dark ? "border-gray-800" : "border-gray-100"}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${dark ? "bg-gray-800" : "bg-gray-100"}`}>
                                        <History size={16} className={dark ? "text-white" : "text-black"} />
                                    </div>
                                    <div>
                                        <h2 className={`text-sm font-semibold ${dark ? "text-white" : "text-black"}`}>
                                            Recently Played
                                        </h2>
                                        <p className="text-xs text-gray-400">Your latest listened tracks</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setOpen(false)}
                                    className={`p-2 rounded-lg transition
                                        ${dark ? "bg-gray-800 hover:bg-gray-700 text-white" : "bg-gray-100 hover:bg-gray-200 text-black"}`}
                                >
                                    <X size={16} />
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