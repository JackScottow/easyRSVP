export const fadeIn = (direction: "up" | "down" | "left" | "right", delay: number = 0) => {
  return {
    hidden: {
      y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
      x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
      opacity: 0,
    },
    show: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        type: "tween",
        duration: 0.8,
        delay,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  };
};

export const staggerContainer = (staggerChildren: number = 0.1, delayChildren: number = 0) => {
  return {
    hidden: {},
    show: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };
};

export const fadeInScale = (delay: number = 0) => {
  return {
    hidden: {
      opacity: 0,
      scale: 0.9,
    },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        duration: 0.5,
        delay,
        bounce: 0.3,
      },
    },
  };
};

export const slideIn = (direction: "up" | "down" | "left" | "right", delay: number = 0) => {
  return {
    hidden: {
      y: direction === "up" ? "100%" : direction === "down" ? "-100%" : 0,
      x: direction === "left" ? "100%" : direction === "right" ? "-100%" : 0,
      opacity: 0,
    },
    show: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200,
        delay,
      },
    },
  };
};

export const textVariant = (delay: number = 0) => {
  return {
    hidden: {
      y: 20,
      opacity: 0,
    },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "tween",
        ease: "easeInOut",
        duration: 0.6,
        delay,
      },
    },
  };
};

// More subtle hover effect with minimal shadow
export const cardHoverEffect = {
  whileHover: {
    scale: 1.02,
    y: -2,
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
    transition: { duration: 0.2, ease: "easeOut" },
  },
};
