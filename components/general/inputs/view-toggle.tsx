'use client'

import { MapIcon, LayoutGridIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/libs/utils";
import { useQueryState } from 'next-usequerystate';

export type ViewMode = 'list' | 'map';

export function ViewToggle({ className }: { className?: string }) {
  const [view, setView] = useQueryState('view', {
    defaultValue: 'list',
    shallow: false,
  });

  const handleViewChange = async (newView: ViewMode) => {
    await setView(newView === 'list' ? null : newView);
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        variant={view === 'list' || !view ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleViewChange('list')}
      >
        <LayoutGridIcon className="h-4 w-4 mr-2" />
        List
      </Button>
      <Button
        variant={view === 'map' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleViewChange('map')}
      >
        <MapIcon className="h-4 w-4 mr-2" />
        Map
      </Button>
    </div>
  );
} 