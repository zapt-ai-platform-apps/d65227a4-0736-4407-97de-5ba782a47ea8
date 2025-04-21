import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CloneForm from './components/CloneForm';
import ClonePreview from './components/ClonePreview';
import CloneHistory from './components/CloneHistory';
import { CloneProvider } from './context/CloneContext';
import ZaptBadge from './components/ZaptBadge';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <CloneProvider>
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
              <CloneForm />
              <CloneHistory />
            </div>
            <div className="lg:col-span-8">
              <ClonePreview />
            </div>
          </div>
        </main>
        <Footer />
        <ZaptBadge />
      </CloneProvider>
    </div>
  );
}