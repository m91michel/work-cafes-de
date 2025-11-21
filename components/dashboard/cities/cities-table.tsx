"use client";

import { City } from "@/libs/types";
import { DataTable } from "@/components/general/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import {
  ColumnDef,
  Row,
  SortingState,
} from "@tanstack/react-table";
import { CityFilters } from "./city-filters";
import { useState } from "react";
import { CityActions } from "./table-action";

export const columns: ColumnDef<City>[] = [
  {
    accessorKey: "name_en",
    header: "Name (EN)",
    enableSorting: true,
    cell: ({ row }: { row: Row<City> }) => (
      <div className="font-medium">{row.getValue("name_en") || row.original.name_de || "N/A"}</div>
    ),
  },
  {
    accessorKey: "name_de",
    header: "Name (DE)",
    enableSorting: true,
    cell: ({ row }: { row: Row<City> }) => (
      <div>{row.getValue("name_de") || "N/A"}</div>
    ),
  },
  {
    accessorKey: "country",
    header: "Country",
    enableSorting: true,
  },
  {
    accessorKey: "state",
    header: "State",
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
    cell: ({ row }: { row: Row<City> }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "PUBLISHED" ? "default" : "secondary"}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "cafes_count",
    header: "Cafes",
    enableSorting: true,
    cell: ({ row }: { row: Row<City> }) => {
      const count = row.getValue("cafes_count") as number;
      return count || 0;
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    cell: ({ row }: { row: Row<City> }) => {
      return <CityActions city={row.original} />;
    },
  },
];

interface CitiesTableProps {
  data: City[];
}

export function CitiesTable({ data }: CitiesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  return (
    <DataTable
      columns={columns}
      data={data}
      sorting={sorting}
      columnFilters={[]}
      onSortingChange={setSorting}
      onColumnFiltersChange={() => {}}
      filterComponent={<CityFilters />}
    />
  );
}

