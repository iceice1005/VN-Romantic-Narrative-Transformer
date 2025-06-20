
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

let apiKey: string | undefined = undefined;
try {
    // Check if process and process.env are defined (they are in Vercel, Node.js, and modern build tools)
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
        apiKey = process.env.API_KEY;
    }
} catch (e) {
    console.warn("process.env.API_KEY not accessible. Ensure it's set in your environment.", e);
}


if (!apiKey) {
  const errorMessage = "Gemini API Key (API_KEY) is not configured. " +
    "Please ensure the API_KEY environment variable is set in your deployment environment (e.g., Vercel, Netlify) " +
    "or properly defined in your local .env file if using a framework that supports it (e.g., Next.js, Vite). " +
    "Directly embedding keys in client-side code or using 'env.js' for API keys is not recommended for production.";
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
        // For example, if 'error' is like { response: { data: { error: { message: 'details' } } } }
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
