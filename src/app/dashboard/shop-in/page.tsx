"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShopInModal } from "@/components/shop-in/ShopInModal";
import { ShopInTable } from "@/components/shop-in/ShopInTable";

export default function ShopInPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEntries = useCallback(async () => {
    const res = await fetch("/api/shop-in");
    const data = await res.json();
    if (res.ok) setEntries(data.data);
  }, []);

  const fetchProducts = useCallback(async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    if (res.ok) setProducts(data.data);
  }, []);

  useEffect(() => {
    Promise.all([fetchEntries(), fetchProducts()]).finally(() => setIsLoading(false));
  }, [fetchEntries, fetchProducts]);

  async function handleDelete(id: string) {
    const res = await fetch(`/api/shop-in/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message ?? "Failed to delete entry");
      return;
    }

    toast.success("Entry deleted, stock reversed");
    fetchEntries();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white">Shop In</h1>
          <p className="mt-1 text-sm text-slate-400">Record incoming stock from suppliers</p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Stock
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center text-sm text-slate-500">
          Loading...
        </div>
      ) : (
        <ShopInTable entries={entries} onDelete={handleDelete} />
      )}

      <ShopInModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        products={products}
        onSuccess={fetchEntries}
      />
    </div>
  );
}