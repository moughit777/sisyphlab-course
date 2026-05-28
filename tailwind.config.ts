import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black:   '#091507',
          dark:    '#0D1E0A',
          card:    '#0F2410',
          card2:   '#142E14',
          border:  '#1E4A1A',
          border2: '#255520',
          green:   '#5DD62C',
          'green-light': '#7EE84E',
          'green-dark':  '#337418',
          'green-dim':   'rgba(93,214,44,0.14)',
          'green-glow':  'rgba(93,214,44,0.40)',
          gray:    '#8AB88A',
          muted:   '#4A7A4A',
          white:   '#EEF8EE',
        },
        dark: {
          300: '#6A9A6A',
          400: '#2E6A2E',
          500: '#1A4A1A',
          600: '#133513',
          700: '#0E280E',
          800: '#0A1A0A',
          900: '#091507',
        },
        accent: {
          purple:       '#8b5cf6',
          'purple-light': '#a78bfa',
          blue:         '#3b82f6',
          'blue-light': '#60a5fa',
        },
      },
      fontFamily: {
        arabic: ['var(--font-tajawal)', 'Tajawal', 'sans-serif'],
        sans:   ['var(--font-tajawal)', 'Tajawal', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern': `
          linear-gradient(rgba(93,214,44,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(93,214,44,0.04) 1px, transparent 1px)
        `,
        'hero-glow': 'radial-gradient(ellipse 70% 50% at 50% -5%, rgba(93,214,44,0.08) 0%, transparent 70%)',
        'green-glow': 'radial-gradient(circle, rgba(93,214,44,0.2) 0%, transparent 60%)',
        'card-shine': 'linear-gradient(135deg, rgba(93,214,44,0.05) 0%, transparent 60%)',
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
      boxShadow: {
        'green':        '0 0 20px rgba(93,214,44,0.25)',
        'green-lg':     '0 0 40px rgba(93,214,44,0.35)',
        'green-xl':     '0 0 60px rgba(93,214,44,0.4)',
        'card':         '0 1px 0 rgba(255,255,255,0.04) inset, 0 4px 20px rgba(0,0,0,0.5)',
        'card-hover':   '0 0 0 1px rgba(93,214,44,0.2), 0 8px 30px rgba(0,0,0,0.6)',
        'glow-purple':  '0 0 30px rgba(139,92,246,0.4)',
      },
      animation: {
        'float':         'float 4s ease-in-out infinite',
        'glow-pulse':    'glow-pulse 2.5s ease-in-out infinite alternate',
        'slide-up':      'slide-up 0.6s ease-out forwards',
        'spin-slow':     'spin 10s linear infinite',
        'shimmer':       'shimmer 2s linear infinite',
        'whatsapp':      'whatsapp 2s ease-in-out infinite',
        'ping-green':    'ping 2s cubic-bezier(0,0,0.2,1) infinite',
        'scan-line':     'scan-line 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-10px)' },
        },
        'glow-pulse': {
          '0%':   { boxShadow: '0 0 10px rgba(93,214,44,0.2)' },
          '100%': { boxShadow: '0 0 40px rgba(93,214,44,0.5)' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        whatsapp: {
          '0%,100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(37,211,102,0.4)' },
          '50%':     { transform: 'scale(1.06)', boxShadow: '0 0 0 12px rgba(37,211,102,0)' },
        },
        'scan-line': {
          '0%':   { top: '0%', opacity: '0' },
          '10%':  { opacity: '1' },
          '90%':  { opacity: '1' },
          '100%': { top: '100%', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
