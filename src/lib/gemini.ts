import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const interviewService = {
  async generateQuestions(profile: any, language: string = "English") {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Gemini API Key is missing. Please configure it in the Secrets panel.");
    }
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a professional hiring manager at a top tech company. You are strict but fair. 
      Generate 5 challenging and humanized interview questions in ${language} for a candidate with the following profile: ${JSON.stringify(profile)}. 
      CRITICAL: If the language is Urdu, use pure, high-quality, human-like Urdu (اردو). Avoid robotic or literal translations. 
      The questions should sound like they are coming from a real boss. Return as JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  },

  async analyzeAnswer(question: string, answer: string, language: string = "English") {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Gemini API Key is missing. Please configure it in the Secrets panel.");
    }
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a professional hiring manager. Analyze this interview answer in ${language}.
      Question: "${question}"
      User's Answer: "${answer}"

      CRITICAL INSTRUCTIONS FOR ${language}:
      - If the language is Urdu, use pure, high-quality, human-like Urdu (اردو). Avoid robotic or literal translations. Use natural idioms and professional vocabulary.
      - The feedback should sound like a real person talking, not a machine.
      - If the user asks a question or makes a comment within their answer, respond to it naturally before providing the analysis.
      - If the answer is poor, irrelevant, or too short, give a very low score (below 30).
      - Analyze the user's communication style, confidence, and clarity.

      Return the analysis as a JSON object with the following structure:
      {
        "score": number (0-100),
        "feedback": "Your human-like response and feedback in ${language}",
        "clarity": number (0-100),
        "confidence": number (0-100),
        "communicationStyle": "Description of their style"
      }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            feedback: { type: Type.STRING },
            clarity: { type: Type.NUMBER },
            confidence: { type: Type.NUMBER },
            communicationStyle: { type: Type.STRING }
          },
          required: ["score", "feedback"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  },

  async analyzeBehavior(imageBase64: string, language: string = "English") {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Gemini API Key is missing. Please configure it in the Secrets panel.");
    }
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: imageBase64
          }
        },
        {
          text: `Analyze the person's behavior in this image for an interview context. 
          Focus on:
          1. Eye contact (are they looking at the camera?).
          2. Hand movements/gestures (are they using their hands to express themselves?).
          3. Facial expressions (do they look confident and engaged?).
          Provide a score (0-100) for each and a brief comment. 
          CRITICAL: The comment MUST be written in ${language}.
          Return as JSON.`
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            eyeContact: { type: Type.NUMBER },
            handMovements: { type: Type.NUMBER },
            facialExpressions: { type: Type.NUMBER },
            comment: { type: Type.STRING }
          },
          required: ["eyeContact", "handMovements", "facialExpressions", "comment"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  },

  async analyzeDressing(imageBase64: string, language: string = "English") {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Gemini API Key is missing. Please configure it in the Secrets panel.");
    }
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: imageBase64
          }
        },
        {
          text: `Analyze the person's attire in this image. Are they dressed formally for an interview? 
          Provide a score (0-100) and a brief comment on their professional appearance. 
          CRITICAL: The comment MUST be written in ${language}.
          Return as JSON.`
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            comment: { type: Type.STRING },
            isFormal: { type: Type.BOOLEAN }
          },
          required: ["score", "comment", "isFormal"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  },

  async analyzeResume(fileData: string, language: string = "English") {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Gemini API Key is missing. Please configure it in the Secrets panel.");
    }
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this resume content and provide professional feedback in ${language}. 
      Highlight strengths, weaknesses, and suggest improvements for a tech interview.
      Resume Content: ${fileData}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            feedback: { type: Type.STRING },
            score: { type: Type.NUMBER },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["feedback", "score"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  }
};
