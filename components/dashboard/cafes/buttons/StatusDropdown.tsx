import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { DropdownMenuContent } from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { NotebookPen } from "lucide-react";
import { Cafe, validStatuses } from "@/libs/types";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

type Props = {
  cafe: Cafe;
  title?: string;
}

export function StatusDropdown({ cafe, title  }: Props) {
    const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

    const handleStatusChange = async (newStatus: string) => {
        try {
          setIsLoading(true);
          await updateCafeStatus(cafe.id, newStatus);
          toast({
            title: "Status updated",
            description: `Cafe status has been updated to ${newStatus}`,
          });
          // Simple page reload after successful update
          // window.location.reload();
        } catch (error) {
          console.error("Failed to update status:", error);
          toast({
            title: "Error",
            description:
              error instanceof Error ? error.message : "Failed to update status",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };

    return (
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={isLoading}>
            <NotebookPen className="h-4 w-4" />
            {title}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {validStatuses.map((status) => (
            <DropdownMenuItem
              key={status}
              onClick={() => handleStatusChange(status)}
            >
              {status}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
}

async function updateCafeStatus(cafeId: string, status: string) {
    const response = await fetch(`/api/cafes/${cafeId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update status");
    }
  
    return await response.json();
  }
  