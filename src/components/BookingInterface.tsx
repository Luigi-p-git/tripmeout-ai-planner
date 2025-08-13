'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plane, 
  Hotel, 
  Car, 
  Calendar, 
  Users, 
  MapPin, 
  Star, 
  Wifi, 
  Coffee, 
  Car as CarIcon, 
  Utensils,
  Dumbbell,
  Waves,
  Shield,
  CreditCard,
  Check,
  Clock,
  Filter,
  SlidersHorizontal
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from './ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Flight {
  id: string
  airline: string
  flightNumber: string
  departure: {
    airport: string
    time: string
    city: string
  }
  arrival: {
    airport: string
    time: string
    city: string
  }
  duration: string
  price: number
  stops: number
  class: string
  baggage: string
}

interface Hotel {
  id: string
  name: string
  rating: number
  reviews: number
  price: number
  originalPrice?: number
  location: string
  distance: string
  amenities: string[]
  images: string[]
  cancellation: string
  breakfast: boolean
}

interface BookingInterfaceProps {
  destination: string
  dates: {
    start: string
    end: string
  }
  travelers: number
}

export function BookingInterface({ destination, dates, travelers }: BookingInterfaceProps) {
  const [activeTab, setActiveTab] = useState('flights')
  const [sortBy, setSortBy] = useState('price')
  const [filterOpen, setFilterOpen] = useState(false)

  const flights: Flight[] = [
    {
      id: '1',
      airline: 'Air France',
      flightNumber: 'AF 1234',
      departure: {
        airport: 'JFK',
        time: '14:30',
        city: 'New York'
      },
      arrival: {
        airport: 'CDG',
        time: '03:45+1',
        city: 'Paris'
      },
      duration: '7h 15m',
      price: 542,
      stops: 0,
      class: 'Economy',
      baggage: '1 checked bag included'
    },
    {
      id: '2',
      airline: 'Delta',
      flightNumber: 'DL 456',
      departure: {
        airport: 'JFK',
        time: '22:15',
        city: 'New York'
      },
      arrival: {
        airport: 'CDG',
        time: '12:30+1',
        city: 'Paris'
      },
      duration: '8h 15m',
      price: 489,
      stops: 1,
      class: 'Economy',
      baggage: 'Carry-on only'
    },
    {
      id: '3',
      airline: 'United',
      flightNumber: 'UA 789',
      departure: {
        airport: 'JFK',
        time: '10:00',
        city: 'New York'
      },
      arrival: {
        airport: 'CDG',
        time: '23:45',
        city: 'Paris'
      },
      duration: '7h 45m',
      price: 612,
      stops: 0,
      class: 'Economy',
      baggage: '2 checked bags included'
    }
  ]

  const hotels: Hotel[] = [
    {
      id: '1',
      name: 'Hotel des Grands Boulevards',
      rating: 4.6,
      reviews: 1247,
      price: 185,
      originalPrice: 220,
      location: '2nd Arrondissement',
      distance: '0.8 km from city center',
      amenities: ['Free WiFi', 'Restaurant', 'Bar', 'Concierge'],
      images: ['/api/placeholder/400/300'],
      cancellation: 'Free cancellation until 24h before',
      breakfast: true
    },
    {
      id: '2',
      name: 'Le Marais Boutique Hotel',
      rating: 4.4,
      reviews: 892,
      price: 165,
      location: 'Le Marais',
      distance: '1.2 km from city center',
      amenities: ['Free WiFi', 'Fitness Center', 'Pet Friendly'],
      images: ['/api/placeholder/400/300'],
      cancellation: 'Free cancellation until 48h before',
      breakfast: false
    },
    {
      id: '3',
      name: 'Luxury Palace Hotel',
      rating: 4.8,
      reviews: 2156,
      price: 320,
      originalPrice: 380,
      location: 'Champs-Élysées',
      distance: '0.3 km from city center',
      amenities: ['Free WiFi', 'Spa', 'Pool', 'Restaurant', 'Valet Parking'],
      images: ['/api/placeholder/400/300'],
      cancellation: 'Free cancellation until 72h before',
      breakfast: true
    }
  ]

  const tabs = [
    { id: 'flights', label: 'Flights', icon: <Plane className="w-4 h-4" /> },
    { id: 'hotels', label: 'Hotels', icon: <Hotel className="w-4 h-4" /> },
    { id: 'cars', label: 'Car Rental', icon: <Car className="w-4 h-4" /> }
  ]

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'free wifi':
        return <Wifi className="w-3 h-3" />
      case 'restaurant':
        return <Utensils className="w-3 h-3" />
      case 'bar':
        return <Coffee className="w-3 h-3" />
      case 'fitness center':
        return <Dumbbell className="w-3 h-3" />
      case 'spa':
        return <Waves className="w-3 h-3" />
      case 'pool':
        return <Waves className="w-3 h-3" />
      case 'valet parking':
        return <CarIcon className="w-3 h-3" />
      default:
        return <Shield className="w-3 h-3" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters and Sorting */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">Price (Low to High)</SelectItem>
              <SelectItem value="rating">Rating (High to Low)</SelectItem>
              <SelectItem value="duration">Duration</SelectItem>
              <SelectItem value="departure">Departure Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => setFilterOpen(!filterOpen)}>
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
        <div className="text-sm text-gray-600">
          {activeTab === 'flights' ? flights.length : hotels.length} results found
        </div>
      </div>

      {/* Flights Tab */}
      {activeTab === 'flights' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {flights.map((flight) => (
            <Card key={flight.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 flex-1">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{flight.departure.time}</div>
                    <div className="text-sm text-gray-600">{flight.departure.airport}</div>
                    <div className="text-xs text-gray-500">{flight.departure.city}</div>
                  </div>
                  
                  <div className="flex-1 relative">
                    <div className="flex items-center justify-center">
                      <div className="flex-1 h-px bg-gray-300"></div>
                      <div className="mx-4 text-center">
                        <Plane className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                        <div className="text-xs text-gray-600">{flight.duration}</div>
                        {flight.stops > 0 && (
                          <div className="text-xs text-orange-600">{flight.stops} stop{flight.stops > 1 ? 's' : ''}</div>
                        )}
                      </div>
                      <div className="flex-1 h-px bg-gray-300"></div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{flight.arrival.time}</div>
                    <div className="text-sm text-gray-600">{flight.arrival.airport}</div>
                    <div className="text-xs text-gray-500">{flight.arrival.city}</div>
                  </div>
                </div>
                
                <div className="text-right space-y-2 ml-6">
                  <div className="text-2xl font-bold text-blue-600">${flight.price}</div>
                  <div className="text-sm text-gray-600">{flight.class}</div>
                  <div className="text-xs text-gray-500">{flight.baggage}</div>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Select Flight
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="font-medium">{flight.airline} {flight.flightNumber}</span>
                  {flight.stops === 0 && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Direct
                    </Badge>
                  )}
                </div>
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </motion.div>
      )}

      {/* Hotels Tab */}
      {activeTab === 'hotels' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {hotels.map((hotel) => (
            <Card key={hotel.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="flex">
                <div className="w-64 h-48 bg-gray-200 flex-shrink-0">
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <Hotel className="w-12 h-12 text-gray-400" />
                  </div>
                </div>
                
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{hotel.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(hotel.rating)
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{hotel.rating}</span>
                        <span className="text-sm text-gray-600">({hotel.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                        <MapPin className="w-4 h-4" />
                        <span>{hotel.location} • {hotel.distance}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        {hotel.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">${hotel.originalPrice}</span>
                        )}
                        <span className="text-2xl font-bold text-blue-600">${hotel.price}</span>
                      </div>
                      <div className="text-sm text-gray-600">per night</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hotel.amenities.slice(0, 4).map((amenity, index) => (
                      <div key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-xs">
                        {getAmenityIcon(amenity)}
                        <span>{amenity}</span>
                      </div>
                    ))}
                    {hotel.amenities.length > 4 && (
                      <div className="bg-gray-100 px-2 py-1 rounded-md text-xs text-gray-600">
                        +{hotel.amenities.length - 4} more
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-green-600">{hotel.cancellation}</span>
                      </div>
                      {hotel.breakfast && (
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="text-green-600">Breakfast included</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline">
                        View Details
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </motion.div>
      )}

      {/* Car Rental Tab */}
      {activeTab === 'cars' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <Card className="bg-white border border-gray-200 rounded-2xl p-8">
            <div className="text-center space-y-4">
              <Car className="w-16 h-16 text-gray-400 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-900">Car Rental Options</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Find the perfect rental car for your trip to {destination}. Compare prices from top rental companies.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Search Car Rentals
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}