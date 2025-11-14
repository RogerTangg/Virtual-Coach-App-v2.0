/**
 * Border Radius Design Tokens
 * Rounded corner standards for UI elements
 */

export const borderRadius = {
  none: '0',          // 0px - sharp corners
  xs: '2px',          // 2px - subtle rounding
  sm: '4px',          // 4px - small components (badges, chips)
  md: '8px',          // 8px - default (buttons, inputs, cards)
  lg: '12px',         // 12px - large cards, modals
  xl: '16px',         // 16px - prominent elements
  '2xl': '24px',      // 24px - hero sections
  full: '9999px',     // Fully rounded (pills, avatars)
} as const;

// Semantic radius tokens for specific components
export const componentRadius = {
  button: borderRadius.md,        // 8px
  input: borderRadius.md,         // 8px
  card: borderRadius.lg,          // 12px
  modal: borderRadius.xl,         // 16px
  badge: borderRadius.full,       // Fully rounded
  avatar: borderRadius.full,      // Fully rounded
  chip: borderRadius.full,        // Fully rounded
  tooltip: borderRadius.sm,       // 4px
  dialog: borderRadius.lg,        // 12px
} as const;

export type BorderRadius = keyof typeof borderRadius;
export type ComponentRadius = keyof typeof componentRadius;
