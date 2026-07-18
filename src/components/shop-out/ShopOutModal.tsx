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
  quantity: number;
}

interface ShopOutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: Option[];
  onSuccess: () => void;
}

export function ShopOutModal({ open, onOpenChange, products, onSuccess }: ShopOutModalProps) {
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedProduct = products.find((p) => p._id === productId);

  function resetForm() {
    setProductId("");
    setQuantity(1);
    setCustomerName("");
    setNote("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/shop-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: productId, quantity, customerName, note }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message ?? "Failed to record entry");
        return;
      }

      toast.success("Stock removed successfully");
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
          <DialogTitle>Shop Out — Remove Stock</DialogTitle>
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
                    {product.name} ({product.sku}) — {product.quantity} in stock
                  </SelectItem>
                ))}
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