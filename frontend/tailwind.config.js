/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        academic: {
          bg: '#FAFAF8',
          card: '#FFFFFF',
          paper: '#F4F4F0',
          border: '#E8E8E2',
          borderLight: '#F0F0EB',
          subtle: '#EDECE6',
        },
        ink: {
          900: '#0F172A', // Deep Oxford Navy / Charcoal
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
          500: '#64748B',
          400: '#94A3B8',
          300: '#CBD5E1',
          200: '#E2E8F0',
          100: '#F1F5F9',
          50: '#F8FAFC',
        },
        scholar: {
          navy: '#0C2340',
          blue: '#1E40AF',
          accent: '#2563EB',
          teal: '#0D9488',
          tealDark: '#0F766E',
          tealLight: '#F0FDFA',
          amber: '#B45309',
          amberLight: '#FEF3C7',
          emerald: '#059669',
        },
        navy: '#0C2340',
        slateBlue: '#334155',
        ivory: '#FAFAF8',
        teal: '#0D9488',
        charcoal: '#0F172A',
        slateGray: '#64748B',
        softGray: '#E2E8F0',
      },
      fontFamily: {
        heading: ['Crimson Pro', 'Playfair Display', 'Georgia', 'serif'],
        serif: ['Crimson Pro', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        cardHover: '0 8px 24px -4px rgba(15, 23, 42, 0.08), 0 2px 6px -2px rgba(15, 23, 42, 0.04)',
        popover: '0 12px 32px -4px rgba(15, 23, 42, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.06)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}