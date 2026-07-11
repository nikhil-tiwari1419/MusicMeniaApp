import React from 'react';
import { useTheme } from '../Context/Theme';

function Pageloader() {
  const themeContext = useTheme();
  const theme = themeContext ? themeContext.theme : 'light';
  const dark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center gap-6 transition-colors duration-300
      ${dark ? 'bg-zinc-950' : 'bg-white'}`}>

      {/* Simple equalizer — 4 bars, staggered pulse */}
      <div className="flex items-end gap-1.5 h-10">
        {[0, 1, 2, 3].map(i => (
          <span
            key={i}
            className={`w-2 rounded-full animate-eq-pulse ${dark ? 'bg-emerald-400' : 'bg-emerald-500'}`}
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      <p className={`text-sm font-semibold tracking-wide ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
        Loading MusicMenia…
      </p>

      {/* Scoped animation — no need to touch global CSS/tailwind.config */}
      <style>{`
        @keyframes eq-pulse {
          0%, 100% { height: 8px; }
          50% { height: 32px; }
        }
        .animate-eq-pulse {
          animation: eq-pulse 0.9s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default Pageloader;
