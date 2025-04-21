import React from 'react';
import { ZaptBadge } from './components/ZaptBadge';
import { WebsiteCloner } from './modules/cloner/components/WebsiteCloner';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-center text-indigo-600">Website Cloner</h1>
          <p className="text-center text-gray-600 mt-2">
            Clone and preview any website by entering its URL
          </p>
        </header>
        
        <main>
          <WebsiteCloner />
        </main>
        
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <ZaptBadge />
          <p className="mt-2">
            &copy; {new Date().getFullYear()} Website Cloner. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}