import React, { useState, useRef } from 'react';
import { trackUserAction } from '../services/ewmaService';

export const TrackCard = ({ id, title, artist, cover }) => {
  const [liked, setLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const playStartTime = useRef(null);

  const handleLike = (e) => {
    e.stopPropagation();
    const nextLikeState = !liked;
    setLiked(nextLikeState);
    trackUserAction(id, nextLikeState ? 'LIKE' : 'UNLIKE');
  };

  const handleTrackClick = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      playStartTime.current = Date.now();
      trackUserAction(id, 'PLAY');
    } else {
      setIsPlaying(false);
      const durationPlayed = (Date.now() - playStartTime.current) / 1000;
      
      if (durationPlayed < 10) {
        trackUserAction(id, 'QUICK_SKIP', { durationInSeconds: durationPlayed.toFixed(1) });
      } else {
        trackUserAction(id, 'FINISHED', { durationInSeconds: durationPlayed.toFixed(1) });
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