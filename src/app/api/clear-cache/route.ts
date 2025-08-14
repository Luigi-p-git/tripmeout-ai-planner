import { NextRequest, NextResponse } from 'next/server';
import { searchService } from '@/services/searchService';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cityName = searchParams.get('city');
    
    if (cityName) {
      // Clear cache for specific city
      searchService.clearCacheForCity(cityName);
      return NextResponse.json({ message: `Cache cleared for ${cityName}` });
    } else {
      // Clear all cache
      searchService.clearCache();
      return NextResponse.json({ message: 'All cache cleared' });
    }
  } catch (error) {
    console.error('Error clearing cache:', error);
    return NextResponse.json({ error: 'Failed to clear cache' }, { status: 500 });
  }
}