// Cache service for storing API responses
class CacheService {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private readonly DEFAULT_TTL = 30 * 60 * 1000; // 30 minutes in milliseconds

  // Set data in cache with optional TTL
  set(key: string, data: any, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  // Get data from cache if not expired
  get(key: string): any | null {
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }

    const now = Date.now();
    const isExpired = (now - cached.timestamp) > cached.ttl;

    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  // Check if key exists and is not expired
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  // Clear specific key
  delete(key: string): void {
    this.cache.delete(key);
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
  }

  // Get cache size
  size(): number {
    return this.cache.size;
  }

  // Clean expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if ((now - value.timestamp) > value.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // Generate cache key for city info
  getCityInfoKey(cityName: string): string {
    return `city_info_${cityName.toLowerCase().trim()}`;
  }

  // Generate cache key for places
  getPlacesKey(cityName: string, limit: number = 12): string {
    return `places_${cityName.toLowerCase().trim()}_${limit}`;
  }
}

// Export singleton instance
export const cacheService = new CacheService();

// Auto cleanup every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    cacheService.cleanup();
  }, 5 * 60 * 1000);
}