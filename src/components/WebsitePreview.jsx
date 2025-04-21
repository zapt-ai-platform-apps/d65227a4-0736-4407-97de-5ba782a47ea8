import React from 'react';
import { Link } from 'react-router-dom';
import { FaExternalLinkAlt, FaTrash, FaEye } from 'react-icons/fa';

const WebsitePreview = ({ website, onDelete }) => {
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this cloned website?')) {
      onDelete(website.id);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-lg text-blue-600 truncate">{website.title || 'Unknown Site'}</h3>
        <div className="flex gap-2">
          <Link 
            to={`/cloned/${website.id}`}
            className="text-gray-600 hover:text-blue-600"
            title="View cloned website"
          >
            <FaEye />
          </Link>
          <a 
            href={website.originalUrl}
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-600"
            title="Visit original website"
          >
            <FaExternalLinkAlt />
          </a>
          <button
            onClick={handleDelete}
            className="text-gray-600 hover:text-red-600 cursor-pointer"
            title="Delete cloned website"
          >
            <FaTrash />
          </button>
        </div>
      </div>
      
      <div className="text-sm text-gray-600 mb-3 truncate">
        {website.originalUrl}
      </div>
      
      <div className="bg-gray-100 rounded p-2 mb-3 h-24 overflow-hidden text-xs opacity-60">
        <div dangerouslySetInnerHTML={{ __html: website.previewHtml || '<p>No preview available</p>' }} />
      </div>
      
      <div className="text-xs text-gray-500">
        Cloned on: {formatDate(website.createdAt)}
      </div>
    </div>
  );
};

export default WebsitePreview;