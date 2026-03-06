/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  safelist: [
    // Theme colors used in index.css @apply – ensure they are always generated
    'bg-surface',
    'dark:bg-surface-dark',
  ],
  theme: {
    extend: {
      colors: {
        // QED-inspired palette: modern, serene, minimal
        primary: '#026670',       // dark teal – main actions, links
        'primary-hover': '#035a63',
        mint: '#9FEDD7',          // light aqua – hover, accents
        cream: '#FEF9C7',         // light yellow – soft accents
        golden: '#FCE181',        // golden yellow – highlights
        surface: '#EDEAE5',       // off-white – page background
        'surface-dark': '#1a2528', // dark mode surface (teal-tinted)
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      transitionDuration: {
        200: '200ms',
        250: '250ms',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'reveal-up': {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'reveal-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-in-up': 'fade-in-up 0.35s ease-out',
        'reveal-up': 'reveal-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'reveal-in': 'reveal-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      },
    },
  },
  plugins: [],
};
