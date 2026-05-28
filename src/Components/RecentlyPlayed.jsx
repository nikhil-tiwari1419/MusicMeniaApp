import { useState } from "react";
import { useAudio } from "../Context/AudioContext";
import { useTheme } from "../Context/Theme";

import {
    History,
    ChevronDown,
    ChevronUp,
    Play,
    Pause,
    Music2,
} from "lucide-react";

function RecentlyPlayed() {
    const { recentlyPlayed, togglePlay, playingTrack, isPlaying } = useAudio();
    const [openRecent, setOpenRecent] = useState(true);

    const { theme } = useTheme();
    const dark = theme === "dark";

    const SongCard = ({ song, index }) => (
        <div
            onClick={() => togglePlay(song, recentlyPlayed)}
            className={`group flex items-center justify-between p-1 rounded transition-all duration-300 cursor-pointer border
      ${dark
                    ? "bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                }`}
        >
            <div className="flex items-center gap-4">
                {/* Thumbnail */}
                <div className="relative">
                    <img
                        src={song.thumbnail}
                        alt={song.title}
                        loading="lazy"
                        className="w-10 h-10 rounded-xl object-cover"
                    />

                    <div
                        className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center 
            opacity-0 group-hover:opacity-100 "
                    >
                        {playingTrack?._id === song._id && isPlaying ? (
                            <Pause size={20} className="text-white fill-white" />
                        ) : (
                            <Play size={20} className="text-white fill-white" />
                        )}
                    </div>
                </div>

                {/* Song Info */}
                <div className="flex flex-col">
                    <h3
                        className={`font-semibold text-sm line-clamp-1 ${dark ? "text-white" : "text-black"
                            }`}
                    >
                        {song.title}
                    </h3>

                    <p className="text-sm text-gray-400 line-clamp-1">
                        {song.artist?.username || "Unknown Artist"}
                    </p>
                </div>
            </div>

            {/* Index */}
            <div
                className={`text-sm font-medium ${dark ? "text-zinc-500" : "text-gray-400"
                    }`}
            >
                #{index + 1}
            </div>
        </div>
    );

    return (
        <div
            className={`w-full rounded p-2 shadow-lg border transition-all duration-300
      ${dark
                    ? "bg-gradient-to-b from-zinc-950 to-black border-zinc-800"
                    : "bg-gradient-to-b from-white to-gray-100 border-gray-200"
                }`}
        >
            {/* Header */}
            <div
                onClick={() => setOpenRecent(!openRecent)}
                className="flex items-center justify-between cursor-pointer mb-1"
            >
                <div className="flex items-center gap-3">
                    <div
                        className={`p-2 rounded-xl ${dark ? "bg-zinc-800" : "bg-gray-200"
                            }`}
                    >
                        <History
                            size={20}
                            className={dark ? "text-white" : "text-black"}
                        />
                    </div>

                    <div>
                        <h2
                            className={`text-xs font-semibold uppercase tracking-widest ${dark ? "text-white" : "text-black"
                                }`}
                        >
                            Recently Played
                        </h2>

                        <p className="text-sm text-gray-400">
                            Your latest listened tracks
                        </p>
                    </div>
                </div>

                <div
                    className={`p-2 rounded-full transition ${dark ? "bg-zinc-800" : "bg-gray-200"
                        }`}
                >
                    {openRecent ? (
                        <ChevronUp className={dark ? "text-white" : "text-black"} />
                    ) : (
                        <ChevronDown className={dark ? "text-white" : "text-black"} />
                    )}
                </div>
            </div>

            {/* Content */}
            {openRecent && (
                <>
                    {recentlyPlayed?.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {recentlyPlayed.map((song, index) => (
                                <SongCard key={song._id} song={song} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div
                            className={`flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed
              ${dark
                                    ? "border-zinc-700 bg-zinc-900"
                                    : "border-gray-300 bg-gray-50"
                                }`}
                        >
                            <Music2 size={45} className="text-gray-400 mb-4" />

                            <h3
                                className={`text-lg font-semibold ${dark ? "text-white" : "text-black"
                                    }`}
                            >
                                No Recently Played Songs
                            </h3>

                            <p className="text-sm text-gray-400 mt-1">
                                Songs you play will appear here
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default RecentlyPlayed;
