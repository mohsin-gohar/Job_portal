import React, { useState, useRef, useEffect } from 'react';
import { useJobs } from '../context/JobContext';
import { useCandidate } from '../context/CandidateContext';
import { JobCard } from '../components/jobs/JobCard';
import { JobFilters } from '../components/jobs/JobFilters';
import { Pagination } from '../components/jobs/Pagination';
import { JobSkeleton } from '../components/jobs/JobSkeleton';
import { EmptyState } from '../components/jobs/EmptyState';
import { ErrorState } from '../components/jobs/ErrorState';
import { ApplicationModal } from '../components/jobs/ApplicationModal';
import { QuickViewDrawer } from '../components/jobs/QuickViewDrawer';
import { SkillMatcherModal } from '../components/jobs/SkillMatcherModal';
import { Job } from '../types/job';
import {
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  MapPin,
  Sparkles,
  LayoutGrid,
  List as ListIcon,
  X,
  Briefcase,
  TrendingUp,
  Code2,
  Cpu,
  Compass,
  Palette,
  CheckCircle2,
  Filter,
} from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const {
    jobs,
    loading,
    error,
    pagination,
    filters,
    activeFilterCount,
    updateFilters,
    resetFilters,
    setPage,
    setItemsPerPage,
    refetchJobs,
  } = useJobs();

  const { candidateSkills } = useCandidate();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);
  const [quickViewJob, setQuickViewJob] = useState<Job | null>(null);
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Cmd/Ctrl+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSkillTagClick = (skill: string) => {
    updateFilters({ search: skill });
  };

  const disciplines = [
    { label: 'All Roles', category: 'All' },
    { label: 'Engineering', category: 'Engineering' },
    { label: 'Data & AI', category: 'Data & AI' },
    { label: 'Product', category: 'Product' },
    { label: 'Design', category: 'Design' },
    { label: 'Operations', category: 'Operations' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200/90 pt-12 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>50 Verified Opportunities</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>100% Transparent Compensation</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
                Explore Tech Positions
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                Discover curated engineering, AI/ML, product, and design roles at vetted technology organizations. Filter by tech stack, salary bands, and remote eligibility.
              </p>
            </div>

            {/* Profile match button */}
            {candidateSkills.length > 0 && (
              <button
                type="button"
                onClick={() => setSkillModalOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-900 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Active Stack ({candidateSkills.length} skills)</span>
              </button>
            )}
          </div>

          {/* Quick Discipline Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            {disciplines.map((d) => {
              const active = filters.category === d.category;
              return (
                <button
                  key={d.category}
                  type="button"
                  onClick={() => updateFilters({ category: d.category })}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-slate-950 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Explorer Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 sticky top-24 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
            <JobFilters />
          </aside>

          {/* Main Listings Column */}
          <main className="lg:col-span-3 space-y-5">
            {/* Search and Control Bar */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-soft space-y-4">
              {/* Dual Search Input */}
              <div className="flex flex-col sm:flex-row items-stretch gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={filters.search}
                    onChange={(e) => updateFilters({ search: e.target.value })}
                    placeholder="Search role title, skill (e.g. React, Python, CUDA), or company..."
                    className="w-full pl-10 pr-8 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-slate-400 focus:bg-white transition-all"
                  />
                  {filters.search && (
                    <button
                      type="button"
                      onClick={() => updateFilters({ search: '' })}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="sm:w-52">
                  <select
                    value={filters.location}
                    onChange={(e) => updateFilters({ location: e.target.value })}
                    className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium cursor-pointer focus:outline-hidden focus:border-slate-400 focus:bg-white transition-all"
                  >
                    <option value="All">All Locations</option>
                    <option value="Remote">100% Remote</option>
                    <option value="San Francisco, CA">San Francisco, CA</option>
                    <option value="New York, NY">New York, NY</option>
                    <option value="London, UK">London, UK</option>
                    <option value="Berlin, Germany">Berlin, Germany</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Austin, TX">Austin, TX</option>
                  </select>
                </div>
              </div>

              {/* Bottom control row: counter, mobile filter button, sort & view toggle */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  {/* Mobile Filter Button */}
                  <button
                    type="button"
                    onClick={() => setMobileFiltersOpen(true)}
                    className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Filters</span>
                    {activeFilterCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-slate-950 text-white text-[10px] flex items-center justify-center font-mono">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  <span className="text-xs text-slate-600 font-mono tabular-nums">
                    Showing <strong>{pagination.totalItems}</strong> openings
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Sort selector */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    <span className="hidden sm:inline">Sort:</span>
                    <select
                      value={filters.sortBy}
                      onChange={(e) =>
                        updateFilters({
                          sortBy: e.target.value as 'newest' | 'salary-high' | 'salary-low',
                        })
                      }
                      className="bg-transparent font-medium text-slate-900 text-xs focus:outline-hidden cursor-pointer"
                    >
                      <option value="newest">Newest first</option>
                      <option value="salary-high">Highest Salary</option>
                      <option value="salary-low">Lowest Salary</option>
                    </select>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="hidden sm:flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-100">
                    <button
                      type="button"
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded-md transition-all ${
                        viewMode === 'grid'
                          ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                      aria-label="Grid view"
                      title="Grid view"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded-md transition-all ${
                        viewMode === 'list'
                          ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                      aria-label="List view"
                      title="List view"
                    >
                      <ListIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filters Pill strip (if any) */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-slate-500 font-medium">Applied:</span>
                {filters.search && (
                  <span className="inline-flex items-center gap-1.5 text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md font-medium">
                    Search: "{filters.search}"
                    <button
                      type="button"
                      onClick={() => updateFilters({ search: '' })}
                      className="hover:text-slate-950"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.category !== 'All' && (
                  <span className="inline-flex items-center gap-1.5 text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md font-medium">
                    {filters.category}
                    <button
                      type="button"
                      onClick={() => updateFilters({ category: 'All' })}
                      className="hover:text-slate-950"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.location !== 'All' && (
                  <span className="inline-flex items-center gap-1.5 text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md font-medium">
                    {filters.location}
                    <button
                      type="button"
                      onClick={() => updateFilters({ location: 'All' })}
                      className="hover:text-slate-950"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.remoteOnly && (
                  <span className="inline-flex items-center gap-1.5 text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md font-medium">
                    Remote Only
                    <button
                      type="button"
                      onClick={() => updateFilters({ remoteOnly: false })}
                      className="hover:text-slate-950"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs text-slate-500 hover:text-slate-950 underline ml-1 font-medium"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Content Rendering: Loading / Error / Empty / Results */}
            {loading ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
                {Array.from({ length: 6 }).map((_, idx) => (
                  <JobSkeleton key={`skel-${idx}`} />
                ))}
              </div>
            ) : error ? (
              <ErrorState error={error} onRetry={refetchJobs} />
            ) : jobs.length === 0 ? (
              <EmptyState onReset={resetFilters} />
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onApplyClick={(j) => setSelectedJobForApply(j)}
                    onQuickViewClick={(j) => setQuickViewJob(j)}
                    onSkillClick={handleSkillTagClick}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && jobs.length > 0 && (
              <Pagination
                meta={pagination}
                onPageChange={setPage}
                onLimitChange={setItemsPerPage}
              />
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {mobileFiltersOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        >
          <div
            className="w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl max-h-[85vh] overflow-y-auto p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-base font-bold text-slate-900">Filter Jobs</h3>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <JobFilters onCloseMobile={() => setMobileFiltersOpen(false)} />
          </div>
        </div>
      )}

      {/* Quick View Drawer */}
      <QuickViewDrawer
        job={quickViewJob}
        onClose={() => setQuickViewJob(null)}
        onApply={(j) => setSelectedJobForApply(j)}
      />

      {/* Application Modal */}
      <ApplicationModal
        job={selectedJobForApply}
        isOpen={Boolean(selectedJobForApply)}
        onClose={() => setSelectedJobForApply(null)}
      />

      {/* Skill Matcher Modal */}
      <SkillMatcherModal
        isOpen={skillModalOpen}
        onClose={() => setSkillModalOpen(false)}
      />
    </div>
  );
};
