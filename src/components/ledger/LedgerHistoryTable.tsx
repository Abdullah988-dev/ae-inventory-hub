"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Transaction {
  _id: string;
  type: "purchase" | "payment";
  amount: number;
  date: string;
  paymentMethod?: string;
  note?: string;
  balanceAfter: number;
}

interface LedgerHistoryTableProps {
  transactions: Transaction[];
}

export function LedgerHistoryTable({ transactions }: LedgerHistoryTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-800 text-sm text-slate-500">
        No transactions yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-800 hover:bg-transparent">
            <TableHead className="text-slate-400">Date</TableHead>
            <TableHead className="text-slate-400">Type</TableHead>
            <TableHead className="text-slate-400">Amount</TableHead>
            <TableHead className="text-slate-400">Method</TableHead>
            <TableHead className="text-slate-400">Running Balance</TableHead>
            <TableHead className="text-slate-400">Note</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t) => (
            <TableRow key={t._id} className="border-slate-800">
              <TableCell className="text-slate-400">
                {new Date(t.date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    t.type === "purchase"
                      ? "border-indigo-500/40 text-indigo-400"
                      : "border-emerald-500/40 text-emerald-400"
                  }
                >
                  {t.type === "purchase" ? "Purchase" : "Payment"}
                </Badge>
              </TableCell>
              <TableCell className={t.type === "purchase" ? "text-indigo-400" : "text-emerald-400"}>
                {t.type === "purchase" ? "+" : "-"}Rs. {t.amount.toLocaleString()}
              </TableCell>
              <TableCell className="text-slate-400">{t.paymentMethod ?? "—"}</TableCell>
              <TableCell className="font-medium text-white">
                Rs. {t.balanceAfter.toLocaleString()}
              </TableCell>
              <TableCell className="text-slate-400">{t.note || "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}