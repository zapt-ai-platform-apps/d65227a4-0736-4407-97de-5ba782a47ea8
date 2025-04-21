import React from 'react';

export function ZaptBadge() {
  return (
    <div className="flex justify-center">
      <a
        href="https://www.zapt.ai"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-gray-500 hover:text-indigo-600 transition-colors"
      >
        Made on ZAPT
      </a>
    </div>
  );
}