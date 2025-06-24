
import React from 'react';
import { NovelChapter } from '../types';

interface NovelTocModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: NovelChapter[] | null;
  onChapterSelect: (url: string) => void;
  isLoading: boolean;
  error: string | null;
  currentTocUrl: string; 
  configuredNovelTocItemClass: string; // New prop
}

export const NovelTocModal: React.FC<NovelTocModalProps> = ({
  isOpen,
  onClose,
  chapters,
  onChapterSelect,
  isLoading,
  error,
  currentTocUrl,
  configuredNovelTocItemClass
}) => {
  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleChapterClick = (url: string) => {
    onChapterSelect(url);
    // onClose(); // App.tsx will close the modal via onChapterSelect logic if needed
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="novel-toc-modal-title"
    >
      <div 
        className="bg-floralWhite w-full max-w-2xl max-h-[90vh] rounded-lg shadow-2xl flex flex-col overflow-hidden"
        style={{ fontFamily: "'Times New Roman', Times, serif" }}
      >
        <header className="flex justify-between items-center p-5 border-b border-gray-300 bg-gray-50 rounded-t-lg">
          <div className="min-w-0">
            <h2 id="novel-toc-modal-title" className="text-xl font-semibold text-gray-800 truncate" title="Novel Chapter List">
              Novel Chapter List
            </h2>
            {currentTocUrl && (
                 <p className="text-xs text-gray-500 truncate" title={`Fetched from: ${currentTocUrl}`}>
                    From: <a href={currentTocUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">{currentTocUrl}</a>
                 </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-3xl leading-none font-semibold focus:outline-none ml-4 flex-shrink-0"
            aria-label="Close chapter list modal"
          >
            &times;
          </button>
        </header>
        <main className="p-6 overflow-y-auto flex-grow bg-white">
          {isLoading && (
            <div className="flex justify-center items-center h-32">
              <p className="text-gray-600 text-lg">Loading chapters...</p>
              {/* Consider adding a small spinner here */}
            </div>
          )}
          {error && !isLoading && (
            <div className="text-red-600 text-center p-4 bg-red-50 rounded border border-red-300">
              <p className="font-semibold">Could not load chapters:</p>
              <p className="text-sm whitespace-pre-line">{error}</p> 
              <p className="text-sm mt-2">
                The app attempted to find chapter links using HTML class "<code>{configuredNovelTocItemClass}</code>".
                Please ensure the URL is correct, the page structure matches this expected format (or configure the class name in "Advanced Content Features"), and there are no CORS issues.
              </p>
            </div>
          )}
          {!isLoading && !error && chapters && chapters.length > 0 && (
            <ul className="space-y-2">
              {chapters.map((chapter, index) => (
                <li key={index} className="border-b border-gray-200 last:border-b-0">
                  <button
                    onClick={() => handleChapterClick(chapter.url)}
                    className="w-full text-left py-2 px-3 text-blue-700 hover:bg-pink-50 hover:text-pink-700 rounded transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    title={`Load content from: ${chapter.url}`}
                  >
                    {chapter.title || 'Untitled Chapter'}
                  </button>
                </li>
              ))}
            </ul>
          )}
           {!isLoading && !error && (!chapters || chapters.length === 0) && !error && ( // Added !error here to prevent double message
             <div className="flex justify-center items-center h-32">
                <p className="text-gray-500">No chapters found. This might mean the configured class "<code>{configuredNovelTocItemClass}</code>" didn't yield any valid chapter links, or the page structure is different.</p>
             </div>
           )}
        </main>
        <footer className="p-4 border-t border-gray-300 text-right bg-gray-50 rounded-b-lg">
            <button
                onClick={onClose}
                className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors duration-150"
            >
                Close
            </button>
        </footer>
      </div>
    </div>
  );
};
