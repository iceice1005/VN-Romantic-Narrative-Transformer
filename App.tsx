
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { InputArea } from './components/InputArea';
import { OutputArea } from './components/OutputArea';
import { HistoryList } from './components/HistoryList';
import { ModelConfigurator } from './components/ModelConfigurator';
import { PromptEditor } from './components/PromptEditor';
import { ChapterTitleFeature } from './components/ChapterTitleFeature';
import { FetchNovelTocFeature } from './components/FetchNovelTocFeature'; // New Import
import { NovelTocModal } from './components/NovelTocModal'; // New Import
import { transformTextViaGemini, generateChapterTitleViaGemini } from './services/geminiService';
import { TransformationEntry, NovelChapter } from './types'; // Added NovelChapter to types
import { IndeterminateProgressBar } from './components/IndeterminateProgressBar';
import { Modal } from './components/Modal';
import { 
  DEFAULT_SYSTEM_INSTRUCTION, 
  DEFAULT_MODEL_ID, 
  AVAILABLE_TEXT_MODELS,
  DEFAULT_RANDOM_TITLE_WORDS_MIN,
  DEFAULT_RANDOM_TITLE_WORDS_MAX,
  CHAPTER_TITLE_GENERATION_TEMPERATURE,
  DEFAULT_CHAPTER_TITLE_PROMPT_TEMPLATE,
  DEFAULT_NOVEL_TOC_ITEM_CLASS // New constant import
} from './constants';

import TemperatureInfo from './components/info/TemperatureInfo';
import TopPInfo from './components/info/TopPInfo';
import TopKInfo from './components/info/TopKInfo';
import SeedInfo from './components/info/SeedInfo';
import ModelSelectionInfo from './components/info/ModelSelectionInfo';


export type InfoComponentKey = 'temperature' | 'topP' | 'topK' | 'seed' | 'modelSelection';

const infoComponentMap: Record<InfoComponentKey, React.FC> = {
  temperature: TemperatureInfo,
  topP: TopPInfo,
  topK: TopKInfo,
  seed: SeedInfo,
  modelSelection: ModelSelectionInfo,
};

