import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import GovifyCommandCenter from './components/GovifySmaller';
import GovifyCommsPage from './components/dashboard/GovifyCommsPage';
import GovifyDataPage from './components/dashboard/GovifyDataPage';
import GovifyAppsPage from './components/dashboard/GovifyAppsPage';
import GovifyPeoplePage from './components/dashboard/GovifyPeoplePage';
import GovifyDocumentsPage from './components/dashboard/GovifyDocumentsPage';
import GovifySettingsPage from './components/dashboard/GovifySettingsPage';
import FloatingPineconeChat from './components/dashboard/FloatingPineconeChat';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-surface p-4 overflow-hidden">
        {/* Sidebar Component */}
        <Sidebar />
        
        {/* Main Content Area - Added overflow-hidden here */}
        <div className="flex-1 ml-4 overflow-hidden flex flex-col">
          <Routes>
            <Route path="/dashboard" element={<GovifyCommandCenter />} />
            <Route path="/comms" element={<GovifyCommsPage />} />
            <Route path="/data" element={<GovifyDataPage />} />
            <Route path="/apps" element={<GovifyAppsPage />} />
            <Route path="/people" element={<GovifyPeoplePage />} />
            <Route path="/documents" element={<GovifyDocumentsPage />} />
            <Route path="/settings" element={<GovifySettingsPage />} />
            <Route path="/" element={<GovifyCommandCenter />} />
          </Routes>
        </div>
        
        {/* Nova AI Assistant - Using the new floating bubble chat */}
        <FloatingPineconeChat />
      </div>
    </Router>
  );
}

export default App;