
import { GoogleGenAI } from "@google/genai";
import { LogoGenerationOptions } from "../types";

export const generateLogoImage = async (options: LogoGenerationOptions): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const styleKeywords: Record<string, string> = {
    minimalist: "ultra-minimalist, clean lines, geometric, flat vector design, solid background, high contrast, symbol only",
    '3d': "high-quality 3D render, depth, realistic lighting, octane render, soft shadows, premium feel",
    vintage: "heritage style, retro badge, classic emblem, distressed texture, 19th century typography",
    futuristic: "cyberpunk aesthetic, neon glow, sharp tech lines, futuristic font, dark sleek background",
    'hand-drawn': "hand-crafted illustration, organic lines, artistic sketch, charcoal style, unique textures",
    gradient: "modern mesh gradient, vibrant liquid colors, glassmorphism elements, trendy soft shadows",
    luxury: "high-end fashion, gold and silver accents, sophisticated serif typography, elegant minimalist icon"
  };

  const fullPrompt = `Create a professional high-resolution logo for: ${options.prompt}. 
                      Style: ${styleKeywords[options.style]}. 
                      Guidelines: Vector style, centralized icon, no realistic photographic details, 
                      professional color palette, clear and legible. No messy text.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: fullPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: options.aspectRatio
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
      throw new Error("No image data received");
    }

    return imageUrl;
  } catch (error: any) {
    console.error("Gemini Image Generation Error:", error);
    throw error;
  }
};
