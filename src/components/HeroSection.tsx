import React, { useState } from 'react';
import { Search, MapPin, Building2, ArrowRight, Star, TrendingUp } from 'lucide-react';
import heroImg from '../assets/images/job_hero_workspace_1790882872474.jpg';

interface HeroSectionProps {
  onSearch: (query: string, location: string) => void;
  onSelectCategory: (category: string) => void;
  activeCategory?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  onSelectCategory,
  activeCategory = 'All',
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [imageError, setImageError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput, locationInput);
  };

  const quickCategories = [
    'All',
    'Engineering',
    'Design',
    'Product',
    'Data & AI',
    'Marketing',
    'Sales',
  ];

  const stats = [
    { value: '12k+', label: 'Live opportunities' },
    { value: '500+', label: 'Verified companies' },
    { value: '98%', label: 'Placement rate' },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Ambient background layers */}
      <div className="absolute inset-0 hero-grid" aria-hidden="true" />
      <div
        className="absolute -top-28 -left-28 w-[26rem] h-[26rem] aurora"
        style={{ backgroundColor: 'var(--color-primary)', opacity: 0.14 }}
        aria-hidden="true"
      />
      <div
        className="absolute -top-16 right-[-8rem] w-[22rem] h-[22rem] aurora"
        style={{ backgroundColor: 'var(--color-primary)', opacity: 0.1 }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-20 pb-14 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 border border-slate-200/80 shadow-soft backdrop-blur text-xs font-semibold text-slate-700">
              <span
                className="w-2 h-2 rounded-full animate-pulse-soft"
                style={{ backgroundColor: 'var(--color-primary)' }}
              />
              <span>Explore Verified Tech & Business Opportunities</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold font-display tracking-tight text-slate-900 leading-[1.08]">
              Find your dream job at{' '}
              <span className="gradient-text">top modern companies.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl font-normal leading-relaxed">
              Browse curated full-time, contract, and remote positions. Apply directly to hiring teams with transparent salary details and live application tracking.
            </p>

            {/* Integrated Search Box */}
            <form
              onSubmit={handleSubmit}
              className="glass-panel rounded-2xl p-2 shadow-lift focus-primary-ring transition-all"
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Job title, keywords, or company name..."
                    className="w-full text-sm bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                <div className="hidden sm:block w-px h-6 bg-slate-200/80" />

                <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="City, Country, or 'Remote'..."
                    className="w-full text-sm bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 btn-primary-theme rounded-xl text-xs font-semibold shadow-glow shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Search Jobs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Quick Category Buttons */}
            <div className="space-y-2.5 pt-1">
              <div className="text-xs text-slate-500 font-semibold">Popular Categories:</div>
              <div className="flex flex-wrap gap-2">
                {quickCategories.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => onSelectCategory(cat)}
                      className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
                        isActive
                          ? 'btn-primary-theme shadow-glow font-semibold'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900 shadow-soft'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Trust stats */}
            <div className="pt-2 grid grid-cols-3 gap-6 max-w-lg border-t border-slate-200/70">
              {stats.map((s) => (
                <div key={s.label} className="pt-5">
                  <div className="text-2xl font-bold font-display text-slate-900 tracking-tight">
                    {s.value}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden ring-1 ring-slate-900/5 shadow-lift bg-slate-100 aspect-[16/12] group">
              {!imageError ? (
                <img
                  src={heroImg}
                  alt="Modern office collaborative workspace"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-900 text-white">
                  <Building2 className="w-12 h-12 text-slate-400 mb-2" />
                  <p className="font-semibold text-base">NextRole Workspace</p>
                  <p className="text-xs text-slate-400">Connecting top companies and talent</p>
                </div>
              )}

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/25 to-transparent flex flex-col justify-end p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 block">
                      Featured Employers
                    </span>
                    <span className="text-sm font-bold text-white mt-0.5 block">
                      Vercel, Notion, Stripe, Airbnb & Canva
                    </span>
                  </div>
                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Actively Hiring
                  </span>
                </div>
              </div>
            </div>

            {/* Floating rating card */}
            <div className="hidden sm:flex absolute -bottom-5 -left-4 lg:-left-8 glass-panel rounded-2xl px-4 py-3 items-center gap-3 animate-float">
              <div className="w-10 h-10 rounded-xl btn-primary-theme flex items-center justify-center">
                <Star className="w-5 h-5 fill-white" />
              </div>
              <div>
                <div className="text-sm font-bold font-display text-slate-900">4.9 / 5.0</div>
                <div className="text-[11px] text-slate-500">Candidate satisfaction</div>
              </div>
            </div>

            {/* Floating roles card */}
            <div className="hidden sm:flex absolute -top-4 right-4 glass-panel rounded-2xl px-4 py-3 items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold font-display text-slate-900">+320</div>
                <div className="text-[11px] text-slate-500">New roles this week</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
