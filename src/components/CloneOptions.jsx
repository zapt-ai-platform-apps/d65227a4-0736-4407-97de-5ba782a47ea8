import React from 'react';
import { FiCode, FiImage, FiFileText } from 'react-icons/fi';

function CloneOptions({ options, onChange, disabled }) {
  const handleChange = (option) => {
    onChange({
      ...options,
      [option]: !options[option]
    });
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">Cloning Options</h3>
      <div className="space-y-2">
        <div className="flex items-center">
          <input
            id="includeStyles"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
            checked={options.includeStyles}
            onChange={() => handleChange('includeStyles')}
            disabled={disabled}
          />
          <label htmlFor="includeStyles" className="ml-2 flex items-center text-sm text-gray-700">
            <FiFileText className="mr-1" />
            Include CSS Styles
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            id="includeScripts"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
            checked={options.includeScripts}
            onChange={() => handleChange('includeScripts')}
            disabled={disabled}
          />
          <label htmlFor="includeScripts" className="ml-2 flex items-center text-sm text-gray-700">
            <FiCode className="mr-1" />
            Include JavaScript
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            id="includeImages"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
            checked={options.includeImages}
            onChange={() => handleChange('includeImages')}
            disabled={disabled}
          />
          <label htmlFor="includeImages" className="ml-2 flex items-center text-sm text-gray-700">
            <FiImage className="mr-1" />
            Include Images
          </label>
        </div>
      </div>
      
      {options.includeScripts && (
        <div className="mt-2 text-xs text-amber-700 bg-amber-50 p-2 rounded">
          <strong>Warning:</strong> Including JavaScript may cause unexpected behavior or errors in the cloned website.
        </div>
      )}
    </div>
  );
}

export default CloneOptions;