import { Type } from "@google/genai";

const geminiFetch = async (prompt: string | any[], systemInstruction: string, responseSchema?: any) => {
  try {
    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt, systemInstruction, responseSchema })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

export const interviewService = {
  async generateQuestions(profile: any, language: string = "English") {
    const systemInstruction = `You are a highly professional, respectful, and empathetic hiring manager. 
      Generate EXACTLY 20 random, challenging, and humanized interview questions in ${language} for a candidate with the following profile: ${JSON.stringify(profile)}. 
      
      CRITICAL INSTRUCTIONS: 
      1. Return EXACTLY 20 questions.
      2. You MUST speak ONLY in ${language}.
      3. The questions should be random and different every time.
      4. If the language is Urdu, use pure, high-quality, standard Urdu (Standard/Lashkari). Avoid robotic translations, literal translations, or excessive English loanwords. Use natural idioms and professional vocabulary (e.g., use 'رابطہ' for contact, 'تاثرات' for expressions, 'تجربہ' for experience).
      5. Be extremely respectful and professional in your phrasing.
      Return as JSON array of strings.`;
    
    const geminiResponse = await geminiFetch(`Generate 20 random, respectful questions for ${profile.role} in ${language} now.`, systemInstruction, {
      type: Type.OBJECT,
      properties: {
        questions: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      },
      required: ["questions"]
    });

    if (geminiResponse) {
      try {
        const parsed = JSON.parse(geminiResponse);
        return (parsed.questions || []).slice(0, 20);
      } catch (e) {
        console.error("Failed to parse Gemini response", e);
      }
    }
    return ["Tell me about yourself.", "Why are you interested in this role?"];
  },

  async generateResume(userData: any, language: string = "English") {
    const systemInstruction = `You are a professional resume writer and career coach. 
      Create a high-level, professional resume in Markdown format based on the following user data: ${JSON.stringify(userData)}.
      
      CRITICAL:
      1. Use a modern, clean structure.
      2. Highlight achievements and skills relevant to their target role.
      3. The resume MUST be in ${language}.
      4. If the language is Urdu, use pure, high-quality, human-like Urdu (اردو).
      5. Include sections for Professional Summary, Experience, Education, and Skills.
      
      Return as a JSON object:
      {
        "markdown": "Full resume in markdown",
        "summary": "Brief professional summary",
        "suggestedRoles": ["Role 1", "Role 2"]
      }`;

    const geminiResponse = await geminiFetch(`Generate a professional resume for ${userData.name} in ${language}.`, systemInstruction, {
      type: Type.OBJECT,
      properties: {
        markdown: { type: Type.STRING },
        summary: { type: Type.STRING },
        suggestedRoles: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      },
      required: ["markdown", "summary", "suggestedRoles"]
    });

    if (geminiResponse) {
      try {
        return JSON.parse(geminiResponse);
      } catch (e) {
        console.error("Failed to parse Gemini response", e);
      }
    }
    return null;
  },

  async analyzeAnswer(question: string, answer: string, language: string = "English") {
    const systemInstruction = `You are a highly professional and respectful hiring manager. Analyze this interview answer in ${language}.
      Question: "${question}"
      User's Answer: "${answer}"

      CRITICAL INSTRUCTIONS FOR ${language}:
      - If the language is Urdu, use pure, high-quality, standard Urdu (Standard/Lashkari). Avoid robotic or literal translations. Use natural idioms and professional vocabulary.
      - The feedback should sound like a real person talking—respectful, encouraging, yet professional.
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
      }`;

    const geminiResponse = await geminiFetch(`Analyze this answer: ${answer}`, systemInstruction, {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        feedback: { type: Type.STRING },
        clarity: { type: Type.NUMBER },
        confidence: { type: Type.NUMBER },
        communicationStyle: { type: Type.STRING }
      },
      required: ["score", "feedback", "clarity", "confidence", "communicationStyle"]
    });

    if (geminiResponse) {
      try {
        return JSON.parse(geminiResponse);
      } catch (e) {
        console.error("Failed to parse Gemini response", e);
      }
    }
    return null;
  },

  async analyzeBehavior(imageBase64: string, language: string = "English") {
    const systemInstruction = `Analyze the person's behavior in this image for an interview context. Focus on eye contact, hand movements, and facial expressions. 
    CRITICAL: If the language is Urdu, use pure, high-quality, standard Urdu (Lashkari/Standard) for the comment. Avoid robotic translations or English loanwords where a pure Urdu word exists (e.g., use 'رابطہ' for contact, 'تاثرات' for expressions, 'حرکات' for movements).
    Be respectful and professional.
    Return as JSON.`;
    
    const geminiResponse = await geminiFetch([
      {
        role: "user",
        parts: [
          { text: `Analyze behavior in image in ${language}. Focus on eye contact, hand movements, and facial expressions. Provide a score (0-100) for each and a brief, respectful comment in ${language}.` },
          { inlineData: { data: imageBase64, mimeType: "image/jpeg" } }
        ]
      }
    ], systemInstruction, {
      type: Type.OBJECT,
      properties: {
        eyeContact: { type: Type.NUMBER },
        handMovements: { type: Type.NUMBER },
        facialExpressions: { type: Type.NUMBER },
        comment: { type: Type.STRING }
      },
      required: ["eyeContact", "handMovements", "facialExpressions", "comment"]
    });

    const defaultResult = { eyeContact: 50, handMovements: 50, facialExpressions: 50, comment: language === "Urdu" ? "تجزیہ کیا جا رہا ہے..." : "Analyzing..." };

    if (geminiResponse) {
      try {
        const parsed = JSON.parse(geminiResponse);
        return {
          eyeContact: typeof parsed.eyeContact === 'number' ? parsed.eyeContact : 50,
          handMovements: typeof parsed.handMovements === 'number' ? parsed.handMovements : 50,
          facialExpressions: typeof parsed.facialExpressions === 'number' ? parsed.facialExpressions : 50,
          comment: parsed.comment || defaultResult.comment
        };
      } catch (e) {
        console.error("Failed to parse Gemini response", e);
      }
    }
    return defaultResult;
  },

  async analyzeDressing(imageBase64: string, language: string = "English") {
    const systemInstruction = `Analyze the person's attire in this image. Are they dressed formally for an interview? Provide a score (0-100) and a brief comment in ${language}. Return as JSON.`;
    
    const geminiResponse = await geminiFetch([
      {
        role: "user",
        parts: [
          { text: `Analyze attire in image in ${language}. Are they dressed formally for an interview? Provide a score (0-100), a brief comment, and a boolean isFormal.` },
          { inlineData: { data: imageBase64, mimeType: "image/jpeg" } }
        ]
      }
    ], systemInstruction, {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        comment: { type: Type.STRING },
        isFormal: { type: Type.BOOLEAN }
      },
      required: ["score", "comment", "isFormal"]
    });

    if (geminiResponse) {
      try {
        return JSON.parse(geminiResponse);
      } catch (e) {
        console.error("Failed to parse Gemini response", e);
      }
    }
    return null;
  },

  async analyzeResume(fileData: string, language: string = "English") {
    const systemInstruction = `Analyze this resume content and provide professional feedback in ${language}. Highlight strengths, weaknesses, and suggest improvements for a tech interview.`;
    
    const geminiResponse = await geminiFetch(`Analyze this resume content and provide professional feedback in ${language}: ${fileData}`, systemInstruction, {
      type: Type.OBJECT,
      properties: {
        feedback: { type: Type.STRING },
        score: { type: Type.NUMBER },
        strengths: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        improvements: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      },
      required: ["feedback", "score", "strengths", "improvements"]
    });

    if (geminiResponse) {
      try {
        return JSON.parse(geminiResponse);
      } catch (e) {
        console.error("Failed to parse Gemini response", e);
      }
    }
    return null;
  }
};
