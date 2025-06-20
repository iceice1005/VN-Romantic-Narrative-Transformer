
import React from 'react';

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
  helpDoc: string;
}

export const SelectControl: React.FC<SelectControlProps> = ({
  id,
  label,
  value,
  setValue,
  options,
  isLoading,
  helpDoc,
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        <a
          href={helpDoc} // Changed from `/${helpDoc}` to `helpDoc`
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-xs text-blue-500 hover:text-blue-700 underline"
          aria-label={`Learn more about ${label}`}
        >
          (Learn more)
        </a>
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
