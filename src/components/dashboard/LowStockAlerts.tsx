"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface LowStockProduct {
  _id: string;
  name: string;
  sku: string;
  quantity: number;
  lowStockThreshold: number;
}

interface LowStockAlertsProps {
  products: LowStockProduct[];
}

export function LowStockAlerts({ products }: LowStockAlertsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2 }}
      className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg backdrop-blur"
    >
      <div className="mb-4 flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-400" />
        <h3 className="text-sm font-semibold text-white">Low Stock Alerts</h3>
      </div>

      {products.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-sm text-slate-500">
          All products are well stocked 🎉
        </div>
      ) : (
        <div className="max-h-64 space-y-2 overflow-y-auto">
          {products.map((product) => (
            <div
              key={product._id}
              className="flex items-center justify-between rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium text-white">{product.name}</p>
                <p className="text-xs text-slate-500">{product.sku}</p>
              </div>
              <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-400">
                {product.quantity} left
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}