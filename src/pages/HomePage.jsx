import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CloneForm from '../components/CloneForm';
import WebsiteSearch from '../components/WebsiteSearch';
import CloneHistory from '../components/CloneHistory';
import { useCloneContext } from '../context/CloneContext';
import { FaSearch, FaLink, FaHistory } from 'react-icons/fa';

const HomePage = () => {
  const navigate = useNavigate();
  const { history, clonedContent, clonedUrl } = useCloneContext();
  const [activeTab, setActiveTab] = useState('direct'); // 'direct', 'search', or 'history'

  // Navigate to the cloned website page when cloning is successful
  useEffect(() => {
    if (clonedContent && clonedUrl) {
      // Extract a valid ID from the URL for the route parameter
      const urlObj = new URL(clonedUrl);
      const id = btoa(urlObj.hostname).replace(/=/g, '');
      navigate(`/cloned/${id}`);
    }
  }, [clonedContent, clonedUrl, navigate]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-2">Website Cloner</h1>
        <p className="text-gray-600">Clone any website with precision - capture the look and feel of any web page.</p>
      </div>

      <div className="mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('direct')}
            className={`px-4 py-2 font-medium text-sm flex items-center cursor-pointer ${
              activeTab === 'direct' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaLink className="mr-2" />
            Direct URL
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2 font-medium text-sm flex items-center cursor-pointer ${
              activeTab === 'search' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaSearch className="mr-2" />
            Search Web
          </button>
          {history.length > 0 && (
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 font-medium text-sm flex items-center cursor-pointer ${
                activeTab === 'history' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaHistory className="mr-2" />
              Recently Cloned
            </button>
          )}
        </div>
      </div>

      <div className="mb-10">
        {activeTab === 'direct' && <CloneForm />}
        {activeTab === 'search' && <WebsiteSearch />}
        {activeTab === 'history' && <CloneHistory />}
      </div>
    </div>
  );
};

export default HomePage;