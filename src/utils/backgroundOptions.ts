// Different site background color options
// Copy any of these functions to replace getBackgroundStyle in styles.ts

// Option 1: Current (Slate/Gray base with purple gradients)
export const backgroundOption1 = (isDark: boolean) => ({
  backgroundColor: isDark 
    ? 'rgb(2 6 23 / var(--tw-bg-opacity, 1))'         // slate-950
    : 'rgb(248 250 252 / var(--tw-bg-opacity, 1))',   // slate-50
  '--tw-gradient-from': isDark
    ? 'rgb(88 28 135 / 0.2) var(--tw-gradient-from-position)'      // purple-800
    : 'rgb(196 181 253 / 0.3) var(--tw-gradient-from-position)',   // purple-300
  '--tw-gradient-to': isDark
    ? 'rgb(30 58 138 / 0.2) var(--tw-gradient-to-position)'        // blue-800
    : 'rgb(251 207 232 / 0.3) var(--tw-gradient-to-position)',     // pink-200
});

// Option 2: Warmer Purple Base
export const backgroundOption2 = (isDark: boolean) => ({
  backgroundColor: isDark 
    ? 'rgb(14 8 30 / var(--tw-bg-opacity, 1))'        // Deep purple base
    : 'rgb(253 250 255 / var(--tw-bg-opacity, 1))',   // Very light purple
  '--tw-gradient-from': isDark
    ? 'rgb(107 33 168 / 0.25) var(--tw-gradient-from-position)'    // purple-700
    : 'rgb(196 181 253 / 0.4) var(--tw-gradient-from-position)',   // purple-300
  '--tw-gradient-to': isDark
    ? 'rgb(79 70 229 / 0.25) var(--tw-gradient-to-position)'       // indigo-600
    : 'rgb(251 207 232 / 0.4) var(--tw-gradient-to-position)',     // pink-200
});

// Option 3: Cooler Blue-Purple Base
export const backgroundOption3 = (isDark: boolean) => ({
  backgroundColor: isDark 
    ? 'rgb(6 9 30 / var(--tw-bg-opacity, 1))'         // Deep blue base
    : 'rgb(250 251 255 / var(--tw-bg-opacity, 1))',   // Very light blue
  '--tw-gradient-from': isDark
    ? 'rgb(67 56 202 / 0.2) var(--tw-gradient-from-position)'      // indigo-700
    : 'rgb(165 180 252 / 0.3) var(--tw-gradient-from-position)',   // indigo-300
  '--tw-gradient-to': isDark
    ? 'rgb(126 34 206 / 0.2) var(--tw-gradient-to-position)'       // purple-700
    : 'rgb(196 181 253 / 0.3) var(--tw-gradient-to-position)',     // purple-300
});

// Option 4: Subtle Gray with Hint of Purple
export const backgroundOption4 = (isDark: boolean) => ({
  backgroundColor: isDark 
    ? 'rgb(15 15 20 / var(--tw-bg-opacity, 1))'       // Very dark gray
    : 'rgb(251 251 253 / var(--tw-bg-opacity, 1))',   // Almost white with purple hint
  '--tw-gradient-from': isDark
    ? 'rgb(88 28 135 / 0.15) var(--tw-gradient-from-position)'     // purple-800 subtle
    : 'rgb(196 181 253 / 0.25) var(--tw-gradient-from-position)',  // purple-300 subtle
  '--tw-gradient-to': isDark
    ? 'rgb(30 58 138 / 0.15) var(--tw-gradient-to-position)'       // blue-800 subtle
    : 'rgb(251 207 232 / 0.25) var(--tw-gradient-to-position)',    // pink-200 subtle
});

// Option 5: Rich Purple Theme
export const backgroundOption5 = (isDark: boolean) => ({
  backgroundColor: isDark 
    ? 'rgb(20 8 35 / var(--tw-bg-opacity, 1))'        // Rich dark purple
    : 'rgb(252 248 255 / var(--tw-bg-opacity, 1))',   // Light purple tint
  '--tw-gradient-from': isDark
    ? 'rgb(124 58 237 / 0.3) var(--tw-gradient-from-position)'     // violet-600
    : 'rgb(196 181 253 / 0.5) var(--tw-gradient-from-position)',   // purple-300
  '--tw-gradient-to': isDark
    ? 'rgb(219 39 119 / 0.3) var(--tw-gradient-to-position)'       // pink-600
    : 'rgb(251 207 232 / 0.5) var(--tw-gradient-to-position)',     // pink-200
});

