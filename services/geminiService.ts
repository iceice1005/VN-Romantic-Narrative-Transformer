
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

let apiKey: string | undefined = undefined;

try {
    // Vite-specific way (primary for client-side builds)
    // @ts-ignore // TypeScript might not know about import.meta.env without vite/client types
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
        // @ts-ignore
        apiKey = import.meta.env.VITE_API_KEY as string;
    }
    // Fallback for Node.js environments or other build tools (secondary)
    else if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
        apiKey = process.env.API_KEY;
    }
} catch (e) {
    console.warn("API_KEY or VITE_API_KEY not accessible. Ensure it's set in your environment.", e);
}


if (!apiKey) {
  const errorMessage = "Gemini API Key is not configured.\n" +
    "If using Vite (or a similar modern build tool for client-side apps like this one):\n" +
    "1. Ensure you have an environment variable named VITE_API_KEY set in your deployment environment (e.g., Vercel Project Settings > Environment Variables).\n" +
    "2. For local development with Vite, create a .env file in your project root and add the line: VITE_API_KEY=YOUR_ACTUAL_GEMINI_KEY\n" +
    "If using a non-Vite Node.js server-side environment (less common for this app's current structure):\n" +
    "- Ensure an environment variable named API_KEY is set.\n" +
    "Directly embedding API keys in client-side code is not recommended for production.";
  console.error(errorMessage);
  throw new Error(errorMessage);
}

const ai = new GoogleGenAI({ apiKey: apiKey });

export const transformTextViaGemini = async (
  modelName: string,
  systemInstruction: string, 
  rawVietnameseText: string,
  temperature: number,
  topP: number,
  topK: number,
  seed?: number // Seed is now always a number if provided by App.tsx
): Promise<string> => {

  const modelConfig: Record<string, any> = {
    temperature: temperature,
    topP: topP,
    topK: topK,
  };

  if (systemInstruction && systemInstruction.trim() !== '') {
    modelConfig.systemInstruction = systemInstruction;
  }

  if (seed !== undefined) { // Seed will always be a number if it comes from App.tsx logic
    modelConfig.seed = seed;
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: rawVietnameseText, // User's actual input text
      config: modelConfig
    });
    
    const text = response.text;
    if (text === null || text === undefined || text.trim() === "") { // Check for null, undefined, or empty/whitespace-only string
      throw new Error("Received an empty or invalid response from the AI. This could be due to: \n1. Overly restrictive or conflicting 'System Instruction'. \n2. Overly restrictive model parameters (e.g., Temperature near 0 with very low Top-K). \n3. The input text itself being problematic for the current configuration. \n4. Content being blocked by safety filters without a specific finishReason. \nPlease check these settings or try resetting to defaults.");
    }
    return text.trim();

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    let errorMessage = "An unknown error occurred while communicating with the Gemini API.";
    if (error instanceof Error) {
        errorMessage = error.message; // Use the original error message

        // Check for specific error patterns or properties if available
        // The Gemini API might provide more structured errors directly on the error object
        // or in a response property if it's an HTTP error wrapped.
        const anyError = error as any;
        if (anyError.message && anyError.message.includes("candidate.finishReason")) {
             errorMessage = `Gemini API Error: Transformation stopped unexpectedly. This could be due to safety settings or reaching the maximum output tokens. Details: ${anyError.message}`;
        } else if (anyError.message && anyError.message.toLowerCase().includes("prompt_blocked")) {
          errorMessage = "Gemini API Error: The prompt was blocked, likely due to safety settings. Please revise your input or system instruction.";
        } else if (anyError.message && anyError.message.includes("API_KEY_INVALID") ) {
             errorMessage = "Gemini API Error: The API key is invalid or not authorized. Please check your API key configuration.";
        } else if (anyError.message && (anyError.message.includes("400") || anyError.message.includes("INVALID_ARGUMENT"))) {
            errorMessage = `Gemini API Error: Invalid argument. This usually means the request was malformed or a parameter was incorrect. Original error: ${anyError.message}`;
        }
        // Retain the specific "empty response" message if that was the explicitly thrown error
        if (!errorMessage.startsWith("Received an empty or invalid response from the AI")) {
             errorMessage = `Gemini API Error: ${errorMessage}. Check console for more details if available.`;
        }
    }
    throw new Error(errorMessage);
  }
};
