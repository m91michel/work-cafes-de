import { FilteredCafes } from '@/components/filtered-cafes'
import { getListings } from '@/libs/cafe-utils'

export default async function FiltersPage() {
  const cafesData = await getListings()
  const cities = Object.keys(cafesData).sort()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Find Your Perfect Workspace</h1>
      <FilteredCafes initialCafesData={cafesData} initialCities={cities} />
    </div>
  )
}
