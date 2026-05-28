import React from 'react';
import { useTheme } from '../Context/Theme';

function Pageloader() {
  const themeContext = useTheme();
  // Safe fallback in case theme is not fully initialized
  const theme = themeContext ? themeContext.theme : 'light';
  const dark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center gap-8 transition-colors duration-300 ${
      dark 
        ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-black' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      
      {/* Audio Visualizer / Equalizer Animation */}
      <div className='flex items-end justify-center gap-1.5 h-16 w-32'>
        {[
          { dur: '1.4s', del: '0.0s' },
          { dur: '1.1s', del: '0.3s' },
          { dur: '1.6s', del: '0.1s' },
          { dur: '0.9s', del: '0.5s' },
          { dur: '1.3s', del: '0.2s' },
          { dur: '1.7s', del: '0.4s' },
          { dur: '1.2s', del: '0.1s' },
        ].map((anim, index) => (
          <span
            key={index}
            className={`w-2.5 rounded-full animate-music-wave ${
              dark 
                ? 'bg-gradient-to-t from-emerald-600 via-emerald-400 to-teal-300' 
                : 'bg-gradient-to-t from-emerald-500 to-teal-400'
            }`}
            style={{ 
              animationDuration: anim.dur,
              animationDelay: anim.del,
              height: '100%' 
            }}
          />
        ))}
      </div>

      {/* Loading Text */}
      <div className='text-center flex flex-col items-center'>
        <p className={`text-xl font-bold tracking-wide ${
          dark ? 'text-white drop-shadow-md' : 'text-gray-900 drop-shadow-sm'
        }`}>
          MusicMenia
        </p>
        <p className={`text-sm mt-2 animate-pulse font-medium ${
          dark ? 'text-emerald-400/80' : 'text-emerald-600/80'
        }`}>
          Tuning in...
        </p>
      </div>

    </div>
  );
}

export default Pageloader;