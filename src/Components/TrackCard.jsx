import React, { useState, useRef } from 'react';

export const TrackCard = ({ id, title, artist, cover }) => {
  const [liked, setLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const playStartTime = useRef(null);

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);
    console.log(`[EWMA Signal] Track ID: ${id} | Action: ${!liked ? 'LIKE (+3)' : 'UNLIKE'}`);
  };

  const handleTrackClick = () => {
    if (!isPlaying) {
      // Song play shuru hua
      setIsPlaying(true);
      playStartTime.current = Date.now();
      console.log(`[EWMA Signal] Track ID: ${id} | Action: SONG PLAY (+1)`);
    } else {
      // Song stop ya skip hua
      setIsPlaying(false);
      const durationPlayed = (Date.now() - playStartTime.current) / 1000; // seconds mein
      
      if (durationPlayed < 10) {
        console.log(`[EWMA Signal] Track ID: ${id} | Action: SKIP QUICKLY (-1) | Played for: ${durationPlayed.toFixed(1)}s`);
      } else {
        console.log(`[EWMA Signal] Track ID: ${id} | Action: Finished listening | Played for: ${durationPlayed.toFixed(1)}s`);
      }
    }
  };

  return (
    <div 
      onClick={handleTrackClick}
      className="w-40 bg-zinc-900 p-3 rounded-lg hover:bg-zinc-800 transition-all duration-300 cursor-pointer shadow-md flex-shrink-0 group"
    >
      <div className="relative mb-2">
        <img src={cover} alt={title} className="w-full h-36 object-cover rounded-md shadow" />
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity rounded-md ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <span className="text-white text-2xl">{isPlaying ? '⏸️' : '▶️'}</span>
        </div>
      </div>
      <h4 className="font-medium text-white truncate text-sm">{title}</h4>
      <p className="text-xs text-zinc-400 truncate mb-2">{artist}</p>
      
      <button onClick={handleLike} className="text-base transform hover:scale-125 transition-transform">
        {liked ? '❤️' : '🤍'}
      </button>
    </div>
  );
};