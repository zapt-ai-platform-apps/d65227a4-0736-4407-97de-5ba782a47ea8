import React, { useState } from 'react';
import { UrlForm } from './UrlForm';
import { PreviewFrame } from './PreviewFrame';
import { CloneOptions } from './CloneOptions';
import { LoadingIndicator } from '../../../components/LoadingIndicator';
import { ErrorMessage } from '../../../components/ErrorMessage';
import { useWebsiteClone } from '../hooks/useWebsiteClone';

export function WebsiteCloner() {
  const [url, setUrl] = useState('');
  const [options, setOptions] = useState({
    includeStyles: true,
    includeScripts: false,
    includeImages: true
  });
  
  const { 
    clonedContent, 
    isLoading, 
    error, 
    cloneWebsite 
  } = useWebsiteClone();

  const handleSubmit = async (submittedUrl) => {
    setUrl(submittedUrl);
    await cloneWebsite(submittedUrl, options);
  };

  const handleOptionsChange = (newOptions) => {
    setOptions(newOptions);
    if (url) {
      cloneWebsite(url, newOptions);
    }
  };

  return (
    <div className="space-y-6">
      <UrlForm onSubmit={handleSubmit} isLoading={isLoading} />
      
      <CloneOptions 
        options={options} 
        onChange={handleOptionsChange} 
        disabled={isLoading || !url} 
      />
      
      {isLoading && <LoadingIndicator message="Cloning website..." />}
      
      {error && <ErrorMessage message={error} />}
      
      {clonedContent && !isLoading && !error && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          <PreviewFrame content={clonedContent} />
        </div>
      )}
    </div>
  );
}