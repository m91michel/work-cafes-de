"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function CityFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.set("page", "1"); // Reset to first page when filtering
      router.push(`/dashboard/cities?${params.toString()}`);
    },
    [router, searchParams]
  );

  const status = searchParams.get("status") || undefined;
  const limit = searchParams.get("limit") || "100";

  return (
    <div className="flex gap-4 justify-between">
      <div className="w-full md:w-1/3">
        <Label>Filter by Status</Label>
        <Select
          value={status || "all"}
          onValueChange={(value) =>
            updateFilter("status", value === "all" ? undefined : value)
          }
        >
          <SelectTrigger className="min-w-40">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="NEW">New</SelectItem>
            <SelectItem value="READY">Ready</SelectItem>
            <SelectItem value="PROCESSING">Processing</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="BOOSTED">Boosted</SelectItem>
            <SelectItem value="CHECK!">Check!</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full md:w-1/3">
        <Label>Page Size</Label>
        <Select
          value={limit}
          onValueChange={(value) => updateFilter("limit", value)}
        >
          <SelectTrigger className="min-w-40">
            <SelectValue placeholder="Select page size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
            <SelectItem value="200">200</SelectItem>
            <SelectItem value="500">500</SelectItem>
            <SelectItem value="1000">1000</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

