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

interface ComplaintModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (complaint: any) => void;
}

const EMPTY_FORM = {
  customerName: "",
  customerPhone: "",
  customerAddress: "",
  productName: "",
  issueDetails: "",
  priority: "Medium",
};

export function ComplaintModal({ open, onOpenChange, onSuccess }: ComplaintModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message ?? "Failed to register complaint");
        return;
      }

      toast.success(`Complaint registered — ${data.data.complaintNumber}`);
      setForm(EMPTY_FORM);
      onOpenChange(false);
      onSuccess(data.data);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-slate-800 bg-slate-900 text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Register New Complaint</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label className="text-slate-300">Customer Name</Label>
              <Input
                required
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                className="border-slate-700 bg-slate-800/60 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">WhatsApp Number</Label>
              <Input
                required
                placeholder="03XXXXXXXXX"
                value={form.customerPhone}
                onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                className="border-slate-700 bg-slate-800/60 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Priority</Label>
              <Select
                value={form.priority}
                onValueChange={(value) => setForm({ ...form, priority: value ?? "Medium" })}
              >
                <SelectTrigger className="border-slate-700 bg-slate-800/60 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-slate-700 bg-slate-800 text-white">
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 space-y-2">
              <Label className="text-slate-300">Customer Address</Label>
              <Input
                required
                value={form.customerAddress}
                onChange={(e) => setForm({ ...form, customerAddress: e.target.value })}
                className="border-slate-700 bg-slate-800/60 text-white"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label className="text-slate-300">Product Name</Label>
              <Input
                required
                placeholder='e.g. "Super Asia Ceiling Fan"'
                value={form.productName}
                onChange={(e) => setForm({ ...form, productName: e.target.value })}
                className="border-slate-700 bg-slate-800/60 text-white"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label className="text-slate-300">Issue Details</Label>
              <Input
                required
                placeholder="e.g. Dc Problem"
                value={form.issueDetails}
                onChange={(e) => setForm({ ...form, issueDetails: e.target.value })}
                className="border-slate-700 bg-slate-800/60 text-white"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Register Complaint"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}