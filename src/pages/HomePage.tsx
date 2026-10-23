import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, List, RotateCcw, AlertTriangle, Briefcase } from 'lucide-react';
import { useJobs } from '../hooks/useJobs';
import { HeroSection } from '../components/HeroSection';
import { JobFilters } from '../components/JobFilters';
import { JobCard } from '../components/JobCard';
import { Pagination } from '../components/Pagination';

export const HomePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const initialCategory = searchParams.get('category') || undefined;
  const initialSearch = searchParams.get('search') || undefined;
  const initialRemote = searchParams.get('remoteOnly') === 'true' || undefined;

  const {
    jobs,
    total,
    page,
    limit,
    totalPages,
    loading,
    error,
    filters,
    setFilters,
    resetFilters,
    setPage,
    setLimit,
    refetch,
  } = useJobs({
    initialFilters: {
      category: initialCategory,
      search: initialSearch,
      remoteOnly: initialRemote,
    },
    initialLimit: 9,
  });

  const handleHeroSearch = (search: string, location: string) => {
    setFilters({
      search: search || undefined,
      location: location || undefined,
    });
  };

  const handleSelectCategory = (cat: string) => {
    setFilters({
      category: cat === 'All' ? undefined : cat,
    });
  };

  const hasActiveFilters = Boolean(
    filters.search ||
      (filters.category && filters.category !== 'All') ||
      (filters.type && filters.type !== 'All') ||
      (filters.experienceLevel && filters.experienceLevel !== 'All') ||
      (filters.location && filters.location !== 'All Locations') ||
      filters.remoteOnly ||
      (filters.minSalary && filters.minSalary > 0)
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero section */}
      <HeroSection
        onSearch={handleHeroSearch}
        onSelectCategory={handleSelectCategory}
        activeCategory={filters.category || 'All'}
      />

      {/* Main catalog layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Section heading */}
        <div className="mb-8">
          <span className="section-eyebrow">Curated Opportunities</span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mt-2">
            Explore open roles
          </h2>
          <p className="text-sm text-slate-500 mt-1.5 max-w-2xl">
            Hand-picked positions from the world&apos;s most respected companies — updated in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Left Column: Filters Sidebar */}
          <div className="lg:col-span-1">
            <JobFilters
              filters={filters}
              onChange={setFilters}
              onReset={resetFilters}
              totalResults={total}
            />
          </div>

          {/* Right Column: Job List & Controls */}
          <div className="lg:col-span-3 space-y-5">
            {/* Top Toolbar */}
            <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-800">
                  {loading ? (
                    'Searching roles...'
                  ) : (
                    <>
                      <strong className="text-primary-theme font-mono tabular-nums">{total}</strong> jobs available
                    </>
                  )}
                </span>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-xs text-primary-theme no-underline hover:opacity-80 flex items-center gap-1 font-semibold bg-primary-light-theme px-2.5 py-1 rounded-md transition-opacity cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear filters</span>
                  </button>
                )}
              </div>

              {/* View options & Sorting */}
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                  <span>Sort by:</span>
                  <select
                    value={filters.sortBy || 'recent'}
                    onChange={(e) => setFilters({ sortBy: e.target.value as any })}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none font-medium cursor-pointer"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="salary-high">Salary: High to Low</option>
                    <option value="salary-low">Salary: Low to High</option>
                    <option value="applicants">Most Applicants</option>
                  </select>
                </div>

                {/* Grid / List View Toggle */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-white text-primary-theme shadow-soft font-semibold'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title="Grid View"
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                      viewMode === 'list'
                        ? 'bg-white text-primary-theme shadow-soft font-semibold'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title="List View"
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center space-y-3">
                <AlertTriangle className="w-8 h-8 text-red-500 mx-auto" />
                <h3 className="text-sm font-bold text-slate-900">Failed to load roles</h3>
                <p className="text-xs text-red-700 max-w-sm mx-auto">{error}</p>
                <button
                  type="button"
                  onClick={refetch}
                  className="px-4 py-2 btn-primary-theme text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  Retry Connection
                </button>
              </div>
            )}

            {/* Loading Skeletons */}
            {loading && !error && (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'
                    : 'space-y-4'
                }
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white border border-slate-200 rounded-xl p-5 animate-pulse space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-slate-200 rounded-xl shrink-0" />
                      <div className="space-y-2 flex-1">
                        <div className="h-3 bg-slate-200 rounded w-24" />
                        <div className="h-2.5 bg-slate-100 rounded w-36" />
                      </div>
                    </div>
                    <div className="space-y-2 pt-2">
                      <div className="h-4 bg-slate-200 rounded w-4/5" />
                      <div className="h-3 bg-slate-100 rounded w-full" />
                    </div>
                    <div className="h-3 bg-slate-100 rounded w-1/2 pt-2" />
                    <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                      <div className="h-4 bg-slate-200 rounded w-20" />
                      <div className="h-7 bg-slate-200 rounded w-16" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && jobs.length === 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4">
                <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center mx-auto">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">No matching positions found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  We couldn&apos;t find any roles matching your current search parameters. Try changing your keywords, selecting broader departments, or resetting filters.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="px-4 py-2 btn-primary-theme rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Reset all filters
                  </button>
                </div>
              </div>
            )}

            {/* Populated Job Listings */}
            {!loading && !error && jobs.length > 0 && (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'
                    : 'space-y-4'
                }
              >
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} viewMode={viewMode} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && total > 0 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={total}
                itemsPerPage={limit}
                onPageChange={setPage}
                onLimitChange={setLimit}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
