/**
 * Spacing Design Tokens
 * 4px base unit spacing scale (0-24)
 */

// Base unit: 4px
const BASE_UNIT = 4;

export const spacing = {
  0: '0',                        // 0px
  1: `${BASE_UNIT * 1}px`,      // 4px
  2: `${BASE_UNIT * 2}px`,      // 8px
  3: `${BASE_UNIT * 3}px`,      // 12px
  4: `${BASE_UNIT * 4}px`,      // 16px
  5: `${BASE_UNIT * 5}px`,      // 20px
  6: `${BASE_UNIT * 6}px`,      // 24px
  7: `${BASE_UNIT * 7}px`,      // 28px
  8: `${BASE_UNIT * 8}px`,      // 32px
  9: `${BASE_UNIT * 9}px`,      // 36px
  10: `${BASE_UNIT * 10}px`,    // 40px
  11: `${BASE_UNIT * 11}px`,    // 44px
  12: `${BASE_UNIT * 12}px`,    // 48px
  14: `${BASE_UNIT * 14}px`,    // 56px
  16: `${BASE_UNIT * 16}px`,    // 64px
  20: `${BASE_UNIT * 20}px`,    // 80px
  24: `${BASE_UNIT * 24}px`,    // 96px
} as const;

// Semantic spacing tokens for common use cases
export const semanticSpacing = {
  // Component internal spacing
  buttonPadding: {
    sm: `${spacing[2]} ${spacing[3]}`,      // 8px 12px
    md: `${spacing[3]} ${spacing[4]}`,      // 12px 16px
    lg: `${spacing[4]} ${spacing[6]}`,      // 16px 24px
  },
  
  // Card padding
  cardPadding: {
    sm: spacing[3],   // 12px
    md: spacing[4],   // 16px
    lg: spacing[6],   // 24px
  },
  
  // Gaps between elements
  gap: {
    xs: spacing[1],   // 4px
    sm: spacing[2],   // 8px
    md: spacing[4],   // 16px
    lg: spacing[6],   // 24px
    xl: spacing[8],   // 32px
  },
  
  // Margins
  margin: {
    section: spacing[12],   // 48px between sections
    element: spacing[4],    // 16px between elements
    component: spacing[6],  // 24px between components
  },
  
  // Container max widths
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
} as const;

export type Spacing = keyof typeof spacing;
export type SemanticSpacingCategory = keyof typeof semanticSpacing;
