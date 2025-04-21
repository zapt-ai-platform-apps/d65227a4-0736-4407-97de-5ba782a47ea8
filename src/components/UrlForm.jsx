import React, { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import * as Sentry from '@sentry/browser';

const UrlForm = ({ onCloneComplete }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateUrl = (input) => {
    try {
      // Check if it's a valid URL
      new URL(input);
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate URL
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    // If URL doesn't start with http/https, add https://
    let processedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      processedUrl = `https://${url}`;
    }

    if (!validateUrl(processedUrl)) {
      setError('Please enter a valid URL');
      return;
    }

    try {
      setIsLoading(true);
      console.log('Cloning website:', processedUrl);
      
      const response = await fetch('/api/clone-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: processedUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to clone website');
      }

      const data = await response.json();
      console.log('Clone completed successfully', data);
      
      onCloneComplete(data);
    } catch (error) {
      console.error('Error cloning website:', error);
      Sentry.captureException(error, {
        extra: {
          url: processedUrl,
        },
      });
      setError(error.message || 'An error occurred while cloning the website');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Clone a Website</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="website-url" className="block mb-2 text-sm font-medium text-gray-700">
            Website URL
          </label>
          <input
            id="website-url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL (e.g., example.com)"
            className="input-field"
            disabled={isLoading}
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
        <button
          type="submit"
          className="btn-primary w-full flex items-center justify-center cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Cloning...
            </>
          ) : (
            'Clone Website'
          )}
        </button>
      </form>
    </div>
  );
};

export default UrlForm;