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
        brand: {
          50:  '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#FF6B00',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
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
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
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
        glow:        '0 0 20px rgba(255, 107, 0, 0.15)',
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
      },
    },
  },
  plugins: [],
}
