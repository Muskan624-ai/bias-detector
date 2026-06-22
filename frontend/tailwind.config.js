/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Space Mono"', 'monospace'],
        sans: ['"Inter"', 'sans-serif'],
      },
      colors: {
        navy: {
          950: '#060a18',
          900: '#080c1a',
          800: '#0d1226',
          700: '#131830',
        },
        purple: {
          glow: '#7c4dff',
          soft: '#a07aff',
          dim: '#4a2fa0',
        },
        cyan: {
          glow: '#00e5ff',
          soft: '#5cf0ff',
        },
        lavender: {
          card: 'rgba(160, 120, 220, 0.13)',
          border: 'rgba(160, 120, 220, 0.22)',
          focus: 'rgba(160, 120, 220, 0.5)',
        },
      },
      animation: {
        'spin-slow': 'spin 1s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bob': 'bob 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.4,0,0.2,1) forwards',
        'bar-fill': 'barFill 1.2s cubic-bezier(0.4,0,0.2,1) forwards',
      },
      keyframes: {
        bob: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(8px)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        barFill: {
          from: { width: '0%' },
          to: { width: 'var(--bar-width)' },
        },
      },
      backdropBlur: {
        xs: '4px',
      },
    },
  },
  plugins: [],
}
