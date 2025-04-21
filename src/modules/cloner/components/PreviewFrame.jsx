import React, { useRef, useEffect } from 'react';

export function PreviewFrame({ content }) {
  const iframeRef = useRef(null);
  
  useEffect(() => {
    if (iframeRef.current && content) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      
      iframeDoc.open();
      iframeDoc.write(content);
      iframeDoc.close();
      
      // Adjust iframe height to content
      const adjustHeight = () => {
        if (iframe && iframe.contentWindow.document.body) {
          const height = iframe.contentWindow.document.body.scrollHeight;
          if (height > 300) { // Set minimum height
            iframe.style.height = `${height}px`;
          }
        }
      };
      
      // Adjust height once content is loaded
      setTimeout(adjustHeight, 500);
      
      // Add event listener for iframe load 
      iframe.onload = adjustHeight;
    }
  }, [content]);

  return (
    <div className="border rounded-lg shadow-sm overflow-hidden bg-white">
      <div className="bg-gray-100 border-b px-4 py-2 flex items-center">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-sm text-gray-600 ml-4 truncate">
          {content ? 'Cloned Website Preview' : 'No preview available'}
        </div>
      </div>
      <iframe
        ref={iframeRef}
        title="Website Preview"
        className="w-full"
        style={{ height: '600px', border: 'none' }}
        sandbox="allow-same-origin"
      ></iframe>
    </div>
  );
}