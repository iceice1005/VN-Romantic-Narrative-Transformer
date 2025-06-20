
import React from 'react';

export const IndeterminateProgressBar: React.FC = () => {
  return (
    <div 
      className="w-full max-w-md h-3 bg-pink-300 rounded-full overflow-hidden relative animated-progress-bar"
      aria-label="Transformation in progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100} 
      aria-busy="true"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      {/* The ::before pseudo-element (defined in index.html <style>) handles the shimmer animation 
          The background of this div (e.g., bg-pink-300) serves as the track color for the shimmer.
      */}
    </div>
  );
};
