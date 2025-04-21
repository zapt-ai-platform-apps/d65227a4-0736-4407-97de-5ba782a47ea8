import React, { useRef, useEffect } from 'react';
import { useCloneContext } from '../context/CloneContext';
import { Oval } from 'react-loader-spinner';

function ClonePreview() {
  const { clonedContent, isLoading, error, clonedUrl } = useCloneContext();
  const iframeRef = useRef(null);

  useEffect(() => {
    if (clonedContent && iframeRef.current) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      
      // Clear previous content
      iframeDoc.open();
      iframeDoc.write(clonedContent);
      iframeDoc.close();
    }
  }, [clonedContent]);

  if (error) {
    return (
      <div className="card p-6">
        <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-800">{error}</p>
        <p className="mt-4 text-sm text-gray-600">
          Try another URL or check if the website allows external access.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">
          {clonedUrl ? `Preview: ${clonedUrl}` : 'Website Preview'}
        </h2>
      </div>
      
      <div className="clone-preview-container">
        {isLoading && (
          <div className="loading-overlay">
            <Oval
              visible={true}
              height="80"
              width="80"
              color="#3B82F6"
              secondaryColor="#93C5FD"
              ariaLabel="loading-indicator"
              strokeWidth={2}
            />
          </div>
        )}
        
        {!clonedContent && !isLoading ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center p-8">
              <h3 className="text-lg font-medium mb-2">No Website Cloned Yet</h3>
              <p>Enter a URL and click "Clone Website" to see the preview here.</p>
            </div>
          </div>
        ) : (
          <iframe 
            ref={iframeRef}
            title="Cloned Website Preview"
            className="clone-frame"
            sandbox="allow-same-origin"
          />
        )}
      </div>
    </div>
  );
}

export default ClonePreview;