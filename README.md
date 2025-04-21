# Website Cloner

A web application that allows users to clone and preview websites by entering a URL. The app fetches the content of the target website, processes it according to user preferences, and displays a preview.

## Features

- Clone any website by entering its URL
- Configure cloning options:
  - Include/exclude CSS styles
  - Include/exclude JavaScript
  - Include/exclude images
- Preview the cloned website within the application
- Responsive design that works across devices

## How It Works

1. Enter a website URL in the input field
2. Select your cloning preferences
3. Click "Clone Website" to fetch and process the website
4. View the cloned website in the preview panel

## Technical Details

The application uses:
- React for the frontend UI
- Tailwind CSS for styling
- Axios for HTTP requests
- Cheerio for HTML parsing
- Vercel Serverless Functions for backend processing

## Limitations

- Some websites may block scraping or use techniques that prevent proper cloning
- JavaScript functionality in cloned websites may be limited due to security restrictions
- Cross-origin resource sharing (CORS) policies may prevent loading some resources
- Dynamic websites that rely heavily on JavaScript may not render correctly