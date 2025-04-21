import axios from 'axios';
import cheerio from 'cheerio';
import Sentry from './_sentry.js';

export default async function handler(req, res) {
  console.log('Received request to clone website');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;
  
  if (!url) {
    console.error('Missing URL parameter');
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    console.log(`Fetching website: ${url}`);
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    const html = response.data;
    const $ = cheerio.load(html);
    
    // Extract title
    const title = $('title').text() || 'Untitled Website';
    
    // Process the HTML content
    processHtml($, url);
    
    // Generate a preview (first few hundred characters of body content)
    let previewHtml = $('body').html() || '';
    previewHtml = previewHtml.substring(0, 500);
    
    // Create a unique ID for the cloned website
    const id = `clone_${Date.now()}`;
    
    // Create website data object
    const websiteData = {
      id,
      originalUrl: url,
      title,
      html: $.html(),
      previewHtml,
      createdAt: Date.now(),
      saved: false
    };
    
    console.log(`Website cloned successfully: ${title}`);
    
    return res.status(200).json(websiteData);
  } catch (error) {
    console.error('Error cloning website:', error);
    
    Sentry.captureException(error, {
      extra: {
        url: url,
        errorDetails: error.message
      }
    });
    
    return res.status(500).json({ 
      error: 'Failed to clone website', 
      details: error.message 
    });
  }
}

// Process HTML to make it displayable within our application
function processHtml($, baseUrl) {
  try {
    // Extract base URL for resolving relative paths
    const urlObj = new URL(baseUrl);
    const origin = urlObj.origin;
    const basePath = urlObj.pathname.split('/').slice(0, -1).join('/') + '/';
    
    // Fix relative URLs for images
    $('img').each((i, img) => {
      const src = $(img).attr('src');
      if (src && !src.startsWith('http') && !src.startsWith('data:')) {
        $(img).attr('src', resolveUrl(src, origin, basePath));
      }
    });
    
    // Fix relative URLs for stylesheets
    $('link[rel="stylesheet"]').each((i, link) => {
      const href = $(link).attr('href');
      if (href && !href.startsWith('http')) {
        $(link).attr('href', resolveUrl(href, origin, basePath));
      }
    });
    
    // Fix relative URLs for scripts
    $('script').each((i, script) => {
      const src = $(script).attr('src');
      if (src && !src.startsWith('http')) {
        $(script).attr('src', resolveUrl(src, origin, basePath));
      }
    });
    
    // Remove potentially problematic elements
    $('script').remove(); // Remove all scripts for security
    $('iframe').remove(); // Remove iframes
    $('meta[http-equiv="Content-Security-Policy"]').remove(); // Remove CSP meta tags
    
    // Add base target to make links open in new tabs
    $('head').append('<base target="_blank">');
    
    // Add styles to contain the cloned website
    $('head').append('<style>html, body { margin: 0; padding: 0; height: 100%; width: 100%; overflow-x: hidden; }</style>');
  } catch (error) {
    console.error('Error processing HTML:', error);
    Sentry.captureException(error, {
      extra: { function: 'processHtml', baseUrl }
    });
  }
}

// Helper function to resolve relative URLs
function resolveUrl(url, origin, basePath) {
  if (url.startsWith('/')) {
    return `${origin}${url}`;
  } else {
    return `${origin}${basePath}${url}`;
  }
}