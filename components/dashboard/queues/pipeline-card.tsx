'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PipelineCafe } from './pipeline-types';
import { formatDistanceToNow } from 'date-fns';

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

  const getStatusVariant = (status: string | null | undefined): 'default' | 'success' | 'warning' | 'destructive' => {
    switch (status) {
      case 'PUBLISHED':
        return 'success';
      case 'PROCESSED':
        return 'default';
      case 'CLOSED':
        return 'destructive';
      case 'DISCARDED':
        return 'destructive';
      default:
        return 'warning';
    }
  };

  return (
    <Card className="mb-2 hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-3">
        <div className="space-y-2">
          <div>
            <h4 className="font-semibold text-sm leading-tight">{cafe.name}</h4>
            <p className="text-xs text-muted-foreground mt-1">{cafe.city_slug}</p>
          </div>
          
          {cafe.status && (
            <Badge variant={getStatusVariant(cafe.status)} className="text-xs">
              {cafe.status}
            </Badge>
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

