"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2 } from "lucide-react";

export function ProcessDuplicatesButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleProcessDuplicates = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/cafes/process-duplicates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to enqueue job");
      }

      toast({
        title: "Job Enqueued",
        description: "Duplicate processing job has been queued",
      });
    } catch (error) {
      console.error("Failed to enqueue job:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to enqueue job",
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
      onClick={handleProcessDuplicates}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <RefreshCw className="mr-2 h-4 w-4" />
          Process Duplicates
        </>
      )}
    </Button>
  );
}

