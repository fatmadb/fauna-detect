import { GoogleGenAI, Type } from "@google/genai";
import { IdentificationResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const identifyAnimal = async (
  base64Image: string
): Promise<IdentificationResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const model = "gemini-2.5-flash";

  // Define schema for structured JSON output
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

  } catch (error) {
    console.error("Gemini Classification Error:", error);
    throw new Error("Failed to identify the animal. Please ensure the image is clear.");
  }
};
