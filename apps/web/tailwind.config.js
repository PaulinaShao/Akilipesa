/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Polished Tanzanite theme
        primary: {
          DEFAULT: '#8A5CF6',
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8A5CF6',
          600: '#6E4BD9',
          700: '#5B21B6',
          800: '#4C1D95',
          900: '#3B1764',
        },
        secondary: {
          DEFAULT: '#6E4BD9',
          50: '#F3F1FF',
          100: '#E8E4FF',
          200: '#D1C7FF',
          300: '#B19FFF',
          400: '#8B71FF',
          500: '#6E4BD9',
          600: '#5A3AB5',
          700: '#472991',
          800: '#35186D',
          900: '#230849',
        },
        accent: {
          DEFAULT: '#33FFC1',
          50: '#F0FFFA',
          100: '#E0FFF5',
          200: '#C2FFEB',
          300: '#85FFD6',
          400: '#33FFC1',
          500: '#00E6A0',
          600: '#00CC8F',
          700: '#00B37F',
          800: '#009970',
          900: '#007A5A',
        },
        // Background colors
        bg: {
          primary: '#0B0712',
          secondary: '#130D22',
          card: 'rgba(20, 16, 32, 0.72)',
        },
        // Text colors
        text: {
          primary: '#FFFFFF',
          secondary: '#B8B4C8',
          muted: '#6B6B8A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '16px' }],
        'sm': ['14px', { lineHeight: '20px' }],
        'base': ['15px', { lineHeight: '22px' }],
        'lg': ['16px', { lineHeight: '24px' }],
        'xl': ['18px', { lineHeight: '28px' }],
        '2xl': ['20px', { lineHeight: '30px' }],
        '3xl': ['24px', { lineHeight: '32px' }],
        '4xl': ['32px', { lineHeight: '40px' }],
        '5xl': ['40px', { lineHeight: '48px' }],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      height: {
        'screen-safe': '100dvh',
        'screen-small': '100svh',
      },
      minHeight: {
        'screen-safe': '100dvh',
      },
      maxHeight: {
        'screen-safe': '100dvh',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      screens: {
        'xs': '375px',
      },
      zIndex: {
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
        'top': '9999',
      },
    },
  },
  plugins: [],
}
