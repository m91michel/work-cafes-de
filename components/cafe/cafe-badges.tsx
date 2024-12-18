import { Badge, BadgeProps } from "../ui/badge";
import { ReactNode } from "react";

type Props = {
  value?: string | null;
  icon?: ReactNode | string;
}

function getWifiQuality(value?: string | null) {
    if (value === "Excellent") {
      return {
        text: "Sehr Gut",
        variant: "success"
      };
    } else if (value === "Average") {
      return {
        text: "Mittel",
        variant: "warning"
      };
    } else if (value === "Poor") {
      return {
        text: "Schlecht",
        variant: "destructive"
      };
    }

  return {
    text: "Unbekannt",
    variant: "default"
  };
}

export function WifiQualityBadge({ value, icon }: Props) {
  const { text, variant } = getWifiQuality(value);

  return <Badge variant={variant as BadgeProps["variant"]}>{icon}{text}</Badge>;
}

function getSeatingComfort(value?: string | null) {
  if (value === "Comfortable") {
    return {
      text: "Komfortabel",
      variant: "success"
    };
  } else if (value === "Very Comfortable") {
    return {
      text: "Sehr Komfortabel",
      variant: "success"
    };
  } else if (value === "Slightly Uncomfortable") {
    return {
      text: "Unkomfortabel",
      variant: "destructive"
    };
  }

  return {
    text: "Unbekannt",
    variant: "default"
  };
}
export function SeatingComfortBadge({ value, icon }: Props) {
  const { text, variant } = getSeatingComfort(value);
  return <Badge variant={variant as BadgeProps["variant"]}>{icon}{text}</Badge>;
}

function getAmbiance(value?: string | null) {
  if (value === "Quiet and Cozy") {
    return {
      text: "Leise",
      variant: "success"
    };
  } else if (value === "Lively") {
    return {
      text: "Lebhaft",
      variant: "warning"
    };
  } else if (value === "Noisy") {
    return {
      text: "Laut",
      variant: "destructive"
    };
  }

  return {
    text: "Unbekannt",
    variant: "default"
  };
}

export function AmbianceBadge({ value, icon }: Props) {
  const { text, variant } = getAmbiance(value);
  return <Badge variant={variant as BadgeProps["variant"]}>{icon}{text}</Badge>;
}
