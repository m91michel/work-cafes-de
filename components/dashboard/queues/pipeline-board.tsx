"use client";

import { useEffect, useState } from "react";
import { PipelineCard } from "./pipeline-card";
import {
  PipelineData,
  PipelineQueryResponse,
  PIPELINE_TITLES,
} from "./pipeline-types";

export function PipelineBoard() {
  const [data, setData] = useState<PipelineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/debug/query");
        if (!response.ok) {
          throw new Error("Failed to fetch pipeline data");
        }
        const result: PipelineQueryResponse = await response.json();
        if (result.message === "success" && result.data) {
          setData(result.data);
        }
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Cafe Processing Pipeline</h2>
        <p className="text-muted-foreground">Loading pipeline data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Cafe Processing Pipeline</h2>
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const pipelineStages = Object.entries(data) as Array<
    [keyof PipelineData, (typeof data)[keyof PipelineData]]
  >;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Cafe Processing Pipeline</h2>
      <div className="w-full overflow-x-auto pb-4 max-w-full">
        <div className="flex gap-4 max-w-full">
          {pipelineStages.map(([key, stage]) => (
            <div key={key} className="flex-shrink-0 w-60 flex flex-col">
              <div className="mb-3">
                <h3 className="text-base font-semibold flex items-center justify-between">
                  <span>{PIPELINE_TITLES[key]}</span>
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({stage.count})
                  </span>
                </h3>
              </div>
              <div className="flex-1">
                {stage.cafes.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No cafes in this stage
                  </p>
                ) : (
                  stage.cafes.map((cafe) => (
                    <PipelineCard key={cafe.id} cafe={cafe} />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
