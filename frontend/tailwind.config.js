/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fintech: {
          navy: {
            950: '#070F1E',
            900: '#0B192C',
            800: '#152A4A',
            700: '#1E3E6D',
          },
          cyan: {
            50: '#ECFEFF',
            100: '#CFFAFE',
            500: '#06B6D4',
            600: '#0891B2',
            700: '#0E7490',
          },
          surface: {
            50: '#F8FAFC',
            100: '#F1F5F9',
            200: '#E2E8F0',
            300: '#CBD5E1',
          },
          text: {
            primary: '#0F172A',
            secondary: '#475569',
            muted: '#64748B',
          },
          positive: '#10B981',
          negative: '#EF4444',
          neutral: '#6B7280',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'fintech': '14px',
        'fintech-lg': '18px',
      },
      boxShadow: {
        'fintech': '0 1px 3px 0 rgba(11, 25, 44, 0.05), 0 1px 2px -1px rgba(11, 25, 44, 0.05)',
        'fintech-card': '0 4px 6px -1px rgba(11, 25, 44, 0.04), 0 2px 4px -2px rgba(11, 25, 44, 0.04)',
        'fintech-hover': '0 10px 15px -3px rgba(11, 25, 44, 0.08), 0 4px 6px -4px rgba(11, 25, 44, 0.04)',
      }
    },
  },
  plugins: [],
}
