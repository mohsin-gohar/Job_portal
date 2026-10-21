import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Briefcase, Bookmark, PlusCircle, Menu, X, FileText, Palette } from 'lucide-react';
import { useJobPortal, ThemeColor } from '../context/JobPortalContext';

export const Navbar: React.FC = () => {
  const { savedJobIds, applications, themeColor, setThemeColor } = useJobPortal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const navigate = useNavigate();

  const themes: { id: ThemeColor; name: string; bg: string }[] = [
    { id: 'blue', name: 'Cobalt Blue', bg: 'bg-[#2563eb]' },
    { id: 'emerald', name: 'Emerald Pine', bg: 'bg-[#059669]' },
    { id: 'teal', name: 'Nordic Teal', bg: 'bg-[#0d9488]' },
    { id: 'slate', name: 'Charcoal Slate', bg: 'bg-[#0f172a]' },
    { id: 'violet', name: 'Royal Violet', bg: 'bg-[#7c3aed]' },
    { id: 'rose', name: 'Crimson Rose', bg: 'bg-[#e11d48]' },
  ];

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors px-3 py-1.5 rounded-lg flex items-center gap-1.5 no-underline ${
      isActive
        ? 'bg-primary-light-theme font-semibold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-primary-light-theme font-semibold'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Brand Wordmark */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl btn-primary-theme flex items-center justify-center font-bold text-base shadow-sm">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 leading-tight group-hover:text-[var(--color-primary)] transition-colors">
                NextRole
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide">
                Job Portal & Careers
              </span>
            </div>
          </Link>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 h-full">
            <NavLink to="/" className={navLinkClass} end>
              Find Jobs
            </NavLink>
            <NavLink to="/saved" className={navLinkClass}>
              <span>Saved Jobs</span>
              {savedJobIds.length > 0 && (
                <span className="px-1.5 py-0.2 text-xs font-mono font-medium bg-slate-100 text-slate-700 rounded-md">
                  {savedJobIds.length}
                </span>
              )}
            </NavLink>
            <NavLink to="/applications" className={navLinkClass}>
              <span>Applications</span>
              {applications.length > 0 && (
                <span className="px-1.5 py-0.2 text-xs font-mono font-medium bg-emerald-50 text-emerald-700 rounded-md">
                  {applications.length}
                </span>
              )}
            </NavLink>
            <NavLink to="/post-job" className={navLinkClass}>
              For Employers
            </NavLink>
          </nav>

          {/* Zone 3: Primary Actions & Color Switcher */}
          <div className="hidden md:flex items-center gap-3">
            {/* Color Accent Picker Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setPaletteOpen(!paletteOpen)}
                className="px-2.5 py-1.5 text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-2 cursor-pointer border border-slate-200/80"
                title="Change UI Theme Color"
              >
                <div
                  className="w-3.5 h-3.5 rounded-full border border-white shadow-xs shrink-0"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                />
                <span className="font-semibold text-xs">Color Theme</span>
                <Palette className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {paletteOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-2 py-1 mb-1 flex items-center justify-between">
                    <span>Select Color</span>
                    <span className="text-[10px] text-slate-400 font-mono">Real-time</span>
                  </div>
                  <div className="space-y-1">
                    {themes.map((th) => (
                      <button
                        key={th.id}
                        type="button"
                        onClick={() => {
                          setThemeColor(th.id);
                          setPaletteOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          themeColor === th.id
                            ? 'bg-slate-100 text-slate-900 font-bold'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-3.5 h-3.5 rounded-full ${th.bg} shadow-xs border border-white`} />
                          <span>{th.name}</span>
                        </div>
                        {themeColor === th.id && (
                          <span className="text-[10px] text-[var(--color-primary)] font-semibold font-mono">Active</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/saved"
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors relative"
              title="View Saved Jobs"
            >
              <Bookmark className="w-5 h-5" />
              {savedJobIds.length > 0 && (
                <span
                  className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                />
              )}
            </Link>

            <button
              onClick={() => navigate('/post-job')}
              className="px-4 py-2 text-xs font-semibold text-white btn-primary-theme rounded-lg shadow-sm whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a Job</span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/saved"
              className="p-2 text-slate-600 hover:text-slate-900 relative rounded-md"
              aria-label="Saved jobs"
            >
              <Bookmark className="w-5 h-5" />
              {savedJobIds.length > 0 && (
                <span
                  className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                />
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-4 space-y-2 shadow-md">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
            end
          >
            <span className="flex items-center gap-2.5">
              <Briefcase className="w-4 h-4 text-slate-500" />
              <span>Find Jobs</span>
            </span>
          </NavLink>
          <NavLink
            to="/saved"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            <span className="flex items-center gap-2.5">
              <Bookmark className="w-4 h-4 text-slate-500" />
              <span>Saved Jobs</span>
            </span>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {savedJobIds.length}
            </span>
          </NavLink>
          <NavLink
            to="/applications"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            <span className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-slate-500" />
              <span>My Applications</span>
            </span>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
              {applications.length}
            </span>
          </NavLink>
          <NavLink
            to="/post-job"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            <span className="flex items-center gap-2.5">
              <PlusCircle className="w-4 h-4 text-slate-500" />
              <span>Post a Job Listing</span>
            </span>
          </NavLink>

          {/* Mobile Theme Color Selector */}
          <div className="pt-2 border-t border-slate-100">
            <div className="text-[11px] font-semibold text-slate-500 mb-2">Accent Color:</div>
            <div className="flex items-center gap-2">
              {themes.map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => setThemeColor(th.id)}
                  className={`w-7 h-7 rounded-full ${th.bg} border-2 transition-all ${
                    themeColor === th.id ? 'border-slate-900 scale-110' : 'border-transparent'
                  }`}
                  title={th.name}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
