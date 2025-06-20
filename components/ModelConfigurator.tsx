
import React from 'react';
import { SelectControl } from './SelectControl'; 

interface ModelOption {
  id: string;
  name: string;
}

interface ModelConfiguratorProps {
  selectedModel: string;
  setSelectedModel: (value: string) => void;
  availableModels: ModelOption[];
  temperature: number;
  setTemperature: (value: number) => void;
  topP: number;
  setTopP: (value: number) => void;
  topK: number;
  setTopK: (value: number) => void;
  seed: string;
  setSeed: (value: string) => void;
  isLoading: boolean;
  onOpenInfoModal: (title: string, htmlFilePath: string) => void; // Added prop
}

const ParameterControl: React.FC<{
  id: string;
  label: string;
  value: number;
  setValue: (value: number) => void;
  min: number;
  max: number;
  step: number;
  isLoading: boolean;
  helpDoc: string;
  valueFormatter?: (value: number) => string;
  onOpenInfoModal: (title: string, htmlFilePath: string) => void; // Added prop
}> = ({ id, label, value, setValue, min, max, step, isLoading, helpDoc, valueFormatter, onOpenInfoModal }) => {
  const displayValue = valueFormatter ? valueFormatter(value) : value.toString();
  
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        <button
          type="button"
          onClick={() => onOpenInfoModal(`Understanding ${label}`, helpDoc)}
          className="ml-2 text-xs text-blue-500 hover:text-blue-700 underline focus:outline-none"
          aria-label={`Learn more about ${label}`}
          disabled={isLoading}
        >
          (Learn more)
        </button>
      </label>
      <div className="flex items-center space-x-3">
        <input
          type="range"
          id={id}
          name={id}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => setValue(parseFloat(e.target.value))}
          disabled={isLoading}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: "'Times New Roman', Times, serif" }}
        />
        <input
          type="number"
          value={displayValue}
          onChange={(e) => {
            const rawValue = e.target.value;
            if (rawValue === '') {
                return; 
            }
            const numVal = parseFloat(rawValue);
            if (!isNaN(numVal) && numVal >= min && numVal <= max) {
              const precision = step.toString().split('.')[1]?.length || 0;
              setValue(parseFloat(numVal.toFixed(precision)));
            }
          }}
          onBlur={(e) => { 
            const numVal = parseFloat(e.target.value);
            if (isNaN(numVal) || numVal < min) setValue(min);
            else if (numVal > max) setValue(max);
          }}
          disabled={isLoading}
          className="w-24 p-1.5 border border-green-500 bg-green-600 text-white rounded-md text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent disabled:bg-gray-400 disabled:text-gray-200 disabled:border-gray-300 disabled:cursor-not-allowed text-center"
          style={{ fontFamily: "'Times New Roman', Times, serif" }}
          step={step}
          min={min}
          max={max}
        />
      </div>
    </div>
  );
};

const NumberInputControl: React.FC<{
    id: string;
    label: string;
    value: string; 
    setValue: (value: string) => void;
    placeholder: string;
    isLoading: boolean;
    helpDoc: string;
    onOpenInfoModal: (title: string, htmlFilePath: string) => void; // Added prop
  }> = ({ id, label, value, setValue, placeholder, isLoading, helpDoc, onOpenInfoModal }) => {
    return (
      <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          <button
            type="button"
            onClick={() => onOpenInfoModal(`Understanding ${label}`, helpDoc)}
            className="ml-2 text-xs text-blue-500 hover:text-blue-700 underline focus:outline-none"
            aria-label={`Learn more about ${label}`}
            disabled={isLoading}
          >
            (Learn more)
          </button>
        </label>
        <input
          type="text" 
          inputMode="numeric" 
          pattern="[0-9]*"   
          id={id}
          name={id}
          value={value}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "" || /^\d+$/.test(val) || /^-?\d+$/.test(val)) {
               setValue(val);
            }
          }} 
          placeholder={placeholder}
          disabled={isLoading}
          className="w-full p-2 border border-green-500 bg-green-50 text-gray-700 rounded-md text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed"
          style={{ fontFamily: "'Times New Roman', Times, serif" }}
        />
      </div>
    );
  };


export const ModelConfigurator: React.FC<ModelConfiguratorProps> = ({
  selectedModel,
  setSelectedModel,
  availableModels,
  temperature,
  setTemperature,
  topP,
  setTopP,
  topK,
  setTopK,
  seed,
  setSeed,
  isLoading,
  onOpenInfoModal, // Destructure the new prop
}) => {
  const modelOptions = availableModels.map(model => ({ value: model.id, label: model.name }));

  return (
    <section className="w-full p-6 bg-white shadow-xl rounded-lg border border-green-200">
      <h2 className="text-xl font-semibold mb-6 text-green-700" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
        Advanced Model Configuration
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
        <div className="md:col-span-2 mb-4">
          <SelectControl
            id="modelSelection"
            label="Model"
            value={selectedModel}
            setValue={setSelectedModel}
            options={modelOptions}
            isLoading={isLoading}
            helpDoc="model-selection-info.html"
            onOpenInfoModal={onOpenInfoModal} // Pass prop
          />
        </div>
        <ParameterControl
          id="temperature"
          label="Temperature"
          value={temperature}
          setValue={setTemperature}
          min={0.0}
          max={1.0} 
          step={0.01}
          isLoading={isLoading}
          helpDoc="temperature-info.html"
          valueFormatter={(v) => v.toFixed(2)}
          onOpenInfoModal={onOpenInfoModal} // Pass prop
        />
        <ParameterControl
          id="topP"
          label="Top-P (Nucleus Sampling)"
          value={topP}
          setValue={setTopP}
          min={0.01} 
          max={1.0}
          step={0.01}
          isLoading={isLoading}
          helpDoc="topP-info.html"
          valueFormatter={(v) => v.toFixed(2)}
          onOpenInfoModal={onOpenInfoModal} // Pass prop
        />
        <ParameterControl
          id="topK"
          label="Top-K Sampling"
          value={topK}
          setValue={setTopK}
          min={1}
          max={100} 
          step={1}
          isLoading={isLoading}
          helpDoc="topK-info.html"
          valueFormatter={(v) => v.toFixed(0)}
          onOpenInfoModal={onOpenInfoModal} // Pass prop
        />
        <div className="md:col-span-2">
          <NumberInputControl
            id="seed"
            label="Seed (for reproducible output)"
            value={seed}
            setValue={setSeed}
            placeholder="Enter an integer (or leave blank for random)"
            isLoading={isLoading}
            helpDoc="seed-info.html"
            onOpenInfoModal={onOpenInfoModal} // Pass prop
          />
        </div>
      </div>
    </section>
  );
};
