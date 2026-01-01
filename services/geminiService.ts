
import { GoogleGenAI } from "@google/genai";
import { LogoGenerationOptions } from "../types";

export const generateLogoImage = async (options: LogoGenerationOptions): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  // Construct a professional logo prompt based on selection
  const styleKeywords: Record<string, string> = {
    minimalist: "clean, flat vector, simple lines, minimalist, modern white background",
    '3d': "3D render, high quality, realistic shadows, depth, ambient occlusion, studio lighting",
    vintage: "retro style, distressed texture, classic typography, 1950s aesthetic, badge style",
    futuristic: "neon accents, cybernetic elements, high tech, glowing, sharp edges, dark background",
    'hand-drawn': "sketchy, organic lines, charcoal style, artistic, handmade feel, paper texture",
    gradient: "vibrant colors, smooth transitions, mesh gradient, trendy, glassmorphism elements",
    luxury: "elegant, gold accents, premium typography, sophisticated, high-end fashion aesthetic"
  };

  const fullPrompt = `Professional logo design: ${options.prompt}. Style: ${styleKeywords[options.style]}. 
                      Requirements: Centralized composition, solid background, high resolution, 
                      vector-like quality, distinct icon or wordmark. NO text artifacts unless specified.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: fullPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: options.aspectRatio,
        }
      },
    });

    let imageUrl = "";
    
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      throw new Error("No image was generated in the response parts.");
    }

    return imageUrl;
  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    throw error;
  }
};
