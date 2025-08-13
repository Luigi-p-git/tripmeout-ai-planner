'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MapPin, 
  Cloud, 
  Sun, 
  CloudRain, 
  Thermometer, 
  Wind, 
  Eye, 
  Droplets,
  Star,
  Heart,
  Share2,
  ExternalLink,
  Calendar,
  Clock,
  Users,
  DollarSign
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface WeatherData {
  day: string
  high: number
  low: number
  condition: string
  icon: React.ReactNode
  humidity: number
  windSpeed: number
  visibility: number
}

interface Attraction {
  id: string
  name: string
  category: string
  rating: number
  reviews: number
  price: string
  image: string
  description: string
  duration: string
  bestTime: string
}

interface TripPlanningFeaturesProps {
  destination: string
}

export function TripPlanningFeatures({ destination }: TripPlanningFeaturesProps) {
  const [activeTab, setActiveTab] = useState('weather')
  const [favorites, setFavorites] = useState<string[]>([])

  const weatherData: WeatherData[] = [
    {
      day: 'Today',
      high: 22,
      low: 15,
      condition: 'Partly Cloudy',
      icon: <Cloud className="w-6 h-6" />,
      humidity: 65,
      windSpeed: 12,
      visibility: 10
    },
    {
      day: 'Tomorrow',
      high: 25,
      low: 18,
      condition: 'Sunny',
      icon: <Sun className="w-6 h-6" />,
      humidity: 45,
      windSpeed: 8,
      visibility: 15
    },
    {
      day: 'Day 3',
      high: 19,
      low: 12,
      condition: 'Light Rain',
      icon: <CloudRain className="w-6 h-6" />,
      humidity: 85,
      windSpeed: 15,
      visibility: 8
    },
    {
      day: 'Day 4',
      high: 24,
      low: 16,
      condition: 'Sunny',
      icon: <Sun className="w-6 h-6" />,
      humidity: 50,
      windSpeed: 10,
      visibility: 12
    }
  ]

  const attractions: Attraction[] = [
    {
      id: '1',
      name: 'Eiffel Tower',
      category: 'Landmark',
      rating: 4.6,
      reviews: 125420,
      price: '€29',
      image: '/api/placeholder/300/200',
      description: 'Iconic iron lattice tower and symbol of Paris',
      duration: '2-3 hours',
      bestTime: 'Sunset'
    },
    {
      id: '2',
      name: 'Louvre Museum',
      category: 'Museum',
      rating: 4.7,
      reviews: 89650,
      price: '€17',
      image: '/api/placeholder/300/200',
      description: 'World\'s largest art museum and historic monument',
      duration: '3-4 hours',
      bestTime: 'Morning'
    },
    {
      id: '3',
      name: 'Seine River Cruise',
      category: 'Experience',
      rating: 4.4,
      reviews: 45230,
      price: '€15',
      image: '/api/placeholder/300/200',
      description: 'Scenic boat tour along the Seine River',
      duration: '1 hour',
      bestTime: 'Evening'
    },
    {
      id: '4',
      name: 'Montmartre District',
      category: 'Neighborhood',
      rating: 4.5,
      reviews: 67890,
      price: 'Free',
      image: '/api/placeholder/300/200',
      description: 'Historic hilltop district with artistic heritage',
      duration: 'Half day',
      bestTime: 'Afternoon'
    }
  ]

  const toggleFavorite = (attractionId: string) => {
    setFavorites(prev => 
      prev.includes(attractionId) 
        ? prev.filter(id => id !== attractionId)
        : [...prev, attractionId]
    )
  }

  const tabs = [
    { id: 'weather', label: 'Weather', icon: <Cloud className="w-4 h-4" /> },
    { id: 'attractions', label: 'Attractions', icon: <MapPin className="w-4 h-4" /> },
    { id: 'map', label: 'Map View', icon: <MapPin className="w-4 h-4" /> }
  ]

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

      {/* Weather Tab */}
      {activeTab === 'weather' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-semibold text-gray-900">Weather Forecast for {destination}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {weatherData.map((weather, index) => (
              <Card key={index} className="bg-white border border-gray-200 rounded-2xl p-4">
                <div className="text-center space-y-3">
                  <h4 className="font-semibold text-gray-900">{weather.day}</h4>
                  <div className="flex justify-center text-blue-600">
                    {weather.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-2xl font-bold text-gray-900">{weather.high}°</span>
                      <span className="text-lg text-gray-500">{weather.low}°</span>
                    </div>
                    <p className="text-sm text-gray-600">{weather.condition}</p>
                  </div>
                  <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Droplets className="w-3 h-3" />
                        <span>{weather.humidity}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Wind className="w-3 h-3" />
                        <span>{weather.windSpeed} km/h</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{weather.visibility} km</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* Attractions Tab */}
      {activeTab === 'attractions' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Top Attractions in {destination}</h3>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {attractions.map((attraction) => (
              <Card key={attraction.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div className="aspect-video bg-gray-200 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <button
                    onClick={() => toggleFavorite(attraction.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                  >
                    <Heart 
                      className={`w-4 h-4 ${
                        favorites.includes(attraction.id) 
                          ? 'text-red-500 fill-red-500' 
                          : 'text-gray-600'
                      }`} 
                    />
                  </button>
                  <div className="absolute bottom-3 left-3 bg-white/90 px-2 py-1 rounded-md">
                    <span className="text-xs font-medium text-gray-900">{attraction.category}</span>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold text-gray-900">{attraction.name}</h4>
                    <span className="text-lg font-bold text-blue-600">{attraction.price}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium">{attraction.rating}</span>
                      <span>({attraction.reviews.toLocaleString()})</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600">{attraction.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{attraction.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Sun className="w-3 h-3" />
                      <span>Best: {attraction.bestTime}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                      Add to Trip
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* Map Tab */}
      {activeTab === 'map' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-semibold text-gray-900">Interactive Map of {destination}</h3>
          <Card className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center space-y-2">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto" />
                <p className="text-gray-600">Interactive map will be displayed here</p>
                <p className="text-sm text-gray-500">Integration with Google Maps or Mapbox</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}