# Website Cloner

A web application that allows you to clone the appearance and structure of any website by providing its URL. The app fetches the target website's content, processes it to fix relative URLs, and displays the cloned version within the application.

## Features

- Clone any publicly accessible website
- Display the cloned website in a preview panel
- Track history of recently cloned websites
- Mobile responsive design
- PWA support for installation on devices

## How It Works

1. Enter a URL in the input field
2. The application sends a request to a server-side API
3. The API fetches the website's HTML content
4. The content is processed to fix relative URLs and make them absolute
5. The cloned website is displayed in the preview panel

## Technical Details

- React frontend with Tailwind CSS for styling
- Server-side API to bypass CORS restrictions
- Cheerio for HTML parsing and manipulation
- Client-side storage to maintain history of cloned sites

## Usage Considerations

This application is intended for educational purposes only. Please respect copyright laws and the terms of service of websites you clone. Do not use this tool to:

- Impersonate other websites
- Create phishing sites
- Steal content or design without permission
- Violate any laws or terms of service

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build
```

## License

All rights reserved.