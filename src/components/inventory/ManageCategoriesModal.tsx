"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Category {
  _id: string;
  name: string;
}

interface ManageCategoriesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onRefresh: () => void;
}

export function ManageCategoriesModal({
  open,
  onOpenChange,
  categories,
  onRefresh,
}: ManageCategoriesModalProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleAdd() {
    if (!name.trim()) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message ?? "Failed to add category");
        return;
      }

      toast.success("Category added");
      setName("");
      onRefresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message ?? "Failed to delete category");
      return;
    }

    toast.success("Category deleted");
    onRefresh();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-slate-800 bg-slate-900 text-white">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New category name"
            className="border-slate-700 bg-slate-800/60 text-white"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <Button onClick={handleAdd} disabled={isSubmitting} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-2 max-h-64 space-y-1 overflow-y-auto">
          {categories.length === 0 && (
            <p className="py-4 text-center text-sm text-slate-500">No categories yet</p>
          )}
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="flex items-center justify-between rounded-lg bg-slate-800/50 px-3 py-2"
            >
              <span className="text-sm text-slate-200">{cat.name}</span>
              <button
                onClick={() => handleDelete(cat._id)}
                className="text-slate-500 hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}