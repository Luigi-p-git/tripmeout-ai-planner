import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/services/geminiService';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// Fallback city data for when Gemini is unavailable
const fallbackCityData: Record<string, any> = {
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
  },
  'rome': {
    name: 'Rome',
    country: 'Italy',
    population: '2.8 million (city), 4.3 million (metropolitan area)',
    currency: 'Euro (€)',
    language: 'Italian',
    timezone: 'CET (UTC+1)',
    bestTimeToVisit: 'April-June, September-October',
    description: 'The Eternal City, Rome is a living museum with over 2,500 years of history. Home to the Vatican, Colosseum, and countless ancient ruins.',
    climate: 'Mediterranean climate with hot summers and mild winters',
    economy: 'Major tourist destination, government center, and cultural hub',
    averageTemperature: '15°C (59°F)',
    costLevel: 'Medium-High',
    safetyRating: '8/10',
    culturalTips: [
      'Dress modestly when visiting churches',
      'Lunch is typically 1-3pm, dinner after 8pm',
      'Learn basic Italian phrases - locals appreciate it',
      'Tipping is not mandatory but appreciated',
      'Be respectful at historical sites'
    ],
    transportation: [
      'Metro (3 lines: A, B, C)',
      'Extensive bus network',
      'Taxis and ride-sharing',
      'Walking (historic center is compact)',
      'Bike sharing available'
    ],
    keyFacts: [
      'Capital of Italy and former Roman Empire',
      'Home to Vatican City (smallest country in the world)',
      'Contains more UNESCO World Heritage Sites than any other city',
      'Known as "Caput Mundi" (Capital of the World)'
    ]
  },
  'sydney': {
    name: 'Sydney',
    country: 'Australia',
    population: '5.3 million (metropolitan area)',
    currency: 'Australian Dollar (AUD)',
    language: 'English',
    timezone: 'AEST/AEDT (UTC+10/+11)',
    bestTimeToVisit: 'September-November and March-May',
    description: 'Sydney is Australia\'s largest city, famous for its stunning harbor, iconic Opera House, and beautiful beaches. A vibrant multicultural metropolis with world-class dining and outdoor lifestyle.',
    climate: 'Temperate oceanic climate with warm summers and mild winters',
    economy: 'Major financial center, tourism hub, and gateway to Asia-Pacific',
    averageTemperature: '18°C (64°F)',
    costLevel: 'High',
    safetyRating: '9/10',
    culturalTips: [
      'Australians are generally casual and friendly',
      'Tipping is not mandatory but appreciated for good service',
      'Sun protection is essential - UV levels are high',
      'Beach safety: swim between the flags',
      'Public transport etiquette: offer seats to elderly and pregnant'
    ],
    transportation: [
      'Sydney Trains (extensive rail network)',
      'Buses and light rail',
      'Sydney Ferries (harbor transport)',
      'Taxis and ride-sharing',
      'Walking and cycling paths'
    ],
    keyFacts: [
      'Home to the iconic Sydney Opera House and Harbour Bridge',
      'Host city of 2000 Summer Olympics',
      'One of the world\'s most liveable cities',
      'Gateway to Australia with the busiest airport in the country'
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
  
  // PRODUCTION: Prioritize real-time data from Gemini AI
  if (geminiService.isAvailable()) {
    try {
      console.log(`Fetching real-time data for ${cityName} from Gemini AI...`);
      const geminiCityInfo = await geminiService.getCityInfo(cityName);
      if (geminiCityInfo) {
        console.log(`Successfully retrieved real-time data for ${cityName}`);
        // For production, return pure Gemini data with minimal fallback enhancement
        const enhancedInfo = {
          ...geminiCityInfo,
          // Only add essential fields that might be missing
          population: geminiCityInfo.population || 'Data not available',
          averageTemperature: geminiCityInfo.averageTemperature || 'Varies by season',
          costLevel: geminiCityInfo.costLevel || 'Medium',
          safetyRating: geminiCityInfo.safetyRating || 'Check current travel advisories'
        };
        return NextResponse.json({ cityInfo: enhancedInfo });
      } else {
        console.warn(`Gemini returned null data for ${cityName}`);
      }
    } catch (error) {
      console.error(`Error fetching from Gemini for ${cityName}:`, error);
      // Continue to fallback options
    }
  } else {
    console.warn('Gemini service not available - check API key configuration');
  }
  
  // EMERGENCY FALLBACK: Only use curated database if Gemini completely fails
  console.warn(`Using emergency fallback data for ${cityName} - Gemini AI unavailable`);
  const cityData = fallbackCityData[normalizedCity];
  if (cityData) {
    console.log(`Found fallback data for ${cityName}`);
    return NextResponse.json({ 
      cityInfo: {
        ...cityData,
        description: `${cityData.description} [Note: Using cached data - real-time information unavailable]`
      }
    });
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
          const databaseInfo = fallbackCityData[suggestedCity.toLowerCase()];
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
    const suggestedCityData = fallbackCityData[suggestedCity.toLowerCase()];
    if (suggestedCityData) {
      const modifiedData = {
        ...suggestedCityData,
        name: `${suggestedCityData.name} (${cityName})`,
        description: `${suggestedCityData.description} Note: You searched for ${cityName}. Here's information about ${suggestedCityData.name}, a major city in ${cityName}.`
      };
      return NextResponse.json({ cityInfo: modifiedData });
    }
  }

  // PRODUCTION FALLBACK: Provide helpful response for any city worldwide
  console.warn(`No specific data available for ${cityName} - providing generic travel information`);
  
  // Return an error for production to indicate we need better data coverage
  return NextResponse.json({ 
    error: 'City information temporarily unavailable',
    message: `We're currently unable to provide detailed information about ${cityName}. This may be due to:
- Temporary API service issues
- City name spelling or formatting
- Limited data coverage for this location

Please try:
- Checking the city name spelling
- Using the full city name (e.g., "New York City" instead of "NYC")
- Trying again in a few moments

For immediate assistance, please search for major cities or contact support.`,
    suggestions: [
      'Verify city name spelling',
      'Try using the full city name',
      'Search for nearby major cities',
      'Contact support if the issue persists'
    ],
    cityName: cityName
  }, { status: 503 }); // Service Unavailable
}