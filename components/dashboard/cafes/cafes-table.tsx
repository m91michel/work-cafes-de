"use client";

import { Cafe } from "@/libs/types";
import { DataTable } from "@/components/ui/data-table/data-table";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  ColumnDef, 
  Row, 
  useReactTable, 
  getCoreRowModel, 
  getFilteredRowModel, 
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  OnChangeFn,
} from "@tanstack/react-table";
import { CafeFilters } from "./cafe-filters";
import { useState } from "react";

export const columns: ColumnDef<Cafe>[] = [
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ row }: { row: Row<Cafe> }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "city",
    header: "City",
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "review_count",
    header: "Reviews",
    enableSorting: true,
  },
  {
    accessorKey: "address",
    header: "Address",
    enableSorting: false,
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
      return (
        <Badge variant={status === "published" ? "default" : "secondary"}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    cell: ({ row }: { row: Row<Cafe> }) => {
      const cafe = row.original;
      return (
        <div className="flex items-center gap-2">
          <Link
            href={`/cafes/${cafe.slug}`}
            className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      );
    },
  },
];

interface CafesTableProps {
  data: Cafe[];
}

export function CafesTable({ data }: CafesTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <DataTable
      columns={columns}
      data={data}
      sorting={sorting}
      columnFilters={columnFilters}
      onSortingChange={setSorting}
      onColumnFiltersChange={setColumnFilters}
      filterComponent={<CafeFilters table={table} />}
    />
  );
} 