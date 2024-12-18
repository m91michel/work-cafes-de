"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ReportModal } from "./ReportModal";
import { Cafe } from "@/libs/types";

interface ReportButtonProps {
  cafe: Cafe;
  text?: string;
  className?: string;
}

export function ReportButton({ cafe, text, className }: ReportButtonProps) {
  const [isReportModalOpen, setReportModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setReportModalOpen(true)} variant="outline" className={className}>
        {text || "Melden"}
      </Button>
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setReportModalOpen(false)}
        cafeSlug={cafe.slug}
      />
    </>
  );
} 