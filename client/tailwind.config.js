/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Palette alignée sur l'app mobile (vert de marque #00D27A, dark #006042)
        primary: {
          DEFAULT: '#00D27A',
          50: '#e6fff4',
          100: '#bafce0',
          200: '#8af7c9',
          300: '#54edb0',
          400: '#1fe097',
          500: '#00D27A',
          600: '#00b069',
          700: '#008a54',
          800: '#006042',
          900: '#004532',
        },
        accent: '#FF6B35',
        background: '#FFFFFF',
        foreground: '#1A1A1A',
        muted: {
          DEFAULT: '#F0F6FF',
          foreground: '#6B7280',
        },
        border: '#E5E7EB',
        card: '#FFFFFF',
        secondary: {
          DEFAULT: '#F5F7FA',
          foreground: '#4A4A4A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.65rem',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        // Pulsation douce du logo dans le loader
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.9' },
          '50%': { transform: 'scale(1.08)', opacity: '1' },
        },
        // Barre de progression qui se remplit de 0% à 100% une seule fois
        loaderFill: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-soft': 'pulseSoft 1.6s ease-in-out infinite',
        'loader-bar': 'loaderFill 1s ease-out forwards',
      },
    },
  },
  plugins: [],
}
