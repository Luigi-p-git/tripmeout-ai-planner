'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  Camera, 
  Utensils, 
  Car, 
  Footprints, 
  Train, 
  Plane,
  Edit3,
  Plus,
  Trash2,
  Heart,
  Share2,
  Download,
  ChevronDown,
  ChevronUp,
  Navigation,
  DollarSign,
  Users,
  Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Activity {
  id: string
  name: string
  type: 'attraction' | 'restaurant' | 'transport' | 'hotel' | 'activity'
  startTime: string
  endTime: string
  duration: string
  location: string
  description: string
  price?: number
  rating?: number
  reviews?: number
  tips?: string[]
  bookingRequired: boolean
  transportation?: {
    method: string
    duration: string
    cost?: number
  }
}

interface DayItinerary {
  date: string
  dayNumber: number
  activities: Activity[]
  totalCost: number
  walkingDistance: string
  highlights: string[]
}

interface ItineraryPlannerProps {
  destination: string
  dates: {
    start: string
    end: string
  }
  travelers: number
}

export function ItineraryPlanner({ destination, dates, travelers }: ItineraryPlannerProps) {
  const [selectedDay, setSelectedDay] = useState(1)
  const [expandedActivities, setExpandedActivities] = useState<string[]>([])
  const [editMode, setEditMode] = useState(false)

  const itinerary: DayItinerary[] = [
    {
      date: '2024-03-15',
      dayNumber: 1,
      totalCost: 85,
      walkingDistance: '3.2 km',
      highlights: ['Eiffel Tower', 'Seine River Cruise', 'French Cuisine'],
      activities: [
        {
          id: '1',
          name: 'Arrival at Charles de Gaulle Airport',
          type: 'transport',
          startTime: '09:00',
          endTime: '10:30',
          duration: '1h 30m',
          location: 'CDG Airport',
          description: 'Flight arrival and airport procedures',
          bookingRequired: false,
          transportation: {
            method: 'RER B Train',
            duration: '45 min',
            cost: 12
          }
        },
        {
          id: '2',
          name: 'Hotel Check-in',
          type: 'hotel',
          startTime: '11:30',
          endTime: '12:00',
          duration: '30 min',
          location: 'Hotel des Grands Boulevards',
          description: 'Check into your accommodation and freshen up',
          bookingRequired: true
        },
        {
          id: '3',
          name: 'Lunch at Café de Flore',
          type: 'restaurant',
          startTime: '12:30',
          endTime: '14:00',
          duration: '1h 30m',
          location: 'Saint-Germain-des-Prés',
          description: 'Historic café famous for its literary clientele',
          price: 35,
          rating: 4.3,
          reviews: 2847,
          tips: ['Try the hot chocolate', 'Great for people watching'],
          bookingRequired: false
        },
        {
          id: '4',
          name: 'Eiffel Tower Visit',
          type: 'attraction',
          startTime: '15:00',
          endTime: '17:30',
          duration: '2h 30m',
          location: 'Champ de Mars',
          description: 'Iconic iron tower with panoramic city views',
          price: 29,
          rating: 4.6,
          reviews: 125420,
          tips: ['Book skip-the-line tickets', 'Best photos from Trocadéro'],
          bookingRequired: true,
          transportation: {
            method: 'Metro Line 6',
            duration: '25 min',
            cost: 2
          }
        },
        {
          id: '5',
          name: 'Seine River Evening Cruise',
          type: 'activity',
          startTime: '19:00',
          endTime: '20:30',
          duration: '1h 30m',
          location: 'Port de la Bourdonnais',
          description: 'Romantic evening cruise with dinner option',
          price: 15,
          rating: 4.4,
          reviews: 8934,
          tips: ['Sunset timing is perfect', 'Bring a light jacket'],
          bookingRequired: true
        }
      ]
    },
    {
      date: '2024-03-16',
      dayNumber: 2,
      totalCost: 67,
      walkingDistance: '4.8 km',
      highlights: ['Louvre Museum', 'Montmartre', 'Local Markets'],
      activities: [
        {
          id: '6',
          name: 'Breakfast at Hotel',
          type: 'restaurant',
          startTime: '08:00',
          endTime: '09:00',
          duration: '1h',
          location: 'Hotel des Grands Boulevards',
          description: 'Continental breakfast included in stay',
          bookingRequired: false
        },
        {
          id: '7',
          name: 'Louvre Museum',
          type: 'attraction',
          startTime: '09:30',
          endTime: '13:00',
          duration: '3h 30m',
          location: '1st Arrondissement',
          description: 'World\'s largest art museum with Mona Lisa',
          price: 17,
          rating: 4.7,
          reviews: 89650,
          tips: ['Pre-book timed entry', 'Focus on specific wings', 'Use the museum app'],
          bookingRequired: true,
          transportation: {
            method: 'Walking',
            duration: '15 min'
          }
        },
        {
          id: '8',
          name: 'Lunch at L\'As du Fallafel',
          type: 'restaurant',
          startTime: '13:30',
          endTime: '14:30',
          duration: '1h',
          location: 'Le Marais',
          description: 'Famous falafel spot in the Jewish quarter',
          price: 12,
          rating: 4.5,
          reviews: 5623,
          tips: ['Expect a queue', 'Cash only', 'Try the special sauce'],
          bookingRequired: false
        },
        {
          id: '9',
          name: 'Montmartre Exploration',
          type: 'attraction',
          startTime: '15:30',
          endTime: '18:00',
          duration: '2h 30m',
          location: 'Montmartre',
          description: 'Historic hilltop district with Sacré-Cœur',
          price: 8,
          rating: 4.5,
          reviews: 67890,
          tips: ['Take the funicular', 'Watch street artists', 'Visit Place du Tertre'],
          bookingRequired: false,
          transportation: {
            method: 'Metro Line 12',
            duration: '20 min',
            cost: 2
          }
        }
      ]
    },
    {
      date: '2024-03-17',
      dayNumber: 3,
      totalCost: 95,
      walkingDistance: '2.1 km',
      highlights: ['Versailles Palace', 'Gardens', 'Royal History'],
      activities: [
        {
          id: '10',
          name: 'Day Trip to Versailles',
          type: 'attraction',
          startTime: '09:00',
          endTime: '17:00',
          duration: '8h',
          location: 'Palace of Versailles',
          description: 'Opulent royal palace with magnificent gardens',
          price: 27,
          rating: 4.8,
          reviews: 156789,
          tips: ['Book palace + gardens ticket', 'Rent audio guide', 'Wear comfortable shoes'],
          bookingRequired: true,
          transportation: {
            method: 'RER C Train',
            duration: '1h each way',
            cost: 8
          }
        }
      ]
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'attraction':
        return <Camera className="w-4 h-4" />
      case 'restaurant':
        return <Utensils className="w-4 h-4" />
      case 'transport':
        return <Car className="w-4 h-4" />
      case 'hotel':
        return <MapPin className="w-4 h-4" />
      case 'activity':
        return <Star className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getTransportIcon = (method: string) => {
    if (method.toLowerCase().includes('metro') || method.toLowerCase().includes('train')) {
      return <Train className="w-3 h-3" />
    }
    if (method.toLowerCase().includes('walk')) {
      return <Footprints className="w-3 h-3" />
    }
    if (method.toLowerCase().includes('car') || method.toLowerCase().includes('taxi')) {
      return <Car className="w-3 h-3" />
    }
    return <Navigation className="w-3 h-3" />
  }

  const toggleActivityExpansion = (activityId: string) => {
    setExpandedActivities(prev => 
      prev.includes(activityId)
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    )
  }

  const selectedDayData = itinerary.find(day => day.dayNumber === selectedDay)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your {destination} Itinerary</h2>
          <p className="text-gray-600 mt-1">
            {itinerary.length} days • {travelers} traveler{travelers > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button 
            variant={editMode ? "default" : "outline"} 
            size="sm"
            onClick={() => setEditMode(!editMode)}
          >
            <Edit3 className="w-4 h-4 mr-2" />
            {editMode ? 'Done' : 'Edit'}
          </Button>
        </div>
      </div>

      {/* Day Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {itinerary.map((day) => (
          <button
            key={day.dayNumber}
            onClick={() => setSelectedDay(day.dayNumber)}
            className={`flex-shrink-0 px-4 py-3 rounded-lg border transition-colors ${
              selectedDay === day.dayNumber
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className="font-semibold">Day {day.dayNumber}</div>
              <div className="text-xs opacity-75">
                {new Date(day.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedDayData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Itinerary */}
          <div className="lg:col-span-2 space-y-4">
            {/* Day Overview */}
            <Card className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Day {selectedDayData.dayNumber} Overview
                </h3>
                <Badge variant="secondary">
                  {new Date(selectedDayData.date).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">${selectedDayData.totalCost}</div>
                  <div className="text-sm text-gray-600">Total Cost</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{selectedDayData.walkingDistance}</div>
                  <div className="text-sm text-gray-600">Walking</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{selectedDayData.activities.length}</div>
                  <div className="text-sm text-gray-600">Activities</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Day Highlights</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDayData.highlights.map((highlight, index) => (
                    <Badge key={index} variant="outline">
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>

            {/* Activities Timeline */}
            <div className="space-y-3">
              {selectedDayData.activities.map((activity, index) => {
                const isExpanded = expandedActivities.includes(activity.id)
                const nextActivity = selectedDayData.activities[index + 1]
                
                return (
                  <div key={activity.id}>
                    <Card className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-200">
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              activity.type === 'attraction' ? 'bg-blue-100 text-blue-600' :
                              activity.type === 'restaurant' ? 'bg-orange-100 text-orange-600' :
                              activity.type === 'transport' ? 'bg-gray-100 text-gray-600' :
                              activity.type === 'hotel' ? 'bg-purple-100 text-purple-600' :
                              'bg-green-100 text-green-600'
                            }`}>
                              {getActivityIcon(activity.type)}
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-gray-900">{activity.name}</h4>
                                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{activity.startTime} - {activity.endTime}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    <span>{activity.location}</span>
                                  </div>
                                  {activity.price && (
                                    <div className="flex items-center gap-1">
                                      <DollarSign className="w-3 h-3" />
                                      <span>${activity.price}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {activity.rating && (
                                  <div className="flex items-center gap-1 text-sm">
                                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                    <span>{activity.rating}</span>
                                  </div>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleActivityExpansion(activity.id)}
                                >
                                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </Button>
                                {editMode && (
                                  <Button variant="ghost" size="sm">
                                    <Edit3 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                            
                            <p className="text-gray-600 text-sm mb-3">{activity.description}</p>
                            
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-3 pt-3 border-t border-gray-100"
                              >
                                {activity.tips && activity.tips.length > 0 && (
                                  <div>
                                    <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-1">
                                      <Info className="w-4 h-4" />
                                      Tips
                                    </h5>
                                    <ul className="space-y-1">
                                      {activity.tips.map((tip, tipIndex) => (
                                        <li key={tipIndex} className="text-sm text-gray-600 flex items-start gap-2">
                                          <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                                          {tip}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                
                                {activity.bookingRequired && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                      Booking Required
                                    </Badge>
                                    <Button size="sm" variant="outline">
                                      Book Now
                                    </Button>
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                    
                    {/* Transportation to next activity */}
                    {nextActivity && activity.transportation && (
                      <div className="flex items-center justify-center py-2">
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full text-sm text-gray-600">
                          {getTransportIcon(activity.transportation.method)}
                          <span>{activity.transportation.method}</span>
                          <span>•</span>
                          <span>{activity.transportation.duration}</span>
                          {activity.transportation.cost && (
                            <>
                              <span>•</span>
                              <span>${activity.transportation.cost}</span>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick Actions */}
            <Card className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Activity
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Heart className="w-4 h-4 mr-2" />
                  Save to Favorites
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
              </div>
            </Card>

            {/* Weather for the day */}
            <Card className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Weather Forecast</h3>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-gray-900">22°C</div>
                <div className="text-sm text-gray-600">Partly Cloudy</div>
                <div className="text-xs text-gray-500">Perfect for sightseeing!</div>
              </div>
            </Card>

            {/* Budget Tracker */}
            <Card className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Budget Tracker</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Today's Spending</span>
                  <span className="font-medium">${selectedDayData.totalCost}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Trip Total</span>
                  <span className="font-medium">${itinerary.reduce((sum, day) => sum + day.totalCost, 0)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  65% of budget used
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}