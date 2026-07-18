"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComplaintModal } from "@/components/complaints/ComplaintModal";
import { ComplaintTable } from "@/components/complaints/ComplaintTable";

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchComplaints = useCallback(async () => {
    const res = await fetch("/api/complaints?status=registered");
    const data = await res.json();
    if (res.ok) setComplaints(data.data);
  }, []);

  useEffect(() => {
    fetchComplaints().finally(() => setIsLoading(false));
  }, [fetchComplaints]);

  function handleRegistered() {
    fetchComplaints();
  }

  async function handleMarkDone(id: string) {
    const res = await fetch(`/api/complaints/${id}`, { method: "PATCH" });
    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message ?? "Failed to update complaint");
      return;
    }

    toast.success("Complaint marked as done");
    fetchComplaints();
  }

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
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white">Complaint Register</h1>
          <p className="mt-1 text-sm text-slate-400">Pending customer complaints</p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
        >
          <Plus className="mr-2 h-4 w-4" />
          Register Complaint
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center text-sm text-slate-500">
          Loading...
        </div>
      ) : (
        <ComplaintTable
          complaints={complaints}
          onMarkDone={handleMarkDone}
          onDelete={handleDelete}
        />
      )}

      <ComplaintModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleRegistered}
      />
    </div>
  );
}