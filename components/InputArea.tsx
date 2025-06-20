import React, { useState, useMemo } from 'react';
import { getCharacterCount, getWordCount } from '../utils/textUtils';

interface InputAreaProps {
  inputText: string;
  setInputText: (text: string) => void;
  onTransform: () => void;
  isLoading: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ inputText, setInputText, onTransform, isLoading }) => {
  const [copyButtonText, setCopyButtonText] = useState('Copy');

  const handleCopy = async () => {
    if (!inputText) return;
    try {
      await navigator.clipboard.writeText(inputText);
      setCopyButtonText('Copied!');
      setTimeout(() => setCopyButtonText('Copy'), 1500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setCopyButtonText('Failed!');
      setTimeout(() => setCopyButtonText('Copy'), 1500);
    }
  };

  const charCount = useMemo(() => getCharacterCount(inputText, true), [inputText]);
  const charCountNoSpaces = useMemo(() => getCharacterCount(inputText, false), [inputText]);
  const wordCount = useMemo(() => getWordCount(inputText), [inputText]);

  return (
    <section className="w-full p-6 bg-white shadow-xl rounded-lg border border-pink-200">
      <h2 className="text-2xl font-semibold mb-4 text-pink-600" style={{ fontFamily: "'Times New Roman', Times, serif" }}>Enter Raw Vietnamese Text</h2>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Paste your raw Vietnamese text here (originally translated from Chinese)..."
        className="w-full h-48 p-3 border border-pink-300 rounded-md focus:ring-2 focus:ring-pink-400 focus:border-pink-400 resize-none placeholder-gray-400 text-gray-700 bg-pink-50"
        disabled={isLoading}
        lang="vi" // Explicitly set language to Vietnamese for input
        aria-label="Raw Vietnamese text input"
        style={{ fontFamily: "'Times New Roman', Times, serif" }}
      />
      <div className="mt-1 text-xs text-gray-500" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
        Chars: {charCount} (no spaces: {charCountNoSpaces}) | Words: {wordCount}
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div> 
          {/* Placeholder for potential future elements on the left */}
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleCopy}
            className="px-6 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
            disabled={isLoading || !inputText}
            aria-label="Copy input text to clipboard"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          >
            {copyButtonText}
          </button>
          <button
            onClick={() => setInputText('')}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50"
            disabled={isLoading || !inputText}
            aria-label="Clear input text"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          >
            Clear
          </button>
          <button
            onClick={onTransform}
            className="px-8 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !inputText.trim()}
            aria-label="Transform text"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          >
            {isLoading ? 'Transforming...' : 'Transform'}
          </button>
        </div>
      </div>
    </section>
  );
};
