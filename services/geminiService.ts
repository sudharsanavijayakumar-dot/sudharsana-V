import { GoogleGenAI, Type } from "@google/genai";
import { AnimalProfile } from "../types";

// Helper to get AI instance safely
const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Identifies the national animal and provides basic details.
 */
export const identifyNationalAnimal = async (country: string): Promise<AnimalProfile> => {
  const ai = getAI();
  const prompt = `Identify the primary national animal or most culturally significant wildlife symbol of ${country}. 
  Return the result as a JSON object with the following fields: 
  - name (common name)
  - scientificName
  - description (a brief physical description, max 2 sentences)
  - habitat (a few words about where it lives)
  - traits (array of 3 strings identifying its key characteristics like 'Strength', 'Wisdom', etc.)`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            scientificName: { type: Type.STRING },
            description: { type: Type.STRING },
            habitat: { type: Type.STRING },
            traits: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text from Gemini");
    
    return JSON.parse(text) as AnimalProfile;
  } catch (error) {
    console.error("Error identifying animal:", error);
    throw error;
  }
};

/**
 * Generates the "Sixth Sense" cultural/spiritual insight.
 */
export const getSixthSenseInsight = async (country: string, animalName: string): Promise<string> => {
  const ai = getAI();
  const prompt = `Reveal the "Sixth Sense" of the ${animalName} in the context of ${country}. 
  Describe its spiritual meaning, folklore, or the deep, unspoken connection it represents for the nation's people. 
  Write it in a mystical, evocative, yet educational tone. Max 200 words.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "The spirits are silent.";
  } catch (error) {
    console.error("Error fetching insight:", error);
    return "Could not commune with the archives at this time.";
  }
};

/**
 * Generates an artistic image of the animal.
 */
export const generateAnimalVision = async (country: string, animalName: string): Promise<string> => {
  const ai = getAI();
  const prompt = `A mystical, high-quality, artistic representation of a ${animalName}, representing the soul of ${country}. 
  Cinematic lighting, ethereal atmosphere, highly detailed. Aspect ratio 1:1.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
      config: {
        // No responseMimeType for image generation models in this mode as per guidelines
      }
    });

    // Extract image from parts
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData && part.inlineData.data) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data received");
  } catch (error) {
    console.error("Error generating vision:", error);
    throw error;
  }
};
