
import React from 'react';
import { DEFAULT_NOVEL_TOC_ITEM_CLASS } from '../constants';

interface FetchNovelTocFeatureProps {
  isEnabled: boolean;
  setIsEnabled: (value: boolean) => void;
  novelTocUrl: string;
  setNovelTocUrl: (value: string) => void;
  novelTocItemClass: string;
  setNovelTocItemClass: (value: string) => void;
  onFetchToc: () => void;
  isLoadingApp: boolean; // Main app loading (e.g., Gemini transform)
  isExtractingLink: boolean; // True when extracting link (e.g., from truyenwikidich)
  isFetchingToc: boolean; // True when fetching ToC content
  fetchError: string | null;
}

export const FetchNovelTocFeature: React.FC<FetchNovelTocFeatureProps> = ({
  isEnabled,
  setIsEnabled,
  novelTocUrl,
  setNovelTocUrl,
  novelTocItemClass,
  setNovelTocItemClass,
  onFetchToc,
  isLoadingApp,
  isExtractingLink,
  isFetchingToc,
  fetchError,
}) => {
  const isOverallLoading = isLoadingApp || isExtractingLink || isFetchingToc;
  let buttonText = 'Fetch Chapters';
  if (isExtractingLink) {
    buttonText = 'Extracting Link...';
  } else if (isFetchingToc) {
    buttonText = 'Fetching Chapters...';
  }

  return (
    <div className="space-y-4" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="fetch-novel-toc-enabled"
          checked={isEnabled}
          onChange={(e) => setIsEnabled(e.target.checked)}
          disabled={isOverallLoading}
          className="h-5 w-5 text-teal-600 border-teal-300 rounded focus:ring-teal-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <label
          htmlFor="fetch-novel-toc-enabled"
          className="ml-2 text-md font-medium text-gray-700 cursor-pointer"
        >
          Fetch Novel Table of Contents
        </label>
      </div>

      {isEnabled && (
        <div className="animate-fadeIn pl-2 space-y-4">
          <p className="text-xs text-gray-500">
            Enter the URL of a novel's table of contents page. The app will try to extract chapter links (from {'<a href="...">'} tags inside elements with the HTML class name configured below). For sites like truyenwikidich.net, it will attempt to extract a direct content link first.
          </p>
          <div>
            <label htmlFor="novel-toc-url-input" className="block text-sm font-medium text-gray-700 mb-1">
              Table of Contents URL:
            </label>
            <div className="flex items-center space-x-2">
                <input
                    type="url"
                    id="novel-toc-url-input"
                    value={novelTocUrl}
                    onChange={(e) => setNovelTocUrl(e.target.value)}
                    placeholder="https://example.com/novel/table-of-contents"
                    disabled={isOverallLoading}
                    className="flex-grow p-2 border border-teal-400 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-gray-400 text-gray-700 bg-teal-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                    aria-label="Novel table of contents URL"
                />
                <button
                    onClick={onFetchToc}
                    disabled={isOverallLoading || !novelTocUrl.trim()}
                    className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                >
                    {buttonText}
                </button>
            </div>
          </div>

          <div className="pt-2">
            <label htmlFor="novel-toc-item-class-input" className="block text-sm font-medium text-gray-700 mb-1">
                Chapter Item Class Name (defaults to '<code>{DEFAULT_NOVEL_TOC_ITEM_CLASS}</code>'):
            </label>
            <p className="text-xs text-gray-500 mb-1">
                The HTML class name of elements containing individual chapter links.
            </p>
            <div className="flex items-center space-x-2">
            <input
                type="text"
                id="novel-toc-item-class-input"
                value={novelTocItemClass}
                onChange={(e) => setNovelTocItemClass(e.target.value)}
                placeholder={`e.g., ${DEFAULT_NOVEL_TOC_ITEM_CLASS} or chapter-link-container`}
                className="flex-grow p-2 border border-teal-400 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-gray-400 text-gray-700 bg-teal-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                disabled={isOverallLoading}
                aria-label="Novel chapter item HTML class name"
            />
            <button
                onClick={() => setNovelTocItemClass(DEFAULT_NOVEL_TOC_ITEM_CLASS)}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 text-xs whitespace-nowrap"
                disabled={isOverallLoading || novelTocItemClass === DEFAULT_NOVEL_TOC_ITEM_CLASS}
                aria-label="Reset chapter item class name to default"
            >
                Reset Class
            </button>
            </div>
          </div>

          {fetchError && (
            <p className="text-sm text-red-600 mt-2 whitespace-pre-line" role="alert">{fetchError}</p>
          )}
        </div>
      )}
    </div>
  );
};
