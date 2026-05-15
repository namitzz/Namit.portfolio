/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          900: '#070710',
          800: '#0B0B17',
          700: '#11121E',
        },
      },
      boxShadow: {
        glow: '0 0 80px -20px var(--accent)',
        card: '0 30px 80px -40px rgba(0,0,0,0.6), 0 2px 8px -2px rgba(0,0,0,0.4)',
      },
      backgroundImage: {
        'grid-fade':
          'linear-gradient(to bottom, transparent, rgba(0,0,0,0.6)), linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        pulseDot: {
          '0%,100%': { opacity: 0.6, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.4)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        scan: 'scan 3.5s linear infinite',
        pulseDot: 'pulseDot 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
