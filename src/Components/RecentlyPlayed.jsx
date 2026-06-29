import { useEffect, useState, useRef } from "react";
import { useAudio } from "../Context/AudioContext";
import { useTheme } from "../Context/Theme";
import { History, X, Play, Pause, Music2, Flag } from "lucide-react";

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

    const SongCard = ({ song, index }) => {
        const isActive = playingTrack?._id === song._id;

        const handlePlay = (e) => {
            e.stopPropagation();
            e.preventDefault();
            // console.log("handlePlay called")
            togglePlay(song, recentlyPlayed);
            setTimeout(() => setOpen(false), 150);  // 150ms 
        }
        return (
            <div
                onClick={handlePlay}
                className={`group flex rounded-xl items-center justify-between p-2.5 border-2 border-black cursor-pointer transition-all duration-100
                    shadow-[3px_3px]
                    ${isActive && isPlaying
                        ? 'bg-yellow-400'
                        : dark ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-white hover:bg-zinc-50'
                    }`}>
                <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 border-2 border-black overflow-hidden rounded">
                            {song.thumbnail
                                ? <img src={song.thumbnail} alt={song.title} loading="lazy" className="w-full h-full object-cover" />
                                : <div className={`w-full h-full flex items-center justify-center ${dark ? 'bg-zinc-700' : 'bg-zinc-200'}`}>
                                    <Music2 size={14} className={dark ? 'text-zinc-500' : 'text-zinc-400'} />
                                </div>
                            }
                        </div>
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 ">
                            {isActive && isPlaying
                                ? <Pause size={14} className="text-white fill-white" />
                                : <Play size={14} className="text-white fill-white" />
                            }
                        </div>
                    </div>
                    <div className="flex flex-col min-w-0">
                        <h3 className={`font-black text-xs tracking-tight truncate font-semibold
                            ${isActive && isPlaying ? 'text-black' : dark ? 'text-white' : 'text-black'}`}>
                            {song.title}
                        </h3>
                        <p className={`text-[10px] font-semibold truncate ${isActive && isPlaying ? 'text-black/60' : 'text-zinc-400'}`}>
                            {song.artist?.username || "Unknown Artist"}
                        </p>
                    </div>
                </div>
                <span className={`text-sm font-black flex-shrink-0 ml-2 font-semibold
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
            <h3 className={`text-xs font-black uppercase tracking-widest font-semibold ${dark ? 'text-white' : 'text-black'}`}>
                No Recently Played
            </h3>
            <p className={`text-[10px] font-semibold mt-1 ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                Songs you play will appear here
            </p>
        </div>
    );

    const Trigger = () => (
        <div
            onClick={() => setOpen(prev => !prev)}
            className={`flex rounded items-center gap-3 p-3 cursor-pointer border-2 border-black transition-all duration-100
                ${open
                    ? 'bg-yellow-400'
                    : dark ? 'bg-zinc-800' : 'bg-white'
                }`}
        >
            <div className={`w-9 rounded h-9 border-2 border-black flex items-center justify-center flex-shrink-0
                ${open ? 'bg-black' : dark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                <History size={25}  className={open ? 'text-yellow-400' : dark ? 'text-white' : 'text-black'} />
            </div>
            <div>
                <h2 className={`text-sm font-black uppercase tracking-wide font-semibold
                    ${open ? 'text-black' : dark ? 'text-white' : 'text-black'}`}>
                    Recently Played
                </h2>
                <p className={`text-sm font-semibold ${open ? 'text-black/60' : 'text-zinc-400'}`}>
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
                    <div className={`absolute rounded top-full left-0 mt-5 w-full z-50 border-2  shadow-[6px_6px] overflow-hidden
                        ${dark ? 'bg-zinc-900' : 'bg-white border-black'}`}>

                        {/* Header */}
                        <div className={`flex items-center justify-between px-4 py-2.5 border-b-2 border-black
                            ${dark ? 'bg-zinc-800' : 'bg-black'}`}>
                            <span className="text-xl font-black uppercase tracking-[0.2em] font-semibold text-white">
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
    <>
        {/* Backdrop */}
        <div
            className="fixed inset-0 z-[99] bg-black/80"
            onClick={() => setOpen(false)}
        />

        {/* Modal — fixed bottom */}
        <div
            className={`fixed rounded-xl bottom-4 left-4 right-4 z-[100] max-h-[90vh] flex flex-col 
                border-2
                ${dark ? 'bg-blue-900' : 'bg-gray-500'}`}
        >
            {/* Modal header */}
            <div className={`flex rounded-xl items-center justify-between px-5 py-3 border-b-2 border-black flex-shrink-0
                ${dark ? 'bg-zinc-800' : 'bg-blue-700'}`}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border-2 rounded border-white flex items-center justify-center">
                        <History strokeWidth={3.5} size={25} className="text-yellow-400" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-widest font-mono text-white">
                            Recently Played
                        </h2>
                        <p className="text-sm font-mono text-zinc-400">Your latest tracks</p>
                    </div>
                </div>
                <button
                    onClick={() => setOpen(false)}
                    className="w-10 h-10 border-2 rounded-2xl border-white flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
                >
                    <X size={26} strokeWidth={3.75} />
                </button>
            </div>

            {/* <X strokeWidth={2.75} /> */}

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
    </>
)}
            </div>
        </>
    );
}

export default RecentlyPlayed;

