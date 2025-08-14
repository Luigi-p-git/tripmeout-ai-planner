import { googlePlacesService, ProcessedPlace } from './googlePlacesService';
import { geminiService, CityInfo, EnhancedPlace } from './geminiService';

export interface SearchResult {
  cityInfo: CityInfo | null;
  places: EnhancedPlace[];
  isLoading: boolean;
  error: string | null;
}

export interface SearchPreferences {
  interests?: string[];
  budget?: 'low' | 'medium' | 'high';
  duration?: string;
  travelStyle?: 'adventure' | 'cultural' | 'relaxed' | 'luxury' | 'budget';
}

class SearchService {
  private cache: Map<string, SearchResult> = new Map();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  // Main search function that combines Google Places and Gemini
  async searchCity(
    cityName: string, 
    preferences?: SearchPreferences,
    useCache: boolean = true
  ): Promise<SearchResult> {
    const cacheKey = `${cityName.toLowerCase()}-${JSON.stringify(preferences || {})}`;
    
    // Check cache first
    if (useCache && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      // Check if cache is still valid (30 minutes)
      if (Date.now() - (cached as any).timestamp < this.CACHE_DURATION) {
        return cached;
      }
    }

    const result: SearchResult = {
      cityInfo: null,
      places: [],
      isLoading: true,
      error: null
    };

    try {
      // Start both API calls in parallel for better performance
      const [cityInfoPromise, placesPromise] = await Promise.allSettled([
        geminiService.getCityInfo(cityName),
        googlePlacesService.getPopularPlaces(cityName, 12)
      ]);

      // Handle city info result
      if (cityInfoPromise.status === 'fulfilled') {
        result.cityInfo = cityInfoPromise.value;
      } else {
        console.warn('Failed to get city info:', cityInfoPromise.reason);
      }

      // Handle places result
      if (placesPromise.status === 'fulfilled') {
        let places = placesPromise.value;

        // Apply personalized recommendations if preferences are provided
        if (preferences && geminiService.isAvailable()) {
          try {
            places = await geminiService.getPersonalizedRecommendations(
              cityName, 
              places, 
              preferences
            );
          } catch (error) {
            console.warn('Failed to get personalized recommendations:', error);
          }
        }

        // Enhance places with AI descriptions if Gemini is available
        if (geminiService.isAvailable()) {
          try {
            result.places = await geminiService.enhancePlaces(places);
          } catch (error) {
            console.warn('Failed to enhance places with AI:', error);
            result.places = places;
          }
        } else {
          result.places = places;
        }
      } else {
        console.error('Failed to get places:', placesPromise.reason);
        result.error = 'Failed to fetch places for this city';
      }

      result.isLoading = false;

      // Cache the result
      if (useCache) {
        (result as any).timestamp = Date.now();
        this.cache.set(cacheKey, result);
      }

      return result;
    } catch (error) {
      console.error('Search error:', error);
      return {
        cityInfo: null,
        places: [],
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      };
    }
  }

  // Quick search for city suggestions (autocomplete)
  async getCitySuggestions(query: string): Promise<string[]> {
    if (query.length < 2) return [];

    try {
      // Use Google Places autocomplete for city suggestions
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&types=(cities)&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.predictions) {
        return data.predictions
          .slice(0, 5) // Limit to 5 suggestions
          .map((prediction: any) => prediction.description);
      }
      
      return [];
    } catch (error) {
      console.error('Error getting city suggestions:', error);
      return [];
    }
  }

  // Generate itinerary for a city
  async generateItinerary(
    cityName: string, 
    places: ProcessedPlace[], 
    days: number = 3
  ): Promise<{ day: number; places: ProcessedPlace[]; theme: string }[]> {
    if (!geminiService.isAvailable()) {
      // Fallback: simple day-by-day distribution
      const placesPerDay = Math.ceil(places.length / days);
      const itinerary = [];
      
      for (let day = 1; day <= days; day++) {
        const startIndex = (day - 1) * placesPerDay;
        const endIndex = Math.min(startIndex + placesPerDay, places.length);
        const dayPlaces = places.slice(startIndex, endIndex);
        
        itinerary.push({
          day,
          places: dayPlaces,
          theme: `Day ${day} Exploration`
        });
      }
      
      return itinerary;
    }

    try {
      return await geminiService.generateItinerary(cityName, places, days);
    } catch (error) {
      console.error('Error generating itinerary:', error);
      // Fallback to simple distribution
      return this.generateItinerary(cityName, places, days);
    }
  }

  // Get detailed place information
  async getPlaceDetails(placeId: string): Promise<ProcessedPlace | null> {
    try {
      const details = await googlePlacesService.getPlaceDetails(placeId);
      if (!details) return null;

      // Convert to ProcessedPlace format
      const place: ProcessedPlace = {
        id: details.place_id,
        name: details.name,
        description: 'Detailed information about this place',
        image: details.photos && details.photos.length > 0 
          ? googlePlacesService.getPhotoUrl(details.photos[0].photo_reference, 400)
          : 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
        category: 'Attraction',
        duration: '1-2 hours',
        rating: details.rating,
        address: details.formatted_address,
        website: details.website,
        phone: details.formatted_phone_number,
        isOpen: details.opening_hours?.open_now
      };

      // Enhance with AI if available
      if (geminiService.isAvailable()) {
        try {
          const [aiDescription, tips] = await Promise.all([
            geminiService.enhancePlaceDescription(place),
            geminiService.getPlaceTips(place)
          ]);
          
          return {
            ...place,
            aiDescription,
            tips
          } as EnhancedPlace;
        } catch (error) {
          console.warn('Failed to enhance place details:', error);
        }
      }

      return place;
    } catch (error) {
      console.error('Error getting place details:', error);
      return null;
    }
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache size
  getCacheSize(): number {
    return this.cache.size;
  }

  // Check if services are available
  getServiceStatus(): {
    googlePlaces: boolean;
    gemini: boolean;
  } {
    return {
      googlePlaces: !!process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY,
      gemini: geminiService.isAvailable()
    };
  }
}

export const searchService = new SearchService();