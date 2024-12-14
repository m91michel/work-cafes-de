import { Cafe } from "@/libs/types";
import { Badge } from "../ui/badge";

function getSeatingComfort(value?: string | null) {
  if (value === "Comfortable") {
    return "Komfortabel";
  } else if (value === "Very Comfortable") {
    return "Sehr Komfortabel";
  } else if (value === "Slightly Uncomfortable") {
    return "Leicht unkomfortabel";
  }

  return "Nicht angegeben";
}

type Props = {
    value?: string | null;
}
export function SeatingComfortBadge({ value }: Props) {
  return <Badge>{getSeatingComfort(value)}</Badge>;
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

export function WifiQualitityBadge({ value }: Props) {
  return <Badge>{getWifiQualitity(value)}</Badge>;
}

function getAmbiance(value?: string | null) {
  if (value === "Quiet and Cozy") {
    return "Leise und gemütlich";
  } else if (value === "Lively") {
    return "Lebhaft";
  } else if (value === "Noisy") {
    return "Laut";
  }

  return "Unbekannt";
}

export function AmbianceBadge({ value }: Props) {
  return <Badge>{getAmbiance(value)}</Badge>;
}