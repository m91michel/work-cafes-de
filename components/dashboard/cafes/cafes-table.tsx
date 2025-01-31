"use client";

import { Cafe } from "@/libs/types";
import { DataTable } from "@/components/ui/data-table/data-table";
import { ExternalLink, MoreHorizontal } from "lucide-react";
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
} from "@tanstack/react-table";
import { CafeFilters } from "./cafe-filters";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

async function updateCafeStatus(cafeId: string, status: string) {
  const response = await fetch(`/api/cafes/${cafeId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update status");
  }

  return await response.json();
}

interface CafeActionsProps {
  cafe: Cafe;
}

function CafeActions({ cafe }: CafeActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: string) => {
    try {
      setIsLoading(true);
      await updateCafeStatus(cafe.id, newStatus);
      toast({
        title: "Status updated",
        description: `Cafe status has been updated to ${newStatus}`,
      });
      // Simple page reload after successful update
      window.location.reload();
    } catch (error) {
      console.error("Failed to update status:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/cafes/${cafe.slug}`}
        className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted"
      >
        <ExternalLink className="h-4 w-4" />
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" disabled={isLoading}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleStatusChange("PROCESSED")}>
            PROCESSED
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange("PUBLISHED")}>
            PUBLISHED
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange("CLOSED")}>
            CLOSED
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange("CHECKED")}>
            CHECKED
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange("NOT_FRIENDLY")}>
            NOT_FRIENDLY
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

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