const App: React.FC = () => {
  const [systemInstruction, setSystemInstruction] = useState<string>(DEFAULT_SYSTEM_INSTRUCTION);
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [suggestedChapterTitle, setSuggestedChapterTitle] = useState<string | null>(null); 
  const [titleSuggestionError, setTitleSuggestionError] = useState<string | null>(null); 
  const [history, setHistory] = useState<TransformationEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTransformationDuration, setLastTransformationDuration] = useState<number | null>(null);

  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL_ID);
  const [temperature, setTemperature] = useState<number>(0.5);
  const [topP, setTopP] = useState<number>(0.9);
  const [topK, setTopK] = useState<number>(40);
  const [seed, setSeed] = useState<string>(''); 

  const [isOptionalSettingsOpen, setIsOptionalSettingsOpen] = useState<boolean>(false);
  const [isAnotherFeatureOpen, setIsAnotherFeatureOpen] = useState<boolean>(false); 

  // Chapter Title Suggestion states
  const [isChapterTitleSuggestionEnabled, setIsChapterTitleSuggestionEnabled] = useState<boolean>(false);
  const [maxTitleWords, setMaxTitleWords] = useState<string>('');
  const [chapterTitlePrompt, setChapterTitlePrompt] = useState<string>(DEFAULT_CHAPTER_TITLE_PROMPT_TEMPLATE);

  // Modal State for Info
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [infoModalTitle, setInfoModalTitle] = useState<string>('');
  const [infoModalContent, setInfoModalContent] = useState<React.ReactNode | null>(null);
  const [isInfoModalLoading, setIsInfoModalLoading] = useState<boolean>(false);
  const [infoModalError, setInfoModalError] = useState<string | null>(null);

  // States for Fetch Novel TOC Feature
  const [isFetchNovelTocEnabled, setIsFetchNovelTocEnabled] = useState<boolean>(false);
  const [novelTocUrlInput, setNovelTocUrlInput] = useState<string>('');
  const [novelTocItemClass, setNovelTocItemClass] = useState<string>(DEFAULT_NOVEL_TOC_ITEM_CLASS); // New state for configurable class
  const [isFetchingNovelToc, setIsFetchingNovelToc] = useState<boolean>(false);
  const [fetchNovelTocError, setFetchNovelTocError] = useState<string | null>(null);
  const [novelChapters, setNovelChapters] = useState<NovelChapter[] | null>(null);
  const [isNovelTocModalOpen, setIsNovelTocModalOpen] = useState<boolean>(false);

  // State for InputArea's URL (lifted) and auto-fetch trigger
  const [inputAreaUrl, setInputAreaUrl] = useState<string>('');
  const [autoFetchUrlSignal, setAutoFetchUrlSignal] = useState<number>(0);
  // States for titles fetched by InputArea, to be passed to onTransform
  const [fetchedPrimaryTitleForTransform, setFetchedPrimaryTitleForTransform] = useState<string | null>(null);
  const [fetchedSecondaryTitleForTransform, setFetchedSecondaryTitleForTransform] = useState<string | null>(null);


  const handleOpenInfoModal = useCallback(async (title: string, componentKey: InfoComponentKey) => {
    setInfoModalTitle(title);
    setIsInfoModalOpen(true);
    setIsInfoModalLoading(true); 
    setInfoModalContent(null);
    setInfoModalError(null);

    try {
      const InfoComponent = infoComponentMap[componentKey];
      if (InfoComponent) {
        setInfoModalContent(<InfoComponent />);
      } else {
        throw new Error(`Info component for key "${componentKey}" not found.`);
      }
    } catch (err) {
      console.error('Failed to load modal component:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error loading content.';
      setInfoModalError(errorMessage);
    } finally {
      setIsInfoModalLoading(false);
    }
  }, []);

  const handleCloseInfoModal = useCallback(() => {
    setIsInfoModalOpen(false);
    setInfoModalTitle('');
    setInfoModalContent(null);
    setIsInfoModalLoading(false);
    setInfoModalError(null);
  }, []);

  const handleTransform = useCallback(async (primaryTitle?: string, secondaryTitle?: string) => {
    if (!inputText.trim()) {
      setError('Input text cannot be empty.');
      return;
    }
    if (!systemInstruction.trim()) {
      setError('System instruction cannot be empty.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setOutputText('');
    setSuggestedChapterTitle(null);
    setTitleSuggestionError(null);
    setLastTransformationDuration(null);
    const startTime = performance.now();

    let actualSeedUsed: number;
    const seedInput = seed.trim();

    if (seedInput === '') {
      actualSeedUsed = Math.floor(Math.random() * 2147483647) + 1;
    } else {
      const parsedSeed = parseInt(seedInput, 10);
      if (isNaN(parsedSeed) || !Number.isInteger(parsedSeed)) {
        setError('Seed must be a valid integer or empty.');
        setIsLoading(false);
        return;
      }
      actualSeedUsed = parsedSeed;
    }

    let transformedTextResult: string = '';
    let finalSuggestedChapterTitle: string | undefined = undefined;

    try {
      transformedTextResult = await transformTextViaGemini(
        selectedModel,
        systemInstruction,
        inputText,
        temperature,
        topP,
        topK,
        actualSeedUsed
      );
      const endTime = performance.now();
      const durationMs = endTime - startTime;
      setLastTransformationDuration(durationMs);
setOutputText(transformedTextResult);

      if (isChapterTitleSuggestionEnabled && transformedTextResult.trim() !== '') {
        if (!chapterTitlePrompt.includes('{{narrativeText}}') || !chapterTitlePrompt.includes('{{maxWords}}')) {
          setTitleSuggestionError('Chapter title prompt template is invalid. It must contain {{narrativeText}} and {{maxWords}} placeholders.');
        } else {
          try {
            let titleMaxWordsNum = parseInt(maxTitleWords.trim(), 10);
            if (isNaN(titleMaxWordsNum) || titleMaxWordsNum <= 0) {
              titleMaxWordsNum = Math.floor(Math.random() * (DEFAULT_RANDOM_TITLE_WORDS_MAX - DEFAULT_RANDOM_TITLE_WORDS_MIN + 1)) + DEFAULT_RANDOM_TITLE_WORDS_MIN;
            }
            
            finalSuggestedChapterTitle = await generateChapterTitleViaGemini(
              selectedModel,
              transformedTextResult,
              titleMaxWordsNum,
              CHAPTER_TITLE_GENERATION_TEMPERATURE,
              chapterTitlePrompt
            );
            setSuggestedChapterTitle(finalSuggestedChapterTitle);
          } catch (titleError) {
            console.error('Chapter title suggestion error:', titleError);
            const titleErrorMessage = titleError instanceof Error ? titleError.message : 'Could not generate chapter title.';
            setTitleSuggestionError(titleErrorMessage); 
            finalSuggestedChapterTitle = undefined;
          }
        }
      }

      const currentModelDetails = AVAILABLE_TEXT_MODELS.find(m => m.id === selectedModel);
      const newEntry: TransformationEntry = {
        id: Date.now().toString(),
        originalText: inputText,
        transformedText: transformedTextResult,
        timestamp: new Date(),
        durationMs: durationMs,
        modelId: selectedModel,
        modelName: currentModelDetails ? currentModelDetails.name : selectedModel,
        temperature: temperature,
        topP: topP,
        topK: topK,
        seed: actualSeedUsed,
        primaryTitle: primaryTitle?.trim() ? primaryTitle.trim() : undefined,
        secondaryTitle: secondaryTitle?.trim() ? secondaryTitle.trim() : undefined,
        suggestedChapterTitle: finalSuggestedChapterTitle,
      };
      setHistory(prevHistory => [newEntry, ...prevHistory].slice(0, 10));

    } catch (err) {
      console.error('Transformation error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during transformation.';
      setError(`Failed to transform text: ${errorMessage}`);
      setOutputText(''); 
      setSuggestedChapterTitle(null); 
    } finally {
      setIsLoading(false);
    }
  }, [
      selectedModel, systemInstruction, inputText, temperature, topP, topK, seed, 
      isChapterTitleSuggestionEnabled, maxTitleWords, chapterTitlePrompt
    ]);

  const handleDeleteHistoryItem = useCallback((id: string) => {
    setHistory(prevHistory => prevHistory.filter(entry => entry.id !== id));
  }, []);

  const handleClearAllHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const handleResetSystemInstruction = useCallback(() => {
    setSystemInstruction(DEFAULT_SYSTEM_INSTRUCTION);
  }, []);

  const handleUpdateHistoryItemPrimaryTitle = useCallback((id: string, newPrimaryTitle: string) => {
    setHistory(prevHistory =>
      prevHistory.map(entry =>
        entry.id === id ? { ...entry, primaryTitle: newPrimaryTitle.trim() === '' ? undefined : newPrimaryTitle.trim() } : entry
      )
    );
  }, []);

  const toggleOptionalSettings = () => {
    setIsOptionalSettingsOpen(prev => !prev);
  };

  const toggleAnotherFeature = () => {
    setIsAnotherFeatureOpen(prev => !prev);
  };

  const handleFetchNovelToc = useCallback(async () => {
    if (!novelTocUrlInput.trim()) {
      setFetchNovelTocError('Table of Contents URL cannot be empty.');
      return;
    }
    const effectiveTocItemClass = (novelTocItemClass.trim() || DEFAULT_NOVEL_TOC_ITEM_CLASS);
    if (!effectiveTocItemClass) {
        setFetchNovelTocError('Chapter item class name cannot be empty. Please provide a class name or reset to default.');
        return;
    }

    setIsFetchingNovelToc(true);
    setFetchNovelTocError(null);
    setNovelChapters(null);

    try {
      const response = await fetch(novelTocUrlInput);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}. Ensure the URL is correct, publicly accessible, and CORS allows fetching.`);
      }
      const htmlText = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');
      
      const chapterElements = doc.getElementsByClassName(effectiveTocItemClass);
      const chapters: NovelChapter[] = [];

      if (chapterElements.length === 0) {
          throw new Error(`No elements with class '${effectiveTocItemClass}' were found in the fetched HTML. Possible reasons: \n1. The URL is incorrect or leads to an unexpected page. \n2. The chapter list is loaded by JavaScript after the page loads (this tool can't access dynamic content). \n3. The website blocks direct fetching (CORS issue). \n4. The class name '${effectiveTocItemClass}' is not used for chapter items, or is misspelled. \nPlease verify these points or try a different class name in the 'Advanced Content Features' section.`);
      }

      for (let i = 0; i < chapterElements.length; i++) {
        const element = chapterElements[i];
        const anchor = element.querySelector('a') || (element.tagName === 'A' ? element : null) as HTMLAnchorElement | null;
        
        if (anchor && anchor.hasAttribute('href')) {
          const title = anchor.textContent?.trim() || `Chapter ${i + 1}`;
          let href = anchor.getAttribute('href')!;
          
          try {
            const absoluteUrl = new URL(href, novelTocUrlInput).toString();
            chapters.push({ title, url: absoluteUrl });
          } catch (urlError) {
            console.warn(`Skipping invalid URL '${href}' for chapter '${title}':`, urlError);
          }
        }
      }

      if (chapters.length === 0) { 
          throw new Error(`Elements with class '${effectiveTocItemClass}' were found, but no valid <a> tags with 'href' attributes could be extracted from them. Please check if these elements correctly contain clickable chapter links (anchor tags).`);
      }

      setNovelChapters(chapters);
      setIsNovelTocModalOpen(true);
    } catch (err) {
      console.error('Failed to fetch novel ToC:', err);
      let errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      
      if (err instanceof Error) {
        if (err.message.includes("No elements with class") || 
            err.message.includes("Elements with class") ||
            err.message.includes("HTTP error!")) {
          // Use the specific error message as is
        } else if (err.message.includes('Failed to fetch')) { 
          errorMessage = `Network error or CORS restriction: ${err.message}. Ensure the URL is correct and the site allows access.`;
        } else {
          errorMessage = `Failed to fetch or parse chapters. Original error: ${err.message}`;
        }
      }
      setFetchNovelTocError(errorMessage);
    } finally {
      setIsFetchingNovelToc(false);
    }
  }, [novelTocUrlInput, novelTocItemClass]);

  const handleChapterSelectFromToc = useCallback((chapterUrl: string) => {
    setIsNovelTocModalOpen(false);
    setInputAreaUrl(chapterUrl); 
    setAutoFetchUrlSignal(prev => prev + 1);
    setFetchedPrimaryTitleForTransform(null);
    setFetchedSecondaryTitleForTransform(null);
  }, []);

  const handleInputAreaTitlesFetched = useCallback((primary: string | null, secondary: string | null) => {
    setFetchedPrimaryTitleForTransform(primary);
    setFetchedSecondaryTitleForTransform(secondary);
  }, []);


  return (
    <>
      <div className="min-h-screen flex flex-col items-center p-4 md:p-8 bg-[#fffaf0] text-gray-700">
        <Header />
        <main className="w-full max-w-4xl space-y-8">
          
          <section className="w-full p-6 bg-white shadow-xl rounded-lg border border-gray-300">
            <button
              onClick={toggleOptionalSettings}
              className="w-full flex justify-between items-center text-left focus:outline-none py-2"
              aria-expanded={isOptionalSettingsOpen}
              aria-controls="optional-settings-content"
            >
              <h2 className="text-xl font-semibold text-gray-800" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                Optional Settings
              </h2>
              <span 
                className="text-2xl text-gray-600 transition-transform duration-300 ease-in-out"
                style={{ transform: isOptionalSettingsOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                ▼
              </span>
            </button>
            {isOptionalSettingsOpen && (
              <div id="optional-settings-content" className="mt-6 space-y-6 border-t border-gray-200 pt-6 animate-fadeIn">
                <PromptEditor
                  systemInstruction={systemInstruction}
                  setSystemInstruction={setSystemInstruction}
                  onResetSystemInstruction={handleResetSystemInstruction}
                  isLoading={isLoading}
                />
                <ModelConfigurator
                  selectedModel={selectedModel}
                  setSelectedModel={setSelectedModel}
                  availableModels={AVAILABLE_TEXT_MODELS}
                  temperature={temperature}
                  setTemperature={setTemperature}
                  topP={topP}
                  setTopP={setTopP}
                  topK={topK}
                  setTopK={setTopK}
                  seed={seed}
                  setSeed={setSeed}
                  isLoading={isLoading}
                  onOpenInfoModal={handleOpenInfoModal}
                />
              </div>
            )}
          </section>

          <section className="w-full p-6 bg-white shadow-xl rounded-lg border border-cyan-300">
            <button
              onClick={toggleAnotherFeature}
              className="w-full flex justify-between items-center text-left focus:outline-none py-2"
              aria-expanded={isAnotherFeatureOpen}
              aria-controls="another-feature-content"
            >
              <h2 className="text-xl font-semibold text-cyan-700" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                Advanced Content Features
              </h2>
              <span 
                className="text-2xl text-gray-600 transition-transform duration-300 ease-in-out"
                style={{ transform: isAnotherFeatureOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                ▼
              </span>
            </button>
            {isAnotherFeatureOpen && (
              <div id="another-feature-content" className="mt-6 space-y-6 border-t border-cyan-200 pt-6 animate-fadeIn">
                <ChapterTitleFeature
                  isEnabled={isChapterTitleSuggestionEnabled}
                  setIsEnabled={setIsChapterTitleSuggestionEnabled}
                  maxWords={maxTitleWords}
                  setMaxWords={setMaxTitleWords}
                  chapterTitlePrompt={chapterTitlePrompt}
                  setChapterTitlePrompt={setChapterTitlePrompt}
                  isLoading={isLoading || isFetchingNovelToc}
                />
                <hr className="border-cyan-100 my-6" /> 
                <FetchNovelTocFeature
                  isEnabled={isFetchNovelTocEnabled}
                  setIsEnabled={setIsFetchNovelTocEnabled}
                  novelTocUrl={novelTocUrlInput}
                  setNovelTocUrl={setNovelTocUrlInput}
                  novelTocItemClass={novelTocItemClass}
                  setNovelTocItemClass={setNovelTocItemClass}
                  onFetchToc={handleFetchNovelToc}
                  isLoading={isFetchingNovelToc || isLoading}
                  fetchError={fetchNovelTocError}
                />
              </div>
            )}
          </section>

          <InputArea
            inputText={inputText}
            setInputText={setInputText}
            onTransform={() => handleTransform(fetchedPrimaryTitleForTransform ?? undefined, fetchedSecondaryTitleForTransform ?? undefined)}
            isLoading={isLoading || isFetchingNovelToc}
            urlInputValue={inputAreaUrl}
            onUrlInputChange={setInputAreaUrl}
            autoFetchSignal={autoFetchUrlSignal}
            onTitlesFetched={handleInputAreaTitlesFetched}
          />

          {isLoading && (
            <div className="w-full my-6 flex flex-col items-center" aria-live="polite">
              <p className="text-pink-600 mb-2 text-lg" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                Transforming your narrative...
              </p>
              <IndeterminateProgressBar />
            </div>
          )}
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
          </div>}
          
          {(outputText || suggestedChapterTitle || titleSuggestionError) && !isLoading && (
            <OutputArea 
              transformedText={outputText} 
              durationMs={lastTransformationDuration}
              suggestedChapterTitle={suggestedChapterTitle}
              titleSuggestionError={titleSuggestionError}
            />
          )}
          
          <HistoryList
            history={history}
            onDeleteHistoryItem={handleDeleteHistoryItem}
            onClearAllHistory={handleClearAllHistory}
            onUpdateHistoryItemPrimaryTitle={handleUpdateHistoryItemPrimaryTitle}
          />
        </main>
        <footer className="w-full max-w-4xl text-center py-8 mt-auto text-sm text-gray-500" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
          <p>Powered by Gemini API</p>
          <p className="mt-2 flex items-center justify-center text-lg">
            Base on ideas of&nbsp;
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="w-5 h-5 mr-1 inline-block text-pink-500"
              aria-hidden="true"
            >
              <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
            </svg>
            <span className="text-pink-600 hover:text-pink-700 hover:underline cursor-default">
              <strong>Edit vì đam mê</strong>
            </span>
          </p>
        </footer>
      </div>
      <Modal
        isOpen={isInfoModalOpen}
        onClose={handleCloseInfoModal}
        title={infoModalTitle}
        content={infoModalContent}
        isLoading={isInfoModalLoading}
        error={infoModalError}
      />
      <NovelTocModal
        isOpen={isNovelTocModalOpen}
        onClose={() => setIsNovelTocModalOpen(false)}
        chapters={novelChapters}
        onChapterSelect={handleChapterSelectFromToc}
        isLoading={isFetchingNovelToc} 
        error={fetchNovelTocError} 
        currentTocUrl={novelTocUrlInput}
        configuredNovelTocItemClass={novelTocItemClass.trim() || DEFAULT_NOVEL_TOC_ITEM_CLASS}
      />
    </>
  );
};

export default App;
