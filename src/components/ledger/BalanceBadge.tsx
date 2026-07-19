import { Badge } from "@/components/ui/badge";

interface BalanceBadgeProps {
  outstandingBalance: number;
  totalPayments: number;
}

export function BalanceBadge({ outstandingBalance, totalPayments }: BalanceBadgeProps) {
  if (outstandingBalance <= 0) {
    return (
      <Badge variant="outline" className="border-emerald-500/40 text-emerald-400">
        Paid
      </Badge>
    );
  }

  if (totalPayments > 0) {
    return (
      <Badge variant="outline" className="border-amber-500/40 text-amber-400">
        Partial Due
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="border-red-500/40 text-red-400">
      Due
    </Badge>
  );
}