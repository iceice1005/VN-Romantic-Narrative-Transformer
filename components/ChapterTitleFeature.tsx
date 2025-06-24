
import React from 'react';
import { DEFAULT_CHAPTER_TITLE_PROMPT_TEMPLATE } from '../constants';

interface ChapterTitleFeatureProps {
  isEnabled: boolean;
  setIsEnabled: (value: boolean) => void;
  maxWords: string;
  setMaxWords: (value: string) => void;
  chapterTitlePrompt: string;
  setChapterTitlePrompt: (value: string) => void;
  isLoading: boolean;
}

export const ChapterTitleFeature: React.FC<ChapterTitleFeatureProps> = ({
  isEnabled,
  setIsEnabled,
  maxWords,
  setMaxWords,
  chapterTitlePrompt,
  setChapterTitlePrompt,
  isLoading,
}) => {

  const handleResetPrompt = () => {
    setChapterTitlePrompt(DEFAULT_CHAPTER_TITLE_PROMPT_TEMPLATE);
  };

  return (
    <div className="space-y-4" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="chapter-title-suggestion-enabled"
          checked={isEnabled}
          onChange={(e) => setIsEnabled(e.target.checked)}
          disabled={isLoading}
          className="h-5 w-5 text-pink-600 border-pink-300 rounded focus:ring-pink-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <label
          htmlFor="chapter-title-suggestion-enabled"
          className="ml-2 text-md font-medium text-gray-700 cursor-pointer"
        >
          Chapter Title Suggestion
        </label>
      </div>

      {isEnabled && (
        <div className="animate-fadeIn pl-2 space-y-4">
          <div>
            <label htmlFor="max-title-words" className="block text-sm font-medium text-gray-700 mb-1">
              Max Words for Title:
            </label>
            <input
              type="text"
              id="max-title-words"
              inputMode="numeric"
              pattern="[0-9]*"
              value={maxWords}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || /^\d+$/.test(val)) {
                   setMaxWords(val);
                }
              }}
              placeholder="e.g., 5 (blank for random 3-7)"
              disabled={isLoading}
              className="w-full p-2 border border-pink-400 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 placeholder-gray-400 text-gray-700 bg-pink-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
              aria-describedby="max-title-words-description"
            />
            <p id="max-title-words-description" className="text-xs text-gray-500 mt-1">
              Enter a positive integer. If blank or invalid, a random word count (3-7 words) will be used.
            </p>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="chapter-title-prompt" className="block text-sm font-medium text-gray-700">
                Chapter Title Prompt Template:
              </label>
              <button
                onClick={handleResetPrompt}
                disabled={isLoading}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 text-xs"
                aria-label="Reset chapter title prompt to default"
              >
                Reset Prompt
              </button>
            </div>
            <textarea
              id="chapter-title-prompt"
              value={chapterTitlePrompt}
              onChange={(e) => setChapterTitlePrompt(e.target.value)}
              disabled={isLoading}
              rows={8}
              className="w-full p-2 border border-pink-400 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 placeholder-gray-400 text-gray-700 bg-pink-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm resize-y"
              aria-describedby="chapter-title-prompt-description"
              placeholder="Enter your custom prompt for chapter title generation..."
            />
            <p id="chapter-title-prompt-description" className="text-xs text-gray-500 mt-1">
              Customize the prompt for AI. Must include <code className="bg-pink-100 text-pink-700 p-0.5 rounded">{'{{narrativeText}}'}</code> and <code className="bg-pink-100 text-pink-700 p-0.5 rounded">{'{{maxWords}}'}</code> placeholders.
            </p>
          </div>

        </div>
      )}
    </div>
  );
};
