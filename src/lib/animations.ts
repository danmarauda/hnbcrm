/**
 * Reusable Framer Motion animation variants
 * Import these to create consistent animations across the app
 */

import type { Variants, Transition } from 'framer-motion';

// Default transition config
export const defaultTransition: Transition = {
  duration: 0.3,
  ease: [0.25, 0.1, 0.25, 1],
};

export const springTransition: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 20,
};

export const slowTransition: Transition = {
  duration: 0.6,
  ease: [0.25, 0.1, 0.25, 1],
};

// Fade in from below (most common entrance)
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
};

// Fade in from above
export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
};

// Simple fade
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: defaultTransition,
  },
};

// Scale in from 0.8
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springTransition,
  },
};

// Scale in from 0.95 (subtle)
export const scaleInSubtle: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: defaultTransition,
  },
};

// Slide in from left
export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: defaultTransition,
  },
};

// Slide in from right
export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: defaultTransition,
  },
};

// Stagger container (wraps children with stagger effect)
export const staggerContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

// Fast stagger for smaller lists
export const staggerContainerFast: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

// Slow stagger for dramatic reveals
export const staggerContainerSlow: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// Glass hover effect (subtle scale + glow)
export const glassHover: Variants = {
  rest: {
    scale: 1,
    boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.08)',
  },
  hover: {
    scale: 1.02,
    boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.12), 0 0 40px rgba(255, 255, 255, 0.05)',
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
};

// Glass hover with brand glow
export const glassHoverBrand: Variants = {
  rest: {
    scale: 1,
    boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.08)',
  },
  hover: {
    scale: 1.02,
    boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.12), 0 0 30px rgba(255, 107, 0, 0.1)',
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
};

// Button press effect
export const buttonPress: Variants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.02,
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
};

// Floating animation (for orbs, decorative elements)
export const float: Variants = {
  initial: {
    y: 0,
  },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
};

// Pulse glow animation
export const pulseGlow: Variants = {
  initial: {
    boxShadow: '0 0 20px rgba(255, 107, 0, 0.1)',
  },
  animate: {
    boxShadow: [
      '0 0 20px rgba(255, 107, 0, 0.1)',
      '0 0 40px rgba(255, 107, 0, 0.2)',
      '0 0 20px rgba(255, 107, 0, 0.1)',
    ],
    transition: {
      duration: 3,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
};

// Modal/overlay backdrop
export const backdrop: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
    },
  },
};

// Modal content (slide up + fade)
export const modalSlideUp: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    y: 50,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

// Page transition
export const pageTransition: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

// Reveal animation (height + opacity)
export const reveal: Variants = {
  hidden: {
    opacity: 0,
    height: 0,
    overflow: 'hidden',
  },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2,
    },
  },
};

// List item (for animated lists)
export const listItem: Variants = {
  hidden: {
    opacity: 0,
    x: -10,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    x: 10,
    transition: {
      duration: 0.15,
    },
  },
};

// Notification/toast entrance
export const notification: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.9,
    transition: {
      duration: 0.15,
    },
  },
};

// Combine helper for compound animations
export function combineVariants(...variants: Variants[]): Variants {
  return variants.reduce((acc, variant) => {
    for (const key in variant) {
      if (acc[key]) {
        acc[key] = { ...acc[key], ...variant[key] };
      } else {
        acc[key] = variant[key];
      }
    }
    return acc;
  }, {} as Variants);
}
