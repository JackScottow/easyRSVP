"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ComponentProps, ReactNode } from "react";
import { cardHoverEffect } from "@/utils/animations";

interface AnimatedCardProps extends ComponentProps<typeof Card> {
  children: ReactNode;
  animate?: boolean;
  delay?: number;
  disableHoverEffect?: boolean;
}

export function AnimatedCard({ children, className, animate = true, delay = 0, disableHoverEffect = false, ...props }: AnimatedCardProps) {
  const hoverEffects = disableHoverEffect
    ? {}
    : {
        whileHover: {
          transition: { duration: 0.2, ease: "easeOut" },
        },
      };

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 20 } : false}
      whileInView={animate ? { opacity: 1, y: 0 } : {}}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: delay,
        ease: "easeOut",
      }}
      {...hoverEffects}>
      <Card className={cn("h-full transition-all duration-200", className)} {...props}>
        {children}
      </Card>
    </motion.div>
  );
}
