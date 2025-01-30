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
import { Table } from "@tanstack/react-table";
import { Cafe } from "@/libs/types";

interface CafeFiltersProps {
  table: Table<Cafe>;
}

export function CafeFilters({ table }: CafeFiltersProps) {
  const status = table.getColumn("status")?.getFilterValue() as string;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label>Search by Name</Label>
        <Input
          placeholder="Search cafes..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="space-y-2">
        <Label>Filter by City</Label>
        <Input
          placeholder="Filter by city..."
          value={(table.getColumn("city")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("city")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="space-y-2">
        <Label>Filter by Status</Label>
        <Select
          value={status || undefined}
          onValueChange={(value) =>
            table.getColumn("status")?.setFilterValue(value === "all" ? undefined : value)
          }
        >
          <SelectTrigger className="max-w-sm">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="NEW">New</SelectItem>
            <SelectItem value="PROCESSED">Processed</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 