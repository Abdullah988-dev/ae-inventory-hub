"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Plus, Search, Wallet, TrendingUp, TrendingDown, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatCard } from "@/components/dashboard/StatCard";
import { CompanyModal } from "@/components/ledger/CompanyModal";
import { CompanyTable } from "@/components/ledger/CompanyTable";

export default function PaymentDetailsPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any | null>(null);

  const fetchCompanies = useCallback(async (query = "") => {
    const res = await fetch(`/api/companies${query ? `?search=${query}` : ""}`);
    const data = await res.json();
    if (res.ok) setCompanies(data.data);
  }, []);

  const fetchStats = useCallback(async () => {
    const res = await fetch("/api/ledger/stats");
    const data = await res.json();
    if (res.ok) setStats(data.data);
  }, []);

  useEffect(() => {
    Promise.all([fetchCompanies(), fetchStats()]).finally(() => setIsLoading(false));
  }, [fetchCompanies, fetchStats]);

  useEffect(() => {
    const timeout = setTimeout(() => fetchCompanies(search), 300);
    return () => clearTimeout(timeout);
  }, [search, fetchCompanies]);

  function handleAddClick() {
    setEditingCompany(null);
    setIsModalOpen(true);
  }

  function handleEditClick(company: any) {
    setEditingCompany({
      _id: company._id,
      name: company.name,
      openingBalance: company.openingBalance,
      notes: company.notes ?? "",
    });
    setIsModalOpen(true);
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/companies/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message ?? "Failed to delete company");
      return;
    }

    toast.success("Company deleted");
    fetchCompanies(search);
    fetchStats();
  }

  async function handleToggleStatus(id: string, isActive: boolean) {
    const res = await fetch(`/api/companies/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message ?? "Failed to update status");
      return;
    }

    toast.success(isActive ? "Company marked active" : "Company marked inactive");
    fetchCompanies(search);
  }

  function handleSuccess() {
    fetchCompanies(search);
    fetchStats();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white">Payment Details</h1>
          <p className="mt-1 text-sm text-slate-400">Company-wise ledger and outstanding balances</p>
        </div>

        <Button
          onClick={handleAddClick}
          className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Company
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Outstanding"
          value={`Rs. ${(stats?.totalOutstanding ?? 0).toLocaleString()}`}
          icon={Wallet}
          accent="red"
          delay={0}
        />
        <StatCard
          label="Total Purchases"
          value={`Rs. ${(stats?.totalPurchases ?? 0).toLocaleString()}`}
          icon={TrendingUp}
          accent="indigo"
          delay={0.05}
        />
        <StatCard
          label="Total Payments"
          value={`Rs. ${(stats?.totalPayments ?? 0).toLocaleString()}`}
          icon={TrendingDown}
          accent="emerald"
          delay={0.1}
        />
        <StatCard
          label="Companies"
          value={stats?.companiesCount ?? 0}
          icon={Building2}
          accent="amber"
          delay={0.15}
        />
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search company..."
          className="border-slate-700 bg-slate-800/60 pl-9 text-white placeholder:text-slate-500"
        />
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center text-sm text-slate-500">
          Loading companies...
        </div>
      ) : (
        <CompanyTable
          companies={companies}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      )}

      <CompanyModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        editingCompany={editingCompany}
        onSuccess={handleSuccess}
      />
    </div>
  );
}