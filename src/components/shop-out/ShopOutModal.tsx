"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Option {
  _id: string;
  name: string;
  sku: string;
  quantity: number;
  category?: { _id: string; name: string };
}

interface CategoryOption {
  _id: string;
  name: string;
}

interface ShopOutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: Option[];
  categories: CategoryOption[];
  onSuccess: () => void;
}

function todayString() {
  return new Date().toISOString().split("T")[0];
}

export function ShopOutModal({
  open,
  onOpenChange,
  products,
  categories,
  onSuccess,
}: ShopOutModalProps) {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(todayString());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredProducts = useMemo(() => {
    if (categoryFilter === "all") return products;
    return products.filter((p) => p.category?._id === categoryFilter);
  }, [products, categoryFilter]);

  const selectedProduct = products.find((p) => p._id === productId);

  useEffect(() => {
    if (!open) {
      setCategoryFilter("all");
      setProductId("");
      setQuantity(1);
      setCustomerName("");
      setNote("");
      setDate(todayString());
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!productId) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/shop-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: productId, quantity, customerName, note, date }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message ?? "Failed to record entry");
        return;
      }

      toast.success("Stock removed successfully");
      onOpenChange(false);
      onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-slate-800 bg-slate-900 text-white">
        <DialogHeader>
          <DialogTitle>Shop Out — Remove Stock</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Filter by Category (optional)</Label>
            <Select
              value={categoryFilter}
              onValueChange={(value) => {
                setCategoryFilter(value ?? "all");
                setProductId("");
              }}
            >
              <SelectTrigger className="border-slate-700 bg-slate-800/60 text-white">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent className="border-slate-700 bg-slate-800 text-white">
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Product</Label>
            <Select value={productId} onValueChange={(value) => setProductId(value ?? "")}>
              <SelectTrigger className="border-slate-700 bg-slate-800/60 text-white">
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent className="border-slate-700 bg-slate-800 text-white">
                {filteredProducts.length === 0 ? (
                  <div className="px-2 py-4 text-center text-sm text-slate-500">
                    No products in this category
                  </div>
                ) : (
                  filteredProducts.map((product) => (
                    <SelectItem key={product._id} value={product._id}>
                      {product.name} ({product.sku}) — {product.quantity} in stock
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {selectedProduct && (
              <p className="text-xs text-slate-500">
                Available: <span className="text-slate-300">{selectedProduct.quantity}</span>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Quantity to Remove</Label>
            <Input
              required
              type="number"
              min="1"
              max={selectedProduct?.quantity}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border-slate-700 bg-slate-800/60 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Date</Label>
            <Input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border-slate-700 bg-slate-800/60 text-white [color-scheme:dark]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Customer Name (optional)</Label>
            <Input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="border-slate-700 bg-slate-800/60 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Note (optional)</Label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="border-slate-700 bg-slate-800/60 text-white"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !productId}
            className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Remove Stock"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}