'use client'

import { CafeCard } from '@/components/ui/cafe-card'
import { CityData } from '@/lib/types'

interface CafeResultsProps {
  cafesData: CityData
}

export function CafeResults({ cafesData }: CafeResultsProps) {
  return (
    <div className="space-y-8">
      {Object.entries(cafesData).map(([city, cafes]) => (
        <div key={city}>
          <h2 className="text-2xl font-semibold mb-4">{city}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cafes.map((cafe) => (
              <CafeCard key={cafe.name} cafe={cafe} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
