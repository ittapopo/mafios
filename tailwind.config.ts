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
        // Mafia theme color palette
        mafia: {
          bg: {
            DEFAULT: '#2A241D',
            dark: '#1A150F',
            darker: '#0F0B08',
          },
          text: {
            primary: '#D4C5B2',
            secondary: '#B8A99A',
            muted: '#8B7355',
          },
          accent: {
            DEFAULT: '#8B7355',
            light: '#B8A99A',
            dark: '#6B5943',
          },
          border: {
            DEFAULT: '#8B7355',
            light: 'rgba(139, 115, 85, 0.3)',
            dark: 'rgba(139, 115, 85, 0.5)',
          },
          status: {
            success: '#4CAF50',
            warning: '#FFC107',
            danger: '#F44336',
            info: '#2196F3',
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
