'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Clock, Star, ExternalLink, Phone, Heart, Share2, MoreHorizontal } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EnhancedPlace } from '@/services/geminiService'

interface HorizontalPlaceCardProps {
  place: EnhancedPlace
  onSelect?: (place: EnhancedPlace) => void
  isSelected?: boolean
}

export function HorizontalPlaceCard({ place, onSelect, isSelected = false }: HorizontalPlaceCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(place)
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
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card 
        className={`overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg border ${isSelected ? 'border-purple-400 shadow-md' : 'border-gray-200 hover:border-purple-300'}`}
        onClick={handleCardClick}
      >
        <div className="flex h-32">
          {/* Image Section */}
          <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden">
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
            
            {/* Status indicators */}
            <div className="absolute bottom-2 left-2 flex gap-1">
              {place.isOpen !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm ${
                  place.isOpen 
                    ? 'bg-green-500/80 text-white' 
                    : 'bg-red-500/80 text-white'
                }`}>
                  {place.isOpen ? 'Open' : 'Closed'}
                </span>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-base text-gray-900 line-clamp-1 group-hover:text-purple-600 transition-colors">
                    {place.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {place.category}
                    </span>
                    {place.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-medium text-gray-700">{place.rating}</span>
                      </div>
                    )}
                    {place.priceLevel && (
                      <span className="text-xs text-gray-500">
                        {'$'.repeat(place.priceLevel)}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleFavorite}
                    className={`p-1.5 rounded-full transition-colors ${
                      isFavorited 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`w-3 h-3 ${isFavorited ? 'fill-current' : ''}`} />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleShare}
                    className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    <Share2 className="w-3 h-3" />
                  </motion.button>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {place.aiDescription || place.description}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{place.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate max-w-24">{place.address}</span>
                </div>
              </div>
              
              {/* Quick action buttons */}
              <div className="flex gap-1">
                {place.website && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleExternalLink(e, place.website!)}
                    className="h-6 px-2 text-xs"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    More
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}