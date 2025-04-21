import React from 'react';

function ZaptBadge() {
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <a 
        href="https://www.zapt.ai" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-xs font-medium bg-gray-800 text-white px-3 py-1.5 rounded-full shadow-md hover:bg-gray-700 transition-colors"
      >
        Made on ZAPT
      </a>
    </div>
  );
}

export default ZaptBadge;