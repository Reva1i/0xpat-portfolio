/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0a',
        surface: '#111111',
        elevated: '#1a1a1a',
        border: 'rgba(255,255,255,0.08)',
        accent: '#7c3aed',
        'accent-hover': '#6d28d9',
        positive: '#22c55e',
        negative: '#ef4444',
        'text-primary': '#ffffff',
        'text-secondary': '#888888',
        'text-muted': '#444444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
