import React, { useState, useMemo } from 'react';
import { getCharacterCount, getWordCount } from '../utils/textUtils';

interface OutputAreaProps {
  transformedText: string;
  durationMs?: number | null; // Added to display transformation time
}

export const OutputArea: React.FC<OutputAreaProps> = ({ transformedText, durationMs }) => {
  const [copyButtonText, setCopyButtonText] = useState('Copy Output');

  if (!transformedText) {
    return null;
  }

  const handleCopyOutput = async () => {
    if (!transformedText) return;
    try {
      await navigator.clipboard.writeText(transformedText);
      setCopyButtonText('Copied!');
      setTimeout(() => setCopyButtonText('Copy Output'), 1500);
    } catch (err) {
      console.error('Failed to copy output text: ', err);
      setCopyButtonText('Failed!');
      setTimeout(() => setCopyButtonText('Copy Output'), 1500);
    }
  };

  const charCount = useMemo(() => getCharacterCount(transformedText, true), [transformedText]);
  const charCountNoSpaces = useMemo(() => getCharacterCount(transformedText, false), [transformedText]);
  const wordCount = useMemo(() => getWordCount(transformedText), [transformedText]);

  return (
    <section className="w-full p-6 bg-white shadow-xl rounded-lg border border-purple-200">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-2xl font-semibold text-purple-600" style={{ fontFamily: "'Times New Roman', Times, serif" }}>Romantic Narrative</h2>
        <button
          onClick={handleCopyOutput}
          className="px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
          aria-label="Copy transformed narrative to clipboard"
          style={{ fontFamily: "'Times New Roman', Times, serif" }}
        >
          {copyButtonText}
        </button>
      </div>
      {durationMs !== null && typeof durationMs === 'number' && (
        <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
          Transformation completed in {(durationMs / 1000).toFixed(2)} seconds.
        </p>
      )}
      <div className="text-xs text-gray-500 mb-3" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
        Chars: {charCount} (no spaces: {charCountNoSpaces}) | Words: {wordCount}
      </div>
      <div 
        className="prose prose-lg max-w-none p-3 bg-purple-50 rounded-md max-h-96 overflow-y-auto text-gray-700"
        lang="vi" // Explicitly set language to Vietnamese
        style={{ fontFamily: "'Times New Roman', Times, serif" }}
      >
        <p className="whitespace-pre-wrap">{transformedText}</p>
      </div>
    </section>
  );
};
