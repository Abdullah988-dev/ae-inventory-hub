"use client";

import { useEffect, useState } from "react";
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
}

interface ProductFormData {
  _id?: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  quantity: number;
  price: number;
  lowStockThreshold: number;
}

interface ProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Option[];
  brands: Option[];
  editingProduct: ProductFormData | null;
  onSuccess: () => void;
}

const EMPTY_FORM: ProductFormData = {
  name: "",
  sku: "",
  category: "",
  brand: "",
  quantity: 0,
  price: 0,
  lowStockThreshold: 5,
};

export function ProductModal({
  open,
  onOpenChange,
  categories,
  brands,
  editingProduct,
  onSuccess,
}: ProductModalProps) {
  const [form, setForm] = useState<ProductFormData>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setForm(editingProduct);
    } else {
      setForm(EMPTY_FORM);
    }
  }, [editingProduct, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const isEditing = Boolean(editingProduct?._id);
      const url = isEditing ? `/api/products/${editingProduct?._id}` : "/api/products";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message ?? "Something went wrong");
        return;
      }

      toast.success(isEditing ? "Product updated" : "Product added");
      onOpenChange(false);
      onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-slate-800 bg-slate-900 text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label className="text-slate-300">Product Name</Label>
              <Input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border-slate-700 bg-slate-800/60 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">SKU</Label>
              <Input
                required
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                className="border-slate-700 bg-slate-800/60 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Price</Label>
              <Input
                required
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="border-slate-700 bg-slate-800/60 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Category</Label>
              <Select
                value={form.category}
                onValueChange={(value) => setForm({ ...form, category: value ?? "" })}
              >
                <SelectTrigger className="border-slate-700 bg-slate-800/60 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="border-slate-700 bg-slate-800 text-white">
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Brand</Label>
              <Select
                value={form.brand}
                onValueChange={(value) => setForm({ ...form, brand: value ?? "" })}
              >
                <SelectTrigger className="border-slate-700 bg-slate-800/60 text-white">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent className="border-slate-700 bg-slate-800 text-white">
                  {brands.map((brand) => (
                    <SelectItem key={brand._id} value={brand._id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Quantity</Label>
              <Input
                required
                type="number"
                min="0"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                className="border-slate-700 bg-slate-800/60 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Low Stock Alert At</Label>
              <Input
                required
                type="number"
                min="0"
                value={form.lowStockThreshold}
                onChange={(e) =>
                  setForm({ ...form, lowStockThreshold: Number(e.target.value) })
                }
                className="border-slate-700 bg-slate-800/60 text-white"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : editingProduct ? (
              "Update Product"
            ) : (
              "Add Product"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}