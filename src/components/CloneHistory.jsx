import React from 'react';
import { FiExternalLink, FiClock } from 'react-icons/fi';
import { useCloneContext } from '../context/CloneContext';

function CloneHistory() {
  const { history, cloneWebsite } = useCloneContext();

  if (!history || history.length === 0) {
    return (
      <div className="card p-6">
        <p className="text-gray-500 text-center">No cloning history yet</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Recently Cloned Websites</h2>
      <div className="space-y-3">
        {history.map((item, index) => (
          <div key={index} className="p-3 border rounded hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-blue-600 truncate">{item.url}</h3>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <FiClock className="mr-1" /> 
                  {formatDate(item.timestamp)}
                </div>
              </div>
              <button
                onClick={() => cloneWebsite(item.url, item.options)}
                className="btn-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded cursor-pointer"
              >
                <FiExternalLink className="inline mr-1" /> Clone Again
              </button>
            </div>
            <div className="mt-2 text-xs">
              <span className={`mr-2 px-2 py-1 rounded ${item.options.includeStyles ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                CSS: {item.options.includeStyles ? 'On' : 'Off'}
              </span>
              <span className={`mr-2 px-2 py-1 rounded ${item.options.includeScripts ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                JS: {item.options.includeScripts ? 'On' : 'Off'}
              </span>
              <span className={`mr-2 px-2 py-1 rounded ${item.options.includeImages ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                Images: {item.options.includeImages ? 'On' : 'Off'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CloneHistory;