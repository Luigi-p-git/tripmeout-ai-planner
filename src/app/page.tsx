'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Sparkles, Plane, Calendar, Users, GripVertical, Filter, BarChart3, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Mock data for cities and places
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

  const handleVibePlan = () => {
    setPlanType('vibe')
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
  const filteredPlaces = selectedCategory === 'All' 
    ? places 
    : places.filter(place => place.category === selectedCategory)

  const categories = ['All', ...Array.from(new Set(places.map(place => place.category)))]

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
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {filteredPlaces.map((place) => (
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
                                <h4 className="font-medium text-gray-900 text-sm truncate">{place.name}</h4>
                                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{place.description}</p>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-medium">
                                    {place.category}
                                  </span>
                                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
                                    {place.duration}
                                  </span>
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
                  <Card className="p-6 bg-white shadow-sm border border-gray-200 min-h-[600px]">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <BarChart3 className="w-5 h-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Your Itinerary</h3>
                      </div>
                      {droppedItems.length > 0 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setDroppedItems([])}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Clear All
                        </Button>
                      )}
                    </div>

                    <div
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
                        draggedItem 
                          ? 'border-blue-400 bg-blue-50' 
                          : 'border-gray-300 bg-gray-50'
                      }`}
                    >
                      {droppedItems.length === 0 ? (
                        <div className="text-center py-12">
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
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-medium">
                                      {item.category}
                                    </span>
                                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
                                      {item.duration}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => removeDroppedItem(item.id)}
                                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-100 text-gray-400 hover:text-red-500 transition-all duration-200 flex items-center justify-center"
                                >
                                  ×
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {droppedItems.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                          <div className="flex gap-3">
                            <Button 
                              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-3 font-semibold"
                              disabled={droppedItems.length === 0}
                            >
                              Generate Complete Itinerary
                            </Button>
                            <Button 
                              variant="outline" 
                              className="px-6 py-3 rounded-xl border-gray-200 hover:bg-gray-50"
                              disabled={droppedItems.length === 0}
                            >
                              Export PDF
                            </Button>
                          </div>
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
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-xl border-2 border-gray-300 bg-gray-50/80 backdrop-blur-sm focus:border-purple-400 focus:bg-white focus:ring-0 focus:outline-none placeholder:text-gray-500 text-gray-800 pl-20 pr-8 py-8 font-medium rounded-3xl shadow-lg hover:shadow-xl hover:bg-white transition-all duration-300"
                    />
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
