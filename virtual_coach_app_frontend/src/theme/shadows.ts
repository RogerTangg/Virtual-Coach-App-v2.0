/**
 * Shadow Design Tokens
 * Elevation system with matcha green tint
 * Using matcha green RGB: 102, 187, 106
 */

// Shadow levels with subtle green tint using matcha green color
export const shadows = {
  // No shadow
  none: 'none',
  
  // Extra small - subtle depth (hover states)
  xs: `0 1px 2px 0 rgba(102, 187, 106, 0.05)`,
  
  // Small - cards at rest, chips
  sm: `0 1px 3px 0 rgba(102, 187, 106, 0.10), 0 1px 2px 0 rgba(102, 187, 106, 0.06)`,
  
  // Medium - default elevation for cards, buttons
  md: `0 4px 6px -1px rgba(102, 187, 106, 0.10), 0 2px 4px -1px rgba(102, 187, 106, 0.06)`,
  
  // Large - dropdowns, popovers, elevated cards
  lg: `0 10px 15px -3px rgba(102, 187, 106, 0.10), 0 4px 6px -2px rgba(102, 187, 106, 0.05)`,
  
  // Extra large - modals, dialogs
  xl: `0 20px 25px -5px rgba(102, 187, 106, 0.10), 0 10px 10px -5px rgba(102, 187, 106, 0.04)`,
  
  // 2X large - high-elevation overlays
  '2xl': `0 25px 50px -12px rgba(102, 187, 106, 0.25)`,
} as const;

// Semantic shadows for specific use cases
export const componentShadows = {
  card: shadows.sm,
  cardHover: shadows.md,
  button: shadows.xs,
  buttonHover: shadows.sm,
  modal: shadows.xl,
  dropdown: shadows.lg,
  tooltip: shadows.md,
  fab: shadows.lg,           // Floating Action Button
  fabHover: shadows.xl,
} as const;

// Inner shadows (inset) for pressed states
export const innerShadows = {
  pressed: `inset 0 2px 4px 0 rgba(102, 187, 106, 0.12)`,
  input: `inset 0 1px 2px 0 rgba(102, 187, 106, 0.08)`,
} as const;

// Focus ring shadows (accessibility)
export const focusShadows = {
  default: `0 0 0 3px rgba(102, 187, 106, 0.20)`,
  error: `0 0 0 3px rgba(239, 83, 80, 0.20)`,
} as const;

export type Shadow = keyof typeof shadows;
export type ComponentShadow = keyof typeof componentShadows;
