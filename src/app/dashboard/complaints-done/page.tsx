"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { ComplaintTable } from "@/components/complaints/ComplaintTable";

export default function ComplaintsDonePage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComplaints = useCallback(async () => {
    const res = await fetch("/api/complaints?status=done");
    const data = await res.json();
    if (res.ok) setComplaints(data.data);
  }, []);

  useEffect(() => {
    fetchComplaints().finally(() => setIsLoading(false));
  }, [fetchComplaints]);

  async function handleDelete(id: string) {
    const res = await fetch(`/api/complaints/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message ?? "Failed to delete complaint");
      return;
    }

    toast.success("Complaint deleted");
    fetchComplaints();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Complaint Done</h1>
        <p className="mt-1 text-sm text-slate-400">Resolved customer complaints</p>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center text-sm text-slate-500">
          Loading...
        </div>
      ) : (
        <ComplaintTable
          complaints={complaints}
          onDelete={handleDelete}
          showDoneButton={false}
        />
      )}
    </div>
  );
}