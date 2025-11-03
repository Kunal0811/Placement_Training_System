/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#00BFFF',
        'neon-pink': '#FF00FF',
        'neon-green': '#39FF14',
        'neon-yellow': '#FFFF33',
        'dark-bg': '#121212',
        'dark-card': '#1E1E1E',
      },
      dropShadow: {
        'glow-blue': '0 0 8px rgba(0, 191, 255, 0.7)',
        'glow-pink': '0 0 8px rgba(255, 0, 255, 0.7)',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        glow: {
          'from': { 'box-shadow': '0 0 5px #00BFFF, 0 0 10px #00BFFF' },
          'to': { 'box-shadow': '0 0 20px #00BFFF, 0 0 30px #00BFFF' },
        },
      },
    },
  },
  plugins: [],
}