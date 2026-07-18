"use client";

import { useState } from "react";
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
}

interface ShopInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: Option[];
  onSuccess: () => void;
}

export function ShopInModal({ open, onOpenChange, products, onSuccess }: ShopInModalProps) {
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [supplierName, setSupplierName] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function resetForm() {
    setProductId("");
    setQuantity(1);
    setSupplierName("");
    setNote("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/shop-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: productId, quantity, supplierName, note }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message ?? "Failed to record entry");
        return;
      }

      toast.success("Stock added successfully");
      resetForm();
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
          <DialogTitle>Shop In — Add Stock</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Product</Label>
            <Select value={productId} onValueChange={(value) => setProductId(value ?? "")}>
              <SelectTrigger className="border-slate-700 bg-slate-800/60 text-white">
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent className="border-slate-700 bg-slate-800 text-white">
                {products.map((product) => (
                  <SelectItem key={product._id} value={product._id}>
                    {product.name} ({product.sku})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Quantity Received</Label>
            <Input
              required
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border-slate-700 bg-slate-800/60 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Supplier Name (optional)</Label>
            <Input
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
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
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Stock"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}