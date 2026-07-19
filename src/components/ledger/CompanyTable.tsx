"use client";

import Link from "next/link";
import { Pencil, Trash2, Eye, Power } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BalanceBadge } from "./BalanceBadge";

interface Company {
  _id: string;
  name: string;
  openingBalance: number;
  totalPurchases: number;
  totalPayments: number;
  outstandingBalance: number;
  lastTransactionDate: string | null;
  isActive: boolean;
}

interface CompanyTableProps {
  companies: Company[];
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
}

export function CompanyTable({ companies, onEdit, onDelete, onToggleStatus }: CompanyTableProps) {
  if (companies.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-800 text-sm text-slate-500">
        No companies yet — click &quot;Add Company&quot; to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-800 hover:bg-transparent">
            <TableHead className="text-slate-400">Company</TableHead>
            <TableHead className="text-slate-400">Purchases</TableHead>
            <TableHead className="text-slate-400">Payments</TableHead>
            <TableHead className="text-slate-400">Outstanding</TableHead>
            <TableHead className="text-slate-400">Status</TableHead>
            <TableHead className="text-slate-400">Last Transaction</TableHead>
            <TableHead className="text-right text-slate-400">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((c) => (
            <TableRow key={c._id} className="border-slate-800">
              <TableCell className="font-medium text-white">{c.name}</TableCell>
              <TableCell className="text-emerald-400">
                Rs. {c.totalPurchases.toLocaleString()}
              </TableCell>
              <TableCell className="text-indigo-400">
                Rs. {c.totalPayments.toLocaleString()}
              </TableCell>
              <TableCell className="font-semibold text-white">
                Rs. {c.outstandingBalance.toLocaleString()}
              </TableCell>
              <TableCell>
                <BalanceBadge
                  outstandingBalance={c.outstandingBalance}
                  totalPayments={c.totalPayments}
                />
              </TableCell>
              <TableCell className="text-slate-400">
                {c.lastTransactionDate ? new Date(c.lastTransactionDate).toLocaleDateString() : "—"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-3">
                  <Link href={`/dashboard/payment-details/${c._id}`}>
                    <button className="text-slate-500 hover:text-indigo-400" title="View Ledger">
                      <Eye className="h-4 w-4" />
                    </button>
                  </Link>
                  <button
                    onClick={() => onToggleStatus(c._id, !c.isActive)}
                    className={c.isActive ? "text-emerald-500 hover:text-slate-400" : "text-slate-600 hover:text-emerald-500"}
                    title={c.isActive ? "Mark Inactive" : "Mark Active"}
                  >
                    <Power className="h-4 w-4" />
                  </button>
                  <button onClick={() => onEdit(c)} className="text-slate-500 hover:text-indigo-400" title="Edit">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => onDelete(c._id)} className="text-slate-500 hover:text-red-400" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}