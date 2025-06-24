
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { getCharacterCount, getWordCount } from '../utils/textUtils';

interface InputAreaProps {
  inputText: string;
  setInputText: (text: string) => void;
  onTransform: () => void; // Titles are now handled via onTitlesFetched + App state
  isLoading: boolean; // This will be the combined loading state from App.tsx
  urlInputValue: string; // Controlled URL from App.tsx
  onUrlInputChange: (value: string) => void; // To update URL in App.tsx
  autoFetchSignal: number; // Incremented by App.tsx to trigger fetch
  onTitlesFetched: (primary: string | null, secondary: string | null) => void; // Callback for fetched titles
}

const DEFAULT_BOOK_TITLE_ELEMENT_CLASS = 'book-title';
const DEFAULT_CONTENT_CONTAINER_ID = 'bookContentBody';

export const InputArea: React.FC<InputAreaProps> = ({ 
  inputText, 
  setInputText, 
  onTransform, 
  isLoading, // Receives combined loading state from App
  urlInputValue,
  onUrlInputChange,
  autoFetchSignal,
  onTitlesFetched
}) => {
  const [copyButtonText, setCopyButtonText] = useState('Copy');
  const [internalUrlInput, setInternalUrlInput] = useState<string>(urlInputValue);
  const [isFetchingUrl, setIsFetchingUrl] = useState(false); // Local state for URL fetching initiated by this component
  const [fetchUrlError, setFetchUrlError] = useState<string | null>(null);
  
  const [bookTitleElementClass, setBookTitleElementClass] = useState<string>(DEFAULT_BOOK_TITLE_ELEMENT_CLASS);
  const [contentContainerId, setContentContainerId] = useState<string>(DEFAULT_CONTENT_CONTAINER_ID);
  
  // Local states for titles, reported up via onTitlesFetched
  const [localFetchedPrimaryTitle, setLocalFetchedPrimaryTitle] = useState<string | null>(null);
  const [localFetchedSecondaryTitle, setLocalFetchedSecondaryTitle] = useState<string | null>(null);
  const [titleFetchStatusMessage, setTitleFetchStatusMessage] = useState<string | null>(null);

  const [isFetchUrlAdvancedOptionsOpen, setIsFetchUrlAdvancedOptionsOpen] = useState<boolean>(false);

  // Sync prop urlInputValue to internalUrlInput
  useEffect(() => {
    setInternalUrlInput(urlInputValue);
  }, [urlInputValue]);

  const handleUrlFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setInternalUrlInput(newUrl);
    onUrlInputChange(newUrl); // Update App.tsx state
  };

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

  const executeFetchFromUrl = useCallback(async (urlToFetch: string) => {
    if (!urlToFetch.trim()) {
      setFetchUrlError('Please enter a valid URL.');
      return;
    }
    const titleClassToUse = bookTitleElementClass.trim() || DEFAULT_BOOK_TITLE_ELEMENT_CLASS;
    const contentIdToUse = contentContainerId.trim() || DEFAULT_CONTENT_CONTAINER_ID;

    if (!contentIdToUse) {
        setFetchUrlError('Content Container ID cannot be empty. Reset to default or provide a valid ID.');
        return;
    }
     if (!titleClassToUse) {
        setFetchUrlError('Book/Chapter Title Element Class cannot be empty. Reset to default or provide a valid class name.');
        return;
    }

    setIsFetchingUrl(true);
    setFetchUrlError(null);
    setInputText(''); 
    setLocalFetchedPrimaryTitle(null); 
    setLocalFetchedSecondaryTitle(null);
    onTitlesFetched(null, null); // Clear titles in App.tsx
    setTitleFetchStatusMessage(null);

    try {
      const response = await fetch(urlToFetch);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}. Ensure the URL is correct, publicly accessible, and CORS allows fetching.`);
      }
      const htmlText = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');
      
      const titleElements = doc.getElementsByClassName(titleClassToUse);
      let primaryTitleText: string | null = null;
      let secondaryTitleText: string | null = null;
      let statusMsg = "";

      if (titleElements.length > 0) {
          const firstTitleElement = titleElements[0];
          primaryTitleText = firstTitleElement?.textContent?.trim() || null;
          if (primaryTitleText) {
              setLocalFetchedPrimaryTitle(primaryTitleText);
              statusMsg += `Fetched primary title: "${primaryTitleText}". `;
          } else {
              statusMsg += `Primary title element (class: '${titleClassToUse}') found, but text is empty. `;
          }

          if (titleElements.length > 1) {
              const secondTitleElement = titleElements[1];
              secondaryTitleText = secondTitleElement?.textContent?.trim() || null;
              if (secondaryTitleText) {
                  setLocalFetchedSecondaryTitle(secondaryTitleText);
                  statusMsg += `Fetched secondary title: "${secondaryTitleText}".`;
              } else {
                 statusMsg += `Second title element (class: '${titleClassToUse}') found, but text is empty.`;
              }
          } else {
              statusMsg += `Second title element (class: '${titleClassToUse}') not found.`;
          }
      } else {
          statusMsg = `No elements found with class: '${titleClassToUse}'. Using default history titles.`;
      }
      setTitleFetchStatusMessage(statusMsg.trim());
      onTitlesFetched(primaryTitleText, secondaryTitleText); // Report titles to App

      const contentBody = doc.getElementById(contentIdToUse);
      if (!contentBody) {
        setFetchUrlError(`Could not find the content body with ID '${contentIdToUse}' on the page.`);
      } else {
        const paragraphs = contentBody.getElementsByTagName('p');
        if (paragraphs.length === 0) {
           setFetchUrlError(`No paragraph text found within the element with ID '${contentIdToUse}'. The input area remains empty.`);
        } else {
          const extractedTexts = Array.from(paragraphs).map(p => p.textContent?.trim() || '');
          const combinedText = extractedTexts.filter(text => text.length > 0).join('\n\n');
          setInputText(combinedText);
        }
      }

    } catch (err) {
      console.error('Failed to fetch from URL:', err);
      let errorMessage = 'Failed to fetch content from URL. ';
      if (err instanceof Error) {
        errorMessage += err.message;
      } else {
        errorMessage += 'An unknown error occurred.';
      }
      if (errorMessage.includes('Failed to fetch')) {
        errorMessage += " This might be due to network issues, the URL being incorrect, or CORS restrictions preventing client-side fetching.";
      }
      setFetchUrlError(errorMessage);
    } finally {
      setIsFetchingUrl(false);
    }
  }, [setInputText, contentContainerId, bookTitleElementClass, onTitlesFetched]);

  // Effect to trigger fetch when autoFetchSignal changes
  useEffect(() => {
    if (autoFetchSignal > 0 && urlInputValue && urlInputValue.trim() !== '') {
      // Ensure internalUrlInput is synced before fetching, though urlInputValue is the source of truth here.
      if (internalUrlInput !== urlInputValue) {
        setInternalUrlInput(urlInputValue);
      }
      executeFetchFromUrl(urlInputValue);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetchSignal]); // We only want this to run when signal changes, urlInputValue is used directly.
                         // executeFetchFromUrl is memoized so it's a stable dep.

  const charCount = useMemo(() => getCharacterCount(inputText, true), [inputText]);
  const charCountNoSpaces = useMemo(() => getCharacterCount(inputText, false), [inputText]);
  const wordCount = useMemo(() => getWordCount(inputText), [inputText]);

  const toggleFetchUrlAdvancedOptions = () => {
    setIsFetchUrlAdvancedOptionsOpen(prev => !prev);
  };
  
  const combinedIsLoading = isLoading || isFetchingUrl; //isLoading from prop, isFetchingUrl is local for URL fetch button


  return (
    <section className="w-full p-6 bg-white shadow-xl rounded-lg border border-pink-200">
      <h2 className="text-2xl font-semibold mb-4 text-pink-600" style={{ fontFamily: "'Times New Roman', Times, serif" }}>Enter Raw Vietnamese Text</h2>
      
      <div className="mb-6 p-4 border border-pink-100 rounded-md bg-pink-50/50 space-y-4">
        <div>
            <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
            Fetch content from a URL:
            </label>
            <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
             Extracts text from &lt;p&gt; tags within an HTML element and can fetch titles. Customize selectors in "Advanced Options".
            </p>
            <div className="flex items-center space-x-2">
            <input
                type="url"
                id="url-input"
                value={internalUrlInput} // Use internal state for display and direct editing
                onChange={handleUrlFieldChange} // Updates internal and App state
                placeholder="https://example.com/your-story-page"
                className="flex-grow p-2 border border-pink-300 rounded-md focus:ring-2 focus:ring-pink-400 focus:border-pink-400 placeholder-gray-400 text-gray-700 bg-white disabled:bg-gray-100"
                disabled={combinedIsLoading} // Use combined loading state
                aria-label="URL to fetch content from"
                style={{ fontFamily: "'Times New Roman', Times, serif" }}
            />
            <button
                onClick={() => executeFetchFromUrl(internalUrlInput)}
                className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                disabled={combinedIsLoading || !internalUrlInput.trim()} // Use combined loading state
                aria-label="Fetch text from URL"
                style={{ fontFamily: "'Times New Roman', Times, serif" }}
            >
                {isFetchingUrl ? 'Fetching...' : 'Fetch Text'}
            </button>
            </div>
        </div>

        <button
          type="button"
          onClick={toggleFetchUrlAdvancedOptions}
          className="mt-1 text-sm text-pink-500 hover:text-pink-700 focus:outline-none flex items-center"
          aria-expanded={isFetchUrlAdvancedOptionsOpen}
          aria-controls="fetch-advanced-options-content"
          style={{ fontFamily: "'Times New Roman', Times, serif" }}
          disabled={combinedIsLoading} // Disable when any loading is active
        >
          {isFetchUrlAdvancedOptionsOpen ? 'Hide Advanced Options' : 'Show Advanced Options'}
          <svg 
            className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${isFetchUrlAdvancedOptionsOpen ? 'rotate-180' : 'rotate-0'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>

        {isFetchUrlAdvancedOptionsOpen && (
          <div id="fetch-advanced-options-content" className="mt-4 space-y-4 border-t border-pink-200 pt-4 animate-fadeIn">
            <div className="pt-2">
                <label htmlFor="book-title-class-input" className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                    Book/Chapter Title Element Class (defaults to '{DEFAULT_BOOK_TITLE_ELEMENT_CLASS}'):
                </label>
                 <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                 Class name of HTML elements containing titles. Uses 1st found for Name, 2nd for Chapter.
                </p>
                <div className="flex items-center space-x-2">
                <input
                    type="text"
                    id="book-title-class-input"
                    value={bookTitleElementClass}
                    onChange={(e) => setBookTitleElementClass(e.target.value)}
                    placeholder={`e.g., ${DEFAULT_BOOK_TITLE_ELEMENT_CLASS} or chapter-heading-class`}
                    className="flex-grow p-2 border border-pink-300 rounded-md focus:ring-2 focus:ring-pink-400 focus:border-pink-400 placeholder-gray-400 text-gray-700 bg-white disabled:bg-gray-100"
                    disabled={combinedIsLoading} // Use combined loading state
                    aria-label="Book or chapter title element class name"
                    style={{ fontFamily: "'Times New Roman', Times, serif" }}
                />
                <button
                    onClick={() => setBookTitleElementClass(DEFAULT_BOOK_TITLE_ELEMENT_CLASS)}
                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 text-xs whitespace-nowrap"
                    disabled={combinedIsLoading || bookTitleElementClass === DEFAULT_BOOK_TITLE_ELEMENT_CLASS} // Use combined loading state
                    aria-label="Reset book/chapter title element class to default"
                    style={{ fontFamily: "'Times New Roman', Times, serif" }}
                >
                    Reset Class
                </button>
                </div>
            </div>

            <div className="pt-2">
                <label htmlFor="content-id-input" className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                    Content Container ID (defaults to '{DEFAULT_CONTENT_CONTAINER_ID}'):
                </label>
                 <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                 ID of the HTML element containing the main paragraph text to transform.
                </p>
                <div className="flex items-center space-x-2">
                <input
                    type="text"
                    id="content-id-input"
                    value={contentContainerId}
                    onChange={(e) => setContentContainerId(e.target.value)}
                    placeholder={`e.g., ${DEFAULT_CONTENT_CONTAINER_ID} or main-content`}
                    className="flex-grow p-2 border border-pink-300 rounded-md focus:ring-2 focus:ring-pink-400 focus:border-pink-400 placeholder-gray-400 text-gray-700 bg-white disabled:bg-gray-100"
                    disabled={combinedIsLoading} // Use combined loading state
                    aria-label="Content container ID"
                    style={{ fontFamily: "'Times New Roman', Times, serif" }}
                />
                <button
                    onClick={() => setContentContainerId(DEFAULT_CONTENT_CONTAINER_ID)}
                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 text-xs whitespace-nowrap"
                    disabled={combinedIsLoading || contentContainerId === DEFAULT_CONTENT_CONTAINER_ID} // Use combined loading state
                    aria-label="Reset content container ID to default"
                    style={{ fontFamily: "'Times New Roman', Times, serif" }}
                >
                    Reset ID
                </button>
                </div>
            </div>
          </div>
        )}

        {isFetchingUrl && (
          <p className="text-sm text-pink-500 mt-2" aria-live="polite">Attempting to load content from URL...</p>
        )}
        {titleFetchStatusMessage && !isFetchingUrl && (
          <p className={`text-sm mt-2 ${(localFetchedPrimaryTitle || localFetchedSecondaryTitle) ? 'text-green-600' : 'text-orange-500'}`} aria-live="polite" role="status">
            {titleFetchStatusMessage}
          </p>
        )}
        {fetchUrlError && (
          <p className="text-sm text-red-600 mt-2" role="alert" aria-live="assertive">{fetchUrlError}</p>
        )}
      </div>

      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Paste your raw Vietnamese text here, or fetch from a URL above..."
        className="w-full h-48 p-3 border border-pink-300 rounded-md focus:ring-2 focus:ring-pink-400 focus:border-pink-400 resize-none placeholder-gray-400 text-gray-700 bg-pink-50"
        disabled={combinedIsLoading} // Use combined loading state
        lang="vi"
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
            disabled={combinedIsLoading || !inputText} // Use combined loading state
            aria-label="Copy input text to clipboard"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          >
            {copyButtonText}
          </button>
          <button
            onClick={() => {
                setInputText('');
                setLocalFetchedPrimaryTitle(null); 
                setLocalFetchedSecondaryTitle(null);
                onTitlesFetched(null, null); // Clear titles in App
                setTitleFetchStatusMessage(null); 
                setFetchUrlError(null); 
            }}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50"
            disabled={combinedIsLoading || !inputText} // Use combined loading state
            aria-label="Clear input text"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          >
            Clear
          </button>
          <button
            onClick={onTransform} // Call onTransform directly, App.tsx handles passing titles
            className="px-8 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={combinedIsLoading || !inputText.trim()} // Use combined loading state
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
