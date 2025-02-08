"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ReportModal } from "./ReportModal";
import { Cafe } from "@/libs/types";
import { useCTranslation } from "@/hooks/use-translation";

interface ReportButtonProps {
  cafe: Cafe;
  className?: string;
}

export function ReportButton({ cafe, className }: ReportButtonProps) {
  const [isReportModalOpen, setReportModalOpen] = useState(false);
  const { t } = useCTranslation('cafe');

  return (
    <>
      <Button onClick={() => setReportModalOpen(true)} variant="outline" className={className}>
        {t('report.buttons.report')}
      </Button>
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setReportModalOpen(false)}
        cafeSlug={cafe.slug}
      />
    </>
  );
} 