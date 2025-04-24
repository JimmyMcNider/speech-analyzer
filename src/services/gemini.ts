import { GoogleGenerativeAI, GenerativeModel, GenerationConfig } from '@google/generative-ai';

// Initialize Gemini AI with configuration
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

const generationConfig: GenerationConfig = {
  temperature: 0.1, // Lower temperature for more focused, deterministic responses
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

const model: GenerativeModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig,
});

export interface DisasterIntake {
  // Required fields
  first_name: string;
  last_name: string;
  date_of_birth: string;
  phone_number: string;
  email_address: string;
  primary_language: string;
  affected_address: string;
  
  // Optional fields
  type_of_residence?: string;
  ownership_status?: string;
  household_members?: number;
  number_of_pets?: number;
  type_of_pets?: string[];
  type_of_disaster?: string;
  incident_date?: string;
  incident_time?: string;
  damage_description?: string;
  is_home_habitable?: boolean;
  insurance_status?: string;
  needs_assessment?: {
    shelter_needed?: boolean;
    food_water_needed?: boolean;
    clothing_needed?: boolean;
    health_services_needed?: boolean;
    medication_needed?: boolean;
    baby_supplies_needed?: boolean;
  };
  has_disabled_members?: boolean;
}

export const REQUIRED_FIELDS = [
  'first_name',
  'last_name',
  'date_of_birth',
  'phone_number',
  'email_address',
  'primary_language',
  'affected_address'
] as const;

function cleanTranscriptText(text: string): string {
  return text
    .replace(/\b(oh|um|uh|ah|er|yeah|you know|like)\b/gi, '') // Remove filler words
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/(\w)\1{2,}/g, '$1') // Remove repeated characters (e.g., "Jimmyyy" -> "Jimmy")
    .trim();
}

export function getMissingRequiredFields(data: Partial<DisasterIntake>): string[] {
  return REQUIRED_FIELDS.filter(field => !data[field]);
}

export async function analyzeSpeech(text: string): Promise<Partial<DisasterIntake>> {
  if (!text.trim()) {
    throw new Error('No speech text provided');
  }

  const cleanedText = cleanTranscriptText(text);

  try {
    const prompt = `
      You are a disaster intake assistant. Extract information from the following speech text.
      Format the response as a clean JSON object. Only include fields that are clearly mentioned.
      
      Rules:
      1. Format phone numbers as XXX-XXX-XXXX
      2. Format dates as YYYY-MM-DD
      3. Format times as HH:MM (24-hour)
      4. Capitalize proper nouns
      5. If information is ambiguous, omit it
      6. Convert yes/no responses to boolean true/false
      7. For needs assessment, interpret context to determine true/false values
      
      Expected fields:
      {
        // Required fields
        "first_name": "string",
        "last_name": "string",
        "date_of_birth": "string (YYYY-MM-DD)",
        "phone_number": "string (XXX-XXX-XXXX)",
        "email_address": "string",
        "primary_language": "string",
        "affected_address": "string",
        
        // Optional fields
        "type_of_residence": "string (house/apartment/mobile home/etc)",
        "ownership_status": "string (own/rent/lease/etc)",
        "household_members": number,
        "number_of_pets": number,
        "type_of_pets": ["string"],
        "type_of_disaster": "string",
        "incident_date": "string (YYYY-MM-DD)",
        "incident_time": "string (HH:MM)",
        "damage_description": "string",
        "is_home_habitable": boolean,
        "insurance_status": "string",
        "needs_assessment": {
          "shelter_needed": boolean,
          "food_water_needed": boolean,
          "clothing_needed": boolean,
          "health_services_needed": boolean,
          "medication_needed": boolean,
          "baby_supplies_needed": boolean
        },
        "has_disabled_members": boolean
      }

      Speech text: "${cleanedText}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text();
    
    try {
      // First try to find a JSON object in the response
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON object found in response');
      }
      
      const parsedResponse = JSON.parse(jsonMatch[0]);
      
      // Validate the response has at least one valid field
      if (Object.keys(parsedResponse).length === 0) {
        throw new Error('No valid information extracted');
      }
      
      return parsedResponse;
    } catch (parseError: unknown) {
      console.error('Raw Gemini response:', textResponse);
      console.error('Parse error:', parseError);
      throw new Error(`Failed to parse response: ${parseError instanceof Error ? parseError.message : 'Invalid JSON format'}`);
    }
  } catch (error) {
    console.error('Error in analyzeSpeech:', error);
    if (error instanceof Error) {
      throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error('Unknown error occurred while analyzing speech');
  }
} 