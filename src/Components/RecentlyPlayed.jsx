import { useAudio } from "../Context/AudioContext";

function RecentlyPlayed() {

    const { recentlyPlayed, togglePlay } = useAudio();

    if (recentlyPlayed.length === 0) {
        return null;
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">
                Recently Played
            </h2>

            <div className="flex flex-col gap-3">

                {recentlyPlayed.map((song) => (

                    <div
                        key={song._id}
                        onClick={() => togglePlay(song)}
                        className="flex items-center gap-3 bg-gray-800 p-2 rounded cursor-pointer hover:bg-gray-700"
                    >

                        <img
                            src={song.cover || song.image}
                            alt={song.title}
                            className="w-14 h-14 rounded object-cover"
                        />

                        <div>
                            <h3 className="font-semibold">
                                {song.title || song.name}
                            </h3>

                            <p className="text-sm text-gray-400">
                                {song.artist?.username || "Unknown Artist"}
                            </p>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}

export default RecentlyPlayed;
