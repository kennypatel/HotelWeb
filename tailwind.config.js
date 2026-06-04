/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        apollo: {
          purple: '#5f4def',
          'purple-dark': '#4c3dd4',
          'purple-light': '#7b68ee',
          navy: '#0f1629',
          'navy-light': '#1a2540',
          'navy-mid': '#232f4b',
          sidebar: '#0d1526',
          accent: '#6366f1',
          green: '#10b981',
          red: '#ef4444',
          yellow: '#f59e0b',
          blue: '#3b82f6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
