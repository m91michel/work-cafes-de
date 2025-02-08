'use client';

import { useCTranslation } from "@/hooks/use-translation";
import { Badge, BadgeProps } from "../ui/badge";
import { ReactNode } from "react";

type Props = {
  value?: string | null;
  icon?: ReactNode | string;
}

function getWifiQuality(value?: string | null) {
  switch (value) {
    case "Excellent":
      return {
        variant: "success"
      };
    case "Average":
      return {
        variant: "warning"
      };
    case "Poor":
      return {
        variant: "destructive"
      };
    case "Good":
      return {
        variant: "success"
      };
    case "Available":
      return {
        variant: "success"
      };
    case "Unavailable":
      return {
        variant: "destructive"
      };
    default:
      return {
        variant: "warning"
      };
  }
}

export function WifiQualityBadge({ value, icon }: Props) {
  const { variant } = getWifiQuality(value);
  const { t } = useCTranslation('cafe');
  const key = translateValue(value);

  return <Badge variant={variant as BadgeProps["variant"]}>{icon}{t(`details.wifi_quality.${key}`)}</Badge>;
}

function getSeatingComfort(value?: string | null) {
  switch (value) {
    case "Comfortable":
      return {
        variant: "success"
      };
    case "Very Comfortable":
      return {
        variant: "success"
      };
    case "Slightly Uncomfortable":
      return {
        variant: "destructive"
      };
    default:
      return {
        variant: "default"
      };
  }
}

export function SeatingComfortBadge({ value, icon }: Props) {
  const { variant } = getSeatingComfort(value);
  const { t } = useCTranslation('cafe');
  const key = translateValue(value);
  return <Badge variant={variant as BadgeProps["variant"]}>{icon}{t(`details.seating_comfort.${key}`)}</Badge>;
}

function getAmbiance(value?: string | null) {
  switch (value) {
    case "Quiet and Cozy":
      return {
        variant: "success"
      };
    case "Lively":
      return {
        variant: "warning"
      };
    case "Noisy":
      return {
        variant: "destructive"
      };
    default:
      return {
        variant: "default"
      };
  }
}

export function AmbianceBadge({ value, icon }: Props) {
  const { variant } = getAmbiance(value);
  const { t } = useCTranslation('cafe');
  const key = translateValue(value);
  return <Badge variant={variant as BadgeProps["variant"]}>{icon}{t(`details.ambiance.${key}`)}</Badge>;
}

function translateValue(value?: string | null) {
  if (!value) return "unknown";
  return value.toLowerCase().replace(" ", "-").replace(" ", "-");
}