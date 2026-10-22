import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobsApi } from '../services/api';
import { Company, JobCategory } from '../types/job';
import { Search, Building, MapPin, Users, Globe, ArrowUpRight, Sparkles, Briefcase } from 'lucide-react';

const CATEGORIES: ('All' | JobCategory)[] = [
  'All',
  'Engineering',
  'Data & AI',
  'Design',
  'Product',
  'Sales',
  'Operations',
];

export const CompaniesPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [stageFilter, setStageFilter] = useState<string>('All');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const resp = await jobsApi.getCompanies({ search, category });
      setCompanies(resp.data);
      setLoading(false);
    };
    load();
  }, [search, category]);

  const filtered = companies.filter((c) => {
    if (stageFilter === 'All') return true;
    return c.stage === stageFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Editorial Header */}
      <section className="relative border-b border-slate-200/80 pt-12 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Architectural Image */}
        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80"
            alt=""
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/92 via-white/85 to-slate-50" />
        </div>
        <div className="max-w-4xl mx-auto text-center space-y-3 relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-800">
            <Building className="w-3.5 h-3.5 text-indigo-600" />
            <span>30 Verified Tech Employers</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Explore Leading Technology Companies
          </h1>

          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Discover verified tech scaleups, foundation AI research labs, and product design powerhouses actively expanding their teams.
          </p>

          {/* Search bar */}
          <div className="pt-2 max-w-xl mx-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies, tech stacks, or locations..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors shadow-2xs"
            />
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Filter bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
          {/* Department pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium mr-1">Sector:</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  category === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Stage filter */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Stage:</span>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-slate-800 font-medium focus:outline-hidden"
            >
              <option value="All">All Stages</option>
              <option value="Seed">Seed</option>
              <option value="Series A">Series A</option>
              <option value="Series B">Series B</option>
              <option value="Series C+">Series C+</option>
              <option value="Public">Public Enterprise</option>
            </select>
          </div>
        </div>

        {/* Companies Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-slate-200 rounded-lg" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                    <div className="h-3 bg-slate-200 rounded w-1/3" />
                  </div>
                </div>
                <div className="h-10 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-xl max-w-md mx-auto">
            <Building className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-900">No companies found</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting your search query or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((company) => (
              <article
                key={company.id}
                className="group bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4 transition-all duration-150 hover:border-slate-400 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between"
              >
                <div>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className="w-12 h-12 rounded-lg text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-xs"
                        style={{ backgroundColor: company.brandColor }}
                      >
                        {company.initial}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-slate-900 tracking-tight truncate group-hover:text-indigo-600 transition-colors">
                          <Link to={`/companies/${company.id}`}>{company.name}</Link>
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span className="font-medium text-slate-700">{company.category}</span>
                          <span aria-hidden="true" className="text-slate-300">·</span>
                          <span className="inline-block px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                            {company.stage}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full shrink-0">
                      <Briefcase className="w-3 h-3" />
                      {company.openJobsCount} Roles
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {company.description}
                  </p>

                  {/* Tech Stack Tags */}
                  <div className="mt-3.5 flex flex-wrap gap-1 text-xs">
                    {company.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Meta */}
                <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{company.location}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono tabular-nums">{company.employees}</span>
                    </span>
                  </div>

                  <Link
                    to={`/companies/${company.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
                  >
                    <span>View Roles</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      {/* Hiring insights */}
      <section className="grid sm:grid-cols-3 gap-4 pt-2">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-1.5">Top industries</h3>
          <p className="text-xs text-slate-600 leading-relaxed">AI, fintech, and developer tooling lead hiring this quarter.</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-1.5">Growth stage</h3>
          <p className="text-xs text-slate-600 leading-relaxed">Series B–D companies account for 60% of open roles.</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-1.5">Remote-first</h3>
          <p className="text-xs text-slate-600 leading-relaxed">45% of listed companies are fully distributed.</p>
        </div>
      </section>

    </div>
  );
};
