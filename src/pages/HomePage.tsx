import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  ArrowRight,
  Code2,
  Cpu,
  Compass,
  Palette,
  ShieldCheck,
  Zap,
  DollarSign,
  Building2,
  ChevronRight,
  Check,
} from 'lucide-react';

export const HomePage: React.FC = () => {
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
  const jobExplorerRef = useRef<HTMLDivElement>(null);

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
    scrollToExplorer();
  };

  const handleCategoryCardClick = (categoryName: string) => {
    updateFilters({ category: categoryName });
    scrollToExplorer();
  };

  const scrollToExplorer = () => {
    if (jobExplorerRef.current) {
      jobExplorerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Top companies for trust marquee
  const partnerCompanies = [
    { name: 'Stripe', domain: 'Fintech Infrastructure', initial: 'S', color: '#635BFF' },
    { name: 'OpenAI', domain: 'Artificial Intelligence', initial: 'O', color: '#10A37F' },
    { name: 'Figma', domain: 'Collaborative Design', initial: 'F', color: '#F24E1E' },
    { name: 'Linear', domain: 'Issue Tracking & Project Management', initial: 'L', color: '#5E6AD2' },
    { name: 'Datadog', domain: 'Cloud Monitoring & Observability', initial: 'D', color: '#632CA6' },
    { name: 'Anthropic', domain: 'AI Safety & Research', initial: 'A', color: '#CC785C' },
    { name: 'Supabase', domain: 'Open Source Backend', initial: 'S', color: '#3ECF8E' },
    { name: 'Vercel', domain: 'Frontend Cloud & Edge Runtime', initial: 'V', color: '#000000' },
  ];

  // Career track / department categories
  const categoryTracks = [
    {
      title: 'Engineering & Systems',
      category: 'Engineering',
      count: '84 roles',
      icon: Code2,
      description: 'Distributed systems, full-stack architectures, high-scale APIs, and cloud infrastructure.',
    },
    {
      title: 'AI & Machine Learning',
      category: 'Data & AI',
      count: '32 roles',
      icon: Cpu,
      description: 'Foundation model evaluation, PyTorch training, RAG pipelines, and agentic workflows.',
    },
    {
      title: 'Product Management',
      category: 'Product',
      count: '28 roles',
      icon: Compass,
      description: 'Technical product strategy, developer tooling roadmaps, growth systems, and zero-to-one delivery.',
    },
    {
      title: 'Design & UX Systems',
      category: 'Design',
      count: '21 roles',
      icon: Palette,
      description: 'Product design, design tokens, human interface guidelines, and interactive prototypes.',
    },
  ];

  // Featured spotlight jobs (curated top 3)
  const spotlightJobs = jobs.filter((j) => j.featured).slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* SECTION 1: Master Minimalist Hero */}
      <section className="relative pt-20 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200/90 overflow-hidden bg-white">
        {/* Architectural grid overlay */}
        <div 
          className="absolute inset-0 -z-10 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(#0f172a 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Live Trust Pill */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-slate-50 border border-slate-200/90 rounded-full text-xs text-slate-700 shadow-2xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-slate-950">50 Curated Tech Positions</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Direct Hiring Manager Access</span>
          </div>

          {/* Clean Master Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-950 max-w-3xl mx-auto leading-[1.12]">
            Where extraordinary talent finds <span className="text-indigo-600">visionary teams</span>.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Curated engineering, AI/ML, product, and design positions at high-growth software teams and foundational labs. Fully transparent compensation.
          </p>

          {/* Unified High-End Search & Filter Deck */}
          <div className="pt-2 max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-950/5 transition-all flex flex-col sm:flex-row items-stretch overflow-hidden">
              {/* Keyword Search Field */}
              <div className="relative flex-1 flex items-center min-w-0 border-b sm:border-b-0 sm:border-r border-slate-200/80">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={filters.search}
                  onChange={(e) => updateFilters({ search: e.target.value })}
                  placeholder="Role, skill (e.g. React, Python, Rust), or company..."
                  className="w-full pl-11 pr-8 py-4 text-xs sm:text-sm bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                />
                {filters.search && (
                  <button
                    type="button"
                    onClick={() => updateFilters({ search: '' })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Location Selector */}
              <div className="relative sm:w-52 flex items-center shrink-0 border-b sm:border-b-0 sm:border-r border-slate-200/80">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={filters.location}
                  onChange={(e) => updateFilters({ location: e.target.value })}
                  className="w-full pl-10 pr-6 py-4 text-xs sm:text-sm bg-transparent text-slate-800 font-medium cursor-pointer focus:outline-hidden"
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

              {/* Search Submit CTA */}
              <div className="p-1.5 flex items-center shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    refetchJobs();
                    scrollToExplorer();
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-950 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs active:scale-[0.99]"
                >
                  <span>Explore Jobs</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Clean Trending Quick Filters */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Quick Filters:</span>

              <button
                type="button"
                onClick={() => updateFilters({ remoteOnly: !filters.remoteOnly })}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  filters.remoteOnly
                    ? 'bg-slate-950 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/70'
                }`}
              >
                Remote Worldwide
              </button>

              <button
                type="button"
                onClick={() => updateFilters({ category: filters.category === 'Engineering' ? 'All' : 'Engineering' })}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  filters.category === 'Engineering'
                    ? 'bg-slate-950 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/70'
                }`}
              >
                Engineering
              </button>

              <button
                type="button"
                onClick={() => updateFilters({ category: filters.category === 'Data & AI' ? 'All' : 'Data & AI' })}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  filters.category === 'Data & AI'
                    ? 'bg-slate-950 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/70'
                }`}
              >
                AI & Machine Learning
              </button>

              <button
                type="button"
                onClick={() => updateFilters({ minSalary: filters.minSalary === 150000 ? 0 : 150000 })}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all font-mono tabular-nums ${
                  filters.minSalary === 150000
                    ? 'bg-slate-950 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/70'
                }`}
              >
                $150k+ Base
              </button>

              <button
                type="button"
                onClick={() => updateFilters({ category: filters.category === 'Design' ? 'All' : 'Design' })}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  filters.category === 'Design'
                    ? 'bg-slate-950 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/70'
                }`}
              >
                Product Design
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Verified Partner Tech Companies */}
      <section className="py-10 border-b border-slate-200/80 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-400 mb-6">
            Leading engineering & product teams hiring through Lumina
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 items-center">
            {partnerCompanies.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => {
                  updateFilters({ search: c.name });
                  scrollToExplorer();
                }}
                className="group p-3 rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-2xs transition-all flex flex-col items-center justify-center text-center"
              >
                <div
                  className="w-7 h-7 rounded-lg text-white font-bold flex items-center justify-center text-xs mb-1.5 transition-transform group-hover:scale-105"
                  style={{ backgroundColor: c.color }}
                >
                  {c.initial}
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-slate-950">
                  {c.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: Career Tracks / Departments Grid */}
      <section className="py-14 border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Discipline Tracks</span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 mt-1">
                Explore positions by domain
              </h2>
            </div>
            <Link
              to="/companies"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors"
            >
              <span>View all hiring companies</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categoryTracks.map((track) => {
              const Icon = track.icon;
              return (
                <button
                  key={track.title}
                  type="button"
                  onClick={() => handleCategoryCardClick(track.category)}
                  className="group text-left p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:border-slate-300 hover:shadow-soft transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 text-slate-900 flex items-center justify-center shadow-2xs mb-4 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h3 className="font-bold text-slate-950 text-base group-hover:text-indigo-600 transition-colors">
                        {track.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {track.description}
                    </p>
                  </div>
                  <div className="mt-5 pt-3.5 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-500 font-medium">{track.count}</span>
                    <span className="font-semibold text-slate-700 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all inline-flex items-center gap-1">
                      Browse roles <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: Spotlight / Featured Roles Carousel or Grid */}
      {spotlightJobs.length > 0 && (
        <section className="py-14 border-b border-slate-200/80 bg-slate-50/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200/80 text-amber-800 text-[11px] font-semibold mb-2">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Curated by Lumina Partners</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
                  Featured Career Opportunities
                </h2>
              </div>
              <button
                type="button"
                onClick={scrollToExplorer}
                className="text-xs font-semibold text-slate-700 hover:text-slate-950 inline-flex items-center gap-1"
              >
                <span>Browse all {pagination.totalItems} open positions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {spotlightJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-soft hover:shadow-card-hover hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-xl text-white font-bold flex items-center justify-center text-sm shadow-xs"
                          style={{ backgroundColor: job.brandColor || '#4F46E5' }}
                        >
                          {job.companyInitial}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-500">{job.company}</div>
                          <div className="text-xs text-slate-400">{job.location}</div>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                        ${Math.round(job.salaryMin / 1000)}k–${Math.round(job.salaryMax / 1000)}k
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-950 mb-2 leading-snug">
                      <Link to={`/jobs/${job.id}`} className="hover:text-indigo-600 transition-colors">
                        {job.title}
                      </Link>
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {job.skills.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setQuickViewJob(job)}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-950"
                    >
                      Quick Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedJobForApply(job)}
                      className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 5: Main Job Explorer (Sidebar Filters + Rich Listings Grid/List) */}
      <div ref={jobExplorerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-20">
        {/* Section Heading & Subtitle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/80 mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
              Explore Active Positions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Filter by engineering discipline, salary range, tech stack, and remote eligibility.
            </p>
          </div>

          {/* Active profile match widget banner */}
          {candidateSkills.length > 0 && (
            <div className="p-2.5 px-3.5 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-3 text-xs text-indigo-900">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                Matching with: <strong>{candidateSkills.slice(0, 3).join(', ')}</strong>
                {candidateSkills.length > 3 && ` +${candidateSkills.length - 3} more`}
              </span>
              <button
                type="button"
                onClick={() => setSkillModalOpen(true)}
                className="text-xs font-bold text-indigo-700 hover:underline shrink-0 ml-1"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 sticky top-24 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
            <JobFilters />
          </aside>

          {/* Main Listings Column */}
          <main className="lg:col-span-3 space-y-5">
            {/* Control Bar: Results count, mobile filter trigger, sort, and view toggle */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:px-5 sm:py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
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

                <div className="text-xs text-slate-600 font-mono tabular-nums">
                  {loading ? (
                    <span>Fetching jobs...</span>
                  ) : (
                    <span>
                      <strong className="text-slate-950 font-bold">{pagination.totalItems}</strong> openings found
                    </span>
                  )}
                </div>
              </div>

              {/* Right: Sort & Grid/List view */}
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
                    aria-label="Grid view (2 columns)"
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
                    aria-label="List view (1 column)"
                    title="List view"
                  >
                    <ListIcon className="w-3.5 h-3.5" />
                  </button>
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
                {filters.minSalary > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md font-mono tabular-nums font-medium">
                    ${(filters.minSalary / 1000).toFixed(0)}k+
                    <button
                      type="button"
                      onClick={() => updateFilters({ minSalary: 0 })}
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

      {/* SECTION 6: Platform Pillars & Guarantees ("Why Lumina") */}
      <section className="py-16 border-t border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">The Lumina Standard</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 mt-1">
              Built for high-caliber engineers and product builders
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Every job listing and partner company is held to rigorous transparency and technical standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-4">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-950 text-base mb-2">100% Compensation Transparency</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                No undisclosed ranges or "competitive pay" vagueness. Every role displays verified base salary bands, equity ranges, and annual bonus potentials.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-950 text-base mb-2">Direct Hiring Team Routing</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Skip automated keyword resume parsers and third-party agencies. Applications submitted on Lumina go directly into engineering leads' review queues.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-950 text-base mb-2">Vetted High-Growth Teams</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Only backed Series A through Public technology organizations with verified runway, top-tier engineering cultures, and modern tech stacks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: Dual Talent / Employer Action Banner */}
      <section className="py-14 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* For Candidates */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between h-full">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">For Tech Builders</span>
                <h3 className="text-xl sm:text-2xl font-bold mt-2 mb-3">
                  Match your tech stack with top engineering roles
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                  Select the programming languages, cloud stacks, and frameworks you excel in. Get instant compatibility scores on every active role.
                </p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => setSkillModalOpen(true)}
                  className="px-5 py-2.5 bg-white text-slate-950 hover:bg-slate-100 font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-xs inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Configure Your Tech Stack</span>
                </button>
              </div>
            </div>

            {/* For Employers */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between h-full">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">For Hiring Teams</span>
                <h3 className="text-xl sm:text-2xl font-bold mt-2 mb-3">
                  Hire verified Senior and Staff engineers faster
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                  Post your open position in minutes, access our 165+ candidate CRM directory, and manage your pipeline through our real-time ATS.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/post-job"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-xs inline-flex items-center gap-2"
                >
                  <span>Post an Open Role</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/ats"
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm rounded-xl transition-all"
                >
                  Explore Recruiter ATS
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

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
