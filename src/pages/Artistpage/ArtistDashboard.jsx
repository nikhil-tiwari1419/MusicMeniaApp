import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/useAuth";
import { useTheme } from "../../Context/Theme";
import {
  Radio, Plus, Mic2, ListMusic, TrendingUp,
  Eye, Music2, BarChart2, ArrowUpRight
} from "lucide-react";

const quickActions = [
  { label: "Upload Track", icon: Plus, path: "/create-music" },
  { label: "Music Feed", icon: Radio, path: "/Local-Feed" },
  { label: "My Album", icon: ListMusic, path: "/album" },
  { label: "My Posts", icon: Mic2, path: "/your-post" },
];

const weekData = [
  { day: "Mon", views: 45, plays: 20 },
  { day: "Tue", views: 80, plays: 55 },
  { day: "Wed", views: 60, plays: 40 },
  { day: "Thu", views: 120, plays: 90 },
  { day: "Fri", views: 95, plays: 70 },
  { day: "Sat", views: 160, plays: 130 },
  { day: "Sun", views: 200, plays: 175 },
];

const stats = [
  { label: "Total Views", value: "2.4K", change: "+12%", icon: Eye },
  { label: "Total Plays", value: "1.1K", change: "+8%", icon: Music2 },
  { label: "Tracks", value: "14", change: "+2", icon: ListMusic },
  { label: "Trending", value: "#3", change: "↑4", icon: TrendingUp },
];

export default function ArtistDashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const navigate = useNavigate();

  const maxViews = Math.max(...weekData.map(d => d.views));

  const bg = dark ? "bg-zinc-950 text-white" : "bg-white text-black";
  const card = `border-2  rounded-xl ${dark ? "bg-zinc-900 border-gray-500" : "bg-white border-black"}`;
  const sub = dark ? "text-zinc-400" : "text-zinc-500";
  const btn = `border-2 border-black rounded-xl hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-100`;

  return (
    <div className={`min-h-screen ${bg}`}>
    
      <div className="pt-5 px-4 sm:px-6 max-w-6xl mx-auto pb-16">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8 mt-2">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-8 bg-blue-400 border-2 border-black" />
              <h1 className="text-xl sm:text-2xl uppercase tracking-tight font-semibold">
                Hey, {user?.username || "Musician"}
              </h1>
            </div>
            <p className={`text-xl font-semibold ml-5 ${sub}`}>Here's what's happening with your music</p>
          </div>
          <button
            onClick={() => navigate("/create-music")}
            className={`flex items-center gap-2 bg-blue-400 text-black px-4 py-2.5 text-sm uppercase tracking-widest font-semibold ${btn}`}
          >
            <Plus size={15} /> Upload
          </button>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {stats.map(({ label, value, change, icon: Icon }, i) => (
            <div key={label} className={`${card} p-4`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center
                  ${dark ? "bg-violet-800" : "bg-blue-100"}`}>
                  <Icon size={24} className={dark ? "text-zinc-300" : "text-black"} />
                </div>
                <span className="text-xs font-semibold rounded-xl bg-green-600 border border-black px-1.5 py-0.5">
                  {change}
                </span>
              </div>
              <p className="text-2xl font-semibold">{value}</p>
              <p className={`text-xs mt-0.5 font-semibold uppercase tracking-wider ${sub}`}>{label}</p>
            </div>
          ))}
        </div>

        {/* ── Chart + Actions ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

          {/* Chart */}
          <div className={`lg:col-span-2 ${card} p-5`}>
            <div className="flex items-center justify-between mb-5 pb-3 border-b-2 border-black">
              <div>
                <h2 className="text-sm uppercase tracking-widest font-semibold">Weekly Overview</h2>
                <p className={`text-xs mt-0.5 font-semibold ${sub}`}>Views vs Plays this week</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold ">
               <button 
               onClick={()=>navigate('/stats') }
               className={` border-2 tracking-wider p-3 rounded-xl border-fuchsia-600 bg-fuchsia-300 `}>
                View Full Stats
               </button>
              </div>
            </div>

            {/* Bar chart — brutalist: square bars, black borders */}
            <div className="flex items-end gap-2 h-40">
              {weekData.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end gap-[2px] h-32">
                    <div
                      className={`flex-1 border-2 border-black transition-all ${dark ? "bg-zinc-600" : "bg-zinc-300"}`}
                      style={{ height: `${(d.views / maxViews) * 100}%` }}
                      title={`Views: ${d.views}`}
                    />
                    <div
                      className="flex-1 border-2 border-black bg-blue-400 transition-all"
                      style={{ height: `${(d.plays / maxViews) * 100}%` }}
                      title={`Plays: ${d.plays}`}
                    />
                  </div>
                  <span className={`text-[10px] font-semibold uppercase ${sub}`}>{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className={`${card} p-5`}>
            <div className="pb-3 mb-4 border-b-2 border-black">
              <h2 className="text-sm uppercase tracking-widest font-semibold">Quick Actions</h2>
              <p className={`text-xs mt-0.5 font-semibold ${sub}`}>Jump to what you need</p>
            </div>

            <div className="space-y-2.5">
              {quickActions.map(({ label, icon: Icon, path }) => (
                <button
                  key={label}
                  onClick={() => navigate(path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm uppercase tracking-wide font-semibold
                    border-2 border-blue-400 ${btn}
                    ${dark ? "bg-zinc-800 text-white hover:bg-zinc-700" : "bg-white text-black hover:bg-zinc-50"}`}
                >
                  <Icon size={20} />
                  {label}
                  <ArrowUpRight size={18} className="ml-auto" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── User Card ── */}
        {/* <div className={`${card} p-3 flex items-center gap-4`}>
          <div className="w-11 h-11 border rounded-xl border-black bg-blue-400 flex items-center justify-center text-black font-black text-sm flex-shrink-0">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm uppercase tracking-tight font-semibold truncate">{user?.username}</p>
            <p className={`text-xs font-semibold truncate ${sub}`}>{user?.email}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`text-xs px-2.5 py-1 border-2 border-black uppercase tracking-wider font-semibold
              ${user?.role === "artist" ? "bg-green-400 rounded text-black" : "bg-zinc-200 text-black"}`}>
              {user?.role || "user"}
            </span>
            <button
              onClick={() => navigate("/profile")}
              className={`text-xs px-3 py-1.5 uppercase tracking-wider font-semibold ${btn}
                border-2 border-black ${dark ? "bg-zinc-800 text-white" : "bg-white text-black"}`}>
              Profile ↗
            </button>
          </div>
        </div> */}

      </div>
    </div>
  );
}
