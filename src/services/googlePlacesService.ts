import axios from 'axios';

export interface PlacePhoto {
  photo_reference: string;
  height: number;
  width: number;
}

export interface PlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  photos?: PlacePhoto[];
  rating?: number;
  user_ratings_total?: number;
  types: string[];
  price_level?: number;
  opening_hours?: {
    open_now: boolean;
  };
}

export interface PlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  website?: string;
  rating?: number;
  user_ratings_total?: number;
  reviews?: Array<{
    author_name: string;
    rating: number;
    text: string;
    time: number;
  }>;
  photos?: PlacePhoto[];
  opening_hours?: {
    open_now: boolean;
    weekday_text: string[];
  };
  types: string[];
  price_level?: number;
}

export interface ProcessedPlace {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  duration: string;
  rating?: number;
  address: string;
  priceLevel?: number;
  isOpen?: boolean;
  website?: string;
  phone?: string;
}

class GooglePlacesService {
  private apiKey: string;
  private baseUrl = 'https://maps.googleapis.com/maps/api/place';

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Google Places API key not found. Please set NEXT_PUBLIC_GOOGLE_PLACES_API_KEY in your environment variables.');
    }
  }

  // Get city coordinates using geocoding
  async getCityCoordinates(cityName: string): Promise<{ lat: number; lng: number } | null> {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cityName)}&key=${this.apiKey}`
      );

      if (response.data.results && response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      }
      return null;
    } catch (error) {
      console.error('Error getting city coordinates:', error);
      return null;
    }
  }

  // Search for places near a city
  async searchPlacesNearCity(cityName: string, radius: number = 10000): Promise<PlaceResult[]> {
    try {
      const coordinates = await this.getCityCoordinates(cityName);
      if (!coordinates) {
        throw new Error(`Could not find coordinates for ${cityName}`);
      }

      const response = await axios.get(
        `${this.baseUrl}/nearbysearch/json?location=${coordinates.lat},${coordinates.lng}&radius=${radius}&type=tourist_attraction&key=${this.apiKey}`
      );

      return response.data.results || [];
    } catch (error) {
      console.error('Error searching places:', error);
      return [];
    }
  }

  // Get detailed information about a specific place
  async getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/details/json?place_id=${placeId}&fields=place_id,name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,reviews,photos,opening_hours,types,price_level&key=${this.apiKey}`
      );

      return response.data.result || null;
    } catch (error) {
      console.error('Error getting place details:', error);
      return null;
    }
  }

  // Get photo URL from photo reference
  getPhotoUrl(photoReference: string, maxWidth: number = 400): string {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${this.apiKey}`;
  }

  // Process raw place data into our app format
  processPlaceData(place: PlaceResult, details?: PlaceDetails): ProcessedPlace {
    const categoryMap: { [key: string]: string } = {
      'tourist_attraction': 'Attraction',
      'museum': 'Museum',
      'park': 'Park',
      'restaurant': 'Restaurant',
      'shopping_mall': 'Shopping',
      'church': 'Religious Site',
      'art_gallery': 'Gallery',
      'zoo': 'Zoo',
      'amusement_park': 'Entertainment',
      'aquarium': 'Aquarium',
      'casino': 'Entertainment',
      'night_club': 'Nightlife',
      'bar': 'Nightlife',
      'spa': 'Wellness'
    };

    // Determine category based on place types
    let category = 'Attraction';
    for (const type of place.types) {
      if (categoryMap[type]) {
        category = categoryMap[type];
        break;
      }
    }

    // Get image URL
    let imageUrl = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop';
    if (place.photos && place.photos.length > 0) {
      imageUrl = this.getPhotoUrl(place.photos[0].photo_reference, 400);
    }

    // Estimate duration based on category
    const durationMap: { [key: string]: string } = {
      'Museum': '2-3 hours',
      'Park': '1-2 hours',
      'Restaurant': '1-2 hours',
      'Shopping': '2-4 hours',
      'Religious Site': '30-60 minutes',
      'Gallery': '1-2 hours',
      'Zoo': '3-4 hours',
      'Entertainment': '2-3 hours',
      'Aquarium': '2-3 hours',
      'Nightlife': '2-4 hours',
      'Wellness': '1-2 hours',
      'Attraction': '1-2 hours'
    };

    return {
      id: place.place_id,
      name: place.name,
      description: this.generateDescription(place, details),
      image: imageUrl,
      category,
      duration: durationMap[category] || '1-2 hours',
      rating: place.rating,
      address: place.formatted_address,
      priceLevel: place.price_level,
      isOpen: place.opening_hours?.open_now,
      website: details?.website,
      phone: details?.formatted_phone_number
    };
  }

  // Generate description based on place data
  private generateDescription(place: PlaceResult, details?: PlaceDetails): string {
    if (details?.reviews && details.reviews.length > 0) {
      // Use the first review as description (truncated)
      const review = details.reviews[0].text;
      return review.length > 100 ? review.substring(0, 100) + '...' : review;
    }

    // Fallback descriptions based on types
    const typeDescriptions: { [key: string]: string } = {
      'tourist_attraction': 'Popular tourist destination with unique attractions',
      'museum': 'Cultural institution showcasing art, history, and knowledge',
      'park': 'Green space perfect for relaxation and outdoor activities',
      'restaurant': 'Dining establishment offering local and international cuisine',
      'shopping_mall': 'Shopping destination with various stores and amenities',
      'church': 'Historic religious site with architectural significance',
      'art_gallery': 'Space dedicated to displaying artistic works',
      'zoo': 'Wildlife park featuring animals from around the world',
      'amusement_park': 'Entertainment venue with rides and attractions',
      'aquarium': 'Marine life center showcasing underwater ecosystems'
    };

    for (const type of place.types) {
      if (typeDescriptions[type]) {
        return typeDescriptions[type];
      }
    }

    return 'Interesting place worth visiting during your trip';
  }

  // Get popular places for a city
  async getPopularPlaces(cityName: string, limit: number = 12): Promise<ProcessedPlace[]> {
    try {
      const places = await this.searchPlacesNearCity(cityName);
      const processedPlaces: ProcessedPlace[] = [];

      // Process up to the limit, getting details for each
      for (let i = 0; i < Math.min(places.length, limit); i++) {
        const place = places[i];
        const details = await this.getPlaceDetails(place.place_id);
        const processedPlace = this.processPlaceData(place, details || undefined);
        processedPlaces.push(processedPlace);
      }

      // Sort by rating (highest first)
      return processedPlaces.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } catch (error) {
      console.error('Error getting popular places:', error);
      return [];
    }
  }
}

export const googlePlacesService = new GooglePlacesService();