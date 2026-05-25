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
          black:   '#030b03',
          dark:    '#071207',
          card:    '#091409',
          card2:   '#0d1d0d',
          border:  '#1a3a1a',
          border2: '#224422',
          green:   '#5DD62C',
          'green-light': '#7EE84E',
          'green-dim':   'rgba(93,214,44,0.12)',
          'green-glow':  'rgba(93,214,44,0.28)',
          gray:    '#8aaa8a',
          muted:   '#4a6a4a',
          white:   '#F8F8F8',
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
        'green':       '0 0 20px rgba(93,214,44,0.25)',
        'green-lg':    '0 0 40px rgba(93,214,44,0.35)',
        'green-xl':    '0 0 60px rgba(93,214,44,0.4)',
        'card':        '0 1px 0 rgba(255,255,255,0.04) inset, 0 4px 20px rgba(0,0,0,0.5)',
        'card-hover':  '0 0 0 1px rgba(93,214,44,0.2), 0 8px 30px rgba(0,0,0,0.6)',
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
