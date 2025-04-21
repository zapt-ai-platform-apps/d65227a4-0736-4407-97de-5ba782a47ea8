import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Sentry from '@sentry/browser';

const CloneContext = createContext();

export function CloneProvider({ children }) {
  const [clonedContent, setClonedContent] = useState('');
  const [clonedUrl, setClonedUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [cloneOptions, setCloneOptions] = useState({
    includeStyles: true,
    includeScripts: false,
    includeImages: true
  });

  // Initialize history from localStorage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('cloneHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (err) {
      console.error('Failed to load history from localStorage:', err);
      Sentry.captureException(err, {
        extra: { context: 'Loading clone history from localStorage' }
      });
    }
  }, []);

  // Save history to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('cloneHistory', JSON.stringify(history));
    } catch (err) {
      console.error('Failed to save history to localStorage:', err);
      Sentry.captureException(err, {
        extra: { context: 'Saving clone history to localStorage' }
      });
    }
  }, [history]);

  const cloneWebsite = async (url, options = cloneOptions) => {
    setIsLoading(true);
    setError('');
    setClonedContent('');
    
    try {
      console.log(`Cloning website: ${url} with options:`, options);
      
      // Call our API endpoint
      const response = await fetch('/api/clone-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, options }),
      });
      
      if (!response.ok) {
        let errorData = { error: 'Failed to clone website' };
        try {
          errorData = await response.json();
        } catch (e) {
          // If parsing fails, use status text
          errorData.error = response.statusText || errorData.error;
        }
        
        throw new Error(errorData.error || 'Failed to clone website');
      }
      
      const data = await response.json();
      console.log('Successfully cloned website');
      
      setClonedContent(data.content);
      setClonedUrl(url);
      
      // Add to history
      const newHistoryItem = {
        url,
        timestamp: new Date().toISOString(),
        options: { ...options }
      };
      
      setHistory(prev => {
        // Avoid duplicates by removing any existing entry with the same URL
        const filtered = prev.filter(item => item.url !== url);
        // Add new item at the beginning and limit to 10 items
        return [newHistoryItem, ...filtered].slice(0, 10);
      });
      
    } catch (err) {
      console.error('Error cloning website:', err);
      setError(err.message || 'Failed to clone website');
      
      Sentry.captureException(err, {
        extra: { url, options, context: 'Cloning website' }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateCloneOptions = (newOptions) => {
    setCloneOptions(prev => ({
      ...prev,
      ...newOptions
    }));
  };

  const value = {
    clonedContent,
    clonedUrl,
    isLoading,
    error,
    history,
    cloneOptions,
    cloneWebsite,
    updateCloneOptions
  };

  return (
    <CloneContext.Provider value={value}>
      {children}
    </CloneContext.Provider>
  );
}

export function useCloneContext() {
  const context = useContext(CloneContext);
  if (!context) {
    throw new Error('useCloneContext must be used within a CloneProvider');
  }
  return context;
}