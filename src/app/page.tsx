'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Sparkles, Plane, Calendar, Users, GripVertical, Filter, BarChart3, Settings, Globe, DollarSign, Clock, Thermometer, Users2, Building2, Train, Utensils } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'


// Mock data for cities and places
// Comprehensive city information
const cityInfo = {
  'Tokyo': {
    population: '37.4M',
    currency: 'Japanese Yen (¥)',
    timezone: 'JST (UTC+9)',
    temperature: '22°C',
    language: 'Japanese',
    area: '2,194 km²',
    founded: '1457',
    bestTime: 'Mar-May, Sep-Nov'
  },
  'Paris': {
    population: '2.1M',
    currency: 'Euro (€)',
    timezone: 'CET (UTC+1)',
    temperature: '15°C',
    language: 'French',
    area: '105 km²',
    founded: '3rd century BC',
    bestTime: 'Apr-Jun, Sep-Oct'
  },
  'New York': {
    population: '8.3M',
    currency: 'US Dollar ($)',
    timezone: 'EST (UTC-5)',
    temperature: '18°C',
    language: 'English',
    area: '783 km²',
    founded: '1624',
    bestTime: 'Apr-Jun, Sep-Nov'
  },
  'London': {
    population: '9.0M',
    currency: 'British Pound (£)',
    timezone: 'GMT (UTC+0)',
    temperature: '12°C',
    language: 'English',
    area: '1,572 km²',
    founded: '43 AD',
    bestTime: 'May-Sep'
  }
}

