import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaBookmark, FaDownload, FaShare } from 'react-icons/fa';
import ClonedWebsiteDisplay from '../components/ClonedWebsiteDisplay';
import { getWebsiteById, saveWebsite } from '../utils/storageUtils';
import * as Sentry from '@sentry/browser';

const ClonedWebsitePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [website, setWebsite] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadWebsite = async () => {
      try {
        setIsLoading(true);
        const data = getWebsiteById(id);
        
        if (!data) {
          setError('Website not found');
          return;
        }
        
        setWebsite(data);
        setSaved(data.saved || false);
      } catch (error) {
        console.error('Error loading cloned website:', error);
        Sentry.captureException(error, {
          extra: { websiteId: id }
        });
        setError('Failed to load the cloned website');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadWebsite();
  }, [id]);

  const handleSave = () => {
    try {
      if (website) {
        const updatedWebsite = { ...website, saved: !saved };
        saveWebsite(updatedWebsite);
        setSaved(!saved);
      }
    } catch (error) {
      console.error('Error saving website:', error);
      Sentry.captureException(error, {
        extra: { websiteId: id, action: 'save' }
      });
    }
  };

  const handleDownload = () => {
    try {
      if (website) {
        // Create a blob with the HTML content
        const blob = new Blob([website.html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        // Create a download link and trigger it
        const a = document.createElement('a');
        a.href = url;
        a.download = `${website.title || 'cloned-website'}.html`;
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading website:', error);
      Sentry.captureException(error, {
        extra: { websiteId: id, action: 'download' }
      });
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: website?.title || 'Cloned Website',
          text: `Check out this cloned website: ${website?.originalUrl}`,
          url: window.location.href,
        });
      } else {
        // Fallback - copy URL to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing website:', error);
      Sentry.captureException(error, {
        extra: { websiteId: id, action: 'share' }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Link to="/" className="btn-primary inline-block">Go Home</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-blue-600 hover:underline"
        >
          <FaArrowLeft className="mr-2" /> Back to Home
        </button>
        
        <div className="flex gap-3">
          <button 
            onClick={handleSave}
            className={`btn-primary flex items-center ${saved ? 'bg-green-600 hover:bg-green-700' : ''}`}
            title={saved ? "Unsave website" : "Save website"}
          >
            <FaBookmark className="mr-2" />
            {saved ? 'Saved' : 'Save'}
          </button>
          
          <button 
            onClick={handleDownload}
            className="btn-primary flex items-center cursor-pointer"
            title="Download HTML"
          >
            <FaDownload className="mr-2" />
            Download
          </button>
          
          <button 
            onClick={handleShare}
            className="btn-primary flex items-center cursor-pointer"
            title="Share"
          >
            <FaShare className="mr-2" />
            Share
          </button>
        </div>
      </div>
      
      <ClonedWebsiteDisplay websiteData={website} />
    </div>
  );
};

export default ClonedWebsitePage;