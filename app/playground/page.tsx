
import { getCafes } from '@/libs/supabase/cafes'

export const revalidate = 0;

export default async function FiltersPage() {
  const cafesData = await getCafes()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Find Your Perfect Workspace</h1>
      {cafesData && JSON.stringify(cafesData)}
    </div>
  )
}
