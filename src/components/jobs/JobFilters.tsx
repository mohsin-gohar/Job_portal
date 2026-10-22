import React from 'react';
import { Search, X, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { useJobs } from '../../context/JobContext';
import { JobCategory, JobType, ExperienceLevel } from '../../types/job';

const CATEGORIES: ('All' | JobCategory)[] = [
  'All',
  'Engineering',
  'Data & AI',
  'Design',
  'Product',
  'Marketing',
  'Sales',
  'Operations',
];

const JOB_TYPES: ('All' | JobType)[] = [
  'All',
  'Full-time',
  'Remote',
  'Contract',
  'Part-time',
  'Internship',
];

const LOCATIONS = [
  'All',
  'Remote',
  'San Francisco, CA',
  'New York, NY',
  'London, UK',
  'Berlin, Germany',
  'Singapore',
  'Seattle, WA',
  'Austin, TX',
  'Toronto, Canada',
];

const EXPERIENCE_LEVELS: ('All' | ExperienceLevel)[] = [
  'All',
  'Entry Level',
  'Mid Level',
  'Senior Level',
  'Staff / Lead',
];

interface JobFiltersProps {
  onCloseMobile?: () => void;
  className?: string;
}

export const JobFilters: React.FC<JobFiltersProps> = ({ onCloseMobile, className = '' }) => {
  const { filters, updateFilters, resetFilters, activeFilterCount } = useJobs();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header bar with Active Filter count and Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-700" />
          <span className="text-sm font-semibold text-slate-900">Filters</span>
          {activeFilterCount > 0 && (
            <span className="text-xs font-mono tabular-nums text-slate-500 font-medium">
              ({activeFilterCount} active)
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* 1. Keyword Search */}
      <div className="space-y-1.5">
        <label htmlFor="search-input" className="block text-xs font-semibold text-slate-700">
          Search Keywords
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="search-input"
            type="text"
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            placeholder="Title, skill, or company..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-slate-200 rounded-md placeholder:text-slate-400 text-slate-900 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => updateFilters({ search: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Category Filter */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700">
          Department / Category
        </label>
        <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1">
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => updateFilters({ category: cat })}
                className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Job Type Filter */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700">
          Employment Type
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {JOB_TYPES.map((type) => {
            const isSelected = filters.type === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => updateFilters({ type })}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium text-center transition-colors whitespace-nowrap truncate ${
                  isSelected
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Remote Only Toggle */}
      <div className="pt-2">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.remoteOnly}
            onChange={(e) => updateFilters({ remoteOnly: e.target.checked })}
            className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-indigo-500"
          />
          <span className="text-xs font-medium text-slate-700">Remote roles only</span>
        </label>
      </div>

      {/* 5. Location Selector */}
      <div className="space-y-1.5">
        <label htmlFor="location-select" className="block text-xs font-semibold text-slate-700">
          Location
        </label>
        <select
          id="location-select"
          value={filters.location}
          onChange={(e) => updateFilters({ location: e.target.value })}
          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md text-slate-800 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        >
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* 6. Experience Level */}
      <div className="space-y-1.5">
        <label htmlFor="experience-select" className="block text-xs font-semibold text-slate-700">
          Experience Level
        </label>
        <select
          id="experience-select"
          value={filters.experienceLevel}
          onChange={(e) => updateFilters({ experienceLevel: e.target.value })}
          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md text-slate-800 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        >
          {EXPERIENCE_LEVELS.map((exp) => (
            <option key={exp} value={exp}>
              {exp}
            </option>
          ))}
        </select>
      </div>

      {/* 7. Minimum Salary Range */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span>Minimum Salary</span>
          <span className="font-mono tabular-nums text-slate-900">
            {filters.minSalary === 0 ? 'Any' : `$${(filters.minSalary / 1000).toFixed(0)}k+ / yr`}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="200000"
          step="10000"
          value={filters.minSalary}
          onChange={(e) => updateFilters({ minSalary: Number(e.target.value) })}
          className="w-full accent-indigo-600 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-slate-400 font-mono tabular-nums">
          <span>$0</span>
          <span>$100k</span>
          <span>$200k+</span>
        </div>
      </div>

      {onCloseMobile && (
        <div className="pt-4 border-t border-slate-200 md:hidden">
          <button
            type="button"
            onClick={onCloseMobile}
            className="w-full py-2.5 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-slate-800 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
};
