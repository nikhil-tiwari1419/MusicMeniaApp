import React, { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/Auth";
import { useTheme } from "../Context/Theme";
import Navbar from "../Components/Navbar";
import { Radio, Plus, Mic2, ListMusic, FileHeadphone } from "lucide-react";

const quickActions = [
  { label: "Upload Track", icon: Plus, path: "/create-music", color: "bg-blue-500 hover:bg-blue-600" },
  { label: "Music Feed", icon: Radio, path: "/Local-Feed", color: "bg-emerald-500 hover:bg-emerald-600" },
  { label: "My Album", icon: ListMusic, path: "/album", color: "bg-orange-500 hover:bg-orange-600" },
  { label: "My Posts", icon: Mic2, path: "/your-post", color: "bg-pink-500 hover:bg-pink-600" },
];

const songlist = [
  { label: "Music..-A", icon: <FileHeadphone />, day: "Mon" },
  { label: "Music..-B", icon: <FileHeadphone />, day: "Tue" },
  { label: "Music..-C", icon: <FileHeadphone />, day: "Wed" },
  { label: "Music..-D", icon: <FileHeadphone />, day: "Thu" },
  { label: "Music..-E", icon: <FileHeadphone />, day: "Fri" },
  { label: "Music..-F", icon: <FileHeadphone />, day: "Sat" },
  { label: "Music..-G", icon: <FileHeadphone />, day: "Sun" },
]

const Views = [
  { viewers: 20 },
  { viewers: 40 },
  { viewers: 60 },
  { viewers: 80 },
  { viewers: 100 },
  { viewers: 200 },
]

// ─── Main Dashboard ────────────────────────────────────────
export default function AdminDashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const navigate = useNavigate();


  // Theme-based class strings
  const base = dark ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900";
  const card = dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const sub = dark ? "text-gray-400" : "text-gray-500";
  const hover = dark ? "hover:bg-gray-800" : "hover:bg-gray-50";

  // Shared props — ek baar banao, sab components ko bhejo
  const themeProps = { dark, sub, hover, card };

  return (
    <>
      <div className={`min-h-screen ${base} `}>
        <Navbar />

        <div className="pt-20 px-4 sm:px-8 md:px-12 lg:px-16 pb-12 max-w-7xl mx-auto">

          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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

          {/* ── Middle Section ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

            {/* Views card */}
            <div
              className={`lg:col-span-2 w-full overflow-x-auto no-scrollbar flex gap-8 rounded-2xl p-4 ${card}`}
            >
              {/* Left axis */}
              <div className="h-[300px] flex flex-col justify-between shrink-0 text-xs font-semibold">
                <h2 className="text-sm font-bold">Views</h2>
                {Views.map((itm) => (
                  <span key={itm.viewers}>{itm.viewers}</span>
                ))}
              </div>

              {/* Graph area */}
              <div className="flex items-end gap-8 h-[300px] w-full">
                {songlist.map((itm) => (
                  <div
                    key={itm.label}
                    className="flex flex-col justify-end items-center min-w-[60px] h-full shrink-0"
                  >
                    <span className="text-xs mb-2">{itm.day}</span>

                    {/* bar */}
                    <div
                      className="w-8 rounded-t-xl bg-blue-500"
                      style={{ height: `${itm.icon}px` }}
                    ></div>

                    <span className="text-xs mt-2">{itm.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quick Actions Card */}
            <div className={`border rounded-2xl p-6 ${card}`}>
              <>
                <h2 className="font-bold text-base mb-1">Quick Actions</h2>
                <p className={`text-xs ${sub} mb-5`}>Jump to what you need</p>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map(action => (
                    <button
                      key={action.label}
                      onClick={() => navigate(action.path)}
                      className={` ${action.color} text-white rounded-xl p-4 flex flex-col items-center gap-2 transition-colors cursor-pointer`}
                    >
                      <>
                        <action.icon size={18} />
                        <span className="text-xs font-bold leading-tight">{action.label} </span>
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



        </div>
      </div>
    </>
  );
}