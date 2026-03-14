import React,{ useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/Auth";
import { useTheme } from "../Context/Theme";
import Navbar from "../Components/Navbar";
import {
  Music2, Radio, TrendingUp, Play, Heart,
  Plus, BarChart2, Headphones, Mic2, ListMusic,
  ArrowUpRight, Clock, Star
} from "lucide-react";

// ─── Static Data ───────────────────────────────────────────
const stats = [
  { label: "Total Tracks", value: "1,284", change: "+12%", icon: Music2,    color: "text-blue-400",   bg: "bg-blue-500/10"   },
  { label: "Listeners",    value: "48.2K", change: "+8%",  icon: Headphones, color: "text-emerald-400", bg: "bg-emerald-500/10"},
  { label: "Artists",      value: "320",   change: "+5%",  icon: Mic2,       color: "text-orange-400", bg: "bg-orange-500/10" },
  { label: "Playlists",    value: "892",   change: "+19%", icon: ListMusic,  color: "text-pink-400",   bg: "bg-pink-500/10"   },
];

const recentTracks = [
  { id: 1, title: "Midnight Groove", artist: "DJ Nikhil",  plays: "12.4K", duration: "3:42", liked: true  },
  { id: 2, title: "Neon Dreams",     artist: "SynthWave",  plays: "9.1K",  duration: "4:15", liked: false },
  { id: 3, title: "Bass Drop 99",    artist: "BeatMaker",  plays: "7.8K",  duration: "2:58", liked: true  },
  { id: 4, title: "Soul Revival",    artist: "JazzCat",    plays: "6.2K",  duration: "5:01", liked: false },
  { id: 5, title: "Urban Echoes",    artist: "LoFi King",  plays: "5.5K",  duration: "3:30", liked: true  },
];

const topArtists = [
  { name: "DJ Nikhil", genre: "Electronic", tracks: 24, followers: "12K" },
  { name: "SynthWave", genre: "Synthpop",   tracks: 18, followers: "9K"  },
  { name: "JazzCat",   genre: "Jazz",       tracks: 31, followers: "7K"  },
  { name: "BeatMaker", genre: "Hip-Hop",    tracks: 15, followers: "5K"  },
];

const quickActions = [
  { label: "Upload Track", icon: Plus,      path: "/create-music", color: "bg-blue-500 hover:bg-blue-600"     },
  { label: "Local Feed",   icon: Radio,     path: "/Local-Feed",   color: "bg-emerald-500 hover:bg-emerald-600"},
  { label: "My Album",     icon: ListMusic, path: "/album",        color: "bg-orange-500 hover:bg-orange-600" },
  { label: "My Posts",     icon: Mic2,      path: "/your-post",    color: "bg-pink-500 hover:bg-pink-600"     },
];

const chartBars   = [40, 65, 50, 80, 60, 90, 75, 55, 85, 70, 95, 60];
const chartLabels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const avatarColors = ["#3b82f6","#10b981","#f97316","#ec4899"];

// ─── Sub Components (Fragments use kiye hain) ──────────────

// Stats Card
function StatCard({ stat, card, sub }) {
  return (
    // ✅ Fragment — extra div nahi
    <>
      <div className={`border rounded-2xl p-5 ${card}`}>
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2 rounded-xl ${stat.bg}`}>
            <stat.icon size={18} className={stat.color} />
          </div>
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-0.5">
            <ArrowUpRight size={12} />{stat.change}
          </span>
        </div>
        <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
        <p className={`text-xs mt-0.5 ${sub}`}>{stat.label}</p>
      </div>
    </>
  );
}

// Single Track Row
function TrackRow({ track, index, playingId, setPlayingId, likedTracks, toggleLike, dark, sub, hover }) {
  const isPlaying = playingId === track.id;
  return (
    // ✅ Fragment — li wrapper ki zarurat nahi
    <>
      <div
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${hover} group cursor-pointer`}
        onClick={() => setPlayingId(isPlaying ? null : track.id)}
      >
        {/* Number / Playing animation */}
        <div className="w-6 text-center flex-shrink-0">
          {isPlaying ? (
            <div className="flex items-center justify-center gap-0.5">
              {[1, 2, 3].map(b => (
                <div
                  key={b}
                  className="w-0.5 bg-blue-400 rounded-full animate-bounce"
                  style={{ height: `${8 + b * 3}px`, animationDelay: `${b * 0.1}s` }}
                />
              ))}
            </div>
          ) : (
            <>
              <span className={`text-xs ${sub} group-hover:hidden`}>{index + 1}</span>
              <Play size={13} className="text-blue-400 hidden group-hover:block mx-auto" />
            </>
          )}
        </div>

        {/* Music icon */}
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${dark ? "bg-gray-800" : "bg-gray-100"}`}>
          <Music2 size={13} className="text-blue-400" />
        </div>

        {/* Title + Artist */}
        <div className="flex-1 overflow-hidden">
          <p className={`text-sm font-semibold truncate ${isPlaying ? "text-blue-400" : ""}`}>
            {track.title}
          </p>
          <p className={`text-xs truncate ${sub}`}>{track.artist}</p>
        </div>

        {/* Plays */}
        <div className={`items-center gap-1 text-xs ${sub} hidden sm:flex`}>
          <TrendingUp size={11} />{track.plays}
        </div>

        {/* Duration */}
        <div className={`items-center gap-1 text-xs ${sub} hidden sm:flex`}>
          <Clock size={11} />{track.duration}
        </div>

        {/* Like button */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleLike(track.id); }}
          className="p-1.5 rounded-lg transition-colors cursor-pointer bg-transparent border-none"
        >
          <Heart
            size={14}
            className={likedTracks.includes(track.id) ? "fill-red-500 text-red-500" : sub}
          />
        </button>
      </div>
    </>
  );
}

// Artist Row
function ArtistRow({ artist, index, hover, sub }) {
  return (
    // ✅ Fragment
    <>
      <div className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${hover} cursor-pointer`}>
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ background: avatarColors[index] }}
        >
          {artist.name.charAt(0)}
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-semibold truncate">{artist.name}</p>
          <p className={`text-xs ${sub}`}>{artist.genre}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs font-bold text-blue-400">{artist.followers}</p>
          <p className={`text-xs ${sub}`}>{artist.tracks} tracks</p>
        </div>
      </div>
    </>
  );
}

