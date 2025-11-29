"use client";

import { Cafe } from "@/libs/types";
import { DataTable } from "@/components/general/data-table/data-table";
import {
  ColumnDef,
  Row,
  SortingState,
} from "@tanstack/react-table";
import { CafeFilters } from "./cafe-filters";
import { useState } from "react";
import { CafeActions } from "./table-action";
import { StatusBadge } from "@/components/general/status-badge";
import { getCountryByCode } from "@/config/countires";
import { ProcessingStatus } from "./processing-status";

export const columns: ColumnDef<Cafe>[] = [
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ row }: { row: Row<Cafe> }) => {
      const cafe = row.original;
      return (
        <div>
          <div className="font-medium">{cafe.name}</div>
          {cafe.address && (
            <div className="text-sm text-muted-foreground mt-0.5">
              {cafe.address}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "city",
    header: "City",
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ row }: { row: Row<Cafe> }) => {
      const cafe = row.original;
      const cityName = row.getValue("city") as string;
      const countryCode = cafe.cities?.country_code;
      const country = countryCode ? getCountryByCode(countryCode) : null;
      
      return (
        <div>
          <div className="font-medium">{cityName || "N/A"}</div>
          {country && (
            <div className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
              <span>{country.flag}</span>
              <span>{country.name}</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "review_count",
    header: "Reviews",
    enableSorting: true,
  },
  {
    accessorKey: "google_rating",
    header: "Rating",
    enableSorting: true,
    cell: ({ row }: { row: Row<Cafe> }) => {
      const rating = row.getValue("google_rating") as number;
      return rating?.toFixed(1) || "N/A";
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ row }: { row: Row<Cafe> }) => {
      const status = row.getValue("status") as string;
      return <StatusBadge status={status} />;
    },
  },
  {
    accessorKey: "processed",
    header: "Processing",
    enableSorting: false,
    cell: ({ row }: { row: Row<Cafe> }) => {
      const processed = row.original.processed;
      return <ProcessingStatus processed={processed} />;
    },
  },
  {
    accessorKey: "checked",
    header: "Checked",
    enableSorting: true,
    enableColumnFilter: true
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    cell: ({ row }: { row: Row<Cafe> }) => {
      return <CafeActions cafe={row.original} />;
    },
  },
];

interface CafesTableProps {
  data: Cafe[];
}

export function CafesTable({ data }: CafesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  return (
    <DataTable
      columns={columns}
      data={data}
      sorting={sorting}
      columnFilters={[]}
      onSortingChange={setSorting}
      onColumnFiltersChange={() => {}}
      filterComponent={<CafeFilters />}
    />
  );
}
