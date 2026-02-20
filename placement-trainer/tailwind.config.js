// placement-trainer/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Outfit"', 'sans-serif'],
        display: ['"Clash Display"', 'sans-serif'],
        mono: ['"Fira Code"', 'monospace'], // Added for the Coding Executor sections
      },
      colors: {
        'game-bg': '#09090b', 
        'game-card': '#18181b', 
        'game-border': '#27272a', // Subtle borders for card separation
        'neon-blue': '#2DD4BF', 
        'neon-purple': '#A855F7', 
        'neon-yellow': '#FACC15',
        'acid-green': '#bef264', 
        'hot-pink': '#fb7185',
        'dark-accent': '#1e1e2e', // For sidebar/header distinction
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #2DD4BF 0deg, #A855F7 180deg, #2DD4BF 360deg)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.8)',
        'neon': '0 0 15px rgba(45, 212, 191, 0.4)',
        'purple-glow': '0 0 15px rgba(168, 85, 247, 0.4)', // Added for purple buttons
        'hard': '6px 6px 0px 0px rgba(0,0,0,1)', 
      },
      animation: {
        'spin-slow': 'spin 10s linear infinite',
        'float': 'float 3s ease-in-out infinite', // Added for floating icons/cards
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'border-flow': 'border-flow 4s linear infinite', // Added for "moving" borders
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'border-flow': {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
        }
      }
    },
  },
  plugins: [],
}
