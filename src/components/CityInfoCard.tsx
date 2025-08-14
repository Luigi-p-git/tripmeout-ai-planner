'use client'

import { motion } from 'framer-motion'
import { MapPin, Clock, DollarSign, Globe, Users, Calendar, Lightbulb, Car, Thermometer, Shield, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { CityInfo } from '@/services/geminiService'

interface CityInfoCardProps {
  cityInfo: CityInfo
  className?: string
}

export function CityInfoCard({ cityInfo, className = '' }: CityInfoCardProps) {
  // Debug logging
  console.log('CityInfoCard received cityInfo:', cityInfo)
  console.log('Currency:', cityInfo.currency)
  console.log('Language:', cityInfo.language)
  console.log('Timezone:', cityInfo.timezone)
  console.log('Best time to visit:', cityInfo.bestTimeToVisit)
  const iconMap = {
    currency: DollarSign,
    language: Globe,
    timezone: Clock,
    location: MapPin
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      <Card className="overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 border-2 border-purple-200 shadow-xl">
        {/* Header Section */}
        <div className="relative p-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center gap-3 mb-3"
            >
              <MapPin className="w-8 h-8" />
              <div>
                <h1 className="text-3xl font-bold">{cityInfo.name}</h1>
                <p className="text-purple-100 text-lg">{cityInfo.country}</p>
              </div>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-lg leading-relaxed text-purple-50"
            >
              {cityInfo.description}
            </motion.p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 opacity-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Globe className="w-16 h-16" />
            </motion.div>
          </div>
        </div>

        {/* Quick Info Section */}
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
          >
            <div className="text-center p-3 bg-white rounded-xl shadow-sm border border-gray-100">
              <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Currency</p>
              <p className="font-semibold text-gray-900">{cityInfo.currency}</p>
            </div>
            
            <div className="text-center p-3 bg-white rounded-xl shadow-sm border border-gray-100">
              <Globe className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Language</p>
              <p className="font-semibold text-gray-900">{cityInfo.language}</p>
            </div>
            
            <div className="text-center p-3 bg-white rounded-xl shadow-sm border border-gray-100">
              <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Timezone</p>
              <p className="font-semibold text-gray-900">{cityInfo.timezone}</p>
            </div>
            
            <div className="text-center p-3 bg-white rounded-xl shadow-sm border border-gray-100">
              <Calendar className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Best Time</p>
              <p className="font-semibold text-gray-900">{cityInfo.bestTimeToVisit}</p>
            </div>
          </motion.div>

          {/* Additional Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
          >
            {cityInfo.population && (
              <div className="text-center p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                <Users className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Population</p>
                <p className="font-semibold text-gray-900 text-xs">{cityInfo.population}</p>
              </div>
            )}
            
            {cityInfo.averageTemperature && (
              <div className="text-center p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                <Thermometer className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Avg. Temp</p>
                <p className="font-semibold text-gray-900">{cityInfo.averageTemperature}</p>
              </div>
            )}
            
            {cityInfo.costLevel && (
              <div className="text-center p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                <TrendingUp className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Cost Level</p>
                <p className="font-semibold text-gray-900">{cityInfo.costLevel}</p>
              </div>
            )}
            
            {cityInfo.safetyRating && (
              <div className="text-center p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                <Shield className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Safety</p>
                <p className="font-semibold text-gray-900">{cityInfo.safetyRating}</p>
              </div>
            )}
          </motion.div>



          {/* Additional Information */}
          {(cityInfo.climate || cityInfo.economy || cityInfo.keyFacts) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cityInfo.climate && (
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <h4 className="font-semibold text-blue-900 mb-2">Climate</h4>
                    <p className="text-sm text-blue-800">{cityInfo.climate}</p>
                  </div>
                )}
                
                {cityInfo.economy && (
                  <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                    <h4 className="font-semibold text-green-900 mb-2">Economy</h4>
                    <p className="text-sm text-green-800">{cityInfo.economy}</p>
                  </div>
                )}
              </div>
              
              {cityInfo.keyFacts && cityInfo.keyFacts.length > 0 && (
                <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <h4 className="font-semibold text-purple-900 mb-3">Key Facts</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {cityInfo.keyFacts.map((fact, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-purple-800">{fact}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Cultural Tips and Transportation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cultural Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                Cultural Tips
              </h3>
              <div className="space-y-2">
                {cityInfo.culturalTips.map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
                    className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100"
                  >
                    <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{tip}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Transportation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-600" />
                Transportation
              </h3>
              <div className="space-y-2">
                {cityInfo.transportation.map((transport, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 + index * 0.1, duration: 0.4 }}
                    className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100"
                  >
                    <Car className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{transport}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}