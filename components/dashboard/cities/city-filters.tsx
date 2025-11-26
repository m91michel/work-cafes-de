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
import { useEffect, useState } from "react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useDebounceCallback } from "usehooks-ts";

export function CityFilters() {
  const [{ name, status, limit }, setFilters] = useQueryStates(
    {
      name: parseAsString.withDefault(""),
      status: parseAsString,
      limit: parseAsInteger.withDefault(100),
      page: parseAsInteger.withDefault(1),
    },
    {
      history: "push",
      shallow: false,
    }
  );

  const [nameInput, setNameInput] = useState(name || "");

  // Keep local input in sync when navigating/back/forward
  useEffect(() => {
    setNameInput(name || "");
  }, [name]);

  const debouncedUpdateFilters = useDebounceCallback(
    (patch: { name?: string | null }) => {
      const updated: {
        name?: string | null;
        page: number;
      } = {
        page: 1, // reset to first page when filtering
      };

      if (patch.name !== undefined) {
        updated.name = patch.name;
      }

      setFilters(updated);
    },
    500
  );

  const handleNameChange = (value: string) => {
    setNameInput(value);
    debouncedUpdateFilters({
      name: value === "" ? null : value,
    });
  };

  const handleStatusChange = (value: string) => {
    setFilters({
      status: value === "all" ? null : value,
      page: 1,
    });
  };

  const handleLimitChange = (value: string) => {
    const numeric = Number(value) || 100;
    setFilters({
      limit: numeric,
      page: 1,
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 items-end">
      <div className="w-full">
        <Label>Search by Name</Label>
        <Input
          placeholder="Search cities (DE/EN)..."
          value={nameInput}
          onChange={(event) => handleNameChange(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="w-full">
        <Label>Filter by Status</Label>
        <Select
          value={status || "all"}
          onValueChange={handleStatusChange}
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
      <div className="w-full">
        <Label>Page Size</Label>
        <Select
          value={String(limit || 100)}
          onValueChange={handleLimitChange}
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