// ─── Main Dashboard ────────────────────────────────────────
export default function Dashboard() {
  const { user }    = useAuth();
  const { theme }   = useTheme();
  const dark        = theme === "dark";
  const navigate    = useNavigate();

  const [playingId, setPlayingId] = useState(null);
  const [likedTracks, setLikedTracks] = useState(
    recentTracks.filter(t => t.liked).map(t => t.id)
  );

  function toggleLike(id) {
    setLikedTracks(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  // Theme-based class strings
  const base  = dark ? "bg-gray-950 text-white"    : "bg-gray-50 text-gray-900";
  const card  = dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const sub   = dark ? "text-gray-400"             : "text-gray-500";
  const hover = dark ? "hover:bg-gray-800"         : "hover:bg-gray-50";

  // Shared props — ek baar banao, sab components ko bhejo
  const themeProps = { dark, sub, hover, card };

  return (
    // ✅ Outermost Fragment — html mein koi extra wrapper nahi
    <>
      <div className={`min-h-screen ${base} `}>
        <Navbar />

        <div className="pt-20 px-4 sm:px-8 md:px-12 lg:px-16 pb-12 max-w-7xl mx-auto">

          {/* ── Page Header ── */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* ✅ Fragment — sirf 2 elements, no wrapper div needed */}
            <>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Hey, {user?.username || "Musician"} 👋
                </h1>
                <p className={`text-sm mt-1 ${sub}`}>
                  Welcome back to your MusicMenia dashboard
                </p>
              </div>
              <button
                onClick={() => navigate("/create-music")}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-colors self-start sm:self-auto cursor-pointer"
              >
                <Plus size={16} /> Upload Track
              </button>
            </>
          </div>

          {/* ── Stats Grid ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map(stat => (
              // ✅ Fragment with key — list rendering
              <StatCard key={stat.label} stat={stat} card={card} sub={sub} />
            ))}
          </div>

          {/* ── Middle Section ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

            {/* Bar Chart */}
            <div className={`lg:col-span-2 border rounded-2xl p-6 ${card}`}>
              {/* ✅ Fragment — header ke 2 elements */}
              <>
                <div className="flex items-center justify-between mb-6">
                  <>
                    <div>
                      <h2 className="font-bold text-base">Play Analytics</h2>
                      <p className={`text-xs ${sub}`}>Monthly streams this year</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BarChart2 size={16} className="text-blue-400" />
                      <span className="text-xs text-blue-400 font-semibold">2024</span>
                    </div>
                  </>
                </div>

                <div className="flex items-end gap-2 h-36">
                  {chartBars.map((h, i) => (
                    // ✅ Fragment with key in list
                    <Fragment key={i}>
                      <div className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full rounded-t-md bg-blue-500/30 hover:bg-blue-500 transition-colors cursor-pointer relative group"
                          style={{ height: `${h}%` }}
                        >
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {h}K
                          </span>
                        </div>
                        <span className={`text-xs ${sub} hidden sm:block`}>{chartLabels[i]}</span>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </>
            </div>

            {/* Quick Actions + User Card */}
            <div className={`border rounded-2xl p-6 ${card}`}>
              <>
                <h2 className="font-bold text-base mb-1">Quick Actions</h2>
                <p className={`text-xs ${sub} mb-5`}>Jump to what you need</p>

                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map(action => (
                    <button
                      key={action.label}
                      onClick={() => navigate(action.path)}
                      className={`${action.color} text-white rounded-xl p-4 flex flex-col items-start gap-2 transition-colors cursor-pointer`}
                    >
                      {/* ✅ Fragment — icon + label, no wrapper */}
                      <>
                        <action.icon size={18} />
                        <span className="text-xs font-bold leading-tight">{action.label}</span>
                      </>
                    </button>
                  ))}
                </div>

                {/* Mini User Card */}
                <div className={`mt-5 p-3 rounded-xl border flex items-center gap-3 ${dark ? "border-gray-700 bg-gray-800/50" : "border-gray-100 bg-gray-50"}`}>
                  <>
                    <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {user?.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold truncate">{user?.username}</p>
                      <p className={`text-xs truncate ${sub}`}>{user?.email}</p>
                    </div>
                    <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0
                      ${user?.role === "artist" ? "bg-orange-500/20 text-orange-400" : "bg-blue-500/20 text-blue-400"}`}>
                      {user?.role || "user"}
                    </span>
                  </>
                </div>
              </>
            </div>
          </div>

          {/* ── Bottom Section ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Recent Tracks */}
            <div className={`lg:col-span-2 border rounded-2xl p-6 ${card}`}>
              <>
                <div className="flex items-center justify-between mb-5">
                  <>
                    <div>
                      <h2 className="font-bold text-base">Recent Tracks</h2>
                      <p className={`text-xs ${sub}`}>Top performing songs</p>
                    </div>
                    <button
                      onClick={() => navigate("/Local-Feed")}
                      className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors bg-transparent border-none cursor-pointer"
                    >
                      View all <ArrowUpRight size={12} />
                    </button>
                  </>
                </div>

                <div className="flex flex-col gap-1">
                  {recentTracks.map((track, i) => (
                    <TrackRow
                      key={track.id}
                      track={track}
                      index={i}
                      playingId={playingId}
                      setPlayingId={setPlayingId}
                      likedTracks={likedTracks}
                      toggleLike={toggleLike}
                      {...themeProps}
                    />
                  ))}
                </div>
              </>
            </div>

            {/* Top Artists */}
            <div className={`border rounded-2xl p-6 ${card}`}>
              <>
                <div className="flex items-center justify-between mb-5">
                  <>
                    <div>
                      <h2 className="font-bold text-base">Top Artists</h2>
                      <p className={`text-xs ${sub}`}>Most followed this month</p>
                    </div>
                    <Star size={15} className="text-yellow-400" />
                  </>
                </div>

                <div className="flex flex-col gap-2">
                  {topArtists.map((artist, i) => (
                    <ArtistRow
                      key={artist.name}
                      artist={artist}
                      index={i}
                      hover={hover}
                      sub={sub}
                    />
                  ))}
                </div>

                {/* Now Playing */}
                <div className={`mt-5 p-3 rounded-xl border ${dark ? "border-gray-700 bg-gray-800/40" : "border-gray-100 bg-blue-50"}`}>
                  <>
                    <p className={`text-xs font-semibold mb-2 flex items-center gap-1.5 ${sub}`}>
                      <Radio size={11} /> NOW PLAYING
                    </p>
                    <p className="text-sm font-bold">Midnight Groove</p>
                    <p className={`text-xs ${sub} mb-3`}>DJ Nikhil</p>
                    <div className={`h-1 rounded-full ${dark ? "bg-gray-700" : "bg-gray-200"}`}>
                      <div className="h-full w-2/3 bg-blue-500 rounded-full" />
                    </div>
                    <div className={`flex justify-between text-xs mt-1 ${sub}`}>
                      <span>2:28</span>
                      <span>3:42</span>
                    </div>
                  </>
                </div>
              </>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}