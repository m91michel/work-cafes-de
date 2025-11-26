"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { JOB_NAMES } from "@/libs/jobs/job-names";
import type { ButtonProps } from "@/components/ui/button";

type JobButtonProps = Omit<ButtonProps, "onClick"> & {
  jobName: keyof typeof JOB_NAMES;
  label?: string;
  successMessage?: string;
  errorMessage?: string;
};

export function JobButton({
  jobName,
  label,
  successMessage,
  errorMessage,
  children,
  ...buttonProps
}: JobButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleJobTrigger = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/jobs/${JOB_NAMES[jobName]}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to enqueue job");
      }

      const data = await response.json();

      toast({
        title: "Job Enqueued",
        description: successMessage || data.message || `${jobName} job has been queued`,
      });
    } catch (error) {
      console.error("Failed to enqueue job:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : errorMessage || "Failed to enqueue job",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      {...buttonProps}
      onClick={handleJobTrigger}
      disabled={isLoading || buttonProps.disabled}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        children || label || jobName
      )}
    </Button>
  );
}

