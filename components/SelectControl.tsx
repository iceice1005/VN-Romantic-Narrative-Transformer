
import React from 'react';
import { InfoComponentKey } from '../App'; // Import InfoComponentKey

interface SelectOption {
  value: string;
  label: string;
}

interface SelectControlProps {
  id: string;
  label: string;
  value: string;
  setValue: (value: string) => void;
  options: SelectOption[];
  isLoading: boolean;
  helpDocKey: InfoComponentKey; // Renamed from helpDoc, type updated
  onOpenInfoModal: (title: string, componentKey: InfoComponentKey) => void; // Updated prop type
}

export const SelectControl: React.FC<SelectControlProps> = ({
  id,
  label,
  value,
  setValue,
  options,
  isLoading,
  helpDocKey, // Renamed from helpDoc
  onOpenInfoModal,
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        <button
          type="button"
          onClick={() => onOpenInfoModal(`Understanding ${label}`, helpDocKey)} // Use helpDocKey
          className="ml-2 text-xs text-blue-500 hover:text-blue-700 underline focus:outline-none"
          aria-label={`Learn more about ${label}`}
          disabled={isLoading}
        >
          (Learn more)
        </button>
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={isLoading}
        className="w-full p-2.5 border border-green-500 bg-green-50 text-gray-700 rounded-md text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed"
        style={{ fontFamily: "'Times New Roman', Times, serif" }}
        aria-label={`${label} selection`}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
