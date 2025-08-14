import { GoogleGenerativeAI } from '@google/generative-ai';
import { ProcessedPlace } from './googlePlacesService';

export interface CityInfo {
  name: string;
  country?: string;
  description: string;
  bestTimeToVisit: string;
  currency: string;
  language: string;
  timezone: string;
  highlights?: string[];
  culturalTips: string[];
  transportation: string[];
  population?: string;
  averageTemperature?: string;
  costLevel?: string;
  safetyRating?: string;
  climate?: string;
  economy?: string;
  keyFacts?: string[];
}

export interface EnhancedPlace extends ProcessedPlace {
  aiDescription?: string;
  tips?: string[];
  bestTimeToVisit?: string;
  nearbyPlaces?: string[];
}

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor() {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    } else {
      console.warn('Gemini API key not found. Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment variables.');
    }
  }

  // Check if Gemini is available
  isAvailable(): boolean {
    return this.model !== null;
  }

  // Get comprehensive city information
  async getCityInfo(cityName: string): Promise<CityInfo | null> {
    if (!this.model) {
      console.warn('Gemini service not available');
      return null;
    }

    try {
      const prompt = `Provide comprehensive travel information about ${cityName} in JSON format with the following structure:
      {
        "name": "${cityName}",
        "country": "country name",
        "description": "engaging 2-3 sentence description",
        "bestTimeToVisit": "best months/season to visit",
        "currency": "local currency",
        "language": "primary language(s)",
        "timezone": "timezone",
        "highlights": ["top 5 must-see attractions or experiences"],
        "culturalTips": ["3-4 important cultural etiquette tips"],
        "transportation": ["3-4 main transportation options"]
      }
      
      Make the description engaging and informative. Focus on what makes this city unique and appealing to travelers.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return null;
    } catch (error) {
      console.error('Error getting city info from Gemini:', error);
      return null;
    }
  }

  // Enhance place descriptions with AI
  async enhancePlaceDescription(place: ProcessedPlace): Promise<string> {
    if (!this.model) {
      return place.description;
    }

    try {
      const prompt = `Create an engaging, informative description for ${place.name} in ${place.address}. 
      Current description: ${place.description}
      Category: ${place.category}
      Rating: ${place.rating || 'N/A'}
      
      Write a compelling 1-2 sentence description that highlights what makes this place special and why travelers should visit. Focus on unique features, experiences, or historical significance. Keep it concise but engaging.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error enhancing place description:', error);
      return place.description;
    }
  }

  // Get travel tips for a specific place
  async getPlaceTips(place: ProcessedPlace): Promise<string[]> {
    if (!this.model) {
      return [];
    }

    try {
      const prompt = `Provide 3-4 practical travel tips for visiting ${place.name} in ${place.address}. 
      Category: ${place.category}
      
      Focus on:
      - Best time to visit (time of day, season)
      - What to bring or wear
      - How to make the most of the visit
      - Any insider tips or things to know
      
      Format as a JSON array of strings: ["tip1", "tip2", "tip3", "tip4"]`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON array from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return [];
    } catch (error) {
      console.error('Error getting place tips:', error);
      return [];
    }
  }

  // Get personalized recommendations based on user preferences
  async getPersonalizedRecommendations(
    cityName: string, 
    places: ProcessedPlace[], 
    preferences: {
      interests?: string[];
      budget?: 'low' | 'medium' | 'high';
      duration?: string;
      travelStyle?: string;
    }
  ): Promise<ProcessedPlace[]> {
    if (!this.model || places.length === 0) {
      return places;
    }

    try {
      const placeNames = places.map(p => p.name).join(', ');
      const prompt = `Given these places in ${cityName}: ${placeNames}
      
      User preferences:
      - Interests: ${preferences.interests?.join(', ') || 'general tourism'}
      - Budget: ${preferences.budget || 'medium'}
      - Duration: ${preferences.duration || 'flexible'}
      - Travel style: ${preferences.travelStyle || 'balanced'}
      
      Rank these places from most to least recommended for this traveler. Return only the place names in order, separated by commas.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const recommendedOrder = response.text().trim().split(',').map((name: string) => name.trim());

      // Reorder places based on AI recommendations
      const reorderedPlaces: ProcessedPlace[] = [];
      
      recommendedOrder.forEach((recommendedName: string) => {
        const place = places.find(p => 
          p.name.toLowerCase().includes(recommendedName.toLowerCase()) ||
          recommendedName.toLowerCase().includes(p.name.toLowerCase())
        );
        if (place && !reorderedPlaces.includes(place)) {
          reorderedPlaces.push(place);
        }
      });

      // Add any remaining places that weren't matched
      places.forEach((place: ProcessedPlace) => {
        if (!reorderedPlaces.includes(place)) {
          reorderedPlaces.push(place);
        }
      });

      return reorderedPlaces;
    } catch (error) {
      console.error('Error getting personalized recommendations:', error);
      return places;
    }
  }

  // Enhance multiple places with AI descriptions
  async enhancePlaces(places: ProcessedPlace[]): Promise<EnhancedPlace[]> {
    if (!this.model) {
      return places;
    }

    const enhancedPlaces: EnhancedPlace[] = [];

    for (const place of places) {
      try {
        const [aiDescription, tips] = await Promise.all([
          this.enhancePlaceDescription(place),
          this.getPlaceTips(place)
        ]);

        enhancedPlaces.push({
          ...place,
          aiDescription,
          tips
        });
      } catch (error) {
        console.error(`Error enhancing place ${place.name}:`, error);
        enhancedPlaces.push(place);
      }
    }

    return enhancedPlaces;
  }

  // Generate a travel itinerary
  async generateItinerary(
    cityName: string, 
    places: ProcessedPlace[], 
    days: number = 3
  ): Promise<{ day: number; places: ProcessedPlace[]; theme: string }[]> {
    if (!this.model || places.length === 0) {
      return [];
    }

    try {
      const placeList = places.map(p => `${p.name} (${p.category}, ${p.duration})`).join(', ');
      
      const prompt = `Create a ${days}-day itinerary for ${cityName} using these places: ${placeList}
      
      Consider:
      - Logical geographical grouping
      - Time needed for each place
      - Travel time between locations
      - Mix of different types of attractions
      
      Format as JSON:
      [
        {
          "day": 1,
          "theme": "day theme",
          "places": ["place1", "place2", "place3"]
        }
      ]
      
      Distribute places evenly across days and give each day a descriptive theme.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const itinerary = JSON.parse(jsonMatch[0]);
        
        // Map place names back to place objects
        return itinerary.map((day: any) => ({
          ...day,
          places: day.places.map((placeName: string) => 
            places.find((p: ProcessedPlace) => 
              p.name.toLowerCase().includes(placeName.toLowerCase()) ||
              placeName.toLowerCase().includes(p.name.toLowerCase())
            )
          ).filter(Boolean)
        }));
      }

      return [];
    } catch (error) {
      console.error('Error generating itinerary:', error);
      return [];
    }
  }
}

export const geminiService = new GeminiService();