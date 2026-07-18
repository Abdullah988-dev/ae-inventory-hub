"use client";

import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: "indigo" | "emerald" | "amber" | "red";
  delay?: number;
}

const ACCENT_STYLES = {
  indigo: "from-indigo-500 to-purple-600 shadow-indigo-600/20",
  emerald: "from-emerald-500 to-teal-600 shadow-emerald-600/20",
  amber: "from-amber-500 to-orange-600 shadow-amber-600/20",
  red: "from-red-500 to-rose-600 shadow-red-600/20",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "indigo",
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg backdrop-blur"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
        </div>
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br shadow-lg",
            ACCENT_STYLES[accent]
          )}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </motion.div>
  );
}