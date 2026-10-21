import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, ArrowRight } from 'lucide-react';
import { useJobPortal } from '../context/JobPortalContext';
import { JobCard } from '../components/JobCard';

export const SavedJobsPage: React.FC = () => {
  const { savedJobs } = useJobPortal();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div>
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-primary-theme" />
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Saved Jobs Watchlist
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Keep track of positions you are interested in. Saved items are preserved in your browser session.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 font-mono tabular-nums">
              {savedJobs.length} {savedJobs.length === 1 ? 'position saved' : 'positions saved'}
            </span>
            <Link
              to="/"
              className="px-4 py-2 btn-primary-theme rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>Explore Roles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Content list */}
        {savedJobs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center space-y-4 max-w-xl mx-auto shadow-2xs">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
              <Bookmark className="w-7 h-7" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Your Watchlist is Empty</h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
              You haven&apos;t saved any jobs yet. When exploring job openings, click the bookmark icon on any job card to save it here for later review.
            </p>
            <div className="pt-2">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 btn-primary-theme rounded-xl text-xs font-semibold transition-colors shadow-sm cursor-pointer"
              >
                <span>Browse Available Jobs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {savedJobs.map((job) => (
                <JobCard key={job.id} job={job} viewMode="grid" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
