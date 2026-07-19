"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Plus, FileDown, FileSpreadsheet, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BalanceBadge } from "@/components/ledger/BalanceBadge";
import { TransactionModal } from "@/components/ledger/TransactionModal";
import { LedgerHistoryTable } from "@/components/ledger/LedgerHistoryTable";
import { exportLedgerToExcel, exportLedgerToPdf } from "@/lib/ledgerExport";

export default function CompanyLedgerPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.companyId as string;

  const [company, setCompany] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCompany = useCallback(async () => {
    const res = await fetch(`/api/companies?search=`);
    const data = await res.json();
    if (res.ok) {
      const found = data.data.find((c: any) => c._id === companyId);
      setCompany(found ?? null);
    }
  }, [companyId]);

  const fetchTransactions = useCallback(async () => {
    const query = new URLSearchParams({ company: companyId });
    if (fromDate) query.set("from", fromDate);
    if (toDate) query.set("to", toDate);

    const res = await fetch(`/api/ledger?${query.toString()}`);
    const data = await res.json();
    if (res.ok) setTransactions(data.data);
  }, [companyId, fromDate, toDate]);

  useEffect(() => {
    Promise.all([fetchCompany(), fetchTransactions()]).finally(() => setIsLoading(false));
  }, [fetchCompany, fetchTransactions]);

  useEffect(() => {
    fetchTransactions();
  }, [fromDate, toDate, fetchTransactions]);

  function handleExportExcel() {
    if (!company) return;
    exportLedgerToExcel(company.name, transactions);
  }

  function handleExportPdf() {
    if (!company) return;
    exportLedgerToPdf(company.name, transactions);
  }

  function handlePrint() {
    window.print();
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-500">
        Loading ledger...
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-sm text-slate-500">
        Company not found.
        <Button variant="outline" onClick={() => router.push("/dashboard/payment-details")}>
          Back to Payment Details
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.push("/dashboard/payment-details")}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Companies
      </button>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-white">{company.name}</h1>
            <BalanceBadge
              outstandingBalance={company.outstandingBalance}
              totalPayments={company.totalPayments}
            />
          </div>
          {company.notes && <p className="mt-1 text-sm text-slate-400">{company.notes}</p>}
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400">Opening Balance</p>
          <p className="mt-1 text-lg font-semibold text-white">
            Rs. {company.openingBalance.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400">Total Purchases</p>
          <p className="mt-1 text-lg font-semibold text-indigo-400">
            Rs. {company.totalPurchases.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400">Total Payments</p>
          <p className="mt-1 text-lg font-semibold text-emerald-400">
            Rs. {company.totalPayments.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400">Outstanding</p>
          <p className="mt-1 text-lg font-semibold text-white">
            Rs. {company.outstandingBalance.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-slate-400">From</Label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border-slate-700 bg-slate-800/60 text-white [color-scheme:dark]"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-slate-400">To</Label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border-slate-700 bg-slate-800/60 text-white [color-scheme:dark]"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={handleExportExcel}
            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Excel
          </Button>
          <Button
            variant="outline"
            onClick={handleExportPdf}
            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <FileDown className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button
            variant="outline"
            onClick={handlePrint}
            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <LedgerHistoryTable transactions={transactions} />

      <TransactionModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        companyId={companyId}
        onSuccess={() => {
          fetchCompany();
          fetchTransactions();
        }}
      />
    </div>
  );
}