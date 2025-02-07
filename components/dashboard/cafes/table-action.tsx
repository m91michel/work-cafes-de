
import { Cafe } from "@/libs/types";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { CheckCafeButton } from "./buttons/CheckCafeButton";
import { StatusDropdown } from "./buttons/StatusDropdown";

interface CafeActionsProps {
  cafe: Cafe;
}

export function CafeActions({ cafe }: CafeActionsProps) {
  

  

  return (
    <div className="flex items-center">
      <Link
        href={`/cafes/${cafe.slug}`}
        className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted"
      >
        <ExternalLink className="h-4 w-4" />
      </Link>

      <StatusDropdown cafe={cafe} />
      <CheckCafeButton cafe={cafe} />
    </div>
  );
}

