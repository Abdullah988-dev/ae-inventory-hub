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
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: string;
  onSuccess: () => void;
}

function todayString() {
  return new Date().toISOString().split("T")[0];
}

export function TransactionModal({ open, onOpenChange, companyId, onSuccess }: TransactionModalProps) {
  const [type, setType] = useState<"purchase" | "payment">("purchase");
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState(todayString());
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setType("purchase");
      setAmount(0);
      setDate(todayString());
      setPaymentMethod("Cash");
      setNote("");
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/ledger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: companyId,
          type,
          amount,
          date,
          paymentMethod: type === "payment" ? paymentMethod : undefined,
          note,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message ?? "Failed to record transaction");
        return;
      }

      toast.success(type === "purchase" ? "Purchase recorded" : "Payment recorded");
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
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setType("purchase")}
            className={cn(
              "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
              type === "purchase"
                ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                : "border-slate-700 text-slate-400 hover:bg-slate-800"
            )}
          >
            Purchase (Goods Received)
          </button>
          <button
            type="button"
            onClick={() => setType("payment")}
            className={cn(
              "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
              type === "payment"
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                : "border-slate-700 text-slate-400 hover:bg-slate-800"
            )}
          >
            Payment (Amount Paid)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Amount</Label>
            <Input
              required
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
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

          {type === "payment" && (
            <div className="space-y-2">
              <Label className="text-slate-300">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v ?? "Cash")}>
                <SelectTrigger className="border-slate-700 bg-slate-800/60 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-slate-700 bg-slate-800 text-white">
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Bank">Bank</SelectItem>
                  <SelectItem value="EasyPaisa">EasyPaisa</SelectItem>
                  <SelectItem value="JazzCash">JazzCash</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

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
            disabled={isSubmitting || amount <= 0}
            className={cn(
              "w-full",
              type === "purchase"
                ? "bg-indigo-600 hover:bg-indigo-500"
                : "bg-emerald-600 hover:bg-emerald-500"
            )}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : type === "purchase" ? (
              "Record Purchase"
            ) : (
              "Record Payment"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}