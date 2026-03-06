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
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '1.5rem' },
      screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px' },
    },
    extend: {
      colors: {
        // EduRozgaar brand palette (startup-grade)
        primary: '#026670',       // dark teal – main actions, links (kept for compatibility)
        'primary-hover': '#035a63',
        mint: '#9FEDD7',          // light aqua – hover, accents
        cream: '#FEF9C7',
        golden: '#FCE181',
        surface: '#EDEAE5',
        'surface-dark': '#1a2528',
        // Image-inspired palette: professional blues & cool grey
        'edur-olive': '#687864',   // muted green-grey – accents, secondary bg
        'edur-steel': '#31708E',   // deep steel blue – hero, primary dark
        'edur-blue': '#5085A5',    // medium blue – secondary buttons, links
        'edur-sky': '#8FC1E3',     // light pastel blue – hover, highlights
        'edur-bg': '#F7F9FB',      // cool off-white – sections, cards
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
        'dropdown-enter': {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'drawer-enter': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'drawer-leave': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'overlay-enter': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'overlay-leave': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-in-up': 'fade-in-up 0.35s ease-out',
        'reveal-up': 'reveal-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'reveal-in': 'reveal-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'dropdown-enter': 'dropdown-enter 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        'drawer-enter': 'drawer-enter 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        'drawer-leave': 'drawer-leave 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'overlay-enter': 'overlay-enter 0.2s ease-out',
        'overlay-leave': 'overlay-leave 0.2s ease-out forwards',
      },
    },
  },
  plugins: [],
};
