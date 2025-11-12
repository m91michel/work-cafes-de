"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Cafe } from "@/libs/types";
import { Play } from "lucide-react";
import { useState } from "react";

type Props = {
  cafe: Cafe;
  title?: string;
};

export function ProcessCafeButton({ cafe, title }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleProcess = async () => {
    if (!cafe.id) {
      toast({
        title: "Error",
        description: "Cafe ID is missing",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/cafes/${cafe.id}/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to enqueue processing job");
      }

      toast({
        title: "Job Enqueued",
        description: `Processing job has been queued for ${cafe.name}`,
      });
    } catch (error) {
      console.error("Failed to enqueue processing job:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to enqueue processing job",
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
      onClick={handleProcess}
    >
      <Play className="h-4 w-4" />
      {title}
    </Button>
  );
}

