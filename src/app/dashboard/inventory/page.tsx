"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Plus, Tags, Layers, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductTable } from "@/components/inventory/ProductTable";
import { ProductModal } from "@/components/inventory/ProductModal";
import { ManageCategoriesModal } from "@/components/inventory/ManageCategoriesModal";
import { ManageBrandsModal } from "@/components/inventory/ManageBrandsModal";

interface Option {
  _id: string;
  name: string;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [brands, setBrands] = useState<Option[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [isBrandsModalOpen, setIsBrandsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const fetchProducts = useCallback(async (query = "") => {
    const res = await fetch(`/api/products${query ? `?search=${query}` : ""}`);
    const data = await res.json();
    if (res.ok) setProducts(data.data);
  }, []);

  const fetchCategories = useCallback(async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    if (res.ok) setCategories(data.data);
  }, []);

  const fetchBrands = useCallback(async () => {
    const res = await fetch("/api/brands");
    const data = await res.json();
    if (res.ok) setBrands(data.data);
  }, []);

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCategories(), fetchBrands()]).finally(() =>
      setIsLoading(false)
    );
  }, [fetchProducts, fetchCategories, fetchBrands]);

  useEffect(() => {
    const timeout = setTimeout(() => fetchProducts(search), 300);
    return () => clearTimeout(timeout);
  }, [search, fetchProducts]);

  function handleAddClick() {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  }

  function handleEditClick(product: any) {
    setEditingProduct({
      _id: product._id,
      name: product.name,
      sku: product.sku,
      category: product.category?._id,
      brand: product.brand?._id,
      quantity: product.quantity,
      price: product.price,
      lowStockThreshold: product.lowStockThreshold,
    });
    setIsProductModalOpen(true);
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message ?? "Failed to delete product");
      return;
    }

    toast.success("Product deleted");
    fetchProducts(search);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white">Inventory</h1>
          <p className="mt-1 text-sm text-slate-400">Manage your products, categories and brands</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => setIsCategoriesModalOpen(true)}
            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <Tags className="mr-2 h-4 w-4" />
            Categories
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsBrandsModalOpen(true)}
            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <Layers className="mr-2 h-4 w-4" />
            Brands
          </Button>
          <Button
            onClick={handleAddClick}
            className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or SKU..."
          className="border-slate-700 bg-slate-800/60 pl-9 text-white placeholder:text-slate-500"
        />
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center text-sm text-slate-500">
          Loading products...
        </div>
      ) : (
        <ProductTable products={products} onEdit={handleEditClick} onDelete={handleDelete} />
      )}

      <ProductModal
        open={isProductModalOpen}
        onOpenChange={setIsProductModalOpen}
        categories={categories}
        brands={brands}
        editingProduct={editingProduct}
        onSuccess={() => fetchProducts(search)}
      />

      <ManageCategoriesModal
        open={isCategoriesModalOpen}
        onOpenChange={setIsCategoriesModalOpen}
        categories={categories}
        onRefresh={fetchCategories}
      />

      <ManageBrandsModal
        open={isBrandsModalOpen}
        onOpenChange={setIsBrandsModalOpen}
        brands={brands}
        onRefresh={fetchBrands}
      />
    </div>
  );
}