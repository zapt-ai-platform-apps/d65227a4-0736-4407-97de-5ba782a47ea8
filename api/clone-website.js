import axios from 'axios';
import * as cheerio from 'cheerio';
import Sentry from './_sentry.js';

export default async function handler(req, res) {
  console.log('Received clone website request');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url, options = {} } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // Set default options
  const cloneOptions = {
    includeScripts: options.includeScripts ?? false,
    includeStyles: options.includeStyles ?? true,
    includeImages: options.includeImages ?? true,
    ...options
  };

  console.log(`Attempting to clone: ${url} with options:`, cloneOptions);

  try {
    // Validate URL
    try {
      new URL(url);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Fetch the target website
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      maxRedirects: 5,
      timeout: 30000, // 30 seconds timeout
    });

    console.log(`Successfully fetched website: ${url}, status: ${response.status}`);

    // Parse the HTML
    const $ = cheerio.load(response.data);

    // Process according to options
    if (!cloneOptions.includeScripts) {
      $('script').remove();
      $('[onclick]').removeAttr('onclick');
      $('[onload]').removeAttr('onload');
      // Remove other event handlers
      $('*').each((i, el) => {
        const element = $(el);
        const attrs = element.attr();
        if (attrs) {
          Object.keys(attrs).forEach(attr => {
            if (attr.startsWith('on')) {
              element.removeAttr(attr);
            }
          });
        }
      });
    }

    if (!cloneOptions.includeStyles) {
      $('style').remove();
      $('link[rel="stylesheet"]').remove();
      $('[style]').removeAttr('style');
    }

    // Fix base URL for the document
    const baseUrl = new URL(url);
    const origin = baseUrl.origin;
    
    // Insert base tag
    $('head').prepend(`<base href="${origin}/">`);

    // Fix relative URLs in various elements
    const fixRelativeUrls = (selector, attribute) => {
      $(selector).each((i, el) => {
        const attrValue = $(el).attr(attribute);
        if (attrValue && !attrValue.startsWith('http') && !attrValue.startsWith('data:') && !attrValue.startsWith('#') && !attrValue.startsWith('//')) {
          try {
            const absoluteUrl = new URL(attrValue, url).href;
            $(el).attr(attribute, absoluteUrl);
          } catch (error) {
            console.warn(`Could not process URL: ${attrValue}`);
          }
        }
      });
    };

    // Fix links
    fixRelativeUrls('a', 'href');
    fixRelativeUrls('link', 'href');
    
    // Handle images based on options
    if (cloneOptions.includeImages) {
      fixRelativeUrls('img', 'src');
      fixRelativeUrls('source', 'src');
      fixRelativeUrls('source', 'srcset');
      fixRelativeUrls('picture source', 'srcset');
    } else {
      $('img').remove();
      $('picture').remove();
      $('video').remove();
      $('svg').remove();
    }

    // Fix form actions
    fixRelativeUrls('form', 'action');
    
    // Fix scripts if they're included
    if (cloneOptions.includeScripts) {
      fixRelativeUrls('script', 'src');
    }

    // Add a banner at the top for context
    $('body').prepend(`
      <div style="position: sticky; top: 0; background-color: #f8f9fa; border-bottom: 1px solid #dee2e6; padding: 8px 16px; z-index: 10000; text-align: center; font-family: Arial, sans-serif;">
        <p style="margin: 0; font-size: 14px;">This is a cloned version of <a href="${url}" target="_blank" style="color: #0d6efd; text-decoration: underline;">${url}</a></p>
      </div>
    `);

    // Add base target="_blank" to make all links open in new tabs
    $('head').append('<base target="_blank">');

    // Add a note about scripts and CSS if they're disabled
    if (!cloneOptions.includeScripts || !cloneOptions.includeStyles) {
      $('body').prepend(`
        <div style="background-color: #fff3cd; color: #856404; padding: 8px 16px; margin-bottom: 16px; border: 1px solid #ffeeba; border-radius: 4px; font-family: Arial, sans-serif;">
          <p style="margin: 0; font-size: 14px;">
            <strong>Note:</strong> 
            ${!cloneOptions.includeStyles ? 'CSS styles have been removed. ' : ''}
            ${!cloneOptions.includeScripts ? 'JavaScript functionality has been disabled. ' : ''}
            This may affect the appearance and functionality of the page.
          </p>
        </div>
      `);
    }

    // Get the updated HTML
    const processedHtml = $.html();

    console.log('Successfully processed website HTML');
    
    return res.status(200).json({
      content: processedHtml,
    });
  } catch (error) {
    console.error('Error cloning website:', error);
    Sentry.captureException(error, {
      extra: {
        url,
        options: cloneOptions,
        errorMessage: error.message,
        errorStack: error.stack,
        errorResponse: error.response?.data,
        errorStatus: error.response?.status,
      }
    });

    // Determine appropriate error message
    let errorMessage = 'Failed to clone website';
    
    if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Could not connect to the website';
    } else if (error.code === 'ETIMEDOUT') {
      errorMessage = 'Connection to the website timed out';
    } else if (error.response) {
      // Server responded with an error status code
      errorMessage = `Website returned an error: ${error.response.status}`;
      if (error.response.status === 403) {
        errorMessage = 'Access to this website is forbidden';
      } else if (error.response.status === 404) {
        errorMessage = 'Website not found';
      }
    }

    return res.status(500).json({ error: errorMessage });
  }
}