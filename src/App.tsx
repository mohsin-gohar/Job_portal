/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { JobPortalProvider, useJobPortal } from './context/JobPortalContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { JobDetailPage } from './pages/JobDetailPage';
import { SavedJobsPage } from './pages/SavedJobsPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { PostJobPage } from './pages/PostJobPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ApplicationModal } from './components/ApplicationModal';
import { NotificationToast } from './components/NotificationToast';

const AppContent: React.FC = () => {
  const { activeJobForModal, closeApplyModal } = useJobPortal();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-[var(--color-primary)] selection:text-white">
      {/* Top 3-Zone Navigation Header */}
      <Navbar />

      {/* Main Pages */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/saved" element={<SavedJobsPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/post-job" element={<PostJobPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      {/* Clean Unboxed Footer */}
      <Footer />

      {/* Global Interactive Application Modal with Real Validation */}
      <ApplicationModal job={activeJobForModal} onClose={closeApplyModal} />

      {/* Toast Notification Banner */}
      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <HashRouter>
      <JobPortalProvider>
        <AppContent />
      </JobPortalProvider>
    </HashRouter>
  );
}
