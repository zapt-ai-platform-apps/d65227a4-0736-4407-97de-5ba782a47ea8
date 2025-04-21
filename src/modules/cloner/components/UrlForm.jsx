import React, { useState } from 'react';

export function UrlForm({ onSubmit, isLoading }) {
  const [inputUrl, setInputUrl] = useState('');
  const [validationError, setValidationError] = useState('');

  const validateUrl = (url) => {
    if (!url.trim()) {
      return 'URL is required';
    }
    
    try {
      const parsedUrl = new URL(url);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return 'URL must start with http:// or https://';
      }
      return '';
    } catch (error) {
      return 'Please enter a valid URL';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const error = validateUrl(inputUrl);
    setValidationError(error);
    
    if (!error) {
      onSubmit(inputUrl);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-grow">
          <label htmlFor="website-url" className="sr-only">
            Website URL
          </label>
          <input
            id="website-url"
            type="text"
            value={inputUrl}
            onChange={(e) => {
              setInputUrl(e.target.value);
              if (validationError) setValidationError('');
            }}
            placeholder="Enter website URL (e.g., https://example.com)"
            className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 box-border"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Cloning...' : 'Clone Website'}
        </button>
      </div>
      
      {validationError && (
        <p className="mt-2 text-sm text-red-600">{validationError}</p>
      )}
    </form>
  );
}