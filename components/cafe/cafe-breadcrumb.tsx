import React from "react";
import { Cafe, Country } from "@/libs/types";
import MBreadcrumb, { BreadcrumbItem } from "../general/breadcrumb";
import { isGerman } from "@/libs/environment";
import Paths from "@/libs/paths";

type Props = {
  cafe: Cafe;
  className?: string;
  country?: Country | null
};

function CafeBreadcrumb({ cafe, className, country }: Props) {
  const cityName = isGerman ? cafe.cities?.name_de : cafe.cities?.name_en;
  const countryName = country?.name;
  const items = [
    { label: isGerman ? "Startseite" : "Home", href: "/cafes" },
    countryName && { label: countryName, href: `${Paths.cities}?country=${country?.name}` },
    { label: cityName || cafe.city || "", href: `/cities/${cafe.city_slug}` },
    { label: cafe.name || "" },
  ].filter(Boolean);

  return <MBreadcrumb items={items as BreadcrumbItem[]} className={className} />;
}

export default CafeBreadcrumb;
