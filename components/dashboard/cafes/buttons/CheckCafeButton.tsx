import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Cafe } from "@/libs/types";
import { Check } from "lucide-react";
import { useState } from "react";

type Props = {
    cafe: Cafe;
    title?: string;
};

export function CheckCafeButton({ cafe, title }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const updateCheckedStatus = async () => {
    try {
      setIsLoading(true);
      await updateStatus(cafe.id, { checked: "CHECKED" });
      toast({
        title: "Checked",
        description: `Cafe has been checked`,
      });
    } catch (error) {
      console.error("Failed to update checked status:", error);
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
    <Button
      variant="outline"
      size="sm"
      disabled={isLoading}
      onClick={updateCheckedStatus}
    >
      <Check className="h-4 w-4" />
      {title}
    </Button>
  );
}

async function updateStatus(cafeId?: string | null, data?: Partial<Cafe>) {
  if (!cafeId) {
    throw new Error("Cafe ID is required");
  }
  const response = await fetch(`/api/cafes/${cafeId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update cafe");
  }

  return await response.json();
}
