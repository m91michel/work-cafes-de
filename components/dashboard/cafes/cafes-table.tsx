"use client";

import { Cafe } from "@/libs/types";
import { DataTable } from "@/components/general/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import {
  ColumnDef,
  Row,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { CafeFilters } from "./cafe-filters";
import { useState } from "react";
import { CafeActions } from "./table-action";


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
        <Badge variant={status === "PUBLISHED" ? "default" : "secondary"}>
          {status}
        </Badge>
      );
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
