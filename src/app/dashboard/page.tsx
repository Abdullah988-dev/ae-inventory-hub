"use client";

import { useEffect, useState } from "react";
import { Boxes, Layers, Tags, DollarSign } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { CategoryChart } from "@/components/dashboard/CategoryChart";
import { LowStockAlerts } from "@/components/dashboard/LowStockAlerts";

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalBrands: number;
  totalStockValue: number;
  lowStockCount: number;
  lowStockProducts: { _id: string; name: string; sku: string; quantity: number; lowStockThreshold: number }[];
  categoryBreakdown: { name: string; count: number }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") setStats(data.data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">
          Overview of your inventory at a glance
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Products"
          value={stats?.totalProducts ?? 0}
          icon={Boxes}
          accent="indigo"
          delay={0}
        />
        <StatCard
          label="Stock Value"
          value={`Rs. ${(stats?.totalStockValue ?? 0).toLocaleString()}`}
          icon={DollarSign}
          accent="emerald"
          delay={0.05}
        />
        <StatCard
          label="Categories"
          value={stats?.totalCategories ?? 0}
          icon={Tags}
          accent="amber"
          delay={0.1}
        />
        <StatCard
          label="Low Stock Items"
          value={stats?.lowStockCount ?? 0}
          icon={Layers}
          accent="red"
          delay={0.15}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CategoryChart data={stats?.categoryBreakdown ?? []} />
        <LowStockAlerts products={stats?.lowStockProducts ?? []} />
      </div>
    </div>
  );
}