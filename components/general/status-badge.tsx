import { Badge } from "@/components/ui/badge";
import { CafeStatus } from "@/libs/types";

interface StatusBadgeProps {
  status: CafeStatus | string | null | undefined;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  if (!status) return null;

  const getStatusVariant = (
    status: string
  ): "default" | "success" | "warning" | "destructive" => {
    switch (status) {
      case "PUBLISHED":
        return "success";
      case "PROCESSED":
        return "default";
      case "CLOSED":
        return "destructive";
      case "DISCARDED":
        return "destructive";
      default:
        return "warning";
    }
  };

  return (
    <Badge variant={getStatusVariant(status)} className={className}>
      {status}
    </Badge>
  );
}

