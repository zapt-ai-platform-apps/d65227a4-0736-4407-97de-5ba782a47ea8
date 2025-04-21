import React, { useState } from 'react';
import { useCloneContext } from '../context/CloneContext';
import { FiLink, FiClipboard, FiSettings } from 'react-icons/fi';
import CloneOptions from './CloneOptions';

function CloneForm() {
  const [url, setUrl] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const { cloneWebsite, cloneOptions, updateCloneOptions, isLoading } = useCloneContext();

  const validateUrl = (value) => {
    try {
      new URL(value);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setIsValid(false);
      return;
    }

    // Check if URL is valid
    const valid = validateUrl(url);
    setIsValid(valid);
    
    if (valid) {
      cloneWebsite(url, cloneOptions);
    }
  };

  const handleChange = (e) => {
    setUrl(e.target.value);
    if (!isValid) {
      setIsValid(true);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setIsValid(validateUrl(text));
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Clone a Website</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="website-url" className="block text-sm font-medium text-gray-700 mb-1">
            Website URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLink className="text-gray-500" />
            </div>
            <input
              type="text"
              id="website-url"
              placeholder="https://example.com"
              value={url}
              onChange={handleChange}
              className={`input-field pl-10 pr-10 ${!isValid ? 'border-red-500 focus:ring-red-500' : ''}`}
            />
            <button 
              type="button"
              onClick={handlePaste}
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
              title="Paste from clipboard"
            >
              <FiClipboard />
            </button>
          </div>
          {!isValid && (
            <p className="mt-1 text-sm text-red-600">
              Please enter a valid URL (e.g., https://example.com)
            </p>
          )}
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <button 
            type="button" 
            onClick={toggleOptions}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
          >
            <FiSettings size={16} />
            <span>{showOptions ? 'Hide Options' : 'Show Options'}</span>
          </button>
        </div>
        
        {showOptions && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
            <CloneOptions 
              options={cloneOptions} 
              onChange={updateCloneOptions} 
              disabled={isLoading}
            />
          </div>
        )}
        
        <button 
          type="submit" 
          className="btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Cloning...' : 'Clone Website'}
        </button>
      </form>
      <div className="mt-4 text-sm text-gray-600">
        <p>Enter a URL to fetch and display a clone of that website.</p>
      </div>
    </div>
  );
}

export default CloneForm;