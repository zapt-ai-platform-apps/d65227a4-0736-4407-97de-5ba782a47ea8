# Website Cloner

A web application that allows users to clone websites by providing a URL. The app fetches the website content and displays it within the application, allowing users to save, download, and share cloned websites.

## Features

- Clone any website by entering its URL
- View cloned websites with preserved styling and content
- Save favorite cloned websites for later access
- Download cloned websites as HTML files
- Share cloned websites with others
- Mobile-responsive interface
- Search through saved websites

## Technologies Used

- React.js with Hooks for frontend
- React Router for navigation
- Tailwind CSS for styling
- LocalStorage for client-side data persistence
- Axios for HTTP requests
- Cheerio for HTML parsing
- HTML React Parser for rendering parsed HTML

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`
4. Open your browser to `http://localhost:5173`

## Deployment

This application is configured for deployment on Vercel.

## Storage

Website data is stored in the browser's localStorage. No server-side database is required.

## Security Notes

- Scripts from cloned websites are removed for security reasons
- iframes are also removed to prevent potential security issues
- All external links open in new tabs