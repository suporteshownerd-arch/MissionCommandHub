/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        openclaw: {
          bg: '#0e1015',
          bgElevated: '#191c24',
          bgHover: '#232730',
          card: '#12141a',
          cardHover: '#1a1d24',
          border: '#2a2f3a',
          borderLight: '#3a4050',
          primary: '#ff5c5c',
          primaryHover: '#ff7878',
          accent: '#14b8a6',
          accentHover: '#2dd4bf',
          text: '#e4e4e7',
          textMuted: '#8b8fa3',
          success: '#22c55e',
          warning: '#f59e0b',
          error: '#ef4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        'openclaw': '10px',
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(255, 92, 92, 0.3)',
        'glow-accent': '0 0 20px rgba(20, 184, 166, 0.3)',
        'glow-card': '0 4px 20px rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
}