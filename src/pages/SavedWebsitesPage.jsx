import React, { useState, useEffect } from 'react';
import { getSavedWebsites, deleteWebsite } from '../utils/storageUtils';
import WebsitePreview from '../components/WebsitePreview';
import { FaSearch } from 'react-icons/fa';

const SavedWebsitesPage = () => {
  const [websites, setWebsites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSavedWebsites();
  }, []);

  const loadSavedWebsites = () => {
    setIsLoading(true);
    const savedWebsites = getSavedWebsites();
    setWebsites(savedWebsites);
    setIsLoading(false);
  };

  const handleDelete = (id) => {
    deleteWebsite(id);
    loadSavedWebsites();
  };

  const filteredWebsites = websites.filter(website => {
    const searchLower = searchTerm.toLowerCase();
    return (
      website.title?.toLowerCase().includes(searchLower) ||
      website.originalUrl.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Saved Websites</h1>
      
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          className="input-field pl-10"
          placeholder="Search saved websites..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredWebsites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWebsites.map(website => (
            <WebsitePreview 
              key={website.id} 
              website={website} 
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : websites.length > 0 ? (
        <div className="card p-8 text-center">
          <p className="text-gray-600">No websites match your search.</p>
        </div>
      ) : (
        <div className="card p-8 text-center">
          <p className="text-gray-600 mb-4">You haven't saved any websites yet.</p>
          <p className="text-sm text-gray-500">
            Clone a website and save it to see it here.
          </p>
        </div>
      )}
    </div>
  );
};

export default SavedWebsitesPage;