"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShopOutModal } from "@/components/shop-out/ShopOutModal";
import { ShopOutTable } from "@/components/shop-out/ShopOutTable";

export default function ShopOutPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEntries = useCallback(async () => {
    const res = await fetch("/api/shop-out");
    const data = await res.json();
    if (res.ok) setEntries(data.data);
  }, []);

  const fetchProducts = useCallback(async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    if (res.ok) setProducts(data.data);
  }, []);

  const fetchCategories = useCallback(async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    if (res.ok) setCategories(data.data);
  }, []);

  useEffect(() => {
    Promise.all([fetchEntries(), fetchProducts(), fetchCategories()]).finally(() =>
      setIsLoading(false)
    );
  }, [fetchEntries, fetchProducts, fetchCategories]);

  async function handleDelete(id: string) {
    const res = await fetch(`/api/shop-out/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message ?? "Failed to delete entry");
      return;
    }

    toast.success("Entry deleted, stock restored");
    fetchEntries();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white">Shop Out</h1>
          <p className="mt-1 text-sm text-slate-400">Record outgoing stock for sales/dispatch</p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
        >
          <Minus className="mr-2 h-4 w-4" />
          Remove Stock
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center text-sm text-slate-500">
          Loading...
        </div>
      ) : (
        <ShopOutTable entries={entries} onDelete={handleDelete} />
      )}

      <ShopOutModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        products={products}
        categories={categories}
        onSuccess={fetchEntries}
      />
    </div>
  );
}