const mockCities = {
  'Paris': [
    {
      id: 1,
      name: 'Eiffel Tower',
      description: 'Iconic iron lattice tower and symbol of Paris',
      image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=300&h=200&fit=crop',
      category: 'Attraction',
      duration: '2-3 hours'
    },
    {
      id: 2,
      name: 'Louvre Museum',
      description: 'World\'s largest art museum and historic monument',
      image: 'https://images.unsplash.com/photo-1566139884669-4b9356b4c040?w=300&h=200&fit=crop',
      category: 'Museum',
      duration: '3-4 hours'
    },
    {
      id: 3,
      name: 'Notre-Dame Cathedral',
      description: 'Medieval Catholic cathedral with Gothic architecture',
      image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=300&h=200&fit=crop',
      category: 'Historic Site',
      duration: '1-2 hours'
    },
    {
      id: 4,
      name: 'Champs-Élysées',
      description: 'Famous avenue for shopping and dining',
      image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=300&h=200&fit=crop',
      category: 'Shopping',
      duration: '2-3 hours'
    }
  ],
  'Tokyo': [
    {
      id: 5,
      name: 'Senso-ji Temple',
      description: 'Ancient Buddhist temple in Asakusa district',
      image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=300&h=200&fit=crop',
      category: 'Temple',
      duration: '1-2 hours'
    },
    {
      id: 6,
      name: 'Shibuya Crossing',
      description: 'World\'s busiest pedestrian crossing',
      image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=300&h=200&fit=crop',
      category: 'Landmark',
      duration: '30 minutes'
    },
    {
      id: 7,
      name: 'Tokyo Skytree',
      description: 'Broadcasting tower and observation deck',
      image: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=300&h=200&fit=crop',
      category: 'Observation',
      duration: '2-3 hours'
    },
    {
      id: 8,
      name: 'Tsukiji Fish Market',
      description: 'Famous fish market and food destination',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
      category: 'Market',
      duration: '2-3 hours'
    },
    {
      id: 101,
      name: 'Meiji Shrine',
      description: 'Shinto shrine dedicated to Emperor Meiji',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=300&h=200&fit=crop',
      category: 'Shrine',
      duration: '1-2 hours'
    },
    {
      id: 102,
      name: 'Tokyo National Museum',
      description: 'Japan\'s oldest and largest museum',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
      category: 'Museum',
      duration: '2-3 hours'
    },
    {
      id: 103,
      name: 'Ginza District',
      description: 'Luxury shopping and dining district',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&h=200&fit=crop',
      category: 'Shopping',
      duration: '2-4 hours'
    },
    {
      id: 104,
      name: 'Ueno Park',
      description: 'Large public park famous for cherry blossoms',
      image: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=300&h=200&fit=crop',
      category: 'Park',
      duration: '2-3 hours'
    },
    {
      id: 105,
      name: 'Tokyo Imperial Palace',
      description: 'Primary residence of the Emperor of Japan',
      image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=300&h=200&fit=crop',
      category: 'Palace',
      duration: '1-2 hours'
    },
    {
      id: 106,
      name: 'Harajuku',
      description: 'Youth culture and fashion district',
      image: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=300&h=200&fit=crop',
      category: 'District',
      duration: '2-3 hours'
    },
    {
      id: 107,
      name: 'Tokyo Tower',
      description: 'Communications tower inspired by Eiffel Tower',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&h=200&fit=crop',
      category: 'Tower',
      duration: '1-2 hours'
    },
    {
      id: 108,
      name: 'Akihabara',
      description: 'Electronics and anime culture district',
      image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=300&h=200&fit=crop',
      category: 'District',
      duration: '2-4 hours'
    },
    {
      id: 109,
      name: 'Roppongi Hills',
      description: 'Modern urban complex with shopping and dining',
      image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=300&h=200&fit=crop',
      category: 'Complex',
      duration: '2-3 hours'
    },
    {
      id: 110,
      name: 'Shinjuku Gyoen',
      description: 'Large park with traditional Japanese gardens',
      image: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=300&h=200&fit=crop',
      category: 'Garden',
      duration: '2-3 hours'
    },
    {
      id: 111,
      name: 'Odaiba',
      description: 'Artificial island with entertainment complexes',
      image: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=300&h=200&fit=crop',
      category: 'Island',
      duration: '3-5 hours'
    },
    {
      id: 112,
      name: 'Kinkaku-ji Temple',
      description: 'Golden Pavilion temple with stunning architecture',
      image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=300&h=200&fit=crop',
      category: 'Temple',
      duration: '1-2 hours'
    },
    {
      id: 113,
      name: 'Tokyo DisneySea',
      description: 'Unique Disney theme park with nautical theme',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
      category: 'Theme Park',
      duration: '6-8 hours'
    },
    {
      id: 114,
      name: 'Nakamise Shopping Street',
      description: 'Traditional shopping street leading to Senso-ji',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&h=200&fit=crop',
      category: 'Shopping',
      duration: '1-2 hours'
    },
    {
      id: 115,
      name: 'Tokyo Station',
      description: 'Historic railway station and shopping complex',
      image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=300&h=200&fit=crop',
      category: 'Station',
      duration: '1-2 hours'
    },
    {
      id: 116,
      name: 'Yasukuni Shrine',
      description: 'Shinto shrine commemorating war dead',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=300&h=200&fit=crop',
      category: 'Shrine',
      duration: '1 hour'
    },
    {
      id: 117,
      name: 'Teamlab Borderless',
      description: 'Digital art museum with interactive exhibits',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
      category: 'Museum',
      duration: '3-4 hours'
    },
    {
      id: 118,
      name: 'Kabukicho',
      description: 'Entertainment and red-light district',
      image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=300&h=200&fit=crop',
      category: 'District',
      duration: '2-3 hours'
    },
    {
      id: 119,
      name: 'Tokyo Metropolitan Government Building',
      description: 'Twin tower complex with free observation decks',
      image: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=300&h=200&fit=crop',
      category: 'Building',
      duration: '1-2 hours'
    },
    {
      id: 120,
      name: 'Sumida River',
      description: 'River cruise with city skyline views',
      image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=300&h=200&fit=crop',
      category: 'River',
      duration: '1-2 hours'
    }
  ],
  'New York': [
    {
      id: 9,
      name: 'Statue of Liberty',
      description: 'Symbol of freedom and democracy',
      image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=300&h=200&fit=crop',
      category: 'Monument',
      duration: '3-4 hours'
    },
    {
      id: 10,
      name: 'Central Park',
      description: 'Large public park in Manhattan',
      image: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=300&h=200&fit=crop',
      category: 'Park',
      duration: '2-4 hours'
    },
    {
      id: 11,
      name: 'Times Square',
      description: 'Bright lights and Broadway theaters',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=300&h=200&fit=crop',
      category: 'Entertainment',
      duration: '1-2 hours'
    },
    {
      id: 12,
      name: 'Brooklyn Bridge',
      description: 'Historic suspension bridge with city views',
      image: 'https://images.unsplash.com/photo-1490644658840-3f2e3f8c5625?w=300&h=200&fit=crop',
      category: 'Bridge',
      duration: '1-2 hours'
    }
  ],
  'London': [
    {
      id: 13,
      name: 'Big Ben',
      description: 'Iconic clock tower and symbol of London',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=300&h=200&fit=crop',
      category: 'Landmark',
      duration: '30 minutes'
    },
    {
      id: 14,
      name: 'Tower of London',
      description: 'Historic castle and home to the Crown Jewels',
      image: 'https://images.unsplash.com/photo-1529655683826-3c8b7d6f8f3d?w=300&h=200&fit=crop',
      category: 'Castle',
      duration: '2-3 hours'
    },
    {
      id: 15,
      name: 'British Museum',
      description: 'World-famous museum with ancient artifacts',
      image: 'https://images.unsplash.com/photo-1555848962-6e79363ec551?w=300&h=200&fit=crop',
      category: 'Museum',
      duration: '3-4 hours'
    },
    {
      id: 16,
      name: 'London Eye',
      description: 'Giant observation wheel on the Thames',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=300&h=200&fit=crop',
      category: 'Observation',
      duration: '1 hour'
    }
  ]
}

