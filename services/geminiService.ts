import { GoogleGenAI, Type } from "@google/genai";
import { IdentificationResult } from "../types";

// Helper to safely access environment variables
const getApiKey = (): string => {
  // Priority 1: User provided key (Hardcoded for immediate fix)
  const hardcodedKey = 'AIzaSyCSk9cHrJJpCtUXvuacs_8x_GJiXHdQ6F0';
  if (hardcodedKey) return hardcodedKey;

  // 1. Try Vite (Standard for Vercel + Vite)
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    if (import.meta.env.VITE_API_KEY) return import.meta.env.VITE_API_KEY;
  }
  
  // 2. Try process.env (Next.js, CRA, Standard Node)
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.NEXT_PUBLIC_API_KEY) return process.env.NEXT_PUBLIC_API_KEY;
    if (process.env.REACT_APP_API_KEY) return process.env.REACT_APP_API_KEY;
    // Fallback for some setups
    if (process.env.VITE_API_KEY) return process.env.VITE_API_KEY;
    if (process.env.API_KEY) return process.env.API_KEY;
  }

  return '';
};

export const identifyAnimal = async (
  base64Image: string
): Promise<IdentificationResult> => {
  // Get key at runtime to handle lazy loading of env vars
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error(
      "API Key is missing.\n\n" +
      "Troubleshooting:\n" +
      "1. On Vercel, ensure the variable name is 'VITE_API_KEY'.\n" +
      "2. Ensure you have REDEPLOYED the app after adding the key.\n" +
      "3. If running locally, check your .env file."
    );
  }

  // Initialize client with the key
  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-2.5-flash";

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      candidates: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 100" }
          },
          required: ["name", "confidence"]
        },
        description: "Top 3 possible animal identifications"
      },
      description: { type: Type.STRING, description: "A brief, interesting fact or description about the primary animal identified." },
      scientificName: { type: Type.STRING, description: "The scientific name of the primary animal." }
    },
    required: ["candidates", "description", "scientificName"]
  };

  const parts: any[] = [
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Image
      }
    },
    {
      text: "Identify the animal in this image. Provide the top 3 most likely animal species it could be, along with a confidence percentage (0-100) for each. Also provide the scientific name and a brief description for the most likely match. Return strictly JSON."
    }
  ];

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as IdentificationResult;
    return result;

  } catch (error: any) {
    console.error("Gemini Classification Error:", error);
    if (error.message.includes("API Key is missing")) {
      throw error;
    }
    throw new Error("Failed to identify the animal. Please ensure the image is clear and the API key is properly configured.");
  }
};