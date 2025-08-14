import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const GOOGLE_PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cityName = searchParams.get('city');
  const limit = parseInt(searchParams.get('limit') || '12');

  if (!cityName) {
    return NextResponse.json({ error: 'City name is required' }, { status: 400 });
  }

  if (!GOOGLE_PLACES_API_KEY) {
    return NextResponse.json({ error: 'Google Places API key not configured' }, { status: 500 });
  }

  try {
    // First, get city coordinates
    const geocodeResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cityName)}&key=${GOOGLE_PLACES_API_KEY}`
    );

    if (!geocodeResponse.data.results || geocodeResponse.data.results.length === 0) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }

    const location = geocodeResponse.data.results[0].geometry.location;

    // Search for tourist attractions near the city
    const placesResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=10000&type=tourist_attraction&key=${GOOGLE_PLACES_API_KEY}`
    );

    const places = placesResponse.data.results || [];
    const processedPlaces = [];

    // Process up to the limit, getting details for each
    for (let i = 0; i < Math.min(places.length, limit); i++) {
      const place = places[i];
      
      try {
        // Get detailed information for each place
        const detailsResponse = await axios.get(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=place_id,name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,reviews,photos,opening_hours,types,price_level&key=${GOOGLE_PLACES_API_KEY}`
        );

        const details = detailsResponse.data.result;
        
        // Process the place data
        const processedPlace = {
          id: place.place_id,
          name: place.name,
          description: generateDescription(place, details),
          image: place.photos && place.photos.length > 0 
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
            : 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
          category: categorizePlace(place.types),
          duration: estimateDuration(place.types),
          rating: place.rating,
          address: place.formatted_address || details?.formatted_address || '',
          priceLevel: place.price_level,
          isOpen: place.opening_hours?.open_now,
          website: details?.website,
          phone: details?.formatted_phone_number
        };

        processedPlaces.push(processedPlace);
      } catch (detailError) {
        console.error('Error getting place details:', detailError);
        // Add basic place info even if details fail
        processedPlaces.push({
          id: place.place_id,
          name: place.name,
          description: place.name,
          image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
          category: categorizePlace(place.types),
          duration: estimateDuration(place.types),
          rating: place.rating,
          address: place.formatted_address || '',
          priceLevel: place.price_level,
          isOpen: place.opening_hours?.open_now
        });
      }
    }

    // Sort by rating (highest first)
    const sortedPlaces = processedPlaces.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    return NextResponse.json({ places: sortedPlaces });
  } catch (error) {
    console.error('Error fetching places:', error);
    return NextResponse.json({ error: 'Failed to fetch places' }, { status: 500 });
  }
}

function generateDescription(place: any, details?: any): string {
  if (details?.reviews && details.reviews.length > 0) {
    return details.reviews[0].text.substring(0, 150) + '...';
  }
  
  const types = place.types || [];
  if (types.includes('museum')) {
    return `A fascinating museum in ${place.vicinity || 'the area'} with rich cultural exhibits.`;
  } else if (types.includes('park')) {
    return `A beautiful park perfect for relaxation and outdoor activities.`;
  } else if (types.includes('restaurant')) {
    return `A popular dining destination known for its excellent cuisine.`;
  } else if (types.includes('tourist_attraction')) {
    return `A must-visit attraction that showcases the best of local culture and history.`;
  }
  
  return `An interesting place to visit in ${place.vicinity || 'the area'}.`;
}

function categorizePlace(types: string[]): string {
  if (types.includes('museum')) return 'Museum';
  if (types.includes('park')) return 'Park';
  if (types.includes('restaurant') || types.includes('food')) return 'Restaurant';
  if (types.includes('shopping_mall') || types.includes('store')) return 'Shopping';
  if (types.includes('church') || types.includes('place_of_worship')) return 'Religious Site';
  if (types.includes('amusement_park')) return 'Entertainment';
  if (types.includes('zoo')) return 'Zoo';
  if (types.includes('aquarium')) return 'Aquarium';
  if (types.includes('art_gallery')) return 'Gallery';
  if (types.includes('night_club') || types.includes('bar')) return 'Nightlife';
  return 'Attraction';
}

function estimateDuration(types: string[]): string {
  if (types.includes('museum') || types.includes('art_gallery')) return '2-3 hours';
  if (types.includes('park')) return '1-2 hours';
  if (types.includes('restaurant')) return '1-2 hours';
  if (types.includes('shopping_mall')) return '2-4 hours';
  if (types.includes('amusement_park')) return '4-6 hours';
  if (types.includes('zoo') || types.includes('aquarium')) return '3-4 hours';
  return '1-2 hours';
}