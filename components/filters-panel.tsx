'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const amenities = [
  { id: 'wifi', label: 'WiFi' },
  { id: 'power', label: 'Power Outlets' },
  { id: 'quiet', label: 'Quiet Space' },
  { id: 'food', label: 'Food Available' },
  { id: 'coffee', label: 'Good Coffee' },
]

interface FiltersPanelProps {
  cities: string[]
  onFiltersChange: (city: string, amenities: string[]) => void
}

export function FiltersPanel({ cities, onFiltersChange }: FiltersPanelProps) {
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    const newAmenities = checked
      ? [...selectedAmenities, amenityId]
      : selectedAmenities.filter(id => id !== amenityId)
    setSelectedAmenities(newAmenities)
  }

  const handleApplyFilters = () => {
    onFiltersChange(selectedCity, selectedAmenities)
  }

  return (
    <Card className="p-6 space-y-6 sticky top-4">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">City</h2>
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a city" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Städte</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Amenities</h2>
        <div className="space-y-3">
          {amenities.map((amenity) => (
            <div key={amenity.id} className="flex items-center space-x-2">
              <Checkbox
                id={amenity.id}
                checked={selectedAmenities.includes(amenity.id)}
                onCheckedChange={(checked) => handleAmenityChange(amenity.id, checked as boolean)}
              />
              <label
                htmlFor={amenity.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {amenity.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Button 
        className="w-full mt-6"
        onClick={handleApplyFilters}
      >
        Apply Filters
      </Button>
    </Card>
  )
}
