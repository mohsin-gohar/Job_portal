import React, { useState } from 'react';
import { Search, Filter, RotateCcw, X, SlidersHorizontal, Check } from 'lucide-react';
import { JobFilterParams } from '../types/job';

interface JobFiltersProps {
  filters: JobFilterParams;
  onChange: (newFilters: Partial<JobFilterParams>) => void;
  onReset: () => void;
  totalResults: number;
}

export const JobFilters: React.FC<JobFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalResults,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const categories = [
    'All',
    'Engineering',
    'Design',
    'Product',
    'Data & AI',
    'Marketing',
    'Sales',
    'Operations',
  ];

  const jobTypes = ['All', 'Full-time', 'Contract', 'Part-time', 'Internship'];

  const experienceLevels = [
    'All',
    'Entry-Level',
    'Mid-Level',
    'Senior',
    'Lead / Executive',
  ];

  const salaryOptions = [
    { label: 'Any Salary', value: 0 },
    { label: '$80,000+ / yr', value: 80000 },
    { label: '$120,000+ / yr', value: 120000 },
    { label: '$160,000+ / yr', value: 160000 },
    { label: '$200,000+ / yr', value: 200000 },
  ];

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
    <>
      {/* Mobile filter toggle bar */}
      <div className="lg:hidden flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 mb-4 shadow-soft">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 text-xs font-semibold text-slate-800 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4 text-slate-600" />
          <span>Filters {hasActiveFilters && '• Active'}</span>
        </button>

        <span className="text-xs text-slate-500 font-mono tabular-nums">
          {totalResults} {totalResults === 1 ? 'job found' : 'jobs found'}
        </span>
      </div>

      {/* Desktop filter sidebar container */}
      <div
        className={`fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs transition-opacity lg:static lg:z-auto lg:bg-transparent lg:backdrop-blur-none ${
          mobileOpen ? 'block' : 'hidden lg:block'
        }`}
      >
        <aside className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white p-6 shadow-xl lg:static lg:w-full lg:p-5 lg:shadow-none lg:border lg:border-slate-200 lg:rounded-xl overflow-y-auto max-h-screen lg:max-h-none">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary-theme" />
              <h2 className="text-sm font-bold text-slate-900">Filter Jobs</h2>
            </div>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={onReset}
                  className="text-xs text-primary-theme no-underline hover:opacity-80 flex items-center gap-1 font-semibold transition-opacity cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="lg:hidden p-1 text-slate-400 hover:text-slate-900 rounded-md"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Search filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-2">
                Keywords & Skills
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={filters.search || ''}
                  onChange={(e) => onChange({ search: e.target.value })}
                  placeholder="e.g. React, Manager..."
                  className="w-full pl-8 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[var(--color-primary)] outline-none transition-colors"
                />
                {filters.search && (
                  <button
                    type="button"
                    onClick={() => onChange({ search: '' })}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Remote Only Toggle */}
            <div className="pt-1">
              <label className="flex items-center justify-between cursor-pointer select-none bg-slate-50 p-2.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                <span className="text-xs font-semibold text-slate-800">Remote Positions Only</span>
                <input
                  type="checkbox"
                  checked={Boolean(filters.remoteOnly)}
                  onChange={(e) => onChange({ remoteOnly: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 cursor-pointer"
                  style={{ accentColor: 'var(--color-primary)' }}
                />
              </label>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-2">
                Department
              </label>
              <div className="space-y-1">
                {categories.map((cat) => {
                  const isSelected = (filters.category || 'All') === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => onChange({ category: cat })}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'btn-primary-theme font-semibold shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{cat}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Job Type Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-2">
                Employment Type
              </label>
              <div className="space-y-1">
                {jobTypes.map((type) => {
                  const isSelected = (filters.type || 'All') === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => onChange({ type })}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'btn-primary-theme font-semibold shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{type}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Experience Level Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-2">
                Experience Level
              </label>
              <div className="space-y-1">
                {experienceLevels.map((lvl) => {
                  const isSelected = (filters.experienceLevel || 'All') === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => onChange({ experienceLevel: lvl })}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'btn-primary-theme font-semibold shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{lvl}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Minimum Salary Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-2">
                Minimum Annual Salary
              </label>
              <select
                value={filters.minSalary || 0}
                onChange={(e) => onChange({ minSalary: Number(e.target.value) })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white outline-none cursor-pointer"
              >
                {salaryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile close button */}
            <div className="lg:hidden pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="w-full py-2.5 btn-primary-theme rounded-lg text-xs font-semibold cursor-pointer"
              >
                Apply Filters & View Roles ({totalResults})
              </button>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};
