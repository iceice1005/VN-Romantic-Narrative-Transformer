
import React, { useState, useMemo, useCallback } from 'react';
import { TransformationEntry } from '../types';
import { getCharacterCount, getWordCount } from '../utils/textUtils';


interface HistoryItemProps {
  entry: TransformationEntry;
  onDelete: (id: string) => void;
  onUpdateTitlePrefix: (id: string, newPrefix: string) => void; // New prop
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ entry, onDelete, onUpdateTitlePrefix }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [originalCopyText, setOriginalCopyText] = useState('Copy Original');
  const [narrativeCopyText, setNarrativeCopyText] = useState('Copy Narrative');

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editableTitlePrefix, setEditableTitlePrefix] = useState(entry.customTitlePrefix || 'Transformation');

  const formattedTimestamp = useMemo(() => 
    new Date(entry.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short', hour12: true })
  , [entry.timestamp]);
  
  const durationText = entry.durationMs ? ` (Took ${(entry.durationMs / 1000).toFixed(2)}s)` : '';

  const originalCharCount = useMemo(() => getCharacterCount(entry.originalText, true), [entry.originalText]);
  const originalCharCountNoSpaces = useMemo(() => getCharacterCount(entry.originalText, false), [entry.originalText]);
  const originalWordCount = useMemo(() => getWordCount(entry.originalText), [entry.originalText]);

  const narrativeCharCount = useMemo(() => getCharacterCount(entry.transformedText, true), [entry.transformedText]);
  const narrativeCharCountNoSpaces = useMemo(() => getCharacterCount(entry.transformedText, false), [entry.transformedText]);
  const narrativeWordCount = useMemo(() => getWordCount(entry.transformedText), [entry.transformedText]);

  const handleCopy = async (textToCopy: string, setTextButton: React.Dispatch<React.SetStateAction<string>>, originalButtonText: string) => {
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setTextButton('Copied!');
      setTimeout(() => setTextButton(originalButtonText), 1500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setTextButton('Failed!');
      setTimeout(() => setTextButton(originalButtonText), 1500);
    }
  };

  const handleTitleEditToggle = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!isEditingTitle) {
      setEditableTitlePrefix(entry.customTitlePrefix || 'Transformation');
    }
    setIsEditingTitle(!isEditingTitle);
  }, [isEditingTitle, entry.customTitlePrefix]);

  const handleTitleSave = useCallback(() => {
    const newPrefix = editableTitlePrefix.trim();
    onUpdateTitlePrefix(entry.id, newPrefix === '' ? 'Transformation' : newPrefix);
    setIsEditingTitle(false);
  }, [editableTitlePrefix, entry.id, onUpdateTitlePrefix]);

  const handleTitleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableTitlePrefix(e.target.value);
  };

  const handleTitleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTitleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleTitleEditToggle(); // Effectively cancels by resetting state
    }
  };
  
  const displayTitlePrefix = entry.customTitlePrefix || "Transformation";

  return (
    <article className="p-5 bg-white shadow-lg rounded-lg border border-indigo-200">
      <header 
        className="flex justify-between items-center"
        style={{ fontFamily: "'Times New Roman', Times, serif" }}
      >
        <div 
          onClick={() => !isEditingTitle && setIsExpanded(!isExpanded)} 
          className="flex-grow cursor-pointer flex items-center min-w-0" // Added min-w-0 for flex truncation
        >
          {isEditingTitle ? (
            <div className="flex items-center flex-grow mr-2">
              <input
                type="text"
                value={editableTitlePrefix}
                onChange={handleTitleInputChange}
                onKeyDown={handleTitleInputKeyDown}
                onBlur={() => setTimeout(handleTitleSave, 100)} // setTimeout to allow button click
                className="text-lg font-medium text-indigo-700 border-b-2 border-indigo-300 focus:border-indigo-500 outline-none flex-grow bg-transparent"
                style={{ fontFamily: "'Times New Roman', Times, serif" }}
                onClick={(e) => e.stopPropagation()} // Prevent header click-to-expand while editing
                autoFocus
                aria-label="Edit history item title prefix"
              />
              <span className="text-lg font-medium text-indigo-700 ml-1">: {formattedTimestamp}</span>
            </div>
          ) : (
            <h3 className="text-lg font-medium text-indigo-700 truncate" title={`${displayTitlePrefix}: ${formattedTimestamp}`}>
              {displayTitlePrefix}: {formattedTimestamp}
              {isExpanded && durationText && <span className="text-sm text-gray-500 ml-2 whitespace-nowrap">{durationText}</span>}
            </h3>
          )}
          {!isEditingTitle && (
            <button
              onClick={handleTitleEditToggle}
              className="p-1 text-indigo-500 hover:text-indigo-700 focus:outline-none ml-2 flex-shrink-0"
              aria-label="Edit title prefix"
              title="Edit title prefix"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          )}
          {isEditingTitle && (
            <div className="flex items-center ml-2 flex-shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); handleTitleSave(); }}
                className="p-1 text-green-500 hover:text-green-700 focus:outline-none"
                aria-label="Save title"
                title="Save title"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleTitleEditToggle(); }}
                className="p-1 text-red-500 hover:text-red-700 focus:outline-none ml-1"
                aria-label="Cancel editing title"
                title="Cancel"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          {!isEditingTitle && (
            <span 
                className="text-indigo-500 text-2xl ml-3 flex-shrink-0"
                onClick={(e) => {e.stopPropagation(); setIsExpanded(!isExpanded);}}
            >
                {isExpanded ? '\u25B2' : '\u25BC'} {/* Up/Down Triangle */}
            </span>
          )}
        </div>
        {!isEditingTitle && (
            <button
            onClick={(e) => {
                e.stopPropagation();
                onDelete(entry.id);
            }}
            className="p-1 text-red-500 hover:text-red-700 focus:outline-none flex-shrink-0"
            aria-label="Delete this history entry"
            title="Delete entry"
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            </button>
        )}
      </header>
      
      {isExpanded && (
        <div className="mt-4 space-y-4" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
          {!durationText && entry.durationMs && ( 
             <p className="text-xs text-gray-500 mb-1">Transformation took {(entry.durationMs / 1000).toFixed(2)}s.</p>
          )}
          
          {(entry.modelName || entry.temperature !== undefined || entry.topP !== undefined || entry.topK !== undefined || entry.seed !== undefined) && (
            <div className="p-3 bg-indigo-50 rounded-md border border-indigo-100">
              <h4 className="font-semibold text-indigo-800 mb-2 text-sm">Model Configuration Used:</h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-gray-700">
                {entry.modelName && <li><strong>Model:</strong> {entry.modelName}</li>}
                {entry.temperature !== undefined && <li><strong>Temperature:</strong> {entry.temperature.toFixed(2)}</li>}
                {entry.topP !== undefined && <li><strong>Top-P:</strong> {entry.topP.toFixed(2)}</li>}
                {entry.topK !== undefined && <li><strong>Top-K:</strong> {entry.topK}</li>}
                {entry.seed !== undefined && <li><strong>Seed:</strong> {entry.seed}</li>}
              </ul>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-semibold text-gray-600">Original Text:</h4>
              <button
                onClick={() => handleCopy(entry.originalText, setOriginalCopyText, 'Copy Original')}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-300 text-xs"
                aria-label="Copy original text to clipboard"
              >
                {originalCopyText}
              </button>
            </div>
            <div className="text-xs text-gray-500 mb-1">
              Chars: {originalCharCount} (no spaces: {originalCharCountNoSpaces}) | Words: {originalWordCount}
            </div>
            <div className="p-3 bg-gray-50 rounded-md max-h-48 overflow-y-auto text-sm text-gray-700 border border-gray-200">
              <p className="whitespace-pre-wrap">{entry.originalText}</p>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-semibold text-pink-600">Romantic Narrative:</h4>
              <button
                onClick={() => handleCopy(entry.transformedText, setNarrativeCopyText, 'Copy Narrative')}
                className="px-3 py-1 bg-pink-100 text-pink-700 rounded-md hover:bg-pink-200 focus:outline-none focus:ring-1 focus:ring-pink-300 text-xs"
                aria-label="Copy transformed narrative to clipboard"
              >
                {narrativeCopyText}
              </button>
            </div>
             <div className="text-xs text-gray-500 mb-1">
              Chars: {narrativeCharCount} (no spaces: {narrativeCharCountNoSpaces}) | Words: {narrativeWordCount}
            </div>
            <div className="p-3 bg-pink-50 rounded-md max-h-60 overflow-y-auto text-sm text-gray-700 border border-pink-200">
              <p className="whitespace-pre-wrap">{entry.transformedText}</p>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};