
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// This `process.env.API_KEY` is a string that Vite replaces at build time.
// It will be the actual key, or the literal string "undefined" if not set during build.
const apiKeyFromVite: string = process.env.API_KEY;

// Check if the key is the string "undefined" (meaning it wasn't set at build time),
// or if it's actually undefined/null/empty (which could happen if Vite's define had an issue,
// or if the key was an empty string).
if (
  apiKeyFromVite === "undefined" || // Literal string "undefined"
  apiKeyFromVite === undefined ||    // Actual undefined (shouldn't happen with JSON.stringify but belt-and-suspenders)
  apiKeyFromVite === null ||         // Actual null (同样,不应该发生)
  typeof apiKeyFromVite !== 'string' || // Not a string (very unlikely after Vite)
  apiKeyFromVite.trim() === ""       // Empty or whitespace-only string
) {
  let problemDetail = "";
  if (apiKeyFromVite === "undefined") {
    problemDetail = "The API key was the literal string 'undefined'. This typically means the API_KEY environment variable was not set or was empty in the build environment (e.g., Vercel).";
  } else if (apiKeyFromVite === undefined || apiKeyFromVite === null) {
    problemDetail = "The API key was 'undefined' or 'null' in the bundled code. This is unexpected if Vite's 'define' feature is working correctly.";
  } else if (typeof apiKeyFromVite !== 'string') {
    problemDetail = "The API key was not a string type after Vite's processing, which is highly unexpected.";
  } else if (apiKeyFromVite.trim() === "") {
    problemDetail = "The API key was an empty or whitespace-only string in the build environment.";
  } else {
    problemDetail = "An unexpected issue occurred with the API key."
  }

  const errorMessage = "Gemini API Key (process.env.API_KEY) is not configured or is invalid. " +
    "This application relies on the API_KEY being set as an environment variable during the build process (e.g., in Vercel settings). " +
    "Vite (the build tool) then embeds this key into the application. " +
    `DETAILS: ${problemDetail} ` +
    `The value received by the application for process.env.API_KEY was: '${String(apiKeyFromVite)}' (type: ${typeof apiKeyFromVite}). ` +
    "Please verify the API_KEY in your build environment settings and ensure it's not empty.";
  console.error(errorMessage);
  throw new Error(errorMessage);
}

// If we reach here, apiKeyFromVite is a non-empty string and not the literal "undefined".
const ai = new GoogleGenAI({ apiKey: apiKeyFromVite });

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
             errorMessage = "Gemini API Error: The API key is invalid or not authorized. Please check your API key configuration. This might also indicate the key was not correctly passed from the build environment.";
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
