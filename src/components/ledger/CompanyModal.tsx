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

interface CompanyFormData {
  _id?: string;
  name: string;
  openingBalance: number;
  notes: string;
}

interface CompanyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCompany: CompanyFormData | null;
  onSuccess: () => void;
}

const EMPTY_FORM: CompanyFormData = { name: "", openingBalance: 0, notes: "" };

export function CompanyModal({ open, onOpenChange, editingCompany, onSuccess }: CompanyModalProps) {
  const [form, setForm] = useState<CompanyFormData>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setForm(editingCompany ?? EMPTY_FORM);
  }, [editingCompany, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const isEditing = Boolean(editingCompany?._id);
      const url = isEditing ? `/api/companies/${editingCompany?._id}` : "/api/companies";
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

      toast.success(isEditing ? "Company updated" : "Company added");
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
          <DialogTitle>{editingCompany ? "Edit Company" : "Add New Company"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Company Name</Label>
            <Input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Cloud 1"
              className="border-slate-700 bg-slate-800/60 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Opening Balance</Label>
            <Input
              required
              type="number"
              step="0.01"
              disabled={Boolean(editingCompany?._id)}
              value={form.openingBalance}
              onChange={(e) => setForm({ ...form, openingBalance: Number(e.target.value) })}
              className="border-slate-700 bg-slate-800/60 text-white disabled:opacity-50"
            />
            {editingCompany?._id && (
              <p className="text-xs text-slate-500">
                Opening balance sirf naye company ke liye editable hai (agar transactions ho chuki hon to lock ho jata hai)
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Notes (optional)</Label>
            <Input
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="border-slate-700 bg-slate-800/60 text-white"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : editingCompany ? (
              "Update Company"
            ) : (
              "Add Company"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}