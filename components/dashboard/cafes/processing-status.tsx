"use client";

import { MapPin, MessageSquare, FileText, Eye } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDistanceToNow } from "date-fns";
import { Processed } from "@/libs/types";

interface ProcessingStatusProps {
  processed?: Processed | null;
}

interface ProcessingStep {
  key: keyof Processed;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PROCESSING_STEPS: ProcessingStep[] = [
  {
    key: "google_details_at",
    label: "Google Details",
    icon: MapPin,
  },
  {
    key: "google_reviews_at",
    label: "Google Reviews",
    icon: MessageSquare,
  },
  {
    key: "checked_reviews_at",
    label: "Checked Reviews",
    icon: Eye,
  },
  {
    key: "fetched_website_content_at",
    label: "Website Content",
    icon: FileText,
  },
];

export function ProcessingStatus({ processed }: ProcessingStatusProps) {
  const formatTimestamp = (timestamp: string | null | undefined): string => {
    if (!timestamp) return "Not processed";
    try {
      const date = new Date(timestamp);
      return `${formatDistanceToNow(date, { addSuffix: true })} (${date.toLocaleString()})`;
    } catch {
      return "Invalid date";
    }
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        {PROCESSING_STEPS.map((step) => {
          const timestamp = processed?.[step.key];
          const isProcessed = !!timestamp;
          const Icon = step.icon;

          return (
            <Tooltip key={step.key}>
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  <Icon
                    className={`h-4 w-4 ${
                      isProcessed
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  <p className="font-semibold">{step.label}</p>
                  <p className="text-xs">{formatTimestamp(timestamp)}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

