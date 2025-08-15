'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Sparkles, Plane, Calendar, Users, GripVertical, Filter, BarChart3, Settings, Globe, DollarSign, Clock, Thermometer, Users2, Building2, Train, Utensils, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { dataService, type CityInfo, type Place } from '@/services/dataService'
import GoogleMap from '@/components/GoogleMap'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type PlanType = 'vibe' | null

// Sortable Timeline Item Component
function SortableTimelineItem({ item, index, totalItems }: { item: any, index: number, totalItems: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id.toString() })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`flex-shrink-0 w-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100 hover:shadow-md transition-all cursor-grab active:cursor-grabbing ${
        isDragging ? 'shadow-2xl scale-105 z-50' : ''
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md ${
          index === 0 ? 'bg-green-500' : 
          index === totalItems - 1 ? 'bg-red-500' : 'bg-purple-500'
        }`}>
          {item.order}
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Day {item.day}</span>
          <span className="text-xs font-medium text-purple-600">{item.timeSlot}</span>
        </div>
        <div className="ml-auto">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
      </div>
      <img 
        src={item.image} 
        alt={item.name}
        className="w-full h-24 object-cover rounded-lg mb-3"
      />
      <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2">{item.name}</h3>
      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{item.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">{item.category}</span>
        <span className="text-xs text-gray-500">{item.duration}</span>
      </div>
    </motion.div>
  )
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [planType, setPlanType] = useState<PlanType>(null)
  const [travelDates, setTravelDates] = useState({ start: '', end: '' })
  const [travelers, setTravelers] = useState('2')
  const [draggedItem, setDraggedItem] = useState<any>(null)
  const [droppedItems, setDroppedItems] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  // Real-time data state
  const [currentCityInfo, setCurrentCityInfo] = useState<CityInfo | null>(null)
  const [currentPlaces, setCurrentPlaces] = useState<Place[]>([])
  const [isLoadingCityInfo, setIsLoadingCityInfo] = useState(false)
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false)
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
  const [cityDataError, setCityDataError] = useState<string | null>(null)
  const [showItinerary, setShowItinerary] = useState(false)
  const [generatedItinerary, setGeneratedItinerary] = useState<any[]>([])
  const [isGeneratingItinerary, setIsGeneratingItinerary] = useState(false)
  const [collapsedItems, setCollapsedItems] = useState<Set<number>>(new Set())

  const handleVibePlan = () => {
    setPlanType('vibe')
  }

  const toggleItemCollapse = (itemId: number) => {
    setCollapsedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  // Fetch real-time city data
  const fetchCityData = async (cityName: string) => {
    if (!cityName.trim()) return;
    
    setIsLoadingCityInfo(true);
    setIsLoadingPlaces(true);
    setCityDataError(null);
    
    try {
      // Fetch city info and places in parallel
      const [cityInfo, places] = await Promise.all([
        dataService.getCityInfo(cityName),
        dataService.getPlaces(cityName, 20)
      ]);
      
      // Handle city info availability
      if (!cityInfo) {
        setCityDataError(`We're currently unable to provide detailed information about ${cityName}. This may be due to temporary API issues or limited data coverage. Please try checking the city name spelling or try again later.`);
      }
      
      setCurrentCityInfo(cityInfo);
      setCurrentPlaces(places);
    } catch (error) {
      console.error('Error fetching city data:', error);
      setCityDataError(`An error occurred while fetching data for ${cityName}. Please try again later.`);
    } finally {
      setIsLoadingCityInfo(false);
      setIsLoadingPlaces(false);
    }
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.length > 1) {
      try {
        const suggestions = await dataService.searchCities(value);
        setSearchSuggestions(suggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching city suggestions:', error);
        setSearchSuggestions([]);
      }
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleCitySelect = async (city: string) => {
    setSearchQuery(city);
    setShowSuggestions(false);
    setSearchSuggestions([]);
    await fetchCityData(city);
  };

  // Fetch data when search query changes (on Enter or search button)
  const handleSearch = async () => {
    if (searchQuery.trim()) {
      await fetchCityData(searchQuery);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
      setShowSuggestions(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, item: any) => {
    console.log('Drag started for item:', item)
    setDraggedItem(item)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    console.log('Drag over drop zone')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    console.log('Drop event triggered')
    console.log('Current draggedItem:', draggedItem)
    console.log('Current droppedItems:', droppedItems)
    
    if (draggedItem && !droppedItems.find(item => item.id === draggedItem.id)) {
      console.log('Adding item to droppedItems:', draggedItem)
      setDroppedItems(prev => {
        const newItems = [...prev, draggedItem]
        console.log('New droppedItems array:', newItems)
        return newItems
      })
    } else {
      console.log('Item not added - either no draggedItem or duplicate')
    }
    setDraggedItem(null)
  }

  const removeDroppedItem = (itemId: number) => {
    setDroppedItems(prev => prev.filter(item => item.id !== itemId))
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleTimelineDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setGeneratedItinerary((items) => {
        const oldIndex = items.findIndex((item) => item.id.toString() === active.id)
        const newIndex = items.findIndex((item) => item.id.toString() === over.id)
        
        const newItems = arrayMove(items, oldIndex, newIndex)
        // Update order numbers
        return newItems.map((item, index) => ({
          ...item,
          order: index + 1
        }))
      })
    }
  }

  const handleGenerateItinerary = () => {
    console.log('Generate itinerary clicked!')
    console.log('Dropped items:', droppedItems)
    
    if (droppedItems.length === 0) {
      console.log('No dropped items, returning early')
      return
    }
    
    console.log('Setting isGeneratingItinerary to true')
    setIsGeneratingItinerary(true)
    
    // Use setTimeout instead of async/await for Safari compatibility
    setTimeout(() => {
      try {
        console.log('Starting itinerary generation...')
        
        // Create optimized itinerary with time slots
        const optimizedItinerary = droppedItems.map((item, index) => ({
          ...item,
          day: Math.floor(index / 3) + 1,
          timeSlot: ['9:00 AM', '1:00 PM', '5:00 PM'][index % 3],
          duration: item.duration || '2-3 hours',
          order: index + 1,
          coordinates: {
            lat: -33.8688 + (Math.random() - 0.5) * 0.1, // Sydney area with random offset
            lng: 151.2093 + (Math.random() - 0.5) * 0.1
          }
        }))
        
        console.log('Generated itinerary:', optimizedItinerary)
        setGeneratedItinerary(optimizedItinerary)
        console.log('Setting showItinerary to true')
        setShowItinerary(true)
        
        // Smooth scroll to itinerary section
         setTimeout(() => {
           try {
             window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
           } catch (e) {
             // Fallback for older Safari versions
             window.scrollTo(0, window.innerHeight)
           }
         }, 100)
        
      } catch (error) {
        console.error('Error generating itinerary:', error)
      } finally {
        console.log('Setting isGeneratingItinerary to false')
        setIsGeneratingItinerary(false)
      }
    }, 2000) // 2 second delay to simulate generation
  }

  // Places are now fetched via API and stored in currentPlaces

  const isDashboardMode = planType && searchQuery

  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence mode="wait">
        {showItinerary ? (
          <motion.div
            key="itinerary"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen bg-gradient-to-br from-gray-50 to-white"
          >
            {/* Itinerary Header */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-8"
            >
              <div className="container mx-auto px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-4xl font-bold mb-2">Your {searchQuery} Itinerary</h1>
                    <p className="text-purple-100 text-lg">Optimized route with {generatedItinerary.length} amazing stops</p>
                  </div>
                  <Button
                    onClick={() => setShowItinerary(false)}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    Back to Planning
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Horizontal Drag-and-Drop Timeline Section */}
            <div className="container mx-auto px-6 py-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                  Interactive Timeline - Drag to Reorder
                </h2>
                <DndContext 
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleTimelineDragEnd}
                >
                  <SortableContext 
                    items={generatedItinerary.map(item => item.id.toString())}
                    strategy={horizontalListSortingStrategy}
                  >
                    <div className="flex overflow-x-auto pb-4 space-x-4 min-h-[200px]">
                      {generatedItinerary.map((item, index) => (
                        <SortableTimelineItem 
                          key={item.id} 
                          item={item} 
                          index={index} 
                          totalItems={generatedItinerary.length}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 pb-8">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Compact Itinerary Timeline */}
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                      Your World-Class Journey
                    </h2>
                    <p className="text-gray-600 text-sm">Expertly curated experiences with insider tips and optimal timing</p>
                  </div>
                  
                  <div className="relative">
                    {/* Connecting Line */}
                    <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 via-pink-400 to-orange-400 rounded-full opacity-30"></div>
                    
                    {generatedItinerary.map((item, index) => {
                      const isFirst = index === 0
                      const isLast = index === generatedItinerary.length - 1
                      const nextItem = generatedItinerary[index + 1]
                      
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.15 }}
                          className="relative mb-8 last:mb-0"
                        >
                          {/* Timeline Node */}
                          <div className={`absolute left-6 w-4 h-4 rounded-full border-4 border-white shadow-lg z-10 ${
                            isFirst ? 'bg-green-500' : isLast ? 'bg-red-500' : 'bg-purple-500'
                          }`}></div>
                          
                          {/* Compact Card */}
                          <div className="ml-16 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                            {/* Compact Header */}
                            <div className={`p-4 bg-gradient-to-r ${
                              isFirst ? 'from-green-500 to-emerald-600' : 
                              isLast ? 'from-red-500 to-rose-600' : 
                              'from-purple-500 to-pink-600'
                            } text-white`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-bold text-sm">
                                    {item.order}
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-bold">{item.name}</h3>
                                    <p className="text-white/80 text-xs">{item.category}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="text-right">
                                    <div className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
                                      Day {item.day}
                                    </div>
                                    <div className="text-white/80 text-xs mt-1">{item.timeSlot}</div>
                                  </div>
                                  <button
                                    onClick={() => toggleItemCollapse(index)}
                                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                                  >
                                    {collapsedItems.has(index) ? 
                                      <ChevronDown className="w-4 h-4" /> : 
                                      <ChevronUp className="w-4 h-4" />
                                    }
                                  </button>
                                </div>
                              </div>
                            </div>
                            
                            {/* Collapsible Card Content */}
                            <AnimatePresence>
                              {!collapsedItems.has(index) && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-4">
                                    <p className="text-gray-700 text-sm leading-relaxed mb-4">{item.description}</p>
                              
                                     {/* Compact Details */}
                                     <div className="grid grid-cols-2 gap-3 mb-4">
                                       <div className="bg-blue-50 rounded-lg p-3">
                                         <div className="flex items-center gap-2 mb-1">
                                           <Clock className="w-4 h-4 text-blue-600" />
                                           <span className="font-medium text-blue-900 text-xs">Duration</span>
                                         </div>
                                         <p className="text-blue-700 text-sm">{item.duration}</p>
                                       </div>
                                       
                                       <div className="bg-green-50 rounded-lg p-3">
                                         <div className="flex items-center gap-2 mb-1">
                                           <DollarSign className="w-4 h-4 text-green-600" />
                                           <span className="font-medium text-green-900 text-xs">Budget</span>
                                         </div>
                                         <p className="text-green-700 text-sm">
                                           {item.category === 'Restaurant' ? '$25-45' :
                                            item.category === 'Museum' ? '$15-25' :
                                            item.category === 'Park' ? 'Free' :
                                            item.category === 'Shopping' ? '$50-200+' :
                                            '$20-40'}
                                         </p>
                                       </div>
                                     </div>
                              
                                     {/* Compact Travel Tips */}
                                     <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-3 mb-4">
                                       <div className="flex items-center gap-2 mb-2">
                                         <Sparkles className="w-4 h-4 text-amber-600" />
                                         <span className="font-medium text-amber-900 text-xs">Tips</span>
                                       </div>
                                <ul className="space-y-1 text-amber-800 text-xs">
                                  {item.category === 'Restaurant' && (
                                    <>
                                         <li className="flex items-start gap-2">
                                           <span className="w-1 h-1 bg-amber-600 rounded-full mt-1.5 flex-shrink-0"></span>
                                           <span>Make reservations 2-3 days in advance</span>
                                         </li>
                                          <li className="flex items-start gap-2">
                                            <span className="w-1 h-1 bg-amber-600 rounded-full mt-1.5 flex-shrink-0"></span>
                                            <span>Try chef's special</span>
                                          </li>
                                          <li className="flex items-start gap-2">
                                            <span className="w-1 h-1 bg-amber-600 rounded-full mt-1.5 flex-shrink-0"></span>
                                            <span>Peak: 7-9 PM, arrive early</span>
                                          </li>
                                    </>
                                  )}
                                  {item.category === 'Museum' && (
                                    <>
                                      <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Visit during weekday mornings for fewer crowds</span>
                                      </li>
                                      <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Download the audio guide app for enhanced experience</span>
                                      </li>
                                      <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Check for special exhibitions and temporary displays</span>
                                      </li>
                                    </>
                                  )}
                                  {item.category === 'Park' && (
                                    <>
                                      <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Best lighting for photos: Golden hour (1 hour before sunset)</span>
                                      </li>
                                      <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Bring comfortable walking shoes and water bottle</span>
                                      </li>
                                      <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Look for hidden viewpoints and local wildlife</span>
                                      </li>
                                    </>
                                  )}
                                  {(item.category === 'Shopping' || item.category === 'Market') && (
                                    <>
                                      <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Negotiate prices at local markets, start at 50% of asking price</span>
                                      </li>
                                      <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Bring cash for better deals and faster transactions</span>
                                      </li>
                                      <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Visit early morning for freshest products and best selection</span>
                                      </li>
                                    </>
                                  )}
                                  {!['Restaurant', 'Museum', 'Park', 'Shopping', 'Market'].includes(item.category) && (
                                    <>
                                      <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Arrive early to avoid crowds and get the best experience</span>
                                      </li>
                                      <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Check opening hours and any special requirements in advance</span>
                                      </li>
                                      <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Bring a camera and comfortable clothing for the activity</span>
                                      </li>
                                    </>
                                  )}
                                </ul>
                              </div>
                              
                                     {/* Compact Transportation */}
                                     {!isLast && nextItem && (
                                       <div className="bg-gray-50 rounded-lg p-3">
                                         <div className="flex items-center justify-between">
                                           <div className="flex items-center gap-2">
                                             <Train className="w-4 h-4 text-gray-600" />
                                             <span className="font-medium text-gray-900 text-xs">To {nextItem.name}</span>
                                           </div>
                                           <div className="flex items-center gap-2 text-xs text-gray-600">
                                             <span className="flex items-center gap-1">
                                               <Clock className="w-3 h-3" />
                                               {Math.floor(Math.random() * 20) + 5}min
                                             </span>
                                             <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                                               {['Walk', 'Taxi', 'Metro', 'Bus'][Math.floor(Math.random() * 4)]}
                                             </span>
                                           </div>
                                         </div>
                                       </div>
                                     )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </motion.div>
                      )
                    })}
                   </div>
                </div>

                {/* Compact Google Map */}
                <div className="lg:sticky lg:top-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                  >
                    {/* Compact Map Header */}
                    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold mb-1">Route Map</h3>
                          <p className="text-white/80 text-sm">{generatedItinerary.length} destinations</p>
                        </div>
                        <div className="bg-white/20 rounded-lg p-2">
                          <MapPin className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Compact Map Stats */}
                    <div className="p-3 bg-gradient-to-r from-gray-50 to-blue-50 border-b">
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                          <div className="text-lg font-bold text-blue-600">{generatedItinerary.length}</div>
                          <div className="text-xs text-gray-600">Stops</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-purple-600">
                            {Math.floor(Math.random() * 15) + 10}km
                          </div>
                          <div className="text-xs text-gray-600">Distance</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-pink-600">
                            {Math.floor(Math.random() * 3) + 2}h
                          </div>
                          <div className="text-xs text-gray-600">Time</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Compact Map Container */}
                    <div className="relative">
                      <div className="h-[400px] bg-gray-100">
                        <GoogleMap places={generatedItinerary} />
                      </div>
                      
                      {/* Map Legend */}
                      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3 text-sm">Map Legend</h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-gray-700">Start Point</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span className="text-gray-700">Destinations</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-gray-700">End Point</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-0.5 bg-purple-500 rounded"></div>
                            <span className="text-gray-700">Optimized Route</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Map Controls */}
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-gray-200">
                        <div className="space-y-2">
                          <button className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                            <span className="text-lg font-bold">+</span>
                          </button>
                          <button className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                            <span className="text-lg font-bold">−</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="p-4 bg-gray-50 border-t">
                      <div className="flex gap-2">
                        <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-xl font-medium hover:bg-blue-600 transition-colors text-sm">
                          Send to Phone
                        </button>
                        <button className="flex-1 bg-green-500 text-white py-2 px-4 rounded-xl font-medium hover:bg-green-600 transition-colors text-sm">
                          Open in Maps
                        </button>
                        <button className="flex-1 bg-purple-500 text-white py-2 px-4 rounded-xl font-medium hover:bg-purple-600 transition-colors text-sm">
                          Export PDF
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : isDashboardMode ? (
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
                      {isLoadingCityInfo ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          {[...Array(8)].map((_, i) => (
                            <div key={i} className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 animate-pulse">
                              <div className="w-4 h-4 bg-white/20 rounded"></div>
                              <div>
                                <div className="w-12 h-3 bg-white/20 rounded mb-1"></div>
                                <div className="w-16 h-4 bg-white/20 rounded"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : cityDataError ? (
                        <div className="bg-red-500/20 backdrop-blur-sm rounded-lg px-4 py-3 mb-4 border border-red-400/30">
                          <div className="flex items-center gap-2 text-white">
                            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                              <span className="text-white text-xs font-bold">!</span>
                            </div>
                            <div>
                              <div className="font-semibold text-sm">City Information Unavailable</div>
                              <div className="text-xs text-white/90 mt-1">{cityDataError}</div>
                            </div>
                          </div>
                        </div>
                      ) : currentCityInfo && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          <div className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                            <Users2 className="w-4 h-4 text-blue-300" />
                            <div>
                              <div className="text-xs text-white/70">Population</div>
                              <div className="font-semibold">{currentCityInfo.population}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                            <DollarSign className="w-4 h-4 text-green-300" />
                            <div>
                              <div className="text-xs text-white/70">Currency</div>
                              <div className="font-semibold">{currentCityInfo.currency}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                            <Clock className="w-4 h-4 text-purple-300" />
                            <div>
                              <div className="text-xs text-white/70">Timezone</div>
                              <div className="font-semibold">{currentCityInfo.timezone}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                            <Thermometer className="w-4 h-4 text-orange-300" />
                            <div>
                              <div className="text-xs text-white/70">Temperature</div>
                              <div className="font-semibold">{currentCityInfo.averageTemperature}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                            <Globe className="w-4 h-4 text-cyan-300" />
                            <div>
                              <div className="text-xs text-white/70">Language</div>
                              <div className="font-semibold">{currentCityInfo.language}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                            <Building2 className="w-4 h-4 text-yellow-300" />
                            <div>
                              <div className="text-xs text-white/70">Safety</div>
                              <div className="font-semibold">{currentCityInfo.safetyRating}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                            <Calendar className="w-4 h-4 text-pink-300" />
                            <div>
                              <div className="text-xs text-white/70">Cost Level</div>
                              <div className="font-semibold">{currentCityInfo.costLevel}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                            <Sparkles className="w-4 h-4 text-indigo-300" />
                            <div>
                              <div className="text-xs text-white/70">Best Time</div>
                              <div className="font-semibold">{currentCityInfo.bestTimeToVisit}</div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 mt-3 text-white/80">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {currentPlaces.length} places to explore
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
                        {currentPlaces.length} places
                      </span>
                    </div>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                      {isLoadingPlaces ? (
                        [...Array(6)].map((_, i) => (
                          <div key={i} className="p-4 border border-gray-100 rounded-xl bg-gradient-to-r from-gray-50 to-white animate-pulse">
                            <div className="flex items-start gap-4">
                              <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                              <div className="flex-1 min-w-0">
                                <div className="w-32 h-5 bg-gray-200 rounded mb-2"></div>
                                <div className="w-full h-4 bg-gray-200 rounded mb-3"></div>
                                <div className="flex items-center gap-2">
                                  <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
                                  <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        currentPlaces.map((place) => (
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
                        ))
                      )}
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
                      onDragOver={(e) => {
                        handleDragOver(e)
                        console.log('Drop zone drag over')
                      }}
                      onDrop={(e) => {
                        console.log('Drop zone drop event')
                        handleDrop(e)
                      }}
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
                                  X
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
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleGenerateItinerary()
                                }}
                                type="button"
                                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white rounded-2xl py-4 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                                disabled={droppedItems.length === 0 || isGeneratingItinerary}
                              >
                                <Sparkles className="w-5 h-5 mr-2" />
                                {isGeneratingItinerary ? 'Generating...' : 'Generate Complete Itinerary'}
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
                        if (searchQuery.trim() && searchSuggestions.length > 0) {
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
                    {showSuggestions && searchSuggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden backdrop-blur-sm"
                      >
                        {searchSuggestions.map((city, index) => (
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
                                Explore amazing places
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
