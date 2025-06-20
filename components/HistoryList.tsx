
import React from 'react';
import { TransformationEntry } from '../types';
import { HistoryItem } from './HistoryItem';

interface HistoryListProps {
  history: TransformationEntry[];
  onDeleteHistoryItem: (id: string) => void;
  onClearAllHistory: () => void;
  onUpdateHistoryItemTitlePrefix: (id: string, newPrefix: string) => void; // Added prop
}

export const HistoryList: React.FC<HistoryListProps> = ({ 
  history, 
  onDeleteHistoryItem, 
  onClearAllHistory,
  onUpdateHistoryItemTitlePrefix 
}) => {
  if (history.length === 0) {
    return (
      <section className="w-full p-6 mt-8 text-center text-gray-500">
        <p style={{ fontFamily: "'Times New Roman', Times, serif" }}>Your transformation history will appear here.</p>
      </section>
    );
  }

  return (
    <section className="w-full mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-indigo-600" style={{ fontFamily: "'Times New Roman', Times, serif" }}>Transformation History</h2>
        <button
          onClick={onClearAllHistory}
          disabled={history.length === 0}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          style={{ fontFamily: "'Times New Roman', Times, serif" }}
          aria-label="Clear all transformation history"
        >
          Clear All History
        </button>
      </div>
      <div className="space-y-6">
        {history.map(entry => (
          <HistoryItem 
            key={entry.id} 
            entry={entry} 
            onDelete={onDeleteHistoryItem} 
            onUpdateTitlePrefix={onUpdateHistoryItemTitlePrefix} // Pass down the new prop
          />
        ))}
      </div>
    </section>
  );
};