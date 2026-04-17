/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── 베이지/화이트 테마 ────────────────────────────────────────────
        beige: {
          50:  '#FDFAF5',
          100: '#FAF7F0',
          200: '#F5EFE0',
          300: '#EDE4CC',
          400: '#DDD0AD',
          500: '#C9A84C',  // 골드 포인트
          600: '#A8893A',
          700: '#876B2C',
        },
        // ── 네이비 테마 ───────────────────────────────────────────────────
        navy: {
          50:  '#EEF2F9',
          100: '#D1DCEF',
          200: '#A3B9DF',
          300: '#7596CF',
          400: '#4A73BF',
          500: '#1B3A6B',  // 기본 네이비
          600: '#162F57',
          700: '#102444',
          800: '#0A1828',
          900: '#050D18',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans KR"', '"Apple SD Gothic Neo"', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
