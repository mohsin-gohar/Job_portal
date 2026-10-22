import React, { useState, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Bookmark,
  FileCheck,
  Menu,
  X,
  PlusCircle,
  Sparkles,
  TrendingUp,
  Building,
  Users,
  User,
  Mail,
  LayoutDashboard,
  Bell,
  ShieldCheck,
  LogIn,
  LogOut,
  Compass,
  ChevronDown,
} from 'lucide-react';
import { useSavedJobs } from '../../context/SavedJobsContext';
import { useApplication } from '../../context/ApplicationContext';
import { useCandidate } from '../../context/CandidateContext';
import { useAuth } from '../../context/AuthContext';
import { SkillMatcherModal } from '../jobs/SkillMatcherModal';
import { JobAlertModal } from '../jobs/JobAlertModal';

export const Header = memo(() => {
  const location = useLocation();
  const { savedCount } = useSavedJobs();
  const { applications } = useApplication();
  const { candidateSkills } = useCandidate();
  const { user, isAuthenticated, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [skillMatcherOpen, setSkillMatcherOpen] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Left: Brand Monogram & Wordmark */}
            <div className="flex items-center gap-8">
              <Link
                to="/"
                className="flex items-center gap-2.5 shrink-0 group"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-950 text-white flex items-center justify-center font-bold text-sm shadow-xs transition-transform group-hover:scale-105">
                  <span className="tracking-tighter font-extrabold text-white">L</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-950 font-bold text-base tracking-tight">Lumina</span>
                  <span className="text-slate-400 font-medium text-xs">/ Careers</span>
                </div>
              </Link>

              {/* Center: Clean Primary Navigation */}
              <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
                <Link
                  to="/"
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    isActive('/') && location.pathname === '/'
                      ? 'bg-slate-100 text-slate-950 font-semibold'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                  }`}
                >
                  Find Jobs
                </Link>

                <Link
                  to="/explore"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                    isActive('/explore')
                      ? 'bg-slate-100 text-slate-950 font-semibold'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                  }`}
                >
                  <Compass className="w-4 h-4 text-slate-400" />
                  <span>Explore</span>
                </Link>

                <Link
                  to="/companies"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                    isActive('/companies')
                      ? 'bg-slate-100 text-slate-950 font-semibold'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                  }`}
                >
                  <Building className="w-4 h-4 text-slate-400" />
                  <span>Companies</span>
                </Link>

                <Link
                  to="/talent"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                    isActive('/talent')
                      ? 'bg-slate-100 text-slate-950 font-semibold'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                  }`}
                >
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>Talent</span>
                </Link>

                {(user?.role === 'employer' || user?.role === 'admin') && (
                  <div className="relative group">
                    <button
                      type="button"
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${
                        isActive('/ats') || isActive('/post-job')
                          ? 'bg-slate-100 text-slate-950 font-semibold'
                          : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                      }`}
                    >
                      Hiring
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 transition-transform group-hover:rotate-180" />
                    </button>
                    <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                      <div className="min-w-[200px] rounded-xl border border-slate-200 bg-white shadow-card p-1.5">
                        <Link
                          to="/ats"
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActive('/ats')
                              ? 'bg-slate-100 text-slate-950 font-semibold'
                              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                          }`}
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          <span>ATS Dashboard</span>
                        </Link>
                        <Link
                          to="/post-job"
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActive('/post-job')
                              ? 'bg-slate-100 text-slate-950 font-semibold'
                              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                          }`}
                        >
                          <PlusCircle className="w-4 h-4 text-slate-400" />
                          <span>Post a Job</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
                <div className="relative group">
                  <button
                    type="button"
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${
                      isActive('/about') || isActive('/contact')
                        ? 'bg-slate-100 text-slate-950 font-semibold'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                    }`}
                  >
                    Company
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 transition-transform group-hover:rotate-180" />
                  </button>
                  <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                    <div className="min-w-[200px] rounded-xl border border-slate-200 bg-white shadow-card p-1.5">
                      <Link
                        to="/about"
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                          isActive('/about')
                            ? 'bg-slate-100 text-slate-950 font-semibold'
                            : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                        }`}
                      >
                        <Building className="w-4 h-4 text-slate-400" />
                        <span>About Lumina</span>
                      </Link>
                      <Link
                        to="/contact"
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                          isActive('/contact')
                            ? 'bg-slate-100 text-slate-950 font-semibold'
                            : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                        }`}
                      >
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span>Contact</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </nav>
            </div>

            {/* Right: Candidate Tools, Auth & Post Job CTA */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              {/* Match Skills Quick Tool */}
              <button
                type="button"
                onClick={() => setSkillMatcherOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 border border-slate-200/70 rounded-lg transition-colors"
                title="Match Candidate Tech Stack"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Skill Match</span>
                {candidateSkills.length > 0 && (
                  <span className="font-mono tabular-nums text-[10px] font-bold text-white bg-indigo-600 px-1.5 rounded-full">
                    {candidateSkills.length}
                  </span>
                )}
              </button>

              {/* Utility Icons */}
              <div className="flex items-center gap-0.5 border-l border-slate-200/80 pl-2">
                <Link
                  to="/saved"
                  className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors relative"
                  title="Saved Jobs"
                  aria-label="Saved Jobs"
                >
                  <Bookmark className="w-4 h-4" />
                  {savedCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600" />
                  )}
                </Link>

                <Link
                  to="/applications"
                  className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors relative"
                  title="Application Tracker"
                  aria-label="Application Tracker"
                >
                  <FileCheck className="w-4 h-4" />
                  {applications.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600" />
                  )}
                </Link>

                <button
                  type="button"
                  onClick={() => setAlertModalOpen(true)}
                  className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Set Job Alert"
                  aria-label="Set Job Alert"
                >
                  <Bell className="w-4 h-4" />
                </button>
              </div>

              {/* Divider */}
              <span className="h-4 w-px bg-slate-200/80 mx-1" aria-hidden="true" />

              {/* Auth links & Admin Button */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2 text-xs">
                  {user?.role === 'admin' ? (
                    <Link
                      to="/admin"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 text-white font-bold text-xs shadow-xs hover:bg-slate-800 transition-colors"
                      title="Open Admin Dashboard"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Admin Dashboard</span>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-900 font-semibold text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="max-w-[100px] truncate">{user?.name}</span>
                    </div>
                  )}

                  <button
                    onClick={logout}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5 text-slate-400" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-lg shadow-2xs hover:border-slate-300 transition-all"
                  >
                    <LogIn className="w-3.5 h-3.5 text-slate-500" />
                    <span>Sign In</span>
                  </Link>

                  <Link
                    to="/register"
                    className="hidden xl:inline-flex items-center px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-950 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Primary CTA: Post a Job */}
              <Link
                to="/post-job"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs hover:shadow-sm transition-all duration-150 active:scale-[0.98] whitespace-nowrap ml-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Post a Job</span>
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <div className="flex items-center gap-2 lg:hidden">
              <Link
                to="/saved"
                className="p-2 text-slate-600 relative"
                aria-label="View saved jobs"
              >
                <Bookmark className="w-5 h-5" />
                {savedCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600" />
                )}
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 focus:outline-hidden"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2.5">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-md hover:bg-slate-100 text-slate-900"
            >
              <span>Find Jobs</span>
            </Link>

            <Link
              to="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-sm font-semibold rounded-md hover:bg-slate-100 text-slate-900"
            >
              <span className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-slate-500" />
                <span>Explore Careers</span>
              </span>
              <span className="text-xs font-mono text-slate-500">50 roles</span>
            </Link>

            <Link
              to="/companies"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-sm font-semibold rounded-md hover:bg-slate-100 text-slate-900"
            >
              <span className="flex items-center gap-2">
                <Building className="w-4 h-4 text-slate-500" />
                <span>Companies Directory</span>
              </span>
              <span className="text-xs font-mono text-slate-500">30 companies</span>
            </Link>

            <Link
              to="/talent"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-sm font-semibold rounded-md hover:bg-slate-100 text-slate-900"
            >
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-500" />
                <span>Talent CRM Directory</span>
              </span>
              <span className="text-xs font-mono text-slate-500">165+ candidates</span>
            </Link>


<Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-md hover:bg-slate-100 text-slate-900"
            >
              <Sparkles className="w-4 h-4 text-slate-500" />
              <span>About Lumina</span>
            </Link>

            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-md hover:bg-slate-100 text-slate-900"
            >
              <Mail className="w-4 h-4 text-slate-500" />
              <span>Contact Us</span>
            </Link>

            {/* Mobile Admin Dashboard Direct Link - ONLY when authenticated as admin */}
            {isAuthenticated && user?.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3.5 py-2.5 text-xs font-bold rounded-xl bg-slate-950 text-white shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Admin Dashboard Console</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                  Root
                </span>
              </Link>
            )}

            {isAuthenticated ? (
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="px-3 py-1.5 text-xs font-semibold text-slate-800 flex items-center justify-between">
                  <span>Signed in as <strong>{user?.name}</strong></span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                    {user?.role}
                  </span>
                </div>

                {(user?.role === 'employer' || user?.role === 'admin') && (
                  <Link
                    to="/ats"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-900"
                  >
                    <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                    <span>Recruiter ATS Dashboard</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 w-full text-left transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Logout Account</span>
                </button>
              </div>
            ) : (
              <div className="pt-2 grid grid-cols-2 gap-2 border-t border-slate-100">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white shadow-xs transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5 text-white" />
                  <span>Sign In / Login</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 transition-colors"
                >
                  <span>Register</span>
                </Link>
              </div>
            )}

            <Link
              to="/saved"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-100 text-slate-800"
            >
              <span>Saved Jobs</span>
              <span className="text-xs font-mono tabular-nums text-slate-500">
                {savedCount} saved
              </span>
            </Link>

            <Link
              to="/applications"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-100 text-slate-800"
            >
              <span>My Applications</span>
              <span className="text-xs font-mono tabular-nums text-slate-500">
                {applications.length} submitted
              </span>
            </Link>

            <div className="pt-2">
              <Link
                to="/post-job"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post a Job Listing</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Modals */}
      <SkillMatcherModal
        isOpen={skillMatcherOpen}
        onClose={() => setSkillMatcherOpen(false)}
      />
      <JobAlertModal
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
      />
    </>
  );
});
