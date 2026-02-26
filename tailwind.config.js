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
        // White/neutral brand (no orange)
        brand: {
          50:  '#ffffff',
          100: '#fafafa',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#ffffff',  // Primary accent = white
          600: '#fafafa',
          700: '#e5e5e5',
          800: '#a3a3a3',
          900: '#737373',
        },
        surface: {
          base:    'var(--surface-base)',
          raised:  'var(--surface-raised)',
          overlay: 'var(--surface-overlay)',
          sunken:  'var(--surface-sunken)',
        },
        border: {
          DEFAULT: 'var(--border-default)',
          subtle:  'var(--border-subtle)',
          strong:  'var(--border-strong)',
        },
        text: {
          primary:   'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted:     'var(--text-muted)',
        },
        semantic: {
          success: '#22C55E',
          error:   '#EF4444',
          warning: '#EAB308',
          info:    '#3B82F6',
        },
        glass: {
          bg:    'var(--glass-bg)',
          border: 'var(--glass-border)',
        },
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Abel"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        btn:   '9999px',
        card:  '12px',
        field: '8px',
      },
      boxShadow: {
        card:        '0 1px 3px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.4)',
        elevated:    '0 8px 24px rgba(0, 0, 0, 0.5)',
        glow:        '0 0 40px rgba(255, 255, 255, 0.04)',
        'glow-sm':   '0 0 20px rgba(255, 255, 255, 0.02)',
        'glow-lg':   '0 0 60px rgba(255, 255, 255, 0.06)',
        'glow-white': '0 0 40px rgba(255, 255, 255, 0.03)',
        'glow-inset': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        bento:       'inset 0 1px 0 0 rgba(255, 255, 255, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.06)',
      },
      backdropBlur: {
        glass: 'var(--glass-blur)',
        'glass-lg': 'var(--glass-blur-lg)',
      },
      screens: {
        xs: '375px',
      },
      animation: {
        'fade-in':       'fadeIn 200ms ease-out',
        'fade-in-up':    'fadeInUp 200ms ease-out',
        'slide-in-right': 'slideInRight 300ms ease-out',
        'slide-in-up':   'slideInUp 300ms ease-out',
        'shimmer':       'shimmer 1.5s ease-in-out infinite',
        'pulse-brand':   'pulseBrand 2s ease-in-out infinite',
        'scale-in':      'scaleIn 300ms ease-out',
        'progress-fill': 'progressFill 600ms ease-out forwards',
        'checkmark':     'checkmarkDraw 400ms ease-out forwards',
        'slide-in-left': 'slideInLeft 200ms ease-out',
        'bounce-in':     'bounceIn 500ms ease-out',
        'shake':         'shake 400ms ease-out',
        /* Ambient animations */
        'float':         'float 6s ease-in-out infinite',
        'float-slow':    'float 8s ease-in-out infinite',
        'orbit':         'orbit 20s linear infinite',
        'orbit-reverse': 'orbit 20s linear infinite reverse',
        'marquee':       'marquee 30s linear infinite',
        'status-pulse':  'statusPulse 2s ease-in-out infinite',
        'glow-pulse':    'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)' },
          to:   { transform: 'translateX(0)' },
        },
        slideInUp: {
          from: { transform: 'translateY(100%)' },
          to:   { transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseBrand: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.6' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.8)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        progressFill: {
          from: { width: '0%' },
          to:   { width: 'var(--progress-width)' },
        },
        checkmarkDraw: {
          from: { 'stroke-dashoffset': '24' },
          to:   { 'stroke-dashoffset': '0' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-12px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        bounceIn: {
          '0%':   { opacity: '0', transform: 'scale(0.3)' },
          '50%':  { transform: 'scale(1.05)' },
          '70%':  { transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%':      { transform: 'translateX(-4px)' },
          '40%':      { transform: 'translateX(4px)' },
          '60%':      { transform: 'translateX(-2px)' },
          '80%':      { transform: 'translateX(2px)' },
        },
        /* Ambient animations */
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        orbit: {
          '0%':   { transform: 'rotate(0deg) translateX(100px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(100px) rotate(-360deg)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        statusPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.5', transform: 'scale(1.1)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 255, 255, 0.02)' },
          '50%':      { boxShadow: '0 0 40px rgba(255, 255, 255, 0.04)' },
        },
      },
    },
  },
  plugins: [],
}
