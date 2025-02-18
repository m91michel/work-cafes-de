'use client'

import dynamic from 'next/dynamic'
import { Cafe } from '@/libs/types'

interface Props {
  cafes: Cafe[]
  className?: string
}

// Dynamically import the CafeMap component with no SSR
const DynamicCafeMap = dynamic(
  () => import('./cafe-map').then(mod => mod.CafeMap),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] rounded-lg bg-muted animate-pulse" />
    )
  }
)

export function MapContainer({ cafes, className }: Props) {
  return <DynamicCafeMap cafes={cafes} className={className} />
} 