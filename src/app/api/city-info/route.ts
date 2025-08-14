import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/services/geminiService';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// City data mapping with real information
const cityDatabase: Record<string, any> = {
  'tokyo': {
    name: 'Tokyo',
    country: 'Japan',
    population: '37.4 million (metropolitan area)',
    currency: 'Japanese Yen (¥)',
    language: 'Japanese',
    timezone: 'JST (UTC+9)',
    bestTimeToVisit: 'March-May (Spring) and September-November (Autumn)',
    description: 'Tokyo is Japan\'s bustling capital, blending ultramodern skyscrapers with traditional temples. Home to the Imperial Palace, it\'s a global hub for technology, fashion, and cuisine.',
    climate: 'Humid subtropical climate with hot summers and mild winters',
    economy: 'World\'s largest metropolitan economy, major financial center',
    averageTemperature: '16°C (61°F)',
    costLevel: 'High',
    safetyRating: '9.5/10',
    culturalTips: [
      'Bow when greeting people',
      'Remove shoes when entering homes and some restaurants',
      'Don\'t eat or drink while walking',
      'Be quiet on public transportation',
      'Learn basic Japanese phrases like "arigatou gozaimasu" (thank you)'
    ],
    transportation: [
      'JR Yamanote Line (circular train line)',
      'Tokyo Metro subway system',
      'Taxi services (expensive but convenient)',
      'Bicycle rental',
      'Walking (very pedestrian-friendly)'
    ],
    keyFacts: [
      'Most populous metropolitan area in the world',
      'Host city of 2020 Summer Olympics',
      'Home to the world\'s busiest train station (Shinjuku)',
      'Has more Michelin-starred restaurants than any other city'
    ]
  },
  'paris': {
    name: 'Paris',
    country: 'France',
    population: '2.1 million (city), 12.3 million (metropolitan area)',
    currency: 'Euro (€)',
    language: 'French',
    timezone: 'CET (UTC+1)',
    bestTimeToVisit: 'April-June and September-October',
    description: 'Paris, the City of Light, is renowned for its art, fashion, gastronomy, and culture. Home to iconic landmarks like the Eiffel Tower and Louvre Museum.',
    climate: 'Oceanic climate with mild temperatures year-round',
    economy: 'Major European financial center, fashion and luxury goods hub',
    averageTemperature: '11°C (52°F)',
    costLevel: 'High',
    safetyRating: '8.5/10',
    culturalTips: [
      'Greet with "Bonjour" when entering shops',
      'Dress elegantly, Parisians value style',
      'Don\'t rush meals, dining is a social experience',
      'Learn basic French phrases',
      'Tipping is not mandatory but appreciated'
    ],
    transportation: [
      'Paris Métro (subway system)',
      'RER trains for longer distances',
      'Vélib\' bike sharing system',
      'Taxi and ride-sharing services',
      'Walking (compact city center)'
    ],
    keyFacts: [
      'Most visited city in the world',
      'Home to 130+ museums and monuments',
      'UNESCO World Heritage site (Seine riverbanks)',
      'Fashion capital of the world'
    ]
  },
  'new york': {
    name: 'New York City',
    country: 'United States',
    population: '8.3 million (city), 20.1 million (metropolitan area)',
    currency: 'US Dollar ($)',
    language: 'English (with 200+ languages spoken)',
    timezone: 'EST/EDT (UTC-5/-4)',
    bestTimeToVisit: 'April-June and September-November',
    description: 'The Big Apple is a global hub for finance, arts, fashion, and culture. Known for its iconic skyline, Broadway shows, and diverse neighborhoods.',
    climate: 'Humid subtropical climate with four distinct seasons',
    economy: 'World\'s leading financial center, major media and tech hub',
    averageTemperature: '13°C (55°F)',
    costLevel: 'Very High',
    safetyRating: '7.5/10',
    culturalTips: [
      'Walk quickly and with purpose',
      'Tipping is expected (18-20% at restaurants)',
      'Stand right on escalators',
      'Don\'t block subway doors',
      'Be direct in communication'
    ],
    transportation: [
      'NYC Subway (24/7 service)',
      'Yellow taxi cabs',
      'Uber and Lyft ride-sharing',
      'Citi Bike sharing system',
      'Walking (very walkable city)'
    ],
    keyFacts: [
      'Most populous city in the United States',
      'Home to the United Nations headquarters',
      'Has the world\'s largest subway system by stations',
      'Economic center generating 10% of US GDP'
    ]
  },
  'london': {
    name: 'London',
    country: 'United Kingdom',
    population: '9 million (Greater London)',
    currency: 'British Pound (£)',
    language: 'English',
    timezone: 'GMT/BST (UTC+0/+1)',
    bestTimeToVisit: 'May-September',
    description: 'London is a global city rich in history, culture, and diversity. From royal palaces to modern skyscrapers, it seamlessly blends tradition with innovation.',
    climate: 'Temperate oceanic climate with mild temperatures and frequent rain',
    economy: 'Major global financial center, leading in fintech and creative industries',
    averageTemperature: '11°C (52°F)',
    costLevel: 'Very High',
    safetyRating: '8/10',
    culturalTips: [
      'Queue politely and wait your turn',
      'Stand right on escalators',
      'Say "please" and "thank you" frequently',
      'Respect personal space',
      'Pub etiquette: order at the bar, no table service'
    ],
    transportation: [
      'London Underground (Tube)',
      'Red double-decker buses',
      'Black taxi cabs',
      'Santander Cycles (bike sharing)',
      'Walking and river services'
    ],
    keyFacts: [
      'One of the world\'s leading financial centers',
      'Home to 4 UNESCO World Heritage Sites',
      'Has the oldest underground railway system',
      'Most visited city in Europe'
    ]
  },
  'barcelona': {
    name: 'Barcelona',
    country: 'Spain',
    population: '1.6 million (city), 5.6 million (metropolitan area)',
    currency: 'Euro (€)',
    language: 'Spanish, Catalan',
    timezone: 'CET (UTC+1)',
    bestTimeToVisit: 'May-June, September-October',
    description: 'A Mediterranean jewel known for Gaudí\'s architecture, vibrant street life, beautiful beaches, and exceptional cuisine.',
    climate: 'Mediterranean climate with mild winters and warm summers',
    economy: 'Major Mediterranean port, tourism and technology hub',
    averageTemperature: '16°C (61°F)',
    costLevel: 'Medium-High',
    safetyRating: '8/10',
    culturalTips: [
      'Lunch is typically 2-4pm, dinner after 9pm',
      'Learn basic Catalan phrases - locals appreciate it',
      'Siesta time: many shops close 2-5pm',
      'Beach etiquette: topless sunbathing is normal'
    ],
    transportation: [
      'Metro and FGC trains',
      'Bicing bike sharing',
      'Taxis and ride-sharing',
      'Walking and beach promenades'
    ],
    keyFacts: [
      'Host city of 1992 Summer Olympics',
      'Home to 9 UNESCO World Heritage Sites',
      'Major cruise ship destination',
      'Leading smart city in Europe'
    ]
  }
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cityName = searchParams.get('city');

  if (!cityName) {
    return NextResponse.json({ error: 'City name is required' }, { status: 400 });
  }

  // Normalize city name for lookup
  const normalizedCity = cityName.toLowerCase().trim();
  
  // First, try to get real-time data from Gemini AI
  if (geminiService.isAvailable()) {
    try {
      const geminiCityInfo = await geminiService.getCityInfo(cityName);
      if (geminiCityInfo) {
        // Enhance with additional fields if available from our database
        const databaseInfo = cityDatabase[normalizedCity];
        const enhancedInfo = {
          ...geminiCityInfo,
          // Add database-specific fields if available
          ...(databaseInfo && {
            population: databaseInfo.population,
            climate: databaseInfo.climate,
            economy: databaseInfo.economy,
            averageTemperature: databaseInfo.averageTemperature,
            costLevel: databaseInfo.costLevel,
            safetyRating: databaseInfo.safetyRating,
            keyFacts: databaseInfo.keyFacts
          })
        };
        return NextResponse.json({ cityInfo: enhancedInfo });
      }
    } catch (error) {
      console.error('Error fetching from Gemini:', error);
      // Continue to fallback options
    }
  }
  
  // Fallback to our curated database
  const cityData = cityDatabase[normalizedCity];
  if (cityData) {
    return NextResponse.json({ cityInfo: cityData });
  }

  // Check if user searched for a country instead of a city
  const countryMappings: Record<string, string> = {
    'japan': 'Tokyo',
    'france': 'Paris',
    'usa': 'New York',
    'united states': 'New York',
    'uk': 'London',
    'united kingdom': 'London',
    'spain': 'Barcelona',
    'italy': 'Rome',
    'germany': 'Berlin',
    'china': 'Beijing',
    'india': 'Mumbai',
    'brazil': 'São Paulo',
    'australia': 'Sydney',
    'canada': 'Toronto',
    'mexico': 'Mexico City'
  };

  const suggestedCity = countryMappings[normalizedCity];
  if (suggestedCity) {
    // If user searched for a country, try to get info for the major city
    if (geminiService.isAvailable()) {
      try {
        const geminiCityInfo = await geminiService.getCityInfo(suggestedCity);
        if (geminiCityInfo) {
          const databaseInfo = cityDatabase[suggestedCity.toLowerCase()];
          const enhancedInfo = {
            ...geminiCityInfo,
            name: `${suggestedCity} (${cityName})`,
            description: `${geminiCityInfo.description} Note: You searched for ${cityName}. Here's information about ${suggestedCity}, a major city in ${cityName}.`,
            ...(databaseInfo && {
              population: databaseInfo.population,
              climate: databaseInfo.climate,
              economy: databaseInfo.economy,
              averageTemperature: databaseInfo.averageTemperature,
              costLevel: databaseInfo.costLevel,
              safetyRating: databaseInfo.safetyRating,
              keyFacts: databaseInfo.keyFacts
            })
          };
          return NextResponse.json({ cityInfo: enhancedInfo });
        }
      } catch (error) {
        console.error('Error fetching suggested city from Gemini:', error);
      }
    }
    
    // Fallback to database for suggested city
    const suggestedCityData = cityDatabase[suggestedCity.toLowerCase()];
    if (suggestedCityData) {
      const modifiedData = {
        ...suggestedCityData,
        name: `${suggestedCityData.name} (${cityName})`,
        description: `${suggestedCityData.description} Note: You searched for ${cityName}. Here's information about ${suggestedCityData.name}, a major city in ${cityName}.`
      };
      return NextResponse.json({ cityInfo: modifiedData });
    }
  }

  // Enhanced fallback for cities not in our database
  const fallbackInfo = {
    name: cityName,
    country: 'Unknown',
    population: 'Data not available',
    currency: 'Local currency',
    language: 'Local language',
    timezone: 'Local timezone',
    bestTimeToVisit: 'Year-round (varies by climate)',
    description: `${cityName} is a unique destination with its own character and attractions. Each city offers distinct experiences, culture, and history worth exploring.`,
    climate: 'Climate varies by location',
    economy: 'Local economy information not available',
    averageTemperature: 'Varies by season',
    costLevel: 'Medium',
    safetyRating: 'Check current travel advisories',
    culturalTips: [
      'Research local customs before visiting',
      'Learn basic phrases in the local language',
      'Respect cultural and religious sites',
      'Be mindful of local etiquette and dress codes',
      'Ask locals for recommendations'
    ],
    transportation: [
      'Public transportation (varies by city)',
      'Taxi and ride-sharing services',
      'Walking and cycling',
      'Car rental (if needed)',
      'Local transportation apps'
    ],
    keyFacts: [
      'Every city has unique attractions and culture',
      'Local experiences vary greatly',
      'Research specific information before traveling'
    ]
  };

  return NextResponse.json({ cityInfo: fallbackInfo });
}