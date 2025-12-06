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
import { getCountryByCode } from "@/config/countires";

export const columns: ColumnDef<City>[] = [
  {
    accessorKey: "name_en",
    header: "Name",
    enableSorting: true,
    cell: ({ row }: { row: Row<City> }) => {
      const nameEn = row.getValue("name_en") as string | null;
      const nameDe = row.original.name_de;
      return (
        <div>
          <div className="font-medium">{nameEn || nameDe || "N/A"}</div>
          {nameEn && nameDe && nameEn !== nameDe && (
            <div className="text-sm text-muted-foreground">{nameDe}</div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "country",
    header: "Country",
    enableSorting: true,
    cell: ({ row }: { row: Row<City> }) => {
      const countryCode = row.original.country_code;
      const country = countryCode ? getCountryByCode(countryCode) : null;
      const countryName = row.getValue("country") as string | null;
      
      return (
        <div className="flex items-center gap-2">
          {country?.flag && <span>{country.flag}</span>}
          <span>{countryName || "N/A"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "state",
    header: "State",
    enableSorting: true,
  },
  {
    accessorKey: "population",
    header: "Population",
    enableSorting: true,
    cell: ({ row }: { row: Row<City> }) => {
      const population = row.getValue("population") as number;
      return population || 0;
    },
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

