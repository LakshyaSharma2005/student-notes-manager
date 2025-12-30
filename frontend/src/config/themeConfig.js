// This file controls the professional look of your dashboard
export const designTokens = {
  colors: {
    primary: '#3B82F6',   // Bright Blue
    secondary: '#8B5CF6', // Purple
    accent: '#F43F5E',    // Pink/Red
    background: '#F8FAFC',
    darkBg: '#0F172A',
  },
  animations: {
    pageTransition: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 }
    },
    spring: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
};