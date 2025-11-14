/**
 * Matcha Green Color Palette
 * Design Token: 10-shade system for Virtual Coach App UI Redesign
 * 
 * Primary: #66BB6A (Matcha 500)
 * Light shades: E8F5E9 → F1F8E9 → C8E6C9 → A5D6A7 → 81C784
 * Dark shades: 4CAF50 → 43A047 → 388E3C → 2E7D32 → 1B5E20
 */

export const matchaGreen = {
  50: '#E8F5E9',   // Lightest - backgrounds, hover states
  100: '#F1F8E9',  // Very light - card backgrounds
  200: '#C8E6C9',  // Light - borders, disabled states
  300: '#A5D6A7',  // Medium light - subtle accents
  400: '#81C784',  // Medium - secondary buttons
  500: '#66BB6A',  // PRIMARY - main brand color
  600: '#4CAF50',  // Medium dark - hover on primary
  700: '#43A047',  // Dark - active states
  800: '#388E3C',  // Darker - pressed states
  900: '#2E7D32',  // Darkest - text on light bg
  950: '#1B5E20',  // Extra dark - high contrast text
} as const;

export const semanticColors = {
  // Success states (using matcha green)
  success: {
    light: matchaGreen[100],
    main: matchaGreen[500],
    dark: matchaGreen[700],
  },
  
  // Error states (WCAG AA compliant red)
  error: {
    light: '#FFEBEE',
    main: '#EF5350',
    dark: '#C62828',
  },
  
  // Warning states (amber)
  warning: {
    light: '#FFF8E1',
    main: '#FFCA28',
    dark: '#F57C00',
  },
  
  // Info states (blue)
  info: {
    light: '#E3F2FD',
    main: '#42A5F5',
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
} as const;

export const backgroundColor = {
  default: '#FFFFFF',
  paper: matchaGreen[50],    // Card backgrounds
  hover: matchaGreen[100],   // Hover states
  disabled: semanticColors.gray[200],
} as const;

export const textColor = {
  primary: semanticColors.gray[900],
  secondary: semanticColors.gray[700],
  disabled: semanticColors.gray[500],
  hint: semanticColors.gray[600],
  onPrimary: '#FFFFFF',      // Text on matcha green backgrounds
  onError: '#FFFFFF',
} as const;

export const borderColor = {
  default: semanticColors.gray[300],
  focus: matchaGreen[500],
  error: semanticColors.error.main,
  disabled: semanticColors.gray[200],
} as const;

export type MatchaGreenShade = keyof typeof matchaGreen;
export type SemanticColor = keyof typeof semanticColors;
