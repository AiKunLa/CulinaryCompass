import { GoogleGenAI, Chat, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = ai.models;

export const createChat = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
        systemInstruction: `You are a friendly and expert chef named 'Gemi'. Your goal is to provide clear, easy-to-follow recipes. 
        When a user asks for a recipe, provide it with a title, a short description, a list of ingredients, and step-by-step instructions. 
        Keep the tone encouraging and helpful. Format your responses using Markdown for better readability. For example:
        
        ### Chocolate Chip Cookies
        
        A classic and beloved cookie recipe...
        
        **Ingredients:**
        * 1 cup flour
        * ...
        
        **Instructions:**
        1. Preheat oven...
        2. ...`,
    },
  });
};

export const getRecipeFromImage = async (base64Image: string, mimeType: string, prompt: string) => {
  try {
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Image,
      },
    };

    const textPart = {
      text: prompt,
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error getting recipe from image:", error);
    throw new Error("Failed to get recipe from the image. Please try again.");
  }
};

export const editImage = async (base64Image: string, mimeType: string, prompt: string) => {
  try {
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };
    const textPart = {
      text: prompt,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [imagePart, textPart],
      },
      config: {
          responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    throw new Error("No image was generated.");

  } catch (error) {
    console.error("Error editing image:", error);
    throw new Error("Failed to edit the image. Please try again.");
  }
};
