import React from "react";
import { Cafe } from "@/libs/types";
import MBreadcrumb from "../general/breadcrumb";

type Props = {
  cafe: Cafe;
  className?: string;
};

function CafeBreadcrumb({ cafe, className }: Props) {
  const items = [
    { label: "Startseite", href: "/cafes" },
    { label: cafe.city || "", href: `/cities/${cafe.city_slug}` },
    { label: cafe.name || "" },
  ];

  return <MBreadcrumb items={items} className={className} />;
}

export default CafeBreadcrumb;
