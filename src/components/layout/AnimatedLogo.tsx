"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AnimatedLogo({ className }: { className?: string }) {
  return (
    <motion.span
      className={cn("bg-clip-text font-bold text-transparent", className)}
      style={{
        backgroundImage:
          "linear-gradient(90deg, #818cf8, #c084fc, #6366f1, #818cf8)",
        backgroundSize: "300% auto",
      }}
      animate={{ backgroundPosition: ["0% center", "300% center"] }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      AE-Inventory-Hub
    </motion.span>
  );
}