/**
 * Animation Design Tokens
 * Duration, easing curves, and transition presets
 */

// Animation durations (in milliseconds)
export const duration = {
  instant: 0,
  fast: 150,         // Micro-interactions (hover, focus)
  normal: 250,       // Default transitions (buttons, tooltips)
  slow: 350,         // Complex animations (modals, drawers)
  slower: 500,       // Page transitions, complex choreography
} as const;

// Easing functions for natural motion
export const easing = {
  // Standard easing
  linear: 'linear',
  
  // Ease-in (accelerating)
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  
  // Ease-out (decelerating) - most common for UI
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  
  // Ease-in-out (smooth start and end)
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Material Design standard easing
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Spring-like bounce
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

// Transition presets for common use cases
export const transitions = {
  // Default transitions
  default: `all ${duration.normal}ms ${easing.easeOut}`,
  
  // Color/background transitions
  color: `color ${duration.fast}ms ${easing.easeOut}`,
  background: `background-color ${duration.fast}ms ${easing.easeOut}`,
  
  // Transform transitions
  transform: `transform ${duration.normal}ms ${easing.easeOut}`,
  scale: `transform ${duration.fast}ms ${easing.bounce}`,
  
  // Opacity transitions
  fade: `opacity ${duration.normal}ms ${easing.easeOut}`,
  fadeIn: `opacity ${duration.slow}ms ${easing.easeOut}`,
  fadeOut: `opacity ${duration.fast}ms ${easing.easeIn}`,
  
  // Shadow transitions
  shadow: `box-shadow ${duration.normal}ms ${easing.easeOut}`,
  
  // Border transitions
  border: `border-color ${duration.fast}ms ${easing.easeOut}`,
} as const;

// Framer Motion variants for common animations
export const motionVariants = {
  // Fade in/out
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: duration.normal / 1000 },
  },
  
  // Scale in/out (for buttons, modals)
  scale: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
    transition: { duration: duration.normal / 1000, ease: easing.easeOut },
  },
  
  // Slide up (for toasts, modals)
  slideUp: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
    transition: { duration: duration.normal / 1000 },
  },
  
  // Slide down (for dropdowns)
  slideDown: {
    initial: { y: -10, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -10, opacity: 0 },
    transition: { duration: duration.fast / 1000 },
  },
  
  // Stagger children (for lists)
  staggerChildren: {
    animate: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  },
  
  // List item animation
  listItem: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: duration.normal / 1000 },
  },
} as const;

// Hover states
export const hoverTransforms = {
  scale: 'scale(1.02)',
  scaleButton: 'scale(0.98)',      // Pressed effect
  lift: 'translateY(-2px)',         // Subtle lift
} as const;

export type Duration = keyof typeof duration;
export type Easing = keyof typeof easing;
export type Transition = keyof typeof transitions;
export type MotionVariant = keyof typeof motionVariants;
