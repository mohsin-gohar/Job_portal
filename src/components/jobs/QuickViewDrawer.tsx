import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Bookmark, ArrowUpRight, CheckCircle2, Building, Globe, Users, Clock, Sparkles } from 'lucide-react';
import { Job } from '../../types/job';
import { useSavedJobs } from '../../context/SavedJobsContext';
import { useCandidate } from '../../context/CandidateContext';
import { useApplication } from '../../context/ApplicationContext';

interface QuickViewDrawerProps {
  job: Job | null;
  onClose: () => void;
  onApply: (job: Job) => void;
}

export const QuickViewDrawer: React.FC<QuickViewDrawerProps> = ({ job, onClose, onApply }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'perks'>('overview');
  const { isSaved, toggleSaveJob } = useSavedJobs();
  const { calculateJobMatchScore } = useCandidate();
  const { hasApplied } = useApplication();

  if (!job) return null;

  const saved = isSaved(job.id);
  const applied = hasApplied(job.id);
  const { score: matchScore, matching } = calculateJobMatchScore(job.skills);

  const formatSalary = (min: number, max: number, currency: string) => {
    const symbol = currency === 'USD' ? '$' : currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : currency === 'SGD' ? 'S$' : 'C$';
    return `${symbol}${Math.round(min / 1000)}k – ${symbol}${Math.round(max / 1000)}k / yr`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-2xs flex justify-end"
    >
      <div
        className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-200 bg-white sticky top-0 z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div
                className="w-12 h-12 rounded-lg text-white font-bold flex items-center justify-center text-lg shrink-0 shadow-xs"
                style={{ backgroundColor: job.brandColor || '#0F172A' }}
              >
                {job.companyInitial}
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span className="font-semibold text-slate-800">{job.company}</span>
                  <span aria-hidden="true">·</span>
                  <span>{job.department}</span>
                  {job.featured && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-indigo-700">Featured</span>
                    </>
                  )}
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
                  {job.title}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Close preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Meta Row */}
          <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600">
            <span className="font-medium text-slate-900">{job.type}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{job.location}</span>
            {job.isRemote && (
              <>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-slate-800 font-medium">Remote Friendly</span>
              </>
            )}
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="font-mono tabular-nums font-semibold text-slate-900">
              {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
            </span>
          </div>

          {/* Skill Match Score Pill */}
          {matchScore > 0 && (
            <div className="mt-3 flex items-center gap-2 text-xs bg-indigo-50 border border-indigo-100 p-2 rounded-md text-indigo-900">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>
                <strong>{matchScore}% Compatibility</strong> ({matching.length} of {job.skills.length} skills match your profile)
              </span>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="mt-5 flex items-center gap-2 border-b border-slate-200 -mb-6 pb-2 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-slate-900 text-slate-900 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Role Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('requirements')}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === 'requirements'
                  ? 'border-slate-900 text-slate-900 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Requirements & Stack
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('perks')}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === 'perks'
                  ? 'border-slate-900 text-slate-900 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Company & Perks
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6 text-xs sm:text-sm">
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900">Mission & Purpose</h4>
                <p className="text-slate-600 leading-relaxed">{job.description}</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="font-bold text-slate-900">Key Responsibilities</h4>
                <ul className="space-y-2 text-slate-600">
                  {job.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'requirements' && (
            <div className="space-y-6 text-xs sm:text-sm">
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900">Qualifications</h4>
                <ul className="space-y-2 text-slate-600">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="font-bold text-slate-900">Required Skills & Tools</h4>
                <div className="flex flex-wrap gap-1.5">
                  {job.skills.map((skill) => {
                    const isMatch = matching.some((m) => m.toLowerCase() === skill.toLowerCase());
                    return (
                      <span
                        key={skill}
                        className={`px-2.5 py-1 rounded text-xs font-medium ${
                          isMatch
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {isMatch && '✓ '}
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'perks' && (
            <div className="space-y-6 text-xs sm:text-sm">
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900">About {job.company}</h4>
                <p className="text-slate-600 leading-relaxed">{job.aboutCompany}</p>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-slate-100">
                <h4 className="font-bold text-slate-900">Benefits Package</h4>
                <ul className="space-y-2 text-slate-600">
                  {job.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Team Size:</span>
                  <span className="font-mono text-slate-900 font-medium">{job.teamSize || '80-120'}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Workplace:</span>
                  <span className="text-slate-900 font-medium">{job.isRemote ? 'Remote-First' : 'Hybrid Office'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Bottom Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleSaveJob(job)}
              className={`p-2 rounded-md border transition-colors ${
                saved
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-300 text-slate-600 hover:text-slate-900 bg-white'
              }`}
              title={saved ? 'Remove from saved' : 'Save position'}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
            </button>

            <Link
              to={`/jobs/${job.id}`}
              onClick={onClose}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2"
            >
              <span>Full Page</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div>
            {applied ? (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-100 rounded-md">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Application Submitted</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onApply(job);
                }}
                className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 shadow-sm transition-colors"
              >
                Apply for Position
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
