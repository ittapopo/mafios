import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
      },
      colors: {
        // Nordic noir theme - Scandinavian organized crime aesthetic
        nordic: {
          bg: {
            DEFAULT: '#0A0E14', // Dark Nordic night
            dark: '#050810',    // Deepest black-blue
            darker: '#020408',  // Almost black
            light: '#141B26',   // Slightly lighter background
          },
          text: {
            primary: '#E8EDF4',   // Ice white
            secondary: '#B8C5D6', // Frost gray
            muted: '#7B8FA3',     // Muted blue-gray
            accent: '#88C0D0',    // Nordic blue accent
          },
          accent: {
            DEFAULT: '#5E81AC',   // Steel blue
            light: '#81A1C1',     // Light steel
            dark: '#4C688A',      // Deep steel
            cold: '#88C0D0',      // Ice blue
            snow: '#ECEFF4',      // Snow white
          },
          border: {
            DEFAULT: '#2E3440',   // Dark gray border
            light: 'rgba(136, 192, 208, 0.2)', // Subtle ice blue
            dark: 'rgba(46, 52, 64, 0.8)',     // Dark gray
          },
          status: {
            success: '#A3BE8C',   // Nordic green
            warning: '#EBCB8B',   // Nordic yellow
            danger: '#BF616A',    // Nordic red
            info: '#88C0D0',      // Nordic blue
          },
        },
        // Legacy mafia colors for backward compatibility
        mafia: {
          bg: {
            DEFAULT: '#0A0E14',
            dark: '#050810',
            darker: '#020408',
          },
          text: {
            primary: '#E8EDF4',
            secondary: '#B8C5D6',
            muted: '#7B8FA3',
          },
          accent: {
            DEFAULT: '#5E81AC',
            light: '#81A1C1',
            dark: '#4C688A',
          },
          border: {
            DEFAULT: '#2E3440',
            light: 'rgba(136, 192, 208, 0.2)',
            dark: 'rgba(46, 52, 64, 0.8)',
          },
          status: {
            success: '#A3BE8C',
            warning: '#EBCB8B',
            danger: '#BF616A',
            info: '#88C0D0',
          },
        },
      },
      keyframes: {
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        'fade-in': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        'slide-in-right': {
          '0%': {
            transform: 'translateX(100%)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        'fade-in': 'fade-in 0.3s ease-in-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;
