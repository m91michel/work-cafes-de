"use client";

import { useState } from 'react';
import { CitySelector } from '@/components/ui/city-selector';
import { CafeCard } from '@/components/ui/cafe-card';
import { Cafe, City } from '@/libs/types';

interface CafeDirectoryProps {
  title?: string;
  cities: City[];
  cafes: Cafe[];
}

export function CafeDirectory({ title, cities, cafes }: CafeDirectoryProps) {

  return (
    <>
      <CitySelector
        cities={cities} 
      />

      <div className="mt-12">
        
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cafes.map((cafe) => (
                <CafeCard key={cafe.slug} cafe={cafe} />
              ))}
            </div>
          </div>
      </div>
    </>
  );
}