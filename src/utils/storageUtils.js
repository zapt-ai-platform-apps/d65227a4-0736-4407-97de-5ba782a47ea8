import * as Sentry from '@sentry/browser';

const STORAGE_KEY = 'cloned_websites';

// Helper to get all websites from localStorage
const getAllWebsites = () => {
  try {
    const websitesJson = localStorage.getItem(STORAGE_KEY);
    return websitesJson ? JSON.parse(websitesJson) : [];
  } catch (error) {
    console.error('Error getting websites from storage:', error);
    Sentry.captureException(error, {
      extra: { action: 'getAllWebsites' }
    });
    return [];
  }
};

// Helper to save all websites to localStorage
const saveAllWebsites = (websites) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(websites));
  } catch (error) {
    console.error('Error saving websites to storage:', error);
    Sentry.captureException(error, {
      extra: { action: 'saveAllWebsites' }
    });
    throw error;
  }
};

// Save a website to localStorage
export const saveWebsite = (website) => {
  try {
    const websites = getAllWebsites();
    const existingIndex = websites.findIndex(w => w.id === website.id);
    
    if (existingIndex >= 0) {
      websites[existingIndex] = { ...website, updatedAt: Date.now() };
    } else {
      websites.push({ ...website, createdAt: Date.now(), updatedAt: Date.now() });
    }
    
    saveAllWebsites(websites);
    return website;
  } catch (error) {
    console.error('Error saving website:', error);
    Sentry.captureException(error, {
      extra: { action: 'saveWebsite', websiteId: website.id }
    });
    throw error;
  }
};

// Get all websites
export const getAllClonedWebsites = () => {
  return getAllWebsites();
};

// Get saved websites (marked as saved)
export const getSavedWebsites = () => {
  try {
    const websites = getAllWebsites();
    return websites.filter(website => website.saved === true);
  } catch (error) {
    console.error('Error getting saved websites:', error);
    Sentry.captureException(error, {
      extra: { action: 'getSavedWebsites' }
    });
    return [];
  }
};

// Get recent websites
export const getRecentWebsites = () => {
  try {
    const websites = getAllWebsites();
    return websites.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Error getting recent websites:', error);
    Sentry.captureException(error, {
      extra: { action: 'getRecentWebsites' }
    });
    return [];
  }
};

// Get website by ID
export const getWebsiteById = (id) => {
  try {
    const websites = getAllWebsites();
    return websites.find(website => website.id === id) || null;
  } catch (error) {
    console.error('Error getting website by ID:', error);
    Sentry.captureException(error, {
      extra: { action: 'getWebsiteById', websiteId: id }
    });
    return null;
  }
};

// Delete website
export const deleteWebsite = (id) => {
  try {
    const websites = getAllWebsites();
    const filteredWebsites = websites.filter(website => website.id !== id);
    saveAllWebsites(filteredWebsites);
  } catch (error) {
    console.error('Error deleting website:', error);
    Sentry.captureException(error, {
      extra: { action: 'deleteWebsite', websiteId: id }
    });
    throw error;
  }
};