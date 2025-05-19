"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends ComponentProps<typeof Button> {
  children: ReactNode;
  animate?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function AnimatedButton({ children, className, animate = true, variant = "default", ...props }: AnimatedButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      initial={animate ? { opacity: 0, y: 10 } : false}
      animate={animate ? { opacity: 1, y: 0 } : {}}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}>
      <Button variant={variant} className={cn("", className)} {...props}>
        {children}
      </Button>
    </motion.div>
  );
}
