
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

let apiKey: string | undefined = undefined;

try {
    // Attempt to get the API key exclusively from process.env.API_KEY
    // This is the primary and sole method as per guidelines.
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
        apiKey = process.env.API_KEY;
        console.info("Using API Key from process.env.API_KEY.");
    }
} catch (e) {
    // Catch potential errors if process or process.env are not defined in some exotic environment
    // Though highly unlikely in typical Node/Browser setups where process.env is expected.
    console.warn("Error accessing process.env for API_KEY:", e);
}


if (!apiKey) {
  const errorMessage = "Gemini API Key (process.env.API_KEY) is not configured. " +
    "Please ensure the API_KEY environment variable is set in your deployment environment (e.g., Vercel, Netlify) " +
    "or development environment. The application exclusively uses process.env.API_KEY. " +
    "Directly embedding keys in client-side code or using other mechanisms for API keys is not supported.";
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
    console.error("Error calling Gemini API for text transformation:", error);
    let errorMessage = "An unknown error occurred while communicating with the Gemini API for text transformation.";
    if (error instanceof Error) {
        errorMessage = error.message; 
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
        if (!errorMessage.startsWith("Received an empty or invalid response from the AI")) {
             errorMessage = `Gemini API Error (Transformation): ${errorMessage}. Check console for more details.`;
        }
    }
    throw new Error(errorMessage);
  }
};

export const generateChapterTitleViaGemini = async (
  modelName: string,
  narrativeText: string,
  maxWords: number,
  temperature: number,
  chapterTitlePromptTemplate: string
): Promise<string> => {
  
  const finalChapterTitlePrompt = chapterTitlePromptTemplate
    .replace('{{narrativeText}}', narrativeText)
    .replace('{{maxWords}}', maxWords.toString());

  const modelConfig: Record<string, any> = {
    temperature: temperature,
    // No topP, topK, seed needed for this simpler task, let model use defaults
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName, // Use the same model as main transformation or a dedicated one
      contents: finalChapterTitlePrompt,
      config: modelConfig,
    });

    const text = response.text;
    if (text === null || text === undefined || text.trim() === "") {
      throw new Error("Received an empty or invalid response from the AI for chapter title generation.");
    }
    // Remove potential quotes around the title, as models sometimes add them
    return text.trim().replace(/^["']|["']$/g, ''); 
  } catch (error) {
    console.error("Error calling Gemini API for chapter title generation:", error);
    let errorMessage = "An unknown error occurred while communicating with the Gemini API for chapter title generation.";
     if (error instanceof Error) {
        errorMessage = error.message;
        const anyError = error as any;
         if (anyError.message && anyError.message.includes("candidate.finishReason")) {
             errorMessage = `Gemini API Error: Title generation stopped unexpectedly. Details: ${anyError.message}`;
        } else if (anyError.message && anyError.message.toLowerCase().includes("prompt_blocked")) {
          errorMessage = "Gemini API Error: The title generation prompt was blocked. Please check the input narrative and prompt template.";
        } else {
            errorMessage = `Gemini API Error (Title Gen): ${errorMessage}.`;
        }
    }
    throw new Error(errorMessage);
  }
};
