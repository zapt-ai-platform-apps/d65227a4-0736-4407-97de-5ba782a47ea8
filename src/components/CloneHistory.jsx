import React from 'react';
import { useCloneContext } from '../context/CloneContext';
import { FiExternalLink, FiClock } from 'react-icons/fi';

function CloneHistory() {
  const { history, cloneWebsite } = useCloneContext();

  if (!history || history.length === 0) {
    return null;
  }

  return (
    <div className="card p-6">
      <div className="flex items-center mb-4">
        <FiClock className="text-gray-500 mr-2" />
        <h2 className="text-xl font-bold text-gray-800">Recent Clones</h2>
      </div>
      
      <ul className="divide-y divide-gray-200">
        {history.map((item, index) => (
          <li key={index} className="py-3">
            <div className="flex justify-between items-center">
              <div className="flex-1 truncate">
                <button 
                  onClick={() => cloneWebsite(item.url)}
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium truncate max-w-full inline-block"
                  title={item.url}
                >
                  {item.url}
                </button>
                <p className="text-xs text-gray-500">
                  {new Date(item.timestamp).toLocaleString()}
                </p>
              </div>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-gray-500 hover:text-gray-700"
                title="Open original site"
              >
                <FiExternalLink />
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CloneHistory;