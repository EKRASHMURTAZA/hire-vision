import { GoogleGenAI, Type } from "@google/genai";
import "dotenv/config";

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY or API_KEY is not set in environment variables.");
}

const genAI = new GoogleGenAI({ apiKey: apiKey || "" });

export const geminiService = {
  async generateContent(prompt: string | any[], systemInstruction: string, responseSchema?: any) {
    try {
      const modelName = "gemini-3.1-pro-preview"; // Using 3.1 Pro for more complex/advanced tasks
      const response = await genAI.models.generateContent({
        model: modelName,
        contents: Array.isArray(prompt) ? prompt : [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          systemInstruction,
          responseMimeType: responseSchema ? "application/json" : "text/plain",
          responseSchema: responseSchema
        }
      });
      return response.text;
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      // If API key is invalid, provide a clearer message
      if (error.message?.includes("API key not valid")) {
        throw new Error("The Gemini API key is invalid. Please check your Secrets/Settings.");
      }
      throw error;
    }
  }
};
