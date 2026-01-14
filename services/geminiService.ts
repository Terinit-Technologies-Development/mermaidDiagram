
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";

export const fixMermaidCode = async (
  apiKey: string,
  brokenCode: string,
  errorMessage: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
Broken Mermaid Code:
${brokenCode}

Error Message:
${errorMessage}

Please fix the syntax error. Return ONLY the raw code.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.2,
      },
    });

    let text = response.text || "";
    // Sanitize response: remove markdown backticks if Gemini ignored instructions
    text = text.replace(/```mermaid/g, "").replace(/```/g, "").trim();
    
    if (!text) {
      throw new Error("AI returned an empty response.");
    }

    return text;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to fix code with AI.");
  }
};
