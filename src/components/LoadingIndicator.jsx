import React from 'react';

export function LoadingIndicator({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
}