import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  backgroundOption1, 
  backgroundOption2, 
  backgroundOption3, 
  backgroundOption4, 
  backgroundOption5,
  backgroundOption6,
  backgroundOption7,
  backgroundOption8,
  backgroundOption9,
  backgroundOption10
} from '../utils/backgroundOptions';

const SiteBackgroundDemo: React.FC = () => {
  const { isDark } = useTheme();
  const [selectedOption, setSelectedOption] = useState(1);

  const options = [
    { 
      id: 1, 
      name: "Current (Slate/Gray)", 
      func: backgroundOption1,
      description: "Clean slate base with purple gradients",
      color: "🟣 Purple"
    },
    { 
      id: 2, 
      name: "Warm Purple", 
      func: backgroundOption2,
      description: "Purple-tinted base with warmer tones",
      color: "🟣 Purple"
    },
    { 
      id: 3, 
      name: "Cool Blue-Purple", 
      func: backgroundOption3,
      description: "Blue base transitioning to purple",
      color: "🟣 Purple"
    },
    { 
      id: 4, 
      name: "Subtle Gray", 
      func: backgroundOption4,
      description: "Minimal gray with hint of purple",
      color: "⚪ Gray"
    },
    { 
      id: 5, 
      name: "Rich Purple", 
      func: backgroundOption5,
      description: "Bold purple theme throughout",
      color: "🟣 Purple"
    },
    { 
      id: 6, 
      name: "Ocean Blue", 
      func: backgroundOption6,
      description: "Deep blue to cyan gradient",
      color: "🔵 Blue"
    },
    { 
      id: 7, 
      name: "Forest Green", 
      func: backgroundOption7,
      description: "Natural green to emerald tones",
      color: "🟢 Green"
    },
    { 
      id: 8, 
      name: "Sunset Orange", 
      func: backgroundOption8,
      description: "Warm orange to red gradient",
      color: "🟠 Orange"
    },
    { 
      id: 9, 
      name: "Monochrome", 
      func: backgroundOption9,
      description: "Pure grayscale design",
      color: "⚫ Gray"
    },
    { 
      id: 10, 
      name: "Cyberpunk Teal", 
      func: backgroundOption10,
      description: "Futuristic cyan to teal",
      color: "🔵 Teal"
    }
  ];

  const currentStyle = options.find(opt => opt.id === selectedOption)?.func(isDark) || backgroundOption1(isDark);

  return (
    <div className="min-h-screen relative" style={currentStyle}>
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-violet-500/10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl bg-purple-500/10" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl bg-violet-500/10" />
      
      <div className="relative z-10 p-8">
        <div className={`backdrop-blur-sm border rounded-2xl p-6 max-w-4xl mx-auto ${
          isDark 
            ? 'bg-slate-900/40 border-purple-500/30 text-white'
            : 'bg-white/60 border-purple-300/30 text-gray-900'
        }`}>
          <h1 className="text-3xl font-bold mb-6">🎨 Site Background Options</h1>
          
          {/* Option Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mb-8">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedOption(option.id)}
                className={`p-3 rounded-lg border-2 transition-all text-sm ${
                  selectedOption === option.id
                    ? isDark
                      ? 'border-purple-400 bg-purple-500/20 text-purple-200'
                      : 'border-purple-500 bg-purple-100 text-purple-800'
                    : isDark
                      ? 'border-purple-500/30 bg-slate-800/50 text-gray-300 hover:border-purple-400/60'
                      : 'border-purple-300/50 bg-white/50 text-gray-700 hover:border-purple-400/70'
                }`}
                              >
                <div className="font-semibold">{option.name}</div>
                <div className={`text-xs mt-1 ${
                  selectedOption === option.id
                    ? isDark ? 'text-purple-300' : 'text-purple-600'
                    : isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {option.color}
                </div>
                <div className={`text-xs ${
                  selectedOption === option.id
                    ? isDark ? 'text-purple-300' : 'text-purple-600'
                    : isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {option.description}
                </div>
              </button>
            ))}
          </div>

          {/* Sample Content */}
          <div className="space-y-6">
            <div className={`p-6 rounded-xl border ${
              isDark 
                ? 'bg-slate-900/60 border-purple-500/40'
                : 'bg-white/80 border-purple-300/60'
            }`}>
              <h2 className="text-xl font-bold mb-3">Sample Course Card</h2>
              <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                This is how content cards would look with the selected background.
                Notice how the contrast and readability changes with different options.
              </p>
            </div>

            {/* Video Container Example */}
            <div className={`aspect-video rounded-xl overflow-hidden ${
              isDark ? 'bg-slate-800/50' : 'bg-gray-100/50'
            }`}>
              <div className={`w-full h-full flex items-center justify-center ${
                isDark ? 'bg-gray-800/20' : 'bg-gray-300/20'
              }`}>
                <div className="text-center">
                  <div className={`text-4xl mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    🎥
                  </div>
                  <span className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Video Content Area
                  </span>
                </div>
              </div>
            </div>

            {/* How to Apply */}
            <div className={`p-4 rounded-lg border ${
              isDark 
                ? 'bg-green-900/20 border-green-500/30'
                : 'bg-green-50 border-green-200'
            }`}>
              <h3 className="font-bold mb-2">📋 How to Apply Option {selectedOption}:</h3>
              <div className={`font-mono text-sm p-3 rounded ${
                isDark ? 'bg-slate-900/50 text-green-400' : 'bg-white text-green-700'
              }`}>
                {`// In src/utils/styles.ts, replace getBackgroundStyle with:
import { backgroundOption${selectedOption} } from './backgroundOptions';
export const getBackgroundStyle = backgroundOption${selectedOption};`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteBackgroundDemo;
