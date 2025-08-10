/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tanzanite Primary Colors
        primary: {
          DEFAULT: '#1A0D3D', // Deep midnight
          50: '#F7F5FF',
          100: '#EFEBFF',
          200: '#E0D8FF',
          300: '#C9BAFF',
          400: '#A991FF',
          500: '#8B5CF6', // Violet-blue glow
          600: '#6D28D9',
          700: '#5B21B6',
          800: '#4C1D95',
          900: '#1A0D3D', // Deep midnight
          950: '#0F0823',
        },
        // Tanzanite Accent Colors
        accent: {
          DEFAULT: '#8B5CF6', // Violet-blue glow
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        // Tanzanite Glow Effects
        glow: {
          DEFAULT: '#C084FC', // Bright violet
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#A855F7',
          600: '#9333EA',
          700: '#7E22CE',
          800: '#6B21A8',
          900: '#581C87',
        },
        // Social Media Colors
        social: {
          like: '#FF3040', // Instagram red
          love: '#FF6B6B',
          comment: '#FFFFFF',
          share: '#FFFFFF',
          bookmark: '#FFD700',
        },
        // Gemstone Gradients
        gem: {
          dark: '#0A0118', // Ultra dark tanzanite
          midnight: '#1A0D3D', // Deep midnight
          violet: '#8B5CF6', // Violet-blue glow
          bright: '#C084FC', // Bright violet
          light: '#E9D5FF', // Light tanzanite
        },
        // Status Colors
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        // Instagram-like body text
        sans: ['Inter', 'system-ui', 'sans-serif'],
        // Bold condensed headings (TikTok/IG vibe)
        display: ['"Bebas Neue"', '"Arial Black"', 'Impact', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        DEFAULT: '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px',
        'gem': '1.5rem', // Gemstone-like rounded corners
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(139, 92, 246, 0.3)',
        'glow': '0 0 20px rgba(139, 92, 246, 0.4)',
        'glow-lg': '0 0 30px rgba(139, 92, 246, 0.5)',
        'glow-xl': '0 0 40px rgba(139, 92, 246, 0.6)',
        'gem': '0 8px 32px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'gem-hover': '0 12px 40px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        'reel': '0 0 60px rgba(0, 0, 0, 0.8)',
        'overlay': '0 -10px 25px rgba(0, 0, 0, 0.5)',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        DEFAULT: '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-gentle': 'bounce-gentle 2s infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'like-pop': 'likePop 0.6s ease-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(139, 92, 246, 0.6)',
            transform: 'scale(1.02)'
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'fadeIn': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slideUp': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slideDown': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'scaleIn': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'likePop': {
          '0%': { transform: 'scale(1)' },
          '20%': { transform: 'scale(1.3)' },
          '40%': { transform: 'scale(1.1)' },
          '60%': { transform: 'scale(1.2)' },
          '80%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      height: {
        'screen-safe': '100dvh', // Dynamic viewport height
        'screen-small': '100svh', // Small viewport height
        'reel': '100dvh',
      },
      minHeight: {
        'screen-safe': '100dvh',
        'reel': '100dvh',
      },
      maxHeight: {
        'screen-safe': '100dvh',
        'reel': '100dvh',
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
