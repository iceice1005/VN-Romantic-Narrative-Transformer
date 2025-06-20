// src/utils/textUtils.ts

/**
 * Calculates the number of characters in a string.
 * @param text The input string.
 * @param includeSpaces Whether to include spaces in the count. Defaults to true.
 * @returns The character count.
 */
export const getCharacterCount = (text: string, includeSpaces: boolean = true): number => {
  if (!text) return 0;
  if (includeSpaces) {
    return text.length;
  }
  return text.replace(/\s/g, '').length;
};

/**
 * Calculates the number of words in a string.
 * Words are determined by splitting the string by spaces and counting non-empty segments.
 * @param text The input string.
 * @returns The word count.
 */
export const getWordCount = (text: string): number => {
  if (!text.trim()) return 0;
  // Split by one or more whitespace characters and filter out empty strings
  return text.split(/\s+/).filter(word => word.length > 0).length;
};
