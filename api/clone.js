import axios from 'axios';
import * as cheerio from 'cheerio';
import Sentry from './_sentry.js';

export default async function handler(req, res) {
  console.log('Clone API called');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    // Validate URL
    try {
      new URL(url);
    } catch (e) {
      return res.status(400).json({ message: 'Invalid URL format' });
    }

    console.log(`Fetching content from: ${url}`);
    
    // Fetch the website content
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      // Important: We need to handle redirects
      maxRedirects: 5,
      timeout: 10000, // 10 seconds timeout
    });

    let html = response.data;
    
    // Parse the HTML to modify relative URLs to absolute
    const $ = cheerio.load(html);
    
    // Fix base URL for the document
    const baseUrl = new URL(url);
    const origin = baseUrl.origin;
    
    // Insert base tag if it doesn't exist
    if (!$('base').length) {
      $('head').prepend(`<base href="${origin}/">`);
    }
    
    // Fix relative URLs in various attributes
    $('[src]').each((_, el) => {
      const src = $(el).attr('src');
      if (src && !src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('//')) {
        $(el).attr('src', new URL(src, url).href);
      }
    });
    
    $('[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('//')) {
        $(el).attr('href', new URL(href, url).href);
      }
    });
    
    // Fix CSS URLs
    $('link[rel="stylesheet"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href && !href.startsWith('http') && !href.startsWith('//')) {
        $(el).attr('href', new URL(href, url).href);
      }
    });
    
    // Convert the document back to HTML
    html = $.html();
    
    // Add a notification that this is a cloned site
    html = html.replace('</body>', `
      <div style="position: fixed; bottom: 10px; right: 10px; background: rgba(0,0,0,0.8); color: white; padding: 10px; border-radius: 5px; z-index: 9999; font-family: Arial, sans-serif;">
        This is a cloned version of <a href="${url}" target="_blank" style="color: #3B82F6;">${url}</a>
      </div>
    </body>`);
    
    console.log('Successfully processed HTML');
    return res.status(200).json({ html });
    
  } catch (error) {
    console.error('Error cloning website:', error);
    
    // Capture detailed error information for debugging
    Sentry.captureException(error, {
      extra: {
        url: req.body?.url,
        errorMessage: error.message,
        errorStack: error.stack,
        errorResponse: error.response?.data,
        errorStatus: error.response?.status,
      }
    });
    
    // Determine appropriate error message
    let message = 'Failed to clone website';
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 403) {
        message = 'This website is blocking access to external requests.';
      } else {
        message = `Server returned ${error.response.status}: ${error.response.statusText}`;
      }
    } else if (error.request) {
      // The request was made but no response was received
      message = 'No response received from the website. It might be unavailable.';
    }
    
    return res.status(500).json({ message });
  }
}