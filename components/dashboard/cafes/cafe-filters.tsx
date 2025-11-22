"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect, useRef } from "react";

export function CafeFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nameTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateFilter = useCallback(
    (key: string, value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all" && value !== "") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.set("page", "1"); // Reset to first page when filtering
      router.push(`/dashboard/cafes?${params.toString()}`);
    },
    [router, searchParams]
  );

  const status = searchParams.get("status") || undefined;
  const [name, setName] = useState(searchParams.get("name") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");

  // Sync local state with URL params
  useEffect(() => {
    setName(searchParams.get("name") || "");
    setCity(searchParams.get("city") || "");
  }, [searchParams]);

  const handleNameChange = (value: string) => {
    setName(value);
    if (nameTimeoutRef.current) {
      clearTimeout(nameTimeoutRef.current);
    }
    nameTimeoutRef.current = setTimeout(() => {
      updateFilter("name", value || undefined);
    }, 500);
  };

  const handleCityChange = (value: string) => {
    setCity(value);
    if (cityTimeoutRef.current) {
      clearTimeout(cityTimeoutRef.current);
    }
    cityTimeoutRef.current = setTimeout(() => {
      updateFilter("city", value || undefined);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (nameTimeoutRef.current) {
        clearTimeout(nameTimeoutRef.current);
      }
      if (cityTimeoutRef.current) {
        clearTimeout(cityTimeoutRef.current);
      }
    };
  }, []);

  const limit = searchParams.get("limit") || "100";

  return (
    <div className="flex gap-4 justify-between flex-wrap">
      <div className="w-full md:w-1/4">
        <Label>Search by Name</Label>
        <Input
          placeholder="Search cafes..."
          value={name}
          onChange={(event) => handleNameChange(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="w-full md:w-1/4">
        <Label>Filter by City</Label>
        <Input
          placeholder="Filter by city..."
          value={city}
          onChange={(event) => handleCityChange(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="w-full md:w-1/4">
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
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="NEW">New</SelectItem>
            <SelectItem value="PROCESSED">Processed</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
            <SelectItem value="UNKNOWN">Unknown</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full md:w-1/4">
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