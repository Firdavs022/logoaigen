
import { GoogleGenAI } from "@google/genai";
import { LogoGenerationOptions } from "../types";

export const generateLogoImage = async (options: LogoGenerationOptions): Promise<string> => {
  // Always use GoogleGenAI with a named parameter for the API key from process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const styleKeywords: Record<string, string> = {
    minimalist: "ultra-minimalist, clean lines, geometric, flat vector design, solid background, symbol only",
    '3d': "high-quality 3D render, depth, realistic lighting, octane render, soft shadows",
    vintage: "heritage style, retro badge, classic emblem, distressed texture",
    futuristic: "cyberpunk aesthetic, neon glow, sharp tech lines",
    'hand-drawn': "hand-crafted illustration, organic lines, artistic sketch",
    gradient: "modern mesh gradient, vibrant liquid colors",
    luxury: "high-end fashion, gold and silver accents, sophisticated"
  };

  const fullPrompt = `Create a professional high-resolution logo for: ${options.prompt}. 
                      Style: ${styleKeywords[options.style]}. 
                      Guidelines: Vector style, centralized icon, solid background, 
                      professional color palette, clear and legible. No messy text.`;

  try {
    // Use gemini-2.5-flash-image for general image generation tasks
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: fullPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: options.aspectRatio === '1:1' ? '1:1' : options.aspectRatio // fallback mapping if needed
        }
      },
    });

    let imageUrl = "";
    
    // Iterate through candidates and parts to find the inlineData containing the image
    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      throw new Error("No image was generated. Please check your prompt or try again.");
    }

    return imageUrl;
  } catch (error: any) {
    console.error("Gemini Image Generation Error:", error);
    throw error;
  }
};
