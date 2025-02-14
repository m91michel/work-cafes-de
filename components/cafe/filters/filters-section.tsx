'use client';

import { CityFilter } from './city-filter';

export function FiltersSection() {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-4 justify-center">
        <CityFilter />
        {/* Add more filters here */}
      </div>
    </div>
  );
} 