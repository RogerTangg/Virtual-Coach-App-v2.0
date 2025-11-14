/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Matcha Green palette (10 shades)
        matchaGreen: {
          50: '#E8F5E9',
          100: '#F1F8E9',
          200: '#C8E6C9',
          300: '#A5D6A7',
          400: '#81C784',
          500: '#66BB6A',   // Primary brand color
          600: '#4CAF50',
          700: '#43A047',
          800: '#388E3C',
          900: '#2E7D32',
          950: '#1B5E20',
        },
        // Semantic colors
        success: {
          light: '#E8F5E9',
          DEFAULT: '#66BB6A',
          dark: '#43A047',
        },
        error: {
          light: '#FFEBEE',
          DEFAULT: '#EF5350',
          dark: '#C62828',
        },
        warning: {
          light: '#FFF8E1',
          DEFAULT: '#FFCA28',
          dark: '#F57C00',
        },
        info: {
          light: '#E3F2FD',
          DEFAULT: '#42A5F5',
          dark: '#1565C0',
        },
        // Neutral grays
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans TC', 'sans-serif'],
        mono: ['Fira Code', 'Consolas', 'monospace'],
      },
      fontSize: {
        xs: '0.75rem',      // 12px
        sm: '0.875rem',     // 14px
        base: '1rem',       // 16px
        lg: '1.125rem',     // 18px
        xl: '1.25rem',      // 20px
        '2xl': '1.5rem',    // 24px
        '3xl': '1.875rem',  // 30px
        '4xl': '2.25rem',   // 36px
        '5xl': '3rem',      // 48px
      },
      spacing: {
        // 4px base unit (0-24 scale)
        0: '0',
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        7: '28px',
        8: '32px',
        9: '36px',
        10: '40px',
        11: '44px',
        12: '48px',
        14: '56px',
        16: '64px',
        20: '80px',
        24: '96px',
      },
      borderRadius: {
        none: '0',
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        full: '9999px',
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(102, 187, 106, 0.05)',
        sm: '0 1px 3px 0 rgba(102, 187, 106, 0.10), 0 1px 2px 0 rgba(102, 187, 106, 0.06)',
        DEFAULT: '0 4px 6px -1px rgba(102, 187, 106, 0.10), 0 2px 4px -1px rgba(102, 187, 106, 0.06)',
        md: '0 4px 6px -1px rgba(102, 187, 106, 0.10), 0 2px 4px -1px rgba(102, 187, 106, 0.06)',
        lg: '0 10px 15px -3px rgba(102, 187, 106, 0.10), 0 4px 6px -2px rgba(102, 187, 106, 0.05)',
        xl: '0 20px 25px -5px rgba(102, 187, 106, 0.10), 0 10px 10px -5px rgba(102, 187, 106, 0.04)',
        '2xl': '0 25px 50px -12px rgba(102, 187, 106, 0.25)',
        none: 'none',
      },
      transitionDuration: {
        fast: '150ms',
        DEFAULT: '250ms',
        slow: '350ms',
        slower: '500ms',
      },
    },
  },
  plugins: [],
}

