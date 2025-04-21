import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ClonedWebsitePage from './pages/ClonedWebsitePage';
import SavedWebsitesPage from './pages/SavedWebsitesPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="cloned/:id" element={<ClonedWebsitePage />} />
          <Route path="saved" element={<SavedWebsitesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <a 
        href="https://www.zapt.ai" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="zapt-badge"
      >
        Made on ZAPT
      </a>
    </div>
  );
}