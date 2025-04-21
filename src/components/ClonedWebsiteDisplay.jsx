import React from 'react';
import parse from 'html-react-parser';

const ClonedWebsiteDisplay = ({ websiteData }) => {
  if (!websiteData || !websiteData.html) {
    return (
      <div className="card p-6 text-center">
        <p className="text-gray-600">No website data available to display.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{websiteData.title || 'Cloned Website'}</h2>
        <a 
          href={websiteData.originalUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          View Original
        </a>
      </div>
      
      <div className="clone-container">
        <iframe
          srcDoc={websiteData.html}
          title="Cloned Website"
          className="w-full h-screen border-0"
          sandbox="allow-same-origin"
        />
      </div>
    </div>
  );
};

export default ClonedWebsiteDisplay;