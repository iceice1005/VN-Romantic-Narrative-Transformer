
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputArea } from './components/InputArea';
import { OutputArea } from './components/OutputArea';
import { HistoryList } from './components/HistoryList';
import { ModelConfigurator } from './components/ModelConfigurator';
import { PromptEditor } from './components/PromptEditor';
import { transformTextViaGemini } from './services/geminiService';
import { TransformationEntry } from './types';
import { IndeterminateProgressBar } from './components/IndeterminateProgressBar';
import { Modal } from './components/Modal';
import { DEFAULT_SYSTEM_INSTRUCTION, DEFAULT_MODEL_ID, AVAILABLE_TEXT_MODELS } from './constants';
import logo from './logo.svg';
import logo_author from './logo_author.png'; // Import the author logo
// Import Info Components
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

  // Modal State
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [infoModalTitle, setInfoModalTitle] = useState<string>('');
  const [infoModalContent, setInfoModalContent] = useState<React.ReactNode | null>(null); // Changed type
  const [isInfoModalLoading, setIsInfoModalLoading] = useState<boolean>(false);
  const [infoModalError, setInfoModalError] = useState<string | null>(null);


  const handleOpenInfoModal = useCallback(async (title: string, componentKey: InfoComponentKey) => {
    setInfoModalTitle(title);
    setIsInfoModalOpen(true);
    setIsInfoModalLoading(true); // Keep loading state briefly for consistency
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


  const handleTransform = useCallback(async () => {
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

    try {
      const transformed = await transformTextViaGemini(
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
setOutputText(transformed);

      const currentModelDetails = AVAILABLE_TEXT_MODELS.find(m => m.id === selectedModel);

      const newEntry: TransformationEntry = {
        id: Date.now().toString(),
        originalText: inputText,
        transformedText: transformed,
        timestamp: new Date(),
        durationMs: durationMs,
        modelId: selectedModel,
        modelName: currentModelDetails ? currentModelDetails.name : selectedModel,
        temperature: temperature,
        topP: topP,
        topK: topK,
        seed: actualSeedUsed,
        customTitlePrefix: undefined,
      };
      setHistory(prevHistory => [newEntry, ...prevHistory].slice(0, 10));
    } catch (err) {
      console.error('Transformation error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during transformation.';
      setError(`Failed to transform text: ${errorMessage}`);
      setOutputText('');
    } finally {
      setIsLoading(false);
    }
  }, [selectedModel, systemInstruction, inputText, temperature, topP, topK, seed]);

  const handleDeleteHistoryItem = useCallback((id: string) => {
    setHistory(prevHistory => prevHistory.filter(entry => entry.id !== id));
  }, []);

  const handleClearAllHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const handleResetSystemInstruction = useCallback(() => {
    setSystemInstruction(DEFAULT_SYSTEM_INSTRUCTION);
  }, []);

  const handleUpdateHistoryItemTitlePrefix = useCallback((id: string, newPrefix: string) => {
    setHistory(prevHistory =>
      prevHistory.map(entry =>
        entry.id === id ? { ...entry, customTitlePrefix: newPrefix.trim() === '' ? undefined : newPrefix.trim() } : entry
      )
    );
  }, []);

  const toggleOptionalSettings = () => {
    setIsOptionalSettingsOpen(prev => !prev);
  };

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
              <div id="optional-settings-content" className="mt-6 space-y-6 border-t border-gray-200 pt-6">
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

          <InputArea
            inputText={inputText}
            setInputText={setInputText}
            onTransform={handleTransform}
            isLoading={isLoading}
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
          {outputText && !isLoading && <OutputArea transformedText={outputText} durationMs={lastTransformationDuration} />}
          
          <HistoryList
            history={history}
            onDeleteHistoryItem={handleDeleteHistoryItem}
            onClearAllHistory={handleClearAllHistory}
            onUpdateHistoryItemTitlePrefix={handleUpdateHistoryItemTitlePrefix}
          />
        </main>
       <footer className="w-full max-w-4xl text-center py-8 mt-auto text-xl text-gray-500" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
       <p className="mt-2 flex items-center justify-center text-lg"> {/* Increased font size here */}
           Powered by     &nbsp;
 
           <a href="https://github.com/iceice1005"   target="_blank" 
   rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700 hover:scale-110 transition-transform duration-200" style={{display: "flex", alignItems: "center"}}>
             <img
               src={logo_author}
               alt="Avatar"
               style={{
                 width: "50px",          // Điều chỉnh kích thước
                 height: "50px",
                 borderRadius: "50%",     // Bo tròn 100% → hình tròn
                 objectFit: "cover",      // Ảnh không bị méo
                 display: "block",        // Loại bỏ khoảng trống dưới ảnh
               }}
             />
             <strong>IceIce1005</strong> {/* Removed quotes */}
           </a>
           &nbsp; with Germini API
         </p>
         <p className="mt-2 flex items-center justify-center text-lg"> {/* Increased font size here */}
           Inspired by novel translation method of    &nbsp;
 
           <a href="https://tytnovel.xyz/profile/68235138018b5e6aea6b0abf"   target="_blank" 
   rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700 hover:scale-110 transition-transform duration-200" style={{display: "flex", alignItems: "center"}}>
             <img
               src={logo}
               alt="Avatar"
               style={{
                 width: "50px",          // Điều chỉnh kích thước
                 height: "50px",
                 borderRadius: "50%",     // Bo tròn 100% → hình tròn
                 objectFit: "cover",      // Ảnh không bị méo
                 display: "block",        // Loại bỏ khoảng trống dưới ảnh
               }}
             />
             <strong>Edit vì đam mê</strong> {/* Removed quotes */}
           </a>
         </p>
       </footer>
      </div>
      <Modal
        isOpen={isInfoModalOpen}
        onClose={handleCloseInfoModal}
        title={infoModalTitle}
        content={infoModalContent} // Changed from htmlContent to content
        isLoading={isInfoModalLoading}
        error={infoModalError}
      />
    </>
  );
};

export default App;
