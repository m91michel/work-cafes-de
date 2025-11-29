'use client';

import { Card, CardContent } from '@/components/ui/card';
import { PipelineCafe } from './pipeline-types';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Paths from '@/libs/paths';
import { StatusBadge } from '@/components/general/status-badge';

interface PipelineCardProps {
  cafe: PipelineCafe;
}

export function PipelineCard({ cafe }: PipelineCardProps) {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Never';
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Invalid date';
    }
  };

  const cafeUrl = Paths.cafe(cafe.slug);

  return (
    <Card className="mb-2 hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm leading-tight">{cafe.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">{cafe.city_slug}</p>
            </div>
            <Link
              href={cafeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-muted transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
          
          {cafe.status && (
            <StatusBadge status={cafe.status} className="text-xs" />
          )}
          
          {cafe.processed_at && (
            <p className="text-xs text-muted-foreground">
              Processed {formatDate(cafe.processed_at)}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

