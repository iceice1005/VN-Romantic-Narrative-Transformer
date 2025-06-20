
import React from 'react';
import { SelectControl } from './SelectControl'; // Import the new component

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
}> = ({ id, label, value, setValue, min, max, step, isLoading, helpDoc, valueFormatter }) => {
  const displayValue = valueFormatter ? valueFormatter(value) : value.toString();
  
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        <a 
          href={`/${helpDoc}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="ml-2 text-xs text-blue-500 hover:text-blue-700 underline"
          aria-label={`Learn more about ${label}`}
        >
          (Learn more)
        </a>
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
                // If user clears the input, reset to min or a sensible default.
                // For now, let's reset to min if it's cleared.
                // Or, consider if current value should be retained until a valid number is typed.
                // For simplicity, if empty, we can choose not to update immediately or set to min.
                // Let's ensure it doesn't crash, and if they type, it updates.
                // If they clear it, and current 'value' is valid, it stays.
                // If they type invalid, it doesn't update.
                return; 
            }
            const numVal = parseFloat(rawValue);
            // Check if it's a number and within bounds.
            // Also, consider precision for step (e.g., 0.01 means up to 2 decimal places)
            if (!isNaN(numVal) && numVal >= min && numVal <= max) {
              // Optionally, round to the step precision if needed, e.g., for 0.01 step
              const precision = step.toString().split('.')[1]?.length || 0;
              setValue(parseFloat(numVal.toFixed(precision)));
            }
          }}
          onBlur={(e) => { // Ensure value is clamped/set correctly on blur
            const numVal = parseFloat(e.target.value);
            if (isNaN(numVal) || numVal < min) setValue(min);
            else if (numVal > max) setValue(max);
            // else it's already set by onChange if valid
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
  }> = ({ id, label, value, setValue, placeholder, isLoading, helpDoc }) => {
    return (
      <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          <a 
            href={`/${helpDoc}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-2 text-xs text-blue-500 hover:text-blue-700 underline"
            aria-label={`Learn more about ${label}`}
          >
            (Learn more)
          </a>
        </label>
        <input
          type="text" // Changed to text to allow empty string and better control parsing
          inputMode="numeric" // Helps mobile browsers show numeric keypad
          pattern="[0-9]*"    // Suggests numeric input, basic validation
          id={id}
          name={id}
          value={value}
          onChange={(e) => {
            const val = e.target.value;
            // Allow empty string or string that is a valid integer representation
            if (val === "" || /^\d+$/.test(val) || /^-?\d+$/.test(val) /* if negative seeds allowed */) {
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
        />
        <ParameterControl
          id="topP"
          label="Top-P (Nucleus Sampling)"
          value={topP}
          setValue={setTopP}
          min={0.01} /* Changed min from 0.0 to 0.01 as TopP=0 can be invalid */
          max={1.0}
          step={0.01}
          isLoading={isLoading}
          helpDoc="topP-info.html"
          valueFormatter={(v) => v.toFixed(2)}
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
          />
        </div>
      </div>
    </section>
  );
};
