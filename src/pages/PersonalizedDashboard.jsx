import React from 'react';
import { MOCK_DASHBOARD_DATA } from '../data/mockData';
import { TrackCard } from '../Components/TrackCard';

export const PersonalizedDashboard = () => {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">MusicMenia Personalized Dashboard</h1>
        <p className="text-zinc-400 text-sm mt-1">Adaptive EWMA Recommendation Engine</p>
      </header>

      {/* 1. Recently Played Section */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-zinc-100">Recently Played</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {MOCK_DASHBOARD_DATA.recentlyPlayed.map((track) => (
            <TrackCard key={track.id} {...track} />
          ))}
        </div>
      </section>

      {/* 2. Continue Listening Section */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-zinc-100">Continue Listening</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {MOCK_DASHBOARD_DATA.continueListening.map((track) => (
            <TrackCard key={track.id} {...track} />
          ))}
        </div>
      </section>

      {/* 3. Recommended Songs Section */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-green-400 flex items-center gap-2">
          ✨ Recommended For You
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {MOCK_DASHBOARD_DATA.recommendedSongs.map((track) => (
            <TrackCard key={track.id} {...track} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default PersonalizedDashboard;