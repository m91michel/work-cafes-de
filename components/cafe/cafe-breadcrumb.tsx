import React from "react";
import { Cafe } from "@/libs/types";
import MBreadcrumb from "../general/breadcrumb";
import { isGerman } from "@/libs/environment";

type Props = {
  cafe: Cafe;
  className?: string;
};

function CafeBreadcrumb({ cafe, className }: Props) {
  const cityName = isGerman ? cafe.cities?.name_de : cafe.cities?.name_en;
  const items = [
    { label: isGerman ? "Startseite" : "Home", href: "/cafes" },
    { label: cityName || cafe.city || "", href: `/cities/${cafe.city_slug}` },
    { label: cafe.name || "" },
  ];

  return <MBreadcrumb items={items} className={className} />;
}

export default CafeBreadcrumb;
