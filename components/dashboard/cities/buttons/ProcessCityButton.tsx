"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Play, Loader2 } from "lucide-react";
import { City } from "@/libs/types";
import { JOB_NAMES } from "@/libs/jobs/job-names";

interface Props {
  city: City;
  title?: string;
}

type JobOption = {
  name: string;
  label: string;
  description: string;
};

const JOB_OPTIONS: JobOption[] = [
  {
    name: JOB_NAMES.citySearchForCafes,
    label: "Search for Cafes",
    description: "Search for new cafes in this city",
  },
  {
    name: JOB_NAMES.cityGenerateImage,
    label: "Generate Image",
    description: "Generate a preview image for this city",
  },
  {
    name: JOB_NAMES.cityGenerateDescription,
    label: "Generate Description",
    description: "Generate descriptions (EN/DE) for this city",
  },
  {
    name: JOB_NAMES.cityUpdateCafeStats,
    label: "Update Cafe Stats",
    description: "Update cafe count and statistics for this city",
  },
];

export function ProcessCityButton({ city, title }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleJobExecution = async (jobName: string) => {
    if (!city.slug) {
      toast({
        title: "Error",
        description: "City slug is missing",
        variant: "destructive",
      });
      return;
    }

    const jobOption = JOB_OPTIONS.find((job) => job.name === jobName);
    const jobLabel = jobOption?.label || jobName;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/cities/${city.slug}/process`, {
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
        description: `${jobLabel} has been queued for ${city.name_en || city.name_de}`,
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
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              {title || "Process"}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Available Jobs</DropdownMenuLabel>
        <DropdownMenuSeparator />
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

