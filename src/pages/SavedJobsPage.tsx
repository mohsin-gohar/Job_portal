import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSavedJobs } from '../context/SavedJobsContext';
import { JobCard } from '../components/jobs/JobCard';
import { ApplicationModal } from '../components/jobs/ApplicationModal';
import { QuickViewDrawer } from '../components/jobs/QuickViewDrawer';
import { Job } from '../types/job';
import { Bookmark, Trash2, ArrowLeft, Search, DollarSign, Globe, Award } from 'lucide-react';

export const SavedJobsPage: React.FC = () => {
  const { savedJobs, savedCount, clearSavedJobs } = useSavedJobs();
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);
  const [quickViewJob, setQuickViewJob] = useState<Job | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSavedJobs = savedJobs.filter((job) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.category.toLowerCase().includes(q)
    );
  });

  // Calculate summary metrics
  const avgSalary =
    savedJobs.length > 0
      ? Math.round(
          savedJobs.reduce((acc, j) => acc + (j.salaryMin + j.salaryMax) / 2, 0) /
            savedJobs.length /
            1000
        )
      : 0;

  const remoteCount = savedJobs.filter((j) => j.isRemote).length;

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header Card */}
      <div className="relative bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-soft overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-32 pointer-events-none overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2000&q=80"
            alt=""
            className="w-full h-full object-cover object-center opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/90 to-white" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="text-slate-500 hover:text-slate-900 transition-colors p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80"
                aria-label="Back to jobs directory"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <h1 className="text-2xl font-bold text-slate-950 tracking-tight flex items-center gap-2.5">
                <span>Saved Positions</span>
                <span className="text-sm font-mono tabular-nums text-slate-500 font-normal">
                  ({savedCount})
                </span>
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Keep track of bookmarks, compare compensation packages, and apply when ready.
            </p>
          </div>

          {savedCount > 0 && (
            <button
              type="button"
              onClick={clearSavedJobs}
              className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md border border-rose-200 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Saved List</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Strip */}
      {savedCount > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white p-3.5 rounded-lg border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Award className="w-3.5 h-3.5 text-slate-700" />
              <span>Bookmarked Positions</span>
            </div>
            <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-1">
              {savedCount} Roles
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <DollarSign className="w-3.5 h-3.5 text-slate-700" />
              <span>Average Midpoint Base</span>
            </div>
            <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-1">
              ${avgSalary}k / yr
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Globe className="w-3.5 h-3.5 text-slate-700" />
              <span>Remote Eligible</span>
            </div>
            <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-1">
              {remoteCount} of {savedCount} roles
            </div>
          </div>
        </div>
      )}

      {savedCount === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center max-w-md mx-auto my-12 space-y-4 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Your saved list is empty</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              When browsing positions, click the bookmark icon on any job card to save it for later review.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors shadow-xs"
            >
              Explore Job Listings
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Quick filter within saved jobs */}
          <div className="relative max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter saved roles..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md placeholder:text-slate-400 text-slate-800 focus:outline-hidden focus:border-slate-800"
            />
          </div>

          {/* Saved Job Cards */}
          <div className="space-y-4">
            {filteredSavedJobs.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                No saved jobs match "{searchTerm}".
              </p>
            ) : (
              filteredSavedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApplyClick={(j) => setSelectedJobForApply(j)}
                  onQuickViewClick={(j) => setQuickViewJob(j)}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Quick View Drawer */}
      <QuickViewDrawer
        job={quickViewJob}
        onClose={() => setQuickViewJob(null)}
        onApply={(j) => setSelectedJobForApply(j)}
      />

      {/* Tips */}
      <section className="grid sm:grid-cols-2 gap-4 pt-2">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-1.5">Keep them fresh</h3>
          <p className="text-xs text-slate-600 leading-relaxed">Review saved roles weekly and remove ones that no longer fit to keep your pipeline focused.</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-1.5">Apply early</h3>
          <p className="text-xs text-slate-600 leading-relaxed">Most roles close within two weeks — apply to your top picks before the queue fills.</p>
        </div>
      </section>

      {/* Application Modal */}
      <ApplicationModal
        job={selectedJobForApply}
        isOpen={Boolean(selectedJobForApply)}
        onClose={() => setSelectedJobForApply(null)}
      />
    </div>
  );
};
