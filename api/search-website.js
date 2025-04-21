import axios from 'axios';
import Sentry from './_sentry.js';

export default async function handler(req, res) {
  console.log('Received website search request');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  console.log(`Searching for: ${query}`);

  try {
    // We'll use Google's Custom Search JSON API
    const apiKey = process.env.GOOGLE_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
    
    if (!apiKey || !searchEngineId) {
      throw new Error('Search API configuration is missing');
    }

    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: apiKey,
        cx: searchEngineId,
        q: query,
        num: 10 // Number of results to return
      }
    });

    const searchResults = response.data.items.map(item => ({
      title: item.title,
      url: item.link,
      description: item.snippet,
      thumbnail: item.pagemap?.cse_thumbnail?.[0]?.src || null
    }));

    console.log(`Found ${searchResults.length} search results`);
    
    return res.status(200).json({
      results: searchResults
    });
  } catch (error) {
    console.error('Error searching websites:', error);
    Sentry.captureException(error, {
      extra: {
        query,
        errorMessage: error.message,
        errorStack: error.stack,
        errorResponse: error.response?.data,
        errorStatus: error.response?.status,
      }
    });

    return res.status(500).json({ error: 'Failed to search websites' });
  }
}