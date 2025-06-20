
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full max-w-4xl mb-8 text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-pink-700" style={{ fontFamily: "'Brush Script MT', 'Times New Roman', Times, cursive" }}>
        Romantic Narrative Transformer
      </h1>
      <p className="text-lg text-gray-600 mt-2" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
        Weaving raw words into tales of timeless romance.
      </p>
    </header>
  );
};