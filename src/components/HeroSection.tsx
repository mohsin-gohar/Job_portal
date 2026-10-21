import React, { useState } from 'react';
import { Search, MapPin, Building2, CheckCircle2, ArrowRight } from 'lucide-react';
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

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-light-theme text-xs font-semibold">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: 'var(--color-primary)' }}
              />
              <span>Explore Verified Tech & Business Opportunities</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.2]">
              Find your dream job at top modern companies.
            </h1>

            <p className="text-base text-slate-600 max-w-xl font-normal leading-relaxed">
              Browse curated full-time, contract, and remote positions. Apply directly to hiring teams with transparent salary details and live application tracking.
            </p>

            {/* Integrated Search Box */}
            <form
              onSubmit={handleSubmit}
              className="bg-white border-2 border-slate-200 hover:border-slate-300 rounded-xl p-2 shadow-sm focus-primary-ring transition-all"
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1 flex items-center gap-2.5 px-3 py-2">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Job title, keywords, or company name..."
                    className="w-full text-sm bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                <div className="hidden sm:block w-px h-6 bg-slate-200" />

                <div className="flex-1 flex items-center gap-2.5 px-3 py-2">
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
                  className="px-5 py-2.5 btn-primary-theme rounded-lg text-xs font-semibold shadow-sm shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Search Jobs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Quick Category Buttons */}
            <div className="space-y-2 pt-1">
              <div className="text-xs text-slate-500 font-medium">Popular Categories:</div>
              <div className="flex flex-wrap gap-1.5">
                {quickCategories.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => onSelectCategory(cat)}
                      className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                        isActive
                          ? 'btn-primary-theme shadow-xs font-semibold'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Trust signals */}
            <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified Direct Companies</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Transparent Salary Bands</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Real-Time Status Tracking</span>
              </div>
            </div>
          </div>

          {/* Right Visual Image */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm aspect-[16/10] group">
              {!imageError ? (
                <img
                  src={heroImg}
                  alt="Modern office collaborative workspace"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-900 text-white">
                  <Building2 className="w-12 h-12 text-slate-400 mb-2" />
                  <p className="font-semibold text-base">NextRole Workspace</p>
                  <p className="text-xs text-slate-400">Connecting top companies and talent</p>
                </div>
              )}

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent flex flex-col justify-end p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 block">
                      Featured Employers
                    </span>
                    <span className="text-sm font-bold text-white mt-0.5 block">
                      Vercel, Notion, Stripe, Airbnb & Canva
                    </span>
                  </div>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-white/20 backdrop-blur-xs text-white">
                    Actively Hiring
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