// Option 6: Ocean Blue Theme
export const backgroundOption6 = (isDark: boolean) => ({
  backgroundColor: isDark 
    ? 'rgb(7 12 26 / var(--tw-bg-opacity, 1))'        // Deep ocean blue
    : 'rgb(248 252 255 / var(--tw-bg-opacity, 1))',   // Very light blue
  '--tw-gradient-from': isDark
    ? 'rgb(29 78 216 / 0.25) var(--tw-gradient-from-position)'     // blue-700
    : 'rgb(147 197 253 / 0.4) var(--tw-gradient-from-position)',   // blue-300
  '--tw-gradient-to': isDark
    ? 'rgb(14 116 144 / 0.25) var(--tw-gradient-to-position)'      // cyan-700
    : 'rgb(165 243 252 / 0.4) var(--tw-gradient-to-position)',     // cyan-200
});

// Option 7: Forest Green Theme
export const backgroundOption7 = (isDark: boolean) => ({
  backgroundColor: isDark 
    ? 'rgb(5 20 14 / var(--tw-bg-opacity, 1))'        // Deep forest green
    : 'rgb(247 254 251 / var(--tw-bg-opacity, 1))',   // Very light green
  '--tw-gradient-from': isDark
    ? 'rgb(21 128 61 / 0.25) var(--tw-gradient-from-position)'     // green-700
    : 'rgb(134 239 172 / 0.4) var(--tw-gradient-from-position)',   // green-300
  '--tw-gradient-to': isDark
    ? 'rgb(5 150 105 / 0.25) var(--tw-gradient-to-position)'       // emerald-600
    : 'rgb(167 243 208 / 0.4) var(--tw-gradient-to-position)',     // emerald-200
});

// Option 8: Sunset Orange Theme
export const backgroundOption8 = (isDark: boolean) => ({
  backgroundColor: isDark 
    ? 'rgb(28 12 5 / var(--tw-bg-opacity, 1))'        // Deep orange/brown
    : 'rgb(255 252 248 / var(--tw-bg-opacity, 1))',   // Warm cream
  '--tw-gradient-from': isDark
    ? 'rgb(234 88 12 / 0.25) var(--tw-gradient-from-position)'     // orange-600
    : 'rgb(254 215 170 / 0.4) var(--tw-gradient-from-position)',   // orange-200
  '--tw-gradient-to': isDark
    ? 'rgb(239 68 68 / 0.25) var(--tw-gradient-to-position)'       // red-500
    : 'rgb(254 202 202 / 0.4) var(--tw-gradient-to-position)',     // red-200
});

// Option 9: Monochrome Gray Theme
export const backgroundOption9 = (isDark: boolean) => ({
  backgroundColor: isDark 
    ? 'rgb(8 8 12 / var(--tw-bg-opacity, 1))'         // Pure dark gray
    : 'rgb(253 253 254 / var(--tw-bg-opacity, 1))',   // Pure light gray
  '--tw-gradient-from': isDark
    ? 'rgb(55 65 81 / 0.2) var(--tw-gradient-from-position)'       // gray-700
    : 'rgb(209 213 219 / 0.3) var(--tw-gradient-from-position)',   // gray-300
  '--tw-gradient-to': isDark
    ? 'rgb(75 85 99 / 0.2) var(--tw-gradient-to-position)'         // gray-600
    : 'rgb(229 231 235 / 0.3) var(--tw-gradient-to-position)',     // gray-200
});

// Option 10: Cyberpunk Teal Theme
export const backgroundOption10 = (isDark: boolean) => ({
  backgroundColor: isDark 
    ? 'rgb(4 15 20 / var(--tw-bg-opacity, 1))'        // Deep teal/cyan
    : 'rgb(246 254 255 / var(--tw-bg-opacity, 1))',   // Very light cyan
  '--tw-gradient-from': isDark
    ? 'rgb(8 145 178 / 0.25) var(--tw-gradient-from-position)'     // cyan-600
    : 'rgb(165 243 252 / 0.4) var(--tw-gradient-from-position)',   // cyan-200
  '--tw-gradient-to': isDark
    ? 'rgb(20 184 166 / 0.25) var(--tw-gradient-to-position)'      // teal-500
    : 'rgb(153 246 228 / 0.4) var(--tw-gradient-to-position)',     // teal-200
});
