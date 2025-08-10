/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2C3E9E', // Tanzanite deep blue
          50: '#F0F2FF',
          100: '#E6E9FF',
          200: '#D1D8FF',
          300: '#B8C2FF',
          400: '#9AA8FF',
          500: '#6C7BFF', // Electric indigo
          600: '#2C3E9E', // Primary
          700: '#1F2B70',
          800: '#151D4F',
          900: '#0B1020', // Dark bg
        },
        accent: {
          DEFAULT: '#6C7BFF', // Electric indigo
          50: '#F0F2FF',
          100: '#E6E9FF',
          200: '#D1D8FF',
          300: '#B8C2FF',
          400: '#9AA8FF',
          500: '#6C7BFF',
          600: '#5A6AE8',
          700: '#4854C7',
          800: '#3640A0',
          900: '#252B7A',
        },
        glow: {
          DEFAULT: '#9AD1FF', // Aqua highlight
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#9AD1FF',
          600: '#0EA5E9',
          700: '#0284C7',
          800: '#0369A1',
          900: '#0C4A6E',
        },
        dark: {
          DEFAULT: '#0B1020', // Dark bg
          card: '#11162B', // Card bg
          lighter: '#1A1F35',
        },
        success: '#1FC16B',
        warning: '#FABB3D',
        danger: '#FF5B6E',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        title: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      borderRadius: {
        'tanzanite': '16px',
      },
      boxShadow: {
        'tanzanite': '0 8px 32px -8px rgba(44, 62, 158, 0.3)',
        'glow': '0 0 20px rgba(154, 209, 255, 0.4)',
        'card': '0 4px 16px -4px rgba(0, 0, 0, 0.1)',
      },
      backdropBlur: {
        'glass': '12px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(154, 209, 255, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(154, 209, 255, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
