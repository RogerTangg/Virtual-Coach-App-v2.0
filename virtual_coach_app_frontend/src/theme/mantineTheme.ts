/**
 * Mantine Theme Configuration
 * Integrates all design tokens for Virtual Coach App UI Redesign
 */

import { createTheme, MantineColorsTuple } from '@mantine/core';
import { matchaGreen, semanticColors, textColor } from './colors';
import { fontFamily, fontSize, fontWeight, lineHeight } from './typography';
import { spacing } from './spacing';
import { borderRadius } from './borderRadius';
import { shadows } from './shadows';

// Convert matchaGreen to Mantine color tuple format
const matchaGreenTuple: MantineColorsTuple = [
  matchaGreen[50],
  matchaGreen[100],
  matchaGreen[200],
  matchaGreen[300],
  matchaGreen[400],
  matchaGreen[500],
  matchaGreen[600],
  matchaGreen[700],
  matchaGreen[800],
  matchaGreen[900],
];

export const mantineTheme = createTheme({
  /** Primary brand color - Matcha Green */
  primaryColor: 'matchaGreen',
  
  /** Color palette */
  colors: {
    matchaGreen: matchaGreenTuple,
    // Mantine expects 10 shades for each color
    gray: [
      semanticColors.gray[50],
      semanticColors.gray[100],
      semanticColors.gray[200],
      semanticColors.gray[300],
      semanticColors.gray[400],
      semanticColors.gray[500],
      semanticColors.gray[600],
      semanticColors.gray[700],
      semanticColors.gray[800],
      semanticColors.gray[900],
    ],
  },
  
  /** Typography */
  fontFamily: fontFamily.body,
  fontFamilyMonospace: fontFamily.mono,
  headings: {
    fontFamily: fontFamily.heading,
    fontWeight: String(fontWeight.semibold),
    sizes: {
      h1: { fontSize: fontSize['5xl'], lineHeight: String(lineHeight.tight) },
      h2: { fontSize: fontSize['4xl'], lineHeight: String(lineHeight.tight) },
      h3: { fontSize: fontSize['3xl'], lineHeight: String(lineHeight.snug) },
      h4: { fontSize: fontSize['2xl'], lineHeight: String(lineHeight.snug) },
      h5: { fontSize: fontSize.xl, lineHeight: String(lineHeight.normal) },
      h6: { fontSize: fontSize.lg, lineHeight: String(lineHeight.normal) },
    },
  },
  
  /** Spacing scale (Mantine uses 0-11 by default) */
  spacing: {
    xs: spacing[2],   // 8px
    sm: spacing[3],   // 12px
    md: spacing[4],   // 16px
    lg: spacing[6],   // 24px
    xl: spacing[8],   // 32px
  },
  
  /** Border radius */
  radius: {
    xs: borderRadius.xs,
    sm: borderRadius.sm,
    md: borderRadius.md,
    lg: borderRadius.lg,
    xl: borderRadius.xl,
  },
  defaultRadius: 'md',
  
  /** Shadows with green tint */
  shadows: {
    xs: shadows.xs,
    sm: shadows.sm,
    md: shadows.md,
    lg: shadows.lg,
    xl: shadows.xl,
  },
  
  /** Component-specific overrides */
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        root: {
          fontWeight: fontWeight.medium,
          transition: 'all 0.2s ease',
        },
      },
    },
    
    Card: {
      defaultProps: {
        shadow: 'sm',
        radius: 'lg',
        padding: 'lg',
      },
    },
    
    Paper: {
      defaultProps: {
        shadow: 'xs',
        radius: 'md',
      },
    },
    
    Input: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        input: {
          '&:focus': {
            borderColor: matchaGreen[500],
          },
        },
      },
    },
    
    Modal: {
      defaultProps: {
        radius: 'xl',
        shadow: 'xl',
      },
    },
    
    Badge: {
      defaultProps: {
        radius: 'full',
      },
    },
  },
  
  /** Other theme properties */
  white: '#FFFFFF',
  black: textColor.primary,
  
  /** Focus ring */
  focusRing: 'auto',
  focusRingStyles: {
    styles: (theme) => ({
      outline: `2px solid ${theme.colors.matchaGreen[5]}`,
      outlineOffset: '2px',
    }),
    inputStyles: (theme) => ({
      border: `2px solid ${theme.colors.matchaGreen[5]}`,
    }),
  },
});

export type MantineTheme = typeof mantineTheme;
