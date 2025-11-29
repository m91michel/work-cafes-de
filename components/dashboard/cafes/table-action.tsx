
import { Cafe } from "@/libs/types";
import { ExternalLink, Edit } from "lucide-react";
import Link from "next/link";
import { CheckCafeButton } from "./buttons/CheckCafeButton";
import { ProcessCafeButton } from "./buttons/ProcessCafeButton";
import { StatusDropdown } from "./buttons/StatusDropdown";
import Paths from "@/libs/paths";

interface CafeActionsProps {
  cafe: Cafe;
}

export function CafeActions({ cafe }: CafeActionsProps) {
  

  

  return (
    <div className="flex items-center gap-1">
      <Link
        href={`/cafes/${cafe.slug}`}
        className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted"
        title="View cafe"
      >
        <ExternalLink className="h-4 w-4" />
      </Link>
      <Link
        href={Paths.cafeEdit(cafe.slug)}
        className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted"
        title="Edit cafe"
      >
        <Edit className="h-4 w-4" />
      </Link>

      <StatusDropdown cafe={cafe} />
      <CheckCafeButton cafe={cafe} />
      <ProcessCafeButton cafe={cafe} />
    </div>
  );
}

