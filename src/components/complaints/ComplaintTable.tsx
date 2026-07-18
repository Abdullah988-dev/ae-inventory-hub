"use client";

import { ForwardActions } from "./ForwardActions";
import { CheckCircle2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Complaint {
  _id: string;
  complaintNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  productName: string;
  issueDetails: string;
  priority: "Low" | "Medium" | "High";
  createdAt: string;
}

interface ComplaintTableProps {
  complaints: Complaint[];
  onMarkDone?: (id: string) => void;
  onDelete: (id: string) => void;
  showDoneButton?: boolean;
}

const PRIORITY_STYLES = {
  Low: "border-slate-500/40 text-slate-400",
  Medium: "border-amber-500/40 text-amber-400",
  High: "border-red-500/40 text-red-400",
};

export function ComplaintTable({
  complaints,
  onMarkDone,
  onDelete,
  showDoneButton = true,
}: ComplaintTableProps) {
  if (complaints.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-800 text-sm text-slate-500">
        No complaints here yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-800 hover:bg-transparent">
            <TableHead className="text-slate-400">Complaint #</TableHead>
            <TableHead className="text-slate-400">Customer</TableHead>
            <TableHead className="text-slate-400">Product</TableHead>
            <TableHead className="text-slate-400">Issue</TableHead>
            <TableHead className="text-slate-400">Priority</TableHead>
            <TableHead className="text-right text-slate-400">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {complaints.map((c) => (
            <TableRow key={c._id} className="border-slate-800">
              <TableCell className="font-medium text-indigo-400">{c.complaintNumber}</TableCell>
              <TableCell>
                <p className="text-white">{c.customerName}</p>
                <p className="text-xs text-slate-500">{c.customerPhone}</p>
              </TableCell>
              <TableCell className="text-slate-400">{c.productName}</TableCell>
              <TableCell className="text-slate-400">{c.issueDetails}</TableCell>
              <TableCell>
                <Badge variant="outline" className={PRIORITY_STYLES[c.priority]}>
                  {c.priority}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
  <div className="flex items-center justify-end gap-2">
    <ForwardActions complaint={c} />
    {showDoneButton && onMarkDone && (
      <button
        onClick={() => onMarkDone(c._id)}
        className="text-slate-500 hover:text-emerald-400"
        title="Mark as Done"
      >
        <CheckCircle2 className="h-4 w-4" />
      </button>
    )}
    <button onClick={() => onDelete(c._id)} className="text-slate-500 hover:text-red-400">
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