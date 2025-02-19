'use client'

import { useEffect, useState, useMemo } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { Cafe } from '@/libs/types'
import { Card } from '@/components/ui/card'
import { Star } from 'lucide-react'
import { cn } from '@/libs/utils'

// Advantages:
// - More polished default styling
// - Rich feature set
// - Extensive documentation
// - Better performance for large datasets

// Disadvantages:
// - Requires API key
// - More expensive for high traffic
// - Larger bundle size
// - More complex API

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

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

export function CafeGoogleMap({ cafes, className }: Props) {
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      setError('Google Maps API key is required')
      return
    }

    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: 'weekly'
    })

    loader.load()
      .then(() => {
        setIsLoaded(true)
        setError(null)
      })
      .catch((err) => {
        console.error('Google Maps loading error:', err)
        setError('Failed to load Google Maps. Please check your API key configuration.')
      })
  }, [])

  useEffect(() => {
    if (!isLoaded || map) return

    try {
      // Initialize map
      const mapInstance = new google.maps.Map(
        document.getElementById('google-map') as HTMLElement,
        {
          zoom: 13,
          center: { 
            lat: allCoords[0]?.[0] ?? 52.520008,
            lng: allCoords[0]?.[1] ?? 13.404954
          },
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false
        }
      )

      setMap(mapInstance)
      setError(null)
    } catch (err) {
      console.error('Map initialization error:', err)
      setError('Failed to initialize the map. Please try again later.')
    }
  }, [isLoaded, map, allCoords])

  useEffect(() => {
    if (!map || !isLoaded) return

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null))

    // Create bounds
    const bounds = new google.maps.LatLngBounds()

    // Add new markers
    const newMarkers = cafesWithCoords.map(cafe => {
      const coords = parseLatLong(cafe.lat_long)
      if (!coords) return null

      const [lat, lng] = coords
      const position = { lat, lng }
      bounds.extend(position)

      const marker = new google.maps.Marker({
        position,
        map,
        title: cafe.name
      })

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-semibold">${cafe.name}</h3>
            <div class="flex items-center mt-1">
              <span class="text-yellow-500">★</span>
              <span class="ml-1">${cafe.google_rating}</span>
            </div>
            <p class="text-sm text-gray-600 mt-1">${cafe.address}</p>
          </div>
        `
      })

      marker.addListener('click', () => {
        infoWindow.open(map, marker)
      })

      return marker
    }).filter((marker): marker is google.maps.Marker => marker !== null)

    setMarkers(newMarkers)

    // Fit bounds with padding
    map.fitBounds(bounds, {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50
    })
  }, [map, isLoaded, cafesWithCoords])

  if (error) {
    return (
      <div className={cn("w-full h-[600px] rounded-lg bg-muted flex items-center justify-center", className)}>
        <div className="text-center p-4">
          <p className="text-destructive mb-2">⚠️ {error}</p>
          <p className="text-sm text-muted-foreground">
            If you're the site owner, please check the Google Cloud Console configuration.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div 
      id="google-map" 
      className={cn("w-full h-[600px] rounded-lg overflow-hidden relative", className)}
    />
  )
} 