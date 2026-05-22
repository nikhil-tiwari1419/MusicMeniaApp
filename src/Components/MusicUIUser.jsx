import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAudio } from '../Context/AudioContext';
import { Play, Pause } from 'lucide-react';
import { useTheme } from '../Context/Theme';

const API = import.meta.env.VITE_API_URL;

function MusicUIUser() {
    const { theme } = useTheme();
    const dark = theme === 'dark';
    
    const [musics, setMusics] = useState([]);
    const [loading, setLoading] = useState(true);
    const { togglePlay, playingTrack, isPlaying } = useAudio();

    useEffect(() => {
        async function fetchMusic() {
            try {
                // Fetching music directly using existing API pattern
                const res = await axios.get(`${API}/music/get-music?limit=5`, { withCredentials: true });
                if (res.data.musics) setMusics(res.data.musics);
            } catch (err) {
                console.error("Error fetching live content:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchMusic();
    }, []);

    const text = dark ? 'text-white' : 'text-gray-900';
    const sub = dark ? 'text-gray-400' : 'text-gray-500';
    const cardBg = dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
    const hoverBg = dark ? 'hover:bg-gray-700' : 'hover:bg-gray-50';

    return (
        <div className={`border rounded-2xl p-5 ${cardBg}`}>
            <h1 className={`text-lg font-bold mb-4 ${text}`}>Top Music</h1>
            
            {loading ? (
                <p className={`text-sm ${sub}`}>Loading live content...</p>
            ) : musics.length > 0 ? (
                <div className='flex flex-col gap-3'>
                    {musics.map(music => {
                        const isCurrentPlaying = playingTrack?._id === music._id && isPlaying;
                        
                        return (
                            <div key={music._id} className={`flex items-center gap-4 p-2 rounded-xl transition-colors ${hoverBg}`}>
                                <img 
                                    src={music.thumbnail} 
                                    alt={music.title} 
                                    className='w-14 h-14 rounded-lg object-cover shadow-sm' 
                                />
                                <div className='flex-1 min-w-0'>
                                    <p className={`font-semibold text-sm truncate ${text}`}>
                                        {music.title}
                                    </p>
                                    <p className={`text-xs truncate mt-0.5 ${sub}`}>
                                        {music.artist?.username || 'Unknown Artist'}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => togglePlay(music)} 
                                    className={`p-3 rounded-full transition-all 
                                        ${dark ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25' 
                                               : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                                >
                                    {isCurrentPlaying ? <Pause size={16} /> : <Play size={16} />}
                                </button>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <p className={`text-sm ${sub}`}>No music available.</p>
            )}
        </div>
    )
}

export default MusicUIUser;