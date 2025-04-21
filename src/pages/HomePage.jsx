import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UrlForm from '../components/UrlForm';
import { getRecentWebsites } from '../utils/storageUtils';
import WebsitePreview from '../components/WebsitePreview';

const HomePage = () => {
  const navigate = useNavigate();
  const [recentWebsites, setRecentWebsites] = useState([]);

  useEffect(() => {
    loadRecentWebsites();
  }, []);

  const loadRecentWebsites = () => {
    const websites = getRecentWebsites();
    setRecentWebsites(websites.slice(0, 3)); // Show only most recent 3
  };

  const handleCloneComplete = (websiteData) => {
    navigate(`/cloned/${websiteData.id}`);
  };

  const handleDelete = (id) => {
    // This will be handled in the WebsitePreview component
    // After deletion, we'll refresh the list
    loadRecentWebsites();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-2">Website Cloner</h1>
        <p className="text-gray-600">Clone any website with precision - capture the look and feel of any web page.</p>
      </div>

      <div className="mb-10">
        <UrlForm onCloneComplete={handleCloneComplete} />
      </div>

      {recentWebsites.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Recently Cloned Websites</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentWebsites.map(website => (
              <WebsitePreview 
                key={website.id} 
                website={website} 
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;