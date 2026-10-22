import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Sparkles, Eye, ArrowUpRight } from 'lucide-react';
import { Job } from '../../types/job';
import { useSavedJobs } from '../../context/SavedJobsContext';
import { useCandidate } from '../../context/CandidateContext';
import { useApplication } from '../../context/ApplicationContext';

interface JobCardProps {
  job: Job;
  onApplyClick?: (job: Job) => void;
  onQuickViewClick?: (job: Job) => void;
  onSkillClick?: (skill: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onApplyClick,
  onQuickViewClick,
  onSkillClick,
}) => {
  const { isSaved, toggleSaveJob } = useSavedJobs();
  const { calculateJobMatchScore } = useCandidate();
  const { hasApplied } = useApplication();

  const saved = isSaved(job.id);
  const applied = hasApplied(job.id);
  const { score: matchScore, matching } = calculateJobMatchScore(job.skills);

  // Format salary
  const formatSalary = (min: number, max: number, currency: string) => {
    const symbol =
      currency === 'USD'
        ? '$'
        : currency === 'GBP'
        ? '£'
        : currency === 'EUR'
        ? '€'
        : currency === 'SGD'
        ? 'S$'
        : 'C$';
    const minK = Math.round(min / 1000);
    const maxK = Math.round(max / 1000);
    return `${symbol}${minK}k – ${symbol}${maxK}k`;
  };

  // Format relative date
  const formatRelativeDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return `${Math.floor(diffDays / 7)}w ago`;
  };

  return (
    <article className="group relative bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-soft transition-all duration-200 hover:border-slate-300 hover:shadow-card-hover hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5 min-w-0">
          {/* Company Monogram Avatar with custom brand color */}
          <div
            className="w-12 h-12 rounded-xl text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-md transition-transform group-hover:scale-105 ring-1 ring-white/20"
            style={{ backgroundColor: job.brandColor || '#4F46E5' }}
          >
            {job.companyInitial}
          </div>

          <div className="min-w-0">
            {/* Clean unboxed metadata kicker */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mb-1">
              <span className="font-semibold text-slate-900">{job.company}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>{job.department}</span>

              {job.featured && (
                <>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="inline-flex items-center gap-0.5 text-indigo-700 font-semibold">
                    <Sparkles className="w-3 h-3" />
                    Featured
                  </span>
                </>
              )}

              {job.urgent && (
                <>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-amber-700 font-semibold">Actively Hiring</span>
                </>
              )}
            </div>

            {/* Title */}
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">
              <Link
                to={`/jobs/${job.id}`}
                className="hover:text-indigo-600 focus:outline-hidden transition-colors"
              >
                {job.title}
              </Link>
            </h3>
          </div>
        </div>

        {/* Top Right: Match score pill & Bookmark action */}
        <div className="flex items-center gap-2 shrink-0">
          {matchScore > 0 && (
            <span
              className={`hidden sm:inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                matchScore >= 60
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
              }`}
              title={`${matching.length} of ${job.skills.length} skills match your profile`}
            >
              <Sparkles className="w-3 h-3" />
              <span>{matchScore}% Match</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => toggleSaveJob(job)}
            className={`p-2 rounded-lg transition-colors ${
              saved
                ? 'text-slate-900 bg-slate-100 hover:bg-slate-200'
                : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
            }`}
            aria-label={saved ? 'Remove from saved' : 'Save job to list'}
            title={saved ? 'Job is saved' : 'Save job'}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-slate-900' : ''}`} />
          </button>
        </div>
      </div>

      {/* Description Snippet */}
      <p className="mt-2.5 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
        {job.description}
      </p>

      {/* Skills list as interactive tags */}
      <div className="mt-3.5 flex flex-wrap items-center gap-1.5 text-xs">
        {job.skills.map((skill) => {
          const isMatch = matching.some((m) => m.toLowerCase() === skill.toLowerCase());
          return (
            <button
              key={skill}
              type="button"
              onClick={() => onSkillClick?.(skill)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                isMatch
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title={`Filter by ${skill}`}
            >
              {isMatch && '✓ '}
              {skill}
            </button>
          );
        })}
      </div>

      {/* Bottom Metadata & Actions Bar */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* Unboxed Metadata with clean separators */}
        <div className="flex flex-wrap items-center gap-2 text-slate-600">
          <span className="font-semibold text-slate-900">{job.type}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>{job.location}</span>
          {job.isRemote && (
            <>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-emerald-700 font-medium">100% Remote</span>
            </>
          )}
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="font-mono tabular-nums font-bold text-slate-900">
            {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="text-slate-400">{formatRelativeDate(job.postedAt)}</span>

          {job.applicantsCount && (
            <>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="font-mono text-slate-500 tabular-nums">
                {job.applicantsCount} applicants
              </span>
            </>
          )}
        </div>

        {/* Action Links */}
        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
          {onQuickViewClick && (
            <button
              type="button"
              onClick={() => onQuickViewClick(job)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100/80 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          )}

          <Link
            to={`/jobs/${job.id}`}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100/80 transition-colors"
          >
            <span>Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          {applied ? (
            <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 rounded-lg border border-emerald-200">
              Applied
            </span>
          ) : (
            onApplyClick && (
              <button
                type="button"
                onClick={() => onApplyClick(job)}
                className="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-lg transition-colors shadow-2xs hover:shadow-xs"
              >
                Apply
              </button>
            )
          )}
        </div>
      </div>
    </article>
  );
};
