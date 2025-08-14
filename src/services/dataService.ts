import { cacheService } from './cacheService';

export interface CityInfo {
  name: string;
  country: string;
  population: string;
  currency: string;
  language: string;
  timezone: string;
  bestTimeToVisit: string;
  description: string;
  climate: string;
  economy: string;
  averageTemperature: string;
  costLevel: string;
  safetyRating: string;
  culturalTips: string[];
  transportation: string[];
  keyFacts: string[];
}

export interface Place {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  duration: string;
  rating?: number;
  address?: string;
  priceLevel?: number;
  isOpen?: boolean;
  website?: string;
  phone?: string;
}

class DataService {
  private readonly BASE_URL = '/api';

  // Fetch city information with caching
  async getCityInfo(cityName: string): Promise<CityInfo | null> {
    const cacheKey = cacheService.getCityInfoKey(cityName);
    
    // Check cache first
    const cached = cacheService.get(cacheKey);
    if (cached) {
      console.log(`🎯 Cache hit for city info: ${cityName}`);
      return cached;
    }

    try {
      console.log(`🌐 Fetching real-time city info for: ${cityName}`);
      const response = await fetch(`${this.BASE_URL}/city-info?city=${encodeURIComponent(cityName)}`);
      
      const data = await response.json();
      
      // Handle successful response
      if (response.ok && data.cityInfo) {
        // Cache the result for 30 minutes
        cacheService.set(cacheKey, data.cityInfo, 30 * 60 * 1000);
        console.log(`✅ Real-time city info cached for: ${cityName}`);
        return data.cityInfo;
      }
      
      // Handle API errors (503, etc.)
      if (data.error) {
        console.warn(`⚠️ City info unavailable for ${cityName}: ${data.message || data.error}`);
        // Don't cache errors, allow retry
        return null;
      }
      
      throw new Error(`Unexpected response format for ${cityName}`);
      
    } catch (error) {
      console.error(`❌ Error fetching city info for ${cityName}:`, error);
      return null;
    }
  }

  // Fetch places with caching
  async getPlaces(cityName: string, limit: number = 12): Promise<Place[]> {
    const cacheKey = cacheService.getPlacesKey(cityName, limit);
    
    // Check cache first
    const cached = cacheService.get(cacheKey);
    if (cached) {
      console.log(`🎯 Cache hit for places: ${cityName}`);
      return cached;
    }

    try {
      console.log(`🌐 Fetching places for: ${cityName}`);
      const response = await fetch(`${this.BASE_URL}/places?city=${encodeURIComponent(cityName)}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Cache the result for 1 hour (places change less frequently)
      cacheService.set(cacheKey, data.places, 60 * 60 * 1000);
      console.log(`✅ Places cached for: ${cityName}`);
      
      return data.places || [];
    } catch (error) {
      console.error('Error fetching places:', error);
      return [];
    }
  }

  // Search for cities (for autocomplete)
  async searchCities(query: string): Promise<string[]> {
    if (!query || query.length < 2) {
      return [];
    }

    const cacheKey = `city_search_${query.toLowerCase().trim()}`;
    
    // Check cache first (shorter TTL for search results)
    const cached = cacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // For now, return some popular cities that match the query
      // In a real implementation, you'd call a geocoding API
      const popularCities = [
        'Tokyo', 'Paris', 'New York', 'London', 'Barcelona', 'Rome', 'Amsterdam', 
        'Berlin', 'Prague', 'Vienna', 'Budapest', 'Istanbul', 'Dubai', 'Singapore',
        'Bangkok', 'Hong Kong', 'Sydney', 'Melbourne', 'Los Angeles', 'San Francisco',
        'Chicago', 'Miami', 'Las Vegas', 'Toronto', 'Vancouver', 'Montreal',
        'Mexico City', 'Buenos Aires', 'Rio de Janeiro', 'São Paulo', 'Lima',
        'Cairo', 'Cape Town', 'Marrakech', 'Mumbai', 'Delhi', 'Bangalore',
        'Seoul', 'Osaka', 'Kyoto', 'Shanghai', 'Beijing', 'Taipei', 'Kuala Lumpur',
        'Jakarta', 'Manila', 'Ho Chi Minh City', 'Hanoi', 'Phnom Penh',
        'Lisbon', 'Madrid', 'Seville', 'Florence', 'Venice', 'Milan', 'Naples',
        'Athens', 'Santorini', 'Mykonos', 'Stockholm', 'Copenhagen', 'Oslo',
        'Helsinki', 'Reykjavik', 'Dublin', 'Edinburgh', 'Manchester', 'Liverpool',
        'Brussels', 'Antwerp', 'Zurich', 'Geneva', 'Munich', 'Hamburg', 'Cologne'
      ];

      const matches = popularCities.filter(city => 
        city.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8);

      // Cache for 10 minutes
      cacheService.set(cacheKey, matches, 10 * 60 * 1000);
      
      return matches;
    } catch (error) {
      console.error('Error searching cities:', error);
      return [];
    }
  }

  // Clear cache for a specific city
  clearCityCache(cityName: string): void {
    const cityInfoKey = cacheService.getCityInfoKey(cityName);
    const placesKey = cacheService.getPlacesKey(cityName);
    
    cacheService.delete(cityInfoKey);
    cacheService.delete(placesKey);
    
    console.log(`🗑️ Cache cleared for: ${cityName}`);
  }

  // Get cache statistics
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: cacheService.size(),
      keys: Array.from((cacheService as any).cache.keys())
    };
  }
}

// Export singleton instance
export const dataService = new DataService();