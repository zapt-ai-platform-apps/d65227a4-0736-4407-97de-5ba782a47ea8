import { useState, useCallback } from 'react';
import * as Sentry from '@sentry/browser';

export function useWebsiteClone() {
  const [clonedContent, setClonedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const cloneWebsite = useCallback(async (url, options) => {
    setIsLoading(true);
    setError('');
    
    console.log('Cloning website:', url, 'with options:', options);
    
    try {
      const response = await fetch('/api/clone-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, options }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to clone website');
      }

      const data = await response.json();
      console.log('Website cloned successfully');
      setClonedContent(data.content);
    } catch (err) {
      console.error('Error cloning website:', err);
      Sentry.captureException(err, {
        extra: {
          url,
          options,
        },
      });
      setError(err.message || 'An error occurred while cloning the website');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    clonedContent,
    isLoading,
    error,
    cloneWebsite,
  };
}