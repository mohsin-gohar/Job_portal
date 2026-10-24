import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { JobProvider } from './context/JobContext';
import { SavedJobsProvider } from './context/SavedJobsContext';
import { ApplicationProvider } from './context/ApplicationContext';
import { CandidateProvider } from './context/CandidateContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ErrorBoundary } from './components/common/ErrorBoundary';

const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const JobDetailPage = lazy(() => import('./pages/JobDetailPage').then((m) => ({ default: m.JobDetailPage })));
const SavedJobsPage = lazy(() => import('./pages/SavedJobsPage').then((m) => ({ default: m.SavedJobsPage })));
const ApplicationsPage = lazy(() => import('./pages/ApplicationsPage').then((m) => ({ default: m.ApplicationsPage })));
const PostJobPage = lazy(() => import('./pages/PostJobPage').then((m) => ({ default: m.PostJobPage })));
const CompaniesPage = lazy(() => import('./pages/CompaniesPage').then((m) => ({ default: m.CompaniesPage })));
const CompanyDetailPage = lazy(() => import('./pages/CompanyDetailPage').then((m) => ({ default: m.CompanyDetailPage })));
const TalentPage = lazy(() => import('./pages/TalentPage').then((m) => ({ default: m.TalentPage })));
const AtsDashboardPage = lazy(() => import('./pages/AtsDashboardPage').then((m) => ({ default: m.AtsDashboardPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const ExplorePage = lazy(() => import('./pages/ExplorePage').then((m) => ({ default: m.ExplorePage })));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

const PageFallback = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex items-center justify-center">
    <div className="flex items-center gap-3 text-sm text-slate-500">
      <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
      <span>Loading...</span>
    </div>
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
};

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CandidateProvider>
            <JobProvider>
              <SavedJobsProvider>
                <ApplicationProvider>
                  <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white relative">
                    <ScrollToTop />
                    <a
                      href="#main-content"
                      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-slate-950 focus:text-white focus:rounded-lg focus:shadow-lg"
                    >
                      Skip to main content
                    </a>
                    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[450px] w-[900px] rounded-full bg-slate-900/[0.02] blur-3xl" />
                    </div>
                    <Header />
                    <main id="main-content" className="flex-1" tabIndex={-1}>
                      <ErrorBoundary>
                        <Suspense fallback={<PageFallback />}>
                          <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/explore" element={<ExplorePage />} />
                            <Route path="/jobs/:id" element={<JobDetailPage />} />
                            <Route path="/saved" element={<SavedJobsPage />} />
                            <Route path="/applications" element={<ApplicationsPage />} />
                            <Route path="/post-job" element={<PostJobPage />} />
                            <Route path="/companies" element={<CompaniesPage />} />
                            <Route path="/companies/:id" element={<CompanyDetailPage />} />
                            <Route path="/talent" element={<TalentPage />} />
                            <Route path="/ats" element={<AtsDashboardPage />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboardPage /></ProtectedRoute>} />
                            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                            <Route path="*" element={<NotFoundPage />} />
                          </Routes>
                        </Suspense>
                      </ErrorBoundary>
                    </main>
                    <Footer />
                  </div>
                </ApplicationProvider>
              </SavedJobsProvider>
            </JobProvider>
          </CandidateProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
