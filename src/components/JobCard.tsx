import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, MapPin, Calendar, ArrowUpRight, Check } from 'lucide-react';
import { Job } from '../types/job';
import { useJobPortal } from '../context/JobPortalContext';

interface JobCardProps {
  job: Job;
  viewMode?: 'grid' | 'list';
}

export const JobCard: React.FC<JobCardProps> = ({ job, viewMode = 'grid' }) => {
  const { isJobSaved, toggleSaveJob, openApplyModal, isJobApplied } = useJobPortal();
  const saved = isJobSaved(job.id);
  const applied = isJobApplied(job.id);

  const formatSalary = (min: number, max: number) => {
    const kMin = Math.round(min / 1000);
    const kMax = Math.round(max / 1000);
    return `$${kMin}k – $${kMax}k`;
  };

  const getRelativeDate = (dateStr: string) => {
    const posted = new Date(dateStr);
    const diffDays = Math.floor((Date.now() - posted.getTime()) / (1000 * 3600 * 24));
    if (diffDays <= 0) return 'Today';
    if (diffDays === 1) return '1d ago';
    if (diffDays < 7) return `${diffDays}d ago`;
    return `${Math.floor(diffDays / 7)}w ago`;
  };

  if (viewMode === 'list') {
    return (
      <div className="card-premium p-5 group">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Left info */}
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-soft ring-1 ring-slate-900/5 ${job.companyColor}`}
            >
              {job.companyInitials}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to={`/jobs/${job.id}`}
                  className="text-base font-semibold font-display text-slate-900 hover-text-primary-theme transition-colors"
                >
                  {job.title}
                </Link>
                {job.featured && (
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary-light-theme">
                    Featured
                  </span>
                )}
                {applied && (
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" /> Applied
                  </span>
                )}
              </div>

              {/* Clean metadata */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{job.company}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {job.location} {job.isRemote && '(Remote)'}
                </span>
                <span aria-hidden="true">·</span>
                <span>{job.type}</span>
                <span aria-hidden="true">·</span>
                <span>{job.experienceLevel}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-slate-500">
                {job.tags.slice(0, 4).map((tag, idx) => (
                  <React.Fragment key={tag}>
                    <span>{tag}</span>
                    {idx < Math.min(job.tags.length - 1, 3) && <span aria-hidden="true">·</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            <div className="text-right">
              <div className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                {formatSalary(job.salaryMin, job.salaryMax)}
                <span className="text-xs font-normal text-slate-500 font-sans"> / yr</span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-end gap-1 mt-0.5">
                <Calendar className="w-3 h-3" />
                <span>{getRelativeDate(job.postedDate)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleSaveJob(job)}
                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                  saved
                    ? 'btn-primary-theme'
                    : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title={saved ? 'Remove from saved' : 'Save job'}
                aria-label={saved ? 'Remove from saved' : 'Save job'}
              >
                <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
              </button>

              <button
                type="button"
                onClick={() => openApplyModal(job)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  applied
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'btn-primary-theme shadow-glow'
                }`}
              >
                {applied ? 'View Application' : 'Quick Apply'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="card-premium p-5 flex flex-col justify-between group">
      <div>
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-soft ring-1 ring-slate-900/5 ${job.companyColor}`}
            >
              {job.companyInitials}
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-800">{job.company}</h3>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span className="truncate max-w-[140px]">{job.location}</span>
                {job.isRemote && <span className="text-emerald-600 font-medium">· Remote</span>}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => toggleSaveJob(job)}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              saved
                ? 'btn-primary-theme'
                : 'border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-50'
            }`}
            title={saved ? 'Remove from saved' : 'Save job'}
            aria-label={saved ? 'Remove from saved' : 'Save job'}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Job Title */}
        <div className="mt-4">
          <Link
            to={`/jobs/${job.id}`}
            className="text-base font-semibold font-display text-slate-900 hover-text-primary-theme transition-colors line-clamp-2"
          >
            {job.title}
          </Link>
          <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {job.description}
          </p>
        </div>

        {/* Metadata */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
          <span>{job.category}</span>
          <span aria-hidden="true">·</span>
          <span>{job.type}</span>
          <span aria-hidden="true">·</span>
          <span>{job.experienceLevel}</span>
        </div>

        {/* Tags */}
        <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px] text-slate-500">
          {job.tags.slice(0, 3).map((tag, idx) => (
            <React.Fragment key={tag}>
              <span>{tag}</span>
              {idx < Math.min(job.tags.length - 1, 2) && <span aria-hidden="true">·</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Card Footer: Salary + Actions */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div>
          <div className="text-[11px] text-slate-400 font-medium">Salary Range</div>
          <div className="text-sm font-bold text-slate-900 font-mono tabular-nums">
            {formatSalary(job.salaryMin, job.salaryMax)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/jobs/${job.id}`}
            className="p-2 text-slate-500 hover-text-primary-theme hover:bg-slate-50 rounded-lg transition-colors"
            title="View Details"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={() => openApplyModal(job)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              applied
                ? 'bg-slate-100 text-slate-700'
                : 'btn-primary-theme shadow-glow'
            }`}
          >
            {applied ? 'Applied' : 'Apply'}
          </button>
        </div>
      </div>
    </div>
  );
};
