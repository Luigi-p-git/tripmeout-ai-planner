'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Sparkles, Plane, Calendar, Users, GripVertical, Filter, BarChart3, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PlaceCard } from '@/components/PlaceCard'
import { CityInfoCard } from '@/components/CityInfoCard'
import { searchService, SearchResult, SearchPreferences } from '@/services/searchService'
import { EnhancedPlace } from '@/services/geminiService'

// Mock data for cities and places (keeping original for fallback)
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
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  // Enhanced search functionality
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchPreferences] = useState<SearchPreferences>({
    interests: ['culture', 'food', 'attractions'],
    budget: 'medium',
    duration: '3 days',
    travelStyle: 'cultural'
  })

  const handleVibePlan = async () => {
    if (!searchQuery.trim()) {
      setPlanType('vibe')
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      // Use enhanced search if available, fallback to mock data
      const result = await searchService.searchCity(searchQuery, searchPreferences)
      setSearchResult(result)
      setPlanType('vibe')
    } catch (err) {
      console.error('Search failed, using mock data:', err)
      // Fallback to original behavior
      setSearchResult(null)
      setPlanType('vibe')
    } finally {
      setIsLoading(false)
    }
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
     // Use enhanced search result if available
     if (searchResult?.places) {
       return searchResult.places.map((place: EnhancedPlace) => ({
         id: place.id,
         name: place.name,
         description: place.description || '',
         image: place.image || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop',
         category: place.category || 'Attraction',
         duration: place.duration || '1-2 hours'
       }))
     }
     
     // Fallback to mock data
     const cityKey = Object.keys(mockCities).find(city => 
       city.toLowerCase().includes(searchQuery.toLowerCase())
     )
     return cityKey ? mockCities[cityKey as keyof typeof mockCities] : []
   }

  const places = getPlacesForCity()
  const filteredPlaces = selectedCategory === 'All' 
    ? places 
    : places.filter((place: any) => place.category === selectedCategory)

  const categories = ['All', ...Array.from(new Set(places.map((place: any) => place.category)))]

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
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white border-b border-gray-200 shadow-sm"
            >
              <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                        <Plane className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h1 className="text-xl font-bold text-gray-900">TripMeOut Dashboard</h1>
                        <p className="text-sm text-gray-500">Planning your trip to {searchQuery}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Settings className="w-4 h-4" />
                      Settings
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setPlanType(null)
                        setSearchQuery('')
                        setDroppedItems([])
                        setSearchResult(null)
                      }}
                    >
                      New Trip
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="grid gap-6 grid-cols-12">
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="col-span-12 lg:col-span-4"
                >
                  <Card className="p-6 mb-6 bg-white shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      <Filter className="w-5 h-5 text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Filter Places</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-white shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Places in {searchQuery}</h3>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {filteredPlaces.length} places
                      </span>
                    </div>
                    
                    {/* Enhanced search results display */}
                    {searchResult?.cityInfo && (
                      <div className="mb-4">
                        <CityInfoCard cityInfo={searchResult.cityInfo} />
                      </div>
                    )}
                    
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {filteredPlaces.map((place: any) => (
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
                            className="group p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-gray-50 hover:bg-white"
                          >
                            <div className="flex items-start gap-3">
                              <img
                                src={place.image}
                                alt={place.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-sm mb-1 truncate">{place.name}</h4>
                                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{place.description}</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                    {place.category}
                                  </span>
                                  <span className="text-xs text-gray-500">{place.duration}</span>
                                </div>
                              </div>
                              <GripVertical className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
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
                  className="col-span-12 lg:col-span-8"
                >
                  <Card className="p-6 bg-white shadow-sm border border-gray-200 h-full">
                    <div className="flex items-center gap-3 mb-6">
                      <BarChart3 className="w-5 h-5 text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Your Itinerary</h3>
                    </div>
                    
                    <div
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      className="min-h-96 border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50/50 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                    >
                      {droppedItems.length === 0 ? (
                        <div className="text-center py-16">
                          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin className="w-8 h-8 text-gray-400" />
                          </div>
                          <h4 className="text-lg font-medium text-gray-900 mb-2">Start Building Your Itinerary</h4>
                          <p className="text-gray-600 mb-4">Drag places from the left panel to create your perfect trip</p>
                          <div className="text-sm text-gray-500">
                            <p>💡 Tip: You can reorder items by dragging them within this area</p>
                          </div>
                        </div>
                      ) : (
                        <div className="grid gap-4">
                          {droppedItems.map((item, index) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
                            >
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                  {index + 1}
                                </div>
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
                                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                                  <div className="flex items-center gap-4">
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                      {item.category}
                                    </span>
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      {item.duration}
                                    </span>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeDroppedItem(item.id)}
                                  className="text-gray-400 hover:text-red-500"
                                >
                                  ×
                                </Button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
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
            className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
               {/* Enhanced Airplane Trajectories with Sequential Dashed Trails */}
               
               {/* Airplane 1 - Purple - Curved trajectory */}
               <motion.div
                 className="absolute"
                 initial={{ x: 50, y: 200 }}
                 animate={{
                   x: [50, 200, 350, 500, 650],
                   y: [200, 150, 100, 120, 80],
                   rotate: [0, 15, -10, 20, 0],
                   opacity: [1, 1, 1, 0.5, 0]
                 }}
                 transition={{
                   duration: 8,
                   repeat: Infinity,
                   ease: 'easeInOut',
                   repeatDelay: 4
                 }}
               >
                 <Plane className="w-4 h-4 text-purple-500 drop-shadow-lg" />
               </motion.div>
               
               {/* Sequential dashed trail for Airplane 1 */}
               {[...Array(12)].map((_, i) => (
                 <motion.div
                   key={`purple-dash-${i}`}
                   className="absolute w-3 h-0.5 bg-purple-400 rounded-full"
                   initial={{
                     x: 50 + (i * 50),
                     y: 200 - (i * 10) + Math.sin(i * 0.5) * 15,
                     opacity: 0
                   }}
                   animate={{
                     opacity: [0, 0.8, 0.4, 0]
                   }}
                   transition={{
                     duration: 2,
                     delay: i * 0.3,
                     repeat: Infinity,
                     repeatDelay: 10
                   }}
                 />
               ))}

               {/* Airplane 2 - Pink - Diagonal descent */}
               <motion.div
                 className="absolute"
                 initial={{ x: 600, y: 100 }}
                 animate={{
                   x: [600, 500, 400, 300, 200],
                   y: [100, 180, 260, 340, 420],
                   rotate: [0, -25, -45, -60, -90],
                   opacity: [1, 1, 1, 0.6, 0]
                 }}
                 transition={{
                   duration: 10,
                   repeat: Infinity,
                   ease: 'easeOut',
                   repeatDelay: 2,
                   delay: 2
                 }}
               >
                 <Plane className="w-3.5 h-3.5 text-pink-500 drop-shadow-lg" />
               </motion.div>
               
               {/* Sequential dashed trail for Airplane 2 */}
               {[...Array(10)].map((_, i) => (
                 <motion.div
                   key={`pink-dash-${i}`}
                   className="absolute w-2.5 h-0.5 bg-pink-400 rounded-full"
                   initial={{
                     x: 600 - (i * 40),
                     y: 100 + (i * 32),
                     opacity: 0,
                     rotate: -45
                   }}
                   animate={{
                     opacity: [0, 0.9, 0.5, 0]
                   }}
                   transition={{
                     duration: 1.8,
                     delay: 2 + (i * 0.4),
                     repeat: Infinity,
                     repeatDelay: 10
                   }}
                 />
               ))}

               {/* Airplane 3 - Orange - Loop trajectory */}
               <motion.div
                 className="absolute"
                 initial={{ x: 300, y: 300 }}
                 animate={{
                   x: [300, 400, 450, 400, 300, 250, 300],
                   y: [300, 250, 300, 350, 400, 350, 300],
                   rotate: [0, 45, 90, 135, 180, 225, 360],
                   opacity: [1, 1, 1, 1, 1, 0.3, 0]
                 }}
                 transition={{
                   duration: 12,
                   repeat: Infinity,
                   ease: 'linear',
                   repeatDelay: 3,
                   delay: 4
                 }}
               >
                 <Plane className="w-3 h-3 text-orange-500 drop-shadow-lg" />
               </motion.div>
               
               {/* Sequential dashed trail for Airplane 3 - Circular */}
               {[...Array(16)].map((_, i) => {
                 const angle = (i * 22.5) * (Math.PI / 180);
                 const radius = 75;
                 return (
                   <motion.div
                     key={`orange-dash-${i}`}
                     className="absolute w-2 h-0.5 bg-orange-400 rounded-full"
                     initial={{
                       x: 300 + Math.cos(angle) * radius,
                       y: 300 + Math.sin(angle) * radius,
                       opacity: 0,
                       rotate: (i * 22.5) + 90
                     }}
                     animate={{
                       opacity: [0, 0.7, 0.3, 0]
                     }}
                     transition={{
                       duration: 1.5,
                       delay: 4 + (i * 0.2),
                       repeat: Infinity,
                       repeatDelay: 12
                     }}
                   />
                 );
               })}

               {/* Airplane 4 - Blue - Zigzag pattern */}
               <motion.div
                 className="absolute"
                 initial={{ x: 100, y: 150 }}
                 animate={{
                   x: [100, 200, 150, 250, 200, 300, 250, 350],
                   y: [150, 120, 180, 100, 200, 130, 190, 110],
                   rotate: [0, 30, -30, 45, -45, 30, -30, 0],
                   opacity: [1, 1, 1, 1, 1, 1, 0.4, 0]
                 }}
                 transition={{
                   duration: 14,
                   repeat: Infinity,
                   ease: 'easeInOut',
                   repeatDelay: 1,
                   delay: 6
                 }}
               >
                 <Plane className="w-3 h-3 text-blue-500 drop-shadow-lg" />
               </motion.div>
               
               {/* Sequential dashed trail for Airplane 4 - Zigzag */}
               {[...Array(14)].map((_, i) => {
                 const zigzagX = 100 + (i * 18);
                 const zigzagY = 150 + (i % 2 === 0 ? -20 : 20) + Math.sin(i * 0.8) * 15;
                 return (
                   <motion.div
                     key={`blue-dash-${i}`}
                     className="absolute w-2.5 h-0.5 bg-blue-400 rounded-full"
                     initial={{
                       x: zigzagX,
                       y: zigzagY,
                       opacity: 0
                     }}
                     animate={{
                       opacity: [0, 0.8, 0.4, 0]
                     }}
                     transition={{
                       duration: 1.6,
                       delay: 6 + (i * 0.25),
                       repeat: Infinity,
                       repeatDelay: 11
                     }}
                   />
                 );
               })}

               {/* Airplane 5 - Green - Ascending spiral */}
               <motion.div
                 className="absolute"
                 initial={{ x: 500, y: 400 }}
                 animate={{
                   x: [500, 450, 400, 350, 300, 250, 200],
                   y: [400, 350, 300, 250, 200, 150, 100],
                   rotate: [0, 60, 120, 180, 240, 300, 360],
                   scale: [1, 1.1, 1.2, 1.1, 1, 0.8, 0],
                   opacity: [1, 1, 1, 1, 1, 0.5, 0]
                 }}
                 transition={{
                   duration: 9,
                   repeat: Infinity,
                   ease: 'easeOut',
                   repeatDelay: 6,
                   delay: 8
                 }}
               >
                 <Plane className="w-3.5 h-3.5 text-green-500 drop-shadow-lg" />
               </motion.div>
               
               {/* Sequential dashed trail for Airplane 5 - Spiral */}
               {[...Array(12)].map((_, i) => {
                 const spiralX = 500 - (i * 25);
                 const spiralY = 400 - (i * 25) + Math.cos(i * 0.8) * 10;
                 return (
                   <motion.div
                     key={`green-dash-${i}`}
                     className="absolute w-3 h-0.5 bg-green-400 rounded-full"
                     initial={{
                       x: spiralX,
                       y: spiralY,
                       opacity: 0,
                       rotate: i * 30
                     }}
                     animate={{
                       opacity: [0, 0.9, 0.5, 0]
                     }}
                     transition={{
                       duration: 1.4,
                       delay: 8 + (i * 0.2),
                       repeat: Infinity,
                       repeatDelay: 13
                     }}
                   />
                 );
               })}
             </div>

            <div className="w-full max-w-6xl mx-auto flex flex-col items-center relative z-10">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
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
                className="w-full max-w-4xl mb-12"
              >
              <div className="max-w-4xl mx-auto">
                <div className="flex flex-col items-center gap-6 mb-12">
                  {/* Search Input */}
                  <div className="relative w-full">
                    <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 z-10" />
                    <Input
                      type="text"
                      placeholder="Where would you like to go?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm focus:border-white/40 focus:bg-white/20 focus:shadow-lg focus:ring-0 focus:outline-none placeholder:text-gray-300 text-white pl-16 pr-6 py-6 font-medium rounded-full shadow-lg hover:shadow-xl hover:bg-white/15 transition-all duration-300"
                    />
                  </div>
                  
                  {/* Vibe Button */}
                   <motion.div
                     whileHover={{ scale: 1.05, y: -2 }}
                     whileTap={{ scale: 0.95 }}
                     transition={{ type: "spring", stiffness: 300, damping: 20 }}
                   >
                     <Button
                       onClick={handleVibePlan}
                       disabled={isLoading}
                       size="lg"
                       className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-0"
                     >
                       <div className="flex items-center gap-3">
                         <Sparkles className="w-5 h-5" />
                         <span className="text-lg">Discover by Vibe</span>
                       </div>
                       <motion.div
                         className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                         animate={{ x: [-100, 100] }}
                         transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                       />
                       <motion.div
                         className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-full opacity-30 blur-lg"
                         animate={{ scale: [1, 1.1, 1] }}
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
