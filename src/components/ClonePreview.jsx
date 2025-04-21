import React, { useRef, useEffect, useState } from 'react';
import { useCloneContext } from '../context/CloneContext';
import { Oval } from 'react-loader-spinner';
import { FiMaximize2, FiMinimize2 } from 'react-icons/fi';

function ClonePreview() {
  const { clonedContent, isLoading, error, clonedUrl } = useCloneContext();
  const iframeRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeHeight, setIframeHeight] = useState(600);

  useEffect(() => {
    if (clonedContent && iframeRef.current) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      
      // Clear previous content
      iframeDoc.open();
      iframeDoc.write(clonedContent);
      iframeDoc.close();
      
      // Attempt to adjust iframe height after content loads
      const adjustHeight = () => {
        try {
          if (iframe && iframe.contentWindow.document.body) {
            const height = iframe.contentWindow.document.body.scrollHeight;
            if (height > 300) {
              setIframeHeight(height);
            }
          }
        } catch (err) {
          console.error("Failed to adjust iframe height:", err);
        }
      };
      
      setTimeout(adjustHeight, 500);
      iframe.onload = adjustHeight;
    }
  }, [clonedContent]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const previewClasses = isFullscreen ? 
    "fixed inset-0 z-50 bg-white p-4" : 
    "card";

  const iframeClasses = isFullscreen ?
    "w-full h-[calc(100vh-120px)]" :
    "clone-frame";

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
    <div className={previewClasses}>
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">
          {clonedUrl ? `Preview: ${clonedUrl}` : 'Website Preview'}
        </h2>
        {clonedContent && !isLoading && (
          <button
            onClick={toggleFullscreen}
            className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100 cursor-pointer"
            title={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
          >
            {isFullscreen ? <FiMinimize2 size={20} /> : <FiMaximize2 size={20} />}
          </button>
        )}
      </div>
      
      <div className="clone-preview-container" style={{ height: isFullscreen ? 'calc(100vh - 120px)' : 'auto' }}>
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
            className={iframeClasses}
            style={{ height: iframeHeight }}
            sandbox="allow-same-origin"
          />
        )}
      </div>
      
      {isFullscreen && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={toggleFullscreen}
            className="btn-secondary"
          >
            Exit Fullscreen
          </button>
        </div>
      )}
    </div>
  );
}

export default ClonePreview;