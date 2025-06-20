import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  htmlContent: string | null;
  isLoading: boolean;
  error: string | null;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, htmlContent, isLoading, error }) => {
  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="bg-floralWhite w-full max-w-3xl max-h-[90vh] rounded-lg shadow-2xl flex flex-col overflow-hidden"
        style={{ fontFamily: "'Times New Roman', Times, serif" }}
      >
        <header className="flex justify-between items-center p-5 border-b border-gray-300 bg-gray-50 rounded-t-lg">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-3xl leading-none font-semibold focus:outline-none"
            aria-label="Close modal"
          >
            &times;
          </button>
        </header>
        <main className="p-6 overflow-y-auto flex-grow bg-white">
          {isLoading && (
            <div className="flex justify-center items-center h-32">
              <p className="text-gray-600 text-lg">Loading content...</p>
            </div>
          )}
          {error && (
            <div className="text-red-600 text-center p-4 bg-red-50 rounded border border-red-300">
              <p className="font-semibold">Could not load content:</p>
              <p className="text-sm">{error}</p>
              <p className="text-sm mt-2">Please ensure the file exists and the path is correct.</p>
            </div>
          )}
          {!isLoading && !error && htmlContent && (
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          )}
           {!isLoading && !error && !htmlContent && (
             <div className="flex justify-center items-center h-32">
                <p className="text-gray-500">No content to display.</p>
             </div>
           )}
        </main>
        <footer className="p-4 border-t border-gray-300 text-right bg-gray-50 rounded-b-lg">
            <button
                onClick={onClose}
                className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors duration-150"
            >
                Close
            </button>
        </footer>
      </div>
    </div>
  );
};
