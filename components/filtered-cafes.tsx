'use client'

import { useState } from 'react'
import { FiltersPanel } from '@/components/filters-panel'
import { CafeResults } from '@/components/cafe-results'
import { CityData } from '@/libs/types'

interface FilteredCafesProps {
  initialCafesData: CityData
  initialCities: string[]
}

export function FilteredCafes({ initialCafesData, initialCities }: FilteredCafesProps) {
  const [filteredCafes, setFilteredCafes] = useState(initialCafesData)

  const handleFiltersChange = (selectedCity: string, selectedAmenities: string[]) => {
    let filtered = { ...initialCafesData }

    // Filter by city
    if (selectedCity) {
      filtered = {
        [selectedCity]: initialCafesData[selectedCity]
      }
    }

    setFilteredCafes(filtered)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Filters Section - Left Side */}
      <div className="lg:w-1/4">
        <FiltersPanel 
          cities={initialCities}
          onFiltersChange={handleFiltersChange}
        />
      </div>

      {/* Cafes Section - Right Side */}
      <div className="lg:w-3/4">
        <CafeResults cafesData={filteredCafes} />
      </div>
    </div>
  )
}
