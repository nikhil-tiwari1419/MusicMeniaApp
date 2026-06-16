import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/useAuth";
import { useTheme } from "../../Context/Theme";
import Navbar from "../../Components/Navbar";
import {
  Radio, Plus, Mic2, ListMusic, TrendingUp,
  Eye, Music2, BarChart2, ArrowUpRight
} from "lucide-react";

const quickActions = [
  { label: "Upload Track", icon: Plus, path: "/create-music", color: "emerald" },
  { label: "Music Feed", icon: Radio, path: "/Local-Feed", color: "blue" },
  { label: "My Album", icon: ListMusic, path: "/album", color: "violet" },
  { label: "My Posts", icon: Mic2, path: "/your-post", color: "orange" },
];

const colorMap = {
  emerald: "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20",
  blue: "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/20",
  violet: "bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 border-violet-500/20",
  orange: "bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border-orange-500/20",
};

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
  { label: "Total Views", value: "2.4K", change: "+12%", icon: Eye, color: "blue" },
  { label: "Total Plays", value: "1.1K", change: "+8%", icon: Music2, color: "emerald" },
  { label: "Tracks", value: "14", change: "+2", icon: ListMusic, color: "violet" },
  { label: "Trending", value: "#3", change: "↑4", icon: TrendingUp, color: "orange" },
];

const statColor = {
  blue: { bg: "bg-blue-500/10", text: "text-blue-400" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-400" },
  orange: { bg: "bg-orange-500/10", text: "text-orange-400" },
};

export default function ArtistDashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const navigate = useNavigate();

  const maxViews = Math.max(...weekData.map(d => d.views));

  const card = dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const sub = dark ? "text-gray-400" : "text-gray-500";

  return (
    <div className={`min-h-screen transition-colors ${dark ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"}`}>
      <Navbar />

      <div className="pt-20 px-4 sm:px-6 max-w-6xl mx-auto pb-16">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8 mt-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">
              Hey, {user?.username || "Musician"} 👋
            </h1>
            <p className={`text-sm mt-0.5 ${sub}`}>Here's what's happening with your music</p>
          </div>
          <button
            onClick={() => navigate("/create-music")}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-emerald-500/25 active:scale-95"
          >
            <Plus size={15} /> Upload
          </button>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {stats.map(({ label, value, change, icon: Icon, color }) => (
            <div key={label} className={`rounded-2xl border p-4 ${card}`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${statColor[color].bg}`}>
                  <Icon size={15} className={statColor[color].text} />
                </div>
                <span className="text-xs font-semibold text-emerald-400">{change}</span>
              </div>
              <p className="text-2xl font-bold">{value}</p>
              <p className={`text-xs mt-0.5 ${sub}`}>{label}</p>
            </div>
          ))}
        </div>

        {/* ── Middle: Chart + Actions ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

          {/* Chart */}
          <div className={`lg:col-span-2 rounded-2xl border p-5 ${card}`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold text-sm">Weekly Overview</h2>
                <p className={`text-xs mt-0.5 ${sub}`}>Views vs Plays this week</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> Views
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Plays
                </span>
              </div>
            </div>

            {/* Bar chart */}
            <div className="flex items-end gap-2 h-40">
              {weekData.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end gap-0.5 h-32">
                    {/* Views bar */}
                    <div
                      className="flex-1 rounded-t-md bg-blue-500/30 hover:bg-blue-500/50 transition-all"
                      style={{ height: `${(d.views / maxViews) * 100}%` }}
                      title={`Views: ${d.views}`}
                    />
                    {/* Plays bar */}
                    <div
                      className="flex-1 rounded-t-md bg-emerald-500/50 hover:bg-emerald-500/70 transition-all"
                      style={{ height: `${(d.plays / maxViews) * 100}%` }}
                      title={`Plays: ${d.plays}`}
                    />
                  </div>
                  <span className={`text-[10px] ${sub}`}>{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className={`rounded-2xl border p-5 ${card}`}>
            <h2 className="font-bold text-sm mb-1">Quick Actions</h2>
            <p className={`text-xs mb-4 ${sub}`}>Jump to what you need</p>

            <div className="space-y-2">
              {quickActions.map(({ label, icon: Icon, path, color }) => (
                <button
                  key={label}
                  onClick={() => navigate(path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all
                    ${colorMap[color]}`}
                >
                  <Icon size={15} />
                  {label}
                  <ArrowUpRight size={13} className="ml-auto opacity-60" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── User Card ── */}
        <div className={`rounded-2xl border p-4 flex items-center gap-4 ${card}`}>
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm truncate">{user?.username}</p>
            <p className={`text-xs truncate ${sub}`}>{user?.email}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold border
              ${user?.role === "artist"
                ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                : "bg-blue-500/10 text-blue-400 border-blue-500/20"}`}>
              {user?.role || "user"}
            </span>
            <button
              onClick={() => navigate("/profile")}
              className={`text-xs px-3 py-1 rounded-lg border font-medium transition-all
                ${dark ? "border-gray-700 hover:bg-gray-800 text-gray-300" : "border-gray-200 hover:bg-gray-100 text-gray-600"}`}>
              View Profile
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
