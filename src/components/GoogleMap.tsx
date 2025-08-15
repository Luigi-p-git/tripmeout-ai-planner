'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// Extend the Window interface to include google
declare global {
  interface Window {
    google: any
  }
}

interface GoogleMapProps {
  places: Array<{
    id: number
    name: string
    coordinates: {
      lat: number
      lng: number
    }
    order: number
  }>
  center?: {
    lat: number
    lng: number
  }
}

export default function GoogleMap({ places, center = { lat: -33.8688, lng: 151.2093 } }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [map, setMap] = useState<any>(null)
  const [markers, setMarkers] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  console.log('GoogleMap component rendered with places:', places)
  console.log('GoogleMap center:', center)

  useEffect(() => {
    const loadGoogleMaps = () => {
      try {
        if (typeof window !== 'undefined' && window.google) {
          initializeMap()
          return
        }

        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        console.log('API Key check:', apiKey ? 'API key found' : 'No API key')
        if (!apiKey || apiKey === 'your-google-maps-api-key-here') {
          console.error('Google Maps API key not configured')
          setError('Google Maps API key is not configured. Please add a valid API key to your .env.local file.')
          setIsLoading(false)
          return
        }

        console.log('Creating Google Maps script...')
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`
        script.async = true
        script.defer = true
        script.onload = () => {
          console.log('Google Maps script loaded successfully')
          setIsLoaded(true)
          setIsLoading(false)
          initializeMap()
        }
        script.onerror = () => {
          console.error('Failed to load Google Maps script')
          setError('Failed to load Google Maps API. Please check your API key and internet connection.')
          setIsLoading(false)
        }
        document.head.appendChild(script)
        console.log('Google Maps script added to head')
      } catch (err) {
        setError('An error occurred while loading Google Maps.')
        setIsLoading(false)
      }
    }

    const initializeMap = () => {
      try {
        console.log('Initializing map...')
        console.log('mapRef.current:', !!mapRef.current)
        console.log('window.google:', !!window.google)
        if (!mapRef.current || !window.google) {
          console.log('Map initialization skipped - missing requirements')
          return
        }

        console.log('Creating map instance...')
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          zoom: 12,
          center,
          styles: [
            {
              featureType: 'all',
              elementType: 'geometry.fill',
              stylers: [{ weight: '2.00' }]
            },
            {
              featureType: 'all',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#9c9c9c' }]
            },
            {
              featureType: 'landscape',
              elementType: 'all',
              stylers: [{ color: '#f2f2f2' }]
            },
            {
              featureType: 'landscape',
              elementType: 'geometry.fill',
              stylers: [{ color: '#ffffff' }]
            },
            {
              featureType: 'poi',
              elementType: 'all',
              stylers: [{ visibility: 'off' }]
            },
            {
              featureType: 'road',
              elementType: 'all',
              stylers: [{ saturation: -100 }, { lightness: 45 }]
            },
            {
              featureType: 'road',
              elementType: 'geometry.fill',
              stylers: [{ color: '#eeeeee' }]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#7b7b7b' }]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.stroke',
              stylers: [{ color: '#ffffff' }]
            },
            {
              featureType: 'transit',
              elementType: 'all',
              stylers: [{ visibility: 'off' }]
            },
            {
              featureType: 'water',
              elementType: 'all',
              stylers: [{ color: '#46bcec' }, { visibility: 'on' }]
            },
            {
              featureType: 'water',
              elementType: 'geometry.fill',
              stylers: [{ color: '#c8d7d4' }]
            }
          ],
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false
        })

        console.log('Map instance created successfully:', !!mapInstance)
        setMap(mapInstance)
      } catch (err) {
        setError('Failed to initialize Google Maps. Please try refreshing the page.')
        setIsLoading(false)
      }
    }

    loadGoogleMaps()
  }, [])

  useEffect(() => {
    if (!map || !places.length || !window.google) return

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null))
    const newMarkers: any[] = []

    // Add markers for each place
    places.forEach((place, index) => {
      const marker = new window.google.maps.Marker({
        position: place.coordinates,
        map: map,
        title: place.name,
        label: {
          text: place.order.toString(),
          color: 'white',
          fontWeight: 'bold',
          fontSize: '14px'
        },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: index === 0 ? '#10B981' : index === places.length - 1 ? '#EF4444' : '#8B5CF6',
          fillOpacity: 1,
          strokeColor: 'white',
          strokeWeight: 2,
          scale: 12
        }
      })

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; font-family: system-ui;">
            <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: bold; color: #1f2937;">${place.name}</h3>
            <p style="margin: 0; font-size: 14px; color: #6b7280;">Stop #${place.order}</p>
          </div>
        `
      })

      marker.addListener('click', () => {
        infoWindow.open(map, marker)
      })

      newMarkers.push(marker)
    })

    setMarkers(newMarkers)

    // Create optimized route if there are multiple places
    if (places.length > 1) {
      const directionsService = new window.google.maps.DirectionsService()
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#8B5CF6',
          strokeWeight: 4,
          strokeOpacity: 0.8
        }
      })
      directionsRenderer.setMap(map)

      const waypoints = places.slice(1, -1).map(place => ({
        location: place.coordinates,
        stopover: true
      }))

      directionsService.route(
        {
          origin: places[0].coordinates,
          destination: places[places.length - 1].coordinates,
          waypoints,
          optimizeWaypoints: true,
          travelMode: window.google.maps.TravelMode.DRIVING
        },
        (result: any, status: string) => {
          if (status === 'OK') {
            directionsRenderer.setDirections(result)
          }
        }
      )
    }

    // Adjust map bounds to fit all markers
    if (places.length > 0) {
      const bounds = new window.google.maps.LatLngBounds()
      places.forEach(place => {
        bounds.extend(place.coordinates)
      })
      map.fitBounds(bounds)
      
      // Ensure minimum zoom level
      const listener = window.google.maps.event.addListener(map, 'idle', () => {
        if (map.getZoom() > 15) {
          map.setZoom(15)
        }
        window.google.maps.event.removeListener(listener)
      })
    }
  }, [map, places])

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-red-200 bg-red-50"
      >
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">Map Loading Error</div>
          <div className="text-red-500 text-sm mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-gray-200 relative"
    >
      <div ref={mapRef} className="w-full h-full" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
            <div className="text-gray-700 font-medium">Loading your world-class map...</div>
            <div className="text-gray-500 text-sm mt-1">Preparing your journey</div>
          </div>
        </div>
      )}
    </motion.div>
  )
}