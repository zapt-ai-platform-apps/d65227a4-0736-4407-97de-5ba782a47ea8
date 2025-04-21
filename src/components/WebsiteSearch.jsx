import React, { useState } from 'react';
import { FiSearch, FiGlobe } from 'react-icons/fi';
import { useCloneContext } from '../context/CloneContext';
import ErrorMessage from './ErrorMessage';
import LoadingIndicator from './LoadingIndicator';

const WebsiteSearch = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const { cloneWebsite, cloneOptions } = useCloneContext();

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Please enter a search term');
      return;
    }
    
    try {
      setIsSearching(true);
      setError('');
      setSearchResults([]);
      
      const response = await fetch(`/api/search-website?query=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to search websites');
      }
      
      const data = await response.json();
      setSearchResults(data.results);
      
      if (data.results.length === 0) {
        setError('No websites found matching your search');
      }
    } catch (err) {
      console.error('Error searching websites:', err);
      setError(err.message || 'Failed to search websites');
    } finally {
      setIsSearching(false);
    }
  };

  const handleCloneWebsite = (url) => {
    cloneWebsite(url, cloneOptions);
  };

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Search the Web</h2>
      <form onSubmit={handleSearch}>
        <div className="mb-4">
          <label htmlFor="search-query" className="block text-sm font-medium text-gray-700 mb-1">
            What website are you looking for?
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-500" />
            </div>
            <input
              type="text"
              id="search-query"
              placeholder="Search for websites..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input-field pl-10 box-border"
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          className="btn-primary w-full cursor-pointer"
          disabled={isSearching}
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </form>
      
      {error && <ErrorMessage message={error} />}
      
      {isSearching && <LoadingIndicator />}
      
      {searchResults.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Search Results</h3>
          <div className="space-y-3">
            {searchResults.map((result, index) => (
              <div key={index} className="p-3 border rounded hover:bg-gray-50">
                <h4 className="font-medium">{result.title}</h4>
                <p className="text-sm text-gray-600 mb-2 truncate">{result.url}</p>
                <p className="text-sm text-gray-500 mb-3">{result.description}</p>
                <button
                  onClick={() => handleCloneWebsite(result.url)}
                  className="btn-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded cursor-pointer"
                >
                  <FiGlobe className="inline mr-1" /> Clone this website
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WebsiteSearch;