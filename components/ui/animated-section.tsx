"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";
import { staggerContainer } from "@/utils/animations";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
  duration?: number;
  staggerItems?: boolean;
  staggerDelay?: number;
}

export function AnimatedSection({ children, className = "", variants, delay = 0, duration = 0.5, staggerItems = false, staggerDelay = 0.1 }: AnimatedSectionProps) {
  const defaultVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        delay,
        ease: "easeOut",
      },
    },
  };

  const containerVariants = staggerItems ? staggerContainer(staggerDelay, delay) : defaultVariants;

  return (
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} variants={variants || containerVariants} className={className}>
      {children}
    </motion.div>
  );
}

export function AnimatedItem({ children, className = "", variants, delay = 0, duration = 0.5 }: AnimatedSectionProps) {
  const defaultVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        delay,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div variants={variants || defaultVariants} className={className}>
      {children}
    </motion.div>
  );
}