type PlanType = 'vibe' | null

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [planType, setPlanType] = useState<PlanType>(null)
  const [travelDates, setTravelDates] = useState({ start: '', end: '' })
  const [travelers, setTravelers] = useState('2')
  const [draggedItem, setDraggedItem] = useState<any>(null)
  const [droppedItems, setDroppedItems] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredCities, setFilteredCities] = useState<string[]>([])

  const handleVibePlan = () => {
    setPlanType('vibe')
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    
    if (value.trim()) {
      const cities = Object.keys(mockCities).filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredCities(cities)
      setShowSuggestions(cities.length > 0)
    } else {
      setShowSuggestions(false)
      setFilteredCities([])
    }
  }

  const handleCitySelect = (city: string) => {
    setSearchQuery(city)
    setShowSuggestions(false)
    setFilteredCities([])
  }

  const handleDragStart = (e: React.DragEvent, item: any) => {
    setDraggedItem(item)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (draggedItem && !droppedItems.find(item => item.id === draggedItem.id)) {
      setDroppedItems(prev => [...prev, draggedItem])
    }
    setDraggedItem(null)
  }

  const removeDroppedItem = (itemId: number) => {
    setDroppedItems(prev => prev.filter(item => item.id !== itemId))
  }

  const getPlacesForCity = () => {
    const cityKey = Object.keys(mockCities).find(city => 
      city.toLowerCase().includes(searchQuery.toLowerCase())
    )
    return cityKey ? mockCities[cityKey as keyof typeof mockCities] : []
  }

  const places = getPlacesForCity()

  const isDashboardMode = planType && searchQuery

  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence mode="wait">
        {isDashboardMode ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen"
          >
            {/* City Header Section */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                    >
                      <Plane className="w-8 h-8 text-white" />
                    </motion.div>
                    <div>
                      <h1 className="text-4xl font-bold mb-2">Welcome to {searchQuery}</h1>
                      <p className="text-xl text-white/90 mb-4">Discover amazing places and create your perfect itinerary</p>
                      
                      {/* City Information Grid */}
                      {cityInfo[searchQuery as keyof typeof cityInfo] && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          <div className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                            <Users2 className="w-4 h-4 text-blue-300" />
                            <div>
                              <div className="text-xs text-white/70">Population</div>
                              <div className="font-semibold">{cityInfo[searchQuery as keyof typeof cityInfo].population}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                            <DollarSign className="w-4 h-4 text-green-300" />
                            <div>
                              <div className="text-xs text-white/70">Currency</div>
                              <div className="font-semibold">{cityInfo[searchQuery as keyof typeof cityInfo].currency}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                            <Clock className="w-4 h-4 text-purple-300" />
                            <div>
                              <div className="text-xs text-white/70">Timezone</div>
                              <div className="font-semibold">{cityInfo[searchQuery as keyof typeof cityInfo].timezone}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                            <Thermometer className="w-4 h-4 text-orange-300" />
                            <div>
                              <div className="text-xs text-white/70">Temperature</div>
                              <div className="font-semibold">{cityInfo[searchQuery as keyof typeof cityInfo].temperature}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                            <Globe className="w-4 h-4 text-cyan-300" />
                            <div>
                              <div className="text-xs text-white/70">Language</div>
                              <div className="font-semibold">{cityInfo[searchQuery as keyof typeof cityInfo].language}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                            <Building2 className="w-4 h-4 text-yellow-300" />
                            <div>
                              <div className="text-xs text-white/70">Area</div>
                              <div className="font-semibold">{cityInfo[searchQuery as keyof typeof cityInfo].area}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                            <Calendar className="w-4 h-4 text-pink-300" />
                            <div>
                              <div className="text-xs text-white/70">Founded</div>
                              <div className="font-semibold">{cityInfo[searchQuery as keyof typeof cityInfo].founded}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                            <Sparkles className="w-4 h-4 text-indigo-300" />
                            <div>
                              <div className="text-xs text-white/70">Best Time</div>
                              <div className="font-semibold">{cityInfo[searchQuery as keyof typeof cityInfo].bestTime}</div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 mt-3 text-white/80">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {places.length} places to explore
                        </span>
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-4 h-4" />
                          AI-powered recommendations
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                      onClick={() => {
                        setPlanType(null)
                        setSearchQuery('')
                        setDroppedItems([])
                      }}
                    >
                      <Search className="w-4 h-4 mr-2" />
                      New Search
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="grid gap-8 grid-cols-12">
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="col-span-12 lg:col-span-5"
                >
                  <Card className="p-6 bg-white shadow-lg border-0 rounded-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900">Places to Visit</h3>
                      <span className="text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full font-medium">
                        {places.length} places
                      </span>
                    </div>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                      {places.map((place) => (
                        <motion.div
                          key={place.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="cursor-move"
                        >
                          <div
                            draggable
                            onDragStart={(e: React.DragEvent<HTMLDivElement>) => handleDragStart(e, place)}
                            className="group p-4 border border-gray-100 rounded-xl hover:border-purple-200 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-gray-50 to-white hover:from-purple-50 hover:to-pink-50"
                          >
                            <div className="flex items-start gap-4">
                              <img
                                src={place.image}
                                alt={place.name}
                                className="w-16 h-16 rounded-xl object-cover shadow-md"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-lg mb-1">{place.name}</h4>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{place.description}</p>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-purple-600 bg-purple-50 px-3 py-1 rounded-full font-medium">
                                    {place.category}
                                  </span>
                                  <span className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full font-medium">
                                    {place.duration}
                                  </span>
                                </div>
                              </div>
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="w-8 h-8 bg-gray-100 group-hover:bg-purple-100 rounded-lg flex items-center justify-center"
                              >
                                <GripVertical className="w-4 h-4 text-gray-400 group-hover:text-purple-500" />
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </motion.div>

                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="col-span-12 lg:col-span-7"
                >
                  <Card className="p-6 bg-white shadow-lg border-0 rounded-2xl min-h-[600px]">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                          <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Your Itinerary</h3>
                      </div>
                      {droppedItems.length > 0 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setDroppedItems([])}
                          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                        >
                          Clear All
                        </Button>
                      )}
                    </div>
                    
                    <div 
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      className="min-h-[500px] border-2 border-dashed border-purple-200 rounded-2xl p-6 bg-gradient-to-br from-purple-50/50 to-pink-50/50 hover:border-purple-300 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 transition-all duration-300"
                    >
                      {droppedItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-16">
                          <motion.div 
                            animate={{ 
                              scale: [1, 1.1, 1],
                              rotate: [0, 5, -5, 0]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                          >
                            <MapPin className="w-10 h-10 text-white" />
                          </motion.div>
                          <h4 className="text-2xl font-bold text-gray-800 mb-3">Start Building Your Itinerary</h4>
                          <p className="text-gray-600 max-w-md text-lg">
                            Drag and drop places from the left panel to create your personalized travel itinerary
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {droppedItems.map((item, index) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, scale: 0.9, y: 20 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: index * 0.1 }}
                              className="bg-white border border-purple-100 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:border-purple-200"
                            >
                              <div className="flex items-start gap-5">
                                <motion.div 
                                  whileHover={{ scale: 1.1 }}
                                  className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg"
                                >
                                  {index + 1}
                                </motion.div>
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-20 h-20 rounded-xl object-cover shadow-md"
                                />
                                <div className="flex-1">
                                  <h4 className="font-bold text-gray-900 mb-2 text-xl">{item.name}</h4>
                                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{item.description}</p>
                                  <div className="flex items-center gap-3">
                                    <span className="text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full font-medium">
                                      {item.category}
                                    </span>
                                    <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full font-medium">
                                      {item.duration}
                                    </span>
                                  </div>
                                </div>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => removeDroppedItem(item.id)}
                                  className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 transition-all duration-200 flex items-center justify-center font-bold text-lg"
                                >
                                  ×
                                </motion.button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {droppedItems.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                          className="mt-8 pt-6 border-t border-purple-100"
                        >
                          <div className="flex gap-4">
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex-1"
                            >
                              <Button 
                                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white rounded-2xl py-4 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                                disabled={droppedItems.length === 0}
                              >
                                <Sparkles className="w-5 h-5 mr-2" />
                                Generate Complete Itinerary
                              </Button>
                            </motion.div>
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button 
                                variant="outline" 
                                className="px-8 py-4 rounded-2xl border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 font-semibold text-lg"
                                disabled={droppedItems.length === 0}
                              >
                                Export PDF
                              </Button>
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen bg-white relative overflow-hidden"
          >
            <div className="container mx-auto px-6 py-12">
               {/* Animated Map-like Background */}
               <div className="absolute inset-0 opacity-30">
                 {/* Grid Lines */}
                 <motion.div
                   className="absolute inset-0"
                   animate={{
                     backgroundPosition: ['0px 0px', '40px 40px'],
                   }}
                   transition={{
                     duration: 15,
                     repeat: Infinity,
                     repeatType: 'reverse',
                     ease: 'linear'
                   }}
                   style={{
                     backgroundImage: `
                       linear-gradient(rgba(139, 92, 246, 0.15) 1px, transparent 1px),
                       linear-gradient(90deg, rgba(139, 92, 246, 0.15) 1px, transparent 1px)
                     `,
                     backgroundSize: '40px 40px'
                   }}
                 />
                 
                 {/* Moving Flight Paths */}
                 <motion.div
                   className="absolute inset-0"
                   animate={{
                     backgroundPosition: ['0% 0%', '100% 100%'],
                   }}
                   transition={{
                     duration: 25,
                     repeat: Infinity,
                     ease: 'linear'
                   }}
                   style={{
                     backgroundImage: `
                       radial-gradient(circle at 20% 30%, rgba(168, 85, 247, 0.4) 2px, transparent 2px),
                       radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.4) 2px, transparent 2px),
                       radial-gradient(circle at 60% 20%, rgba(251, 146, 60, 0.4) 2px, transparent 2px)
                     `,
                     backgroundSize: '120px 120px, 150px 150px, 100px 100px'
                   }}
                 />
                 
                 {/* Floating Elements - Plane Markers */}
                 <motion.div
                   className="absolute top-1/4 left-1/4 w-3 h-3 bg-purple-500 rounded-full shadow-lg"
                   animate={{
                     x: [0, 150, 0],
                     y: [0, -75, 0],
                     opacity: [0.6, 1, 0.6],
                     scale: [1, 1.2, 1]
                   }}
                   transition={{
                     duration: 12,
                     repeat: Infinity,
                     ease: 'easeInOut'
                   }}
                 />
                 <motion.div
                   className="absolute top-3/4 right-1/3 w-2.5 h-2.5 bg-pink-500 rounded-full shadow-lg"
                   animate={{
                     x: [0, -120, 0],
                     y: [0, 90, 0],
                     opacity: [0.7, 1, 0.7],
                     scale: [1, 1.3, 1]
                   }}
                   transition={{
                     duration: 18,
                     repeat: Infinity,
                     ease: 'easeInOut',
                     delay: 3
                   }}
                 />
                 <motion.div
                   className="absolute top-1/2 right-1/4 w-2 h-2 bg-orange-500 rounded-full shadow-lg"
                   animate={{
                     x: [0, -90, 0],
                     y: [0, -120, 0],
                     opacity: [0.5, 0.9, 0.5],
                     scale: [1, 1.4, 1]
                   }}
                   transition={{
                     duration: 14,
                     repeat: Infinity,
                     ease: 'easeInOut',
                     delay: 6
                   }}
                 />
                 
                 {/* Additional Flight Path Indicators */}
                 <motion.div
                   className="absolute top-1/3 left-2/3 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-md"
                   animate={{
                     x: [0, -200, 0],
                     y: [0, 100, 0],
                     opacity: [0.4, 0.8, 0.4]
                   }}
                   transition={{
                     duration: 20,
                     repeat: Infinity,
                     ease: 'linear',
                     delay: 2
                   }}
                 />
                 <motion.div
                   className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-green-500 rounded-full shadow-md"
                   animate={{
                     x: [0, 180, 0],
                     y: [0, -60, 0],
                     opacity: [0.5, 0.9, 0.5]
                   }}
                   transition={{
                     duration: 16,
                     repeat: Infinity,
                     ease: 'easeInOut',
                     delay: 8
                   }}
                 />
               </div>

              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16 relative z-10"
              >
                <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-6 flex items-center justify-center gap-4 tracking-tight">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Plane className="w-16 h-16 md:w-20 md:h-20 text-purple-600" />
                  </motion.div>
                  <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                    Trip Me Out
                  </span>
                </h1>
                <p className="text-2xl md:text-3xl text-gray-600 font-light tracking-wide">Discover your next adventure through vibes</p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-4xl mx-auto mb-12 relative z-10"
              >
                <div className="max-w-3xl mx-auto">
                  <div className="relative mb-12">
                    <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 w-8 h-8 text-gray-500 z-10" />
                    <Input
                      type="text"
                      placeholder="Where would you like to go?"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onFocus={() => {
                        if (searchQuery.trim() && filteredCities.length > 0) {
                          setShowSuggestions(true)
                        }
                      }}
                      onBlur={() => {
                        // Delay hiding suggestions to allow for clicks
                        setTimeout(() => setShowSuggestions(false), 200)
                      }}
                      className="w-full text-xl border-2 border-gray-300 bg-gray-50/80 backdrop-blur-sm focus:border-purple-400 focus:bg-white focus:ring-0 focus:outline-none placeholder:text-gray-500 text-gray-800 pl-20 pr-8 py-8 font-medium rounded-3xl shadow-lg hover:shadow-xl hover:bg-white transition-all duration-300"
                    />
                    
                    {/* Search Suggestions Dropdown */}
                    {showSuggestions && filteredCities.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden backdrop-blur-sm"
                      >
                        {filteredCities.map((city, index) => (
                          <motion.div
                            key={city}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            onClick={() => handleCitySelect(city)}
                            className="px-6 py-4 hover:bg-purple-50 cursor-pointer transition-all duration-200 border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                          >
                            <MapPin className="w-5 h-5 text-purple-500" />
                            <div>
                              <span className="text-lg font-medium text-gray-900">{city}</span>
                              <p className="text-sm text-gray-500">
                                {mockCities[city as keyof typeof mockCities].length} places to explore
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  <div className="flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.08, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Button
                        onClick={handleVibePlan}
                        size="lg"
                        className="relative overflow-hidden px-16 py-8 rounded-3xl font-black text-2xl shadow-2xl transition-all duration-700 group bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white hover:shadow-purple-500/40 border-0"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                        <motion.div 
                          className="flex items-center relative z-10"
                          animate={{ x: [0, -3, 0] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <motion.div
                            animate={{ 
                              rotate: [0, 15, -15, 0],
                              scale: [1, 1.2, 1]
                            }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <Sparkles className="w-8 h-8 mr-4" />
                          </motion.div>
                          <span className="tracking-wide">Discover by Vibe</span>
                        </motion.div>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          animate={{ x: [-200, 400] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.div
                          className="absolute inset-0 rounded-3xl"
                          animate={{
                            boxShadow: [
                              '0 0 20px rgba(168, 85, 247, 0.4)',
                              '0 0 40px rgba(236, 72, 153, 0.6)',
                              '0 0 20px rgba(168, 85, 247, 0.4)'
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
