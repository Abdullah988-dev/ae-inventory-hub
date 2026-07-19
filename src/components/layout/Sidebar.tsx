"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Boxes,
  ArrowDownToLine,
  ArrowUpFromLine,
  MessageSquareWarning,
  MessageSquareCheck,
  Wallet,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedLogo } from "./AnimatedLogo";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Inventory", href: "/dashboard/inventory", icon: Boxes },
  { label: "Shop In", href: "/dashboard/shop-in", icon: ArrowDownToLine },
  { label: "Shop Out", href: "/dashboard/shop-out", icon: ArrowUpFromLine },
  { label: "Payment Details", href: "/dashboard/payment-details", icon: Wallet },
  { label: "Complaint Register", href: "/dashboard/complaints", icon: MessageSquareWarning },
  { label: "Complaint Done", href: "/dashboard/complaints-done", icon: MessageSquareCheck },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-600/20">
          <Boxes className="h-5 w-5 text-white" />
        </div>
        <AnimatedLogo className="text-base" />
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="relative block" onClick={onNavigate}>
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-indigo-500/15"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <div
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive ? "text-indigo-400" : "text-slate-400 hover:text-slate-200"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </>
  );
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      <aside className="hidden w-64 flex-col border-r border-slate-800 bg-slate-950 p-4 md:flex">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-slate-950 p-4 md:hidden"
            >
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
              <SidebarContent onNavigate={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}