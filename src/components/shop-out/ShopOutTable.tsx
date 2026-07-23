"use client";

import { Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ShopOutEntry {
  _id: string;
  product: { _id: string; name: string; sku: string };
  quantity: number;
  pricePerUnit?: number;
  totalAmount?: number;
  customerName?: string;
  note?: string;
  date?: string;
  createdAt: string;
}

interface ShopOutTableProps {
  entries: ShopOutEntry[];
  onDelete: (id: string) => void;
}

export function ShopOutTable({ entries, onDelete }: ShopOutTableProps) {
  if (entries.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-800 text-sm text-slate-500">
        No stock-out records yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-800 hover:bg-transparent">
            <TableHead className="text-slate-400">Date</TableHead>
            <TableHead className="text-slate-400">Product</TableHead>
            <TableHead className="text-slate-400">Quantity</TableHead>
            <TableHead className="text-slate-400">Price/Unit</TableHead>
            <TableHead className="text-slate-400">Total</TableHead>
            <TableHead className="text-slate-400">Customer</TableHead>
            <TableHead className="text-slate-400">Note</TableHead>
            <TableHead className="text-right text-slate-400">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry._id} className="border-slate-800">
              <TableCell className="text-slate-400">
                {new Date(entry.date ?? entry.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="font-medium text-white">
                {entry.product?.name} <span className="text-slate-500">({entry.product?.sku})</span>
              </TableCell>
              <TableCell className="text-red-400">-{entry.quantity}</TableCell>
              <TableCell className="text-slate-400">
                Rs. {(entry.pricePerUnit ?? 0).toLocaleString()}
              </TableCell>
              <TableCell className="text-white">
                Rs. {(entry.totalAmount ?? 0).toLocaleString()}
              </TableCell>
              <TableCell className="text-slate-400">{entry.customerName || "—"}</TableCell>
              <TableCell className="text-slate-400">{entry.note || "—"}</TableCell>
              <TableCell className="text-right">
                <button
                  onClick={() => onDelete(entry._id)}
                  className="text-slate-500 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}