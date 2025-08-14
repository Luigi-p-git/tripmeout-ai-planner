'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Clock, Star, ExternalLink, Phone, Info, Heart, Share2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EnhancedPlace } from '@/services/geminiService'

interface PlaceCardProps {
  place: EnhancedPlace
  onSelect?: (place: EnhancedPlace) => void
  isSelected?: boolean
  showDetails?: boolean
}

export function PlaceCard({ place, onSelect, isSelected = false, showDetails = false }: PlaceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(place)
    } else {
      setIsExpanded(!isExpanded)
    }
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFavorited(!isFavorited)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (navigator.share) {
      navigator.share({
        title: place.name,
        text: place.aiDescription || place.description,
        url: place.website || window.location.href
      })
    }
  }

  const handleExternalLink = (e: React.MouseEvent, url: string) => {
    e.stopPropagation()
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const fallbackImage = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group"
    >
      <Card 
        className={`overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl border-2 ${
          isSelected 
            ? 'border-purple-400 shadow-lg shadow-purple-200' 
            : 'border-gray-200 hover:border-purple-300'
        }`}
        onClick={handleCardClick}
      >
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          <motion.img
            src={imageError ? fallbackImage : place.image}
            alt={place.name}
            className={`w-full h-full object-cover transition-all duration-500 ${
              imageLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
            } group-hover:scale-105`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true)
              setImageLoaded(true)
            }}
          />
          
          {/* Loading placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
          )}
          
          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute top-3 right-3 flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleFavorite}
                className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                  isFavorited 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </motion.button>
            </div>
            
            {/* Status indicators */}
            <div className="absolute bottom-3 left-3 flex gap-2">
              {place.isOpen !== undefined && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                  place.isOpen 
                    ? 'bg-green-500/80 text-white' 
                    : 'bg-red-500/80 text-white'
                }`}>
                  {place.isOpen ? 'Open' : 'Closed'}
                </span>
              )}
              
              {place.priceLevel && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/80 text-white backdrop-blur-sm">
                  {'$'.repeat(place.priceLevel)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-purple-600 transition-colors">
                {place.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {place.category}
                </span>
                {place.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700">{place.rating}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {showDetails && place.aiDescription ? place.aiDescription : place.description}
          </p>

          {/* Details */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{place.duration}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              <span className="line-clamp-1">{place.address}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            {place.website && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => handleExternalLink(e, place.website!)}
                className="flex-1 text-xs"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Website
              </Button>
            )}
            
            {place.phone && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => handleExternalLink(e, `tel:${place.phone}`)}
                className="flex-1 text-xs"
              >
                <Phone className="w-3 h-3 mr-1" />
                Call
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(!isExpanded)
              }}
              className="text-xs"
            >
              <Info className="w-3 h-3 mr-1" />
              {isExpanded ? 'Less' : 'More'}
            </Button>
          </div>
        </div>

        {/* Expanded content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="border-t border-gray-200 bg-gray-50"
            >
              <div className="p-4 space-y-3">
                {/* AI Enhanced Description */}
                {place.aiDescription && place.aiDescription !== place.description && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 mb-1">About this place</h4>
                    <p className="text-sm text-gray-600">{place.aiDescription}</p>
                  </div>
                )}
                
                {/* Tips */}
                {place.tips && place.tips.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 mb-2">Travel Tips</h4>
                    <ul className="space-y-1">
                      {place.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Additional info */}
                {(place.website || place.phone) && (
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {place.website && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={(e) => handleExternalLink(e, place.website!)}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Visit Website
                        </Button>
                      )}
                      
                      {place.phone && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => handleExternalLink(e, `tel:${place.phone}`)}
                        >
                          <Phone className="w-3 h-3 mr-1" />
                          {place.phone}
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}