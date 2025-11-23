"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { JOB_NAMES } from "@/libs/jobs/job-names";
import { Cafe } from "@/libs/types";
import { Play, ChevronDown } from "lucide-react";
import { useState } from "react";

type Props = {
  cafe: Cafe;
  title?: string;
};

type JobOption = {
  name: string;
  label: string;
  description: string;
};

const JOB_OPTIONS: JobOption[] = [
  {
    name: JOB_NAMES.googleMapsDetails,
    label: "Fetch Google Maps Details",
    description: "Fetch and update cafe details from Google Maps",
  },
  {
    name: JOB_NAMES.googleMapsImages,
    label: "Fetch Google Maps Images",
    description: "Fetch and upload cafe images from Google Maps",
  },
  {
    name: JOB_NAMES.cafeFetchReviews,
    label: "Fetch Reviews",
    description: "Fetch reviews from Google Maps",
  },
  {
    name: JOB_NAMES.cafeEvalPublishStatus,
    label: "Evaluate Publish Status",
    description: "Evaluate the publish status of the cafe",
  },
  {
    name: JOB_NAMES.cafeFetchAboutContent,
    label: "Fetch About Content",
    description: "Fetch and update cafe about content",
  },
];

export function ProcessCafeButton({ cafe, title }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleJobExecution = async (jobName: string) => {
    if (!cafe.id) {
      toast({
        title: "Error",
        description: "Cafe ID is missing",
        variant: "destructive",
      });
      return;
    }

    const jobOption = JOB_OPTIONS.find((job) => job.name === jobName);
    const jobLabel = jobOption?.label || jobName;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/cafes/${cafe.id}/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobName }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to enqueue job");
      }

      toast({
        title: "Job Enqueued",
        description: `${jobLabel} has been queued for ${cafe.name}`,
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isLoading}>
          <Play className="h-4 w-4 mr-2" />
          {title || "Process"}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {JOB_OPTIONS.map((job) => (
          <DropdownMenuItem
            key={job.name}
            onClick={() => handleJobExecution(job.name)}
            disabled={isLoading}
          >
            <div className="flex flex-col">
              <span className="font-medium">{job.label}</span>
              <span className="text-xs text-muted-foreground">
                {job.description}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

