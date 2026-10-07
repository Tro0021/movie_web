/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        carbon: {
          DEFAULT: '#0A0A09',
          950: '#0A0A09',
          900: '#121210',
          850: '#181816',
          800: '#201F1D',
          700: '#262522',
        },
        bone: '#F4F0EA',
        stone: {
          DEFAULT: '#8C877E',
          light: '#B5B0A6',
          dark: '#5C5851',
        },
        vermilion: {
          DEFAULT: '#E03C31',
          hover: '#C83228',
          dark: '#9E241C',
        },
        champagne: {
          DEFAULT: '#D9C39A',
          light: '#EADBC0',
          dark: '#B89F70',
        },
        graphite: '#262522',
        cine: {
          950: '#0A0A09',
          900: '#121210',
          850: '#181816',
          800: '#201F1D',
          700: '#262522',
          600: '#383632',
          gold: '#D9C39A',
          'gold-light': '#EADBC0',
          crimson: '#E03C31',
          cyan: '#709CA8',
          emerald: '#10b981',
          purple: '#8b5cf6',
        }
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        heading: ['"Instrument Serif"', 'Georgia', 'serif'],
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 25px -5px rgba(217, 195, 154, 0.35)',
        'glow-crimson': '0 0 25px -5px rgba(224, 60, 49, 0.4)',
        'glow-cyan': '0 0 25px -5px rgba(112, 156, 168, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.65)',
        'ledger': '0 2px 16px -2px rgba(0, 0, 0, 0.8)',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle at 50% 0%, var(--tw-gradient-stops))',
        'subtle-grid': 'linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-subtle': 'pulseSubtle 3s infinite ease-in-out',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
}
