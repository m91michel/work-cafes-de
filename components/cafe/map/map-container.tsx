'use client'

import dynamic from 'next/dynamic'
import { Cafe } from '@/libs/types'

interface Props {
  cafes: Cafe[]
  className?: string
  provider?: 'leaflet' | 'google' | 'mapbox'
}

export function MapContainer({ cafes, className, provider = 'leaflet' }: Props) {
  switch (provider) {
    case 'google':
      return <DynamicGoogleMap cafes={cafes} className={className} />
    case 'mapbox':
      return <DynamicMapboxMap cafes={cafes} className={className} />
    default:
      return <DynamicLeafletMap cafes={cafes} className={className} />
  }
} 

// Dynamically import the map components with no SSR
const DynamicLeafletMap = dynamic(
  () => import('./cafe-map').then(mod => mod.CafeMap),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] rounded-lg bg-muted animate-pulse" />
    )
  }
)

const DynamicGoogleMap = dynamic(
  () => import('./cafe-google-map').then(mod => mod.CafeGoogleMap),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] rounded-lg bg-muted animate-pulse" />
    )
  }
)

const DynamicMapboxMap = dynamic(
  () => import('./cafe-map-box').then(mod => mod.CafeMapBox),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] rounded-lg bg-muted animate-pulse" />
    )
  }
)

