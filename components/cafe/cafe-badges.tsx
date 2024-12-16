import { Badge } from "../ui/badge";
import { ReactNode } from "react";

function getSeatingComfort(value?: string | null) {
  if (value === "Comfortable") {
    return "Komfortabel";
  } else if (value === "Very Comfortable") {
    return "Sehr Komfortabel";
  } else if (value === "Slightly Uncomfortable") {
    return "Unkomfortabel";
  }

  return "Unbekannt";
}

type Props = {
    value?: string | null;
    icon?: ReactNode | string;
}
export function SeatingComfortBadge({ value, icon }: Props) {
  return <Badge>{icon} {getSeatingComfort(value)}</Badge>;
}

function getWifiQualitity(value?: string | null) {
    if (value === "Excellent") {
      return "Gut";
    } else if (value === "Average") {
      return "Sehr Gut";
    } else if (value === "Poor") {
      return "Schlecht";
    }
  
  return "Unbekannt";
}

export function WifiQualitityBadge({ value, icon }: Props) {
  return <Badge>{icon}{getWifiQualitity(value)}</Badge>;
}

function getAmbiance(value?: string | null) {
  if (value === "Quiet and Cozy") {
    return "Leise";
  } else if (value === "Lively") {
    return "Lebhaft";
  } else if (value === "Noisy") {
    return "Laut";
  }

  return "Unbekannt";
}

export function AmbianceBadge({ value, icon }: Props) {
  return <Badge>{icon} {getAmbiance(value)}</Badge>;
}
