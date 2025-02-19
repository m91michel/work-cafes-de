'use client'

import { useEffect, useState, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Cafe } from '@/libs/types'
import { Card } from '@/components/ui/card'
import { Star } from 'lucide-react'
import { cn } from '@/libs/utils'

// Advantages:
// - Free and open source
// - Lighter weight (~40KB vs ~150KB)
// - No API key required for basic usage
// - Simpler API
// - More flexible with tile providers

// Disadvantages:
// - Less polished default styling
// - Fewer built-in features
// - Manual marker icon handling

// Fix for default markers in Next.js
const DEFAULT_ICON = L.icon({
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})

interface Props {
  cafes: Cafe[]
  className?: string
}

function parseLatLong(latLong: string | null): [number, number] | null {
  if (!latLong) return null
  const [lat, long] = latLong.split(',').map(Number)
  if (isNaN(lat) || isNaN(long)) return null
  return [lat, long]
}

// Component to handle map bounds
function MapBounds({ coords }: { coords: [number, number][] }) {
  const map = useMap()
  
  useEffect(() => {
    if (coords.length > 0) {
      const bounds = L.latLngBounds(coords)
      map.fitBounds(bounds, { 
        padding: [50, 50],
        maxZoom: 13 // Prevent too much zoom when only one marker
      })
    }
  }, [coords, map])

  return null
}

export function CafeMap({ cafes, className }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Fix for marker icons in Next.js
    L.Marker.prototype.options.icon = DEFAULT_ICON
  }, [])

  // Get cafes with valid coordinates
  const cafesWithCoords = useMemo(() => 
    cafes.filter(cafe => parseLatLong(cafe.lat_long))
  , [cafes])
  
  // Extract all coordinates for bounds calculation
  const allCoords = useMemo(() => 
    cafesWithCoords
      .map(cafe => parseLatLong(cafe.lat_long))
      .filter((coords): coords is [number, number] => coords !== null)
  , [cafesWithCoords])
  
  // Calculate center based on first cafe or default to Berlin
  const center = allCoords.length > 0
    ? allCoords[0]
    : [52.520008, 13.404954] // Berlin coordinates

  if (!mounted) return null

  return (
    <div className={cn("w-full h-[600px] rounded-lg overflow-hidden relative", className)}>
      <style jsx global>{`
        .leaflet-container {
          z-index: 10;
        }
        .leaflet-popup {
          z-index: 20;
        }
      `}</style>
      <MapContainer
        center={center as L.LatLngExpression}
        zoom={13}
        className="w-full h-full"
        attributionControl={false}
        scrollWheelZoom={false}
        dragging={!L.Browser.mobile}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBounds coords={allCoords} />
        {cafesWithCoords.map((cafe) => {
          const coords = parseLatLong(cafe.lat_long)
          if (!coords) return null
          
          return (
            <Marker
              key={cafe.slug}
              position={coords as L.LatLngExpression}
            >
              <Popup>
                <Card className="p-3">
                  <h3 className="font-semibold text-lg">{cafe.name}</h3>
                  <div className="flex items-center mt-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="ml-1">{cafe.google_rating}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{cafe.address}</p>
                </Card>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
      <div className="absolute bottom-0 right-0 z-20 bg-white/80 px-2 py-1 text-xs text-muted-foreground">
        © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="hover:underline">OpenStreetMap</a> contributors
      </div>
    </div>
  )
} 