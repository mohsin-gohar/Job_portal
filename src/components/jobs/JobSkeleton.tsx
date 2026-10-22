import React from 'react';

export const JobSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 animate-pulse space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5 w-full">
          {/* Avatar skeleton */}
          <div className="w-10 h-10 rounded-md bg-slate-200 shrink-0" />
          <div className="space-y-2 w-3/4">
            {/* Kicker */}
            <div className="h-3 bg-slate-200 rounded w-1/3" />
            {/* Title */}
            <div className="h-5 bg-slate-200 rounded w-2/3" />
          </div>
        </div>
        {/* Bookmark icon skeleton */}
        <div className="w-8 h-8 rounded bg-slate-100 shrink-0" />
      </div>

      {/* Description lines */}
      <div className="space-y-2 pt-1">
        <div className="h-3.5 bg-slate-200 rounded w-full" />
        <div className="h-3.5 bg-slate-200 rounded w-4/5" />
      </div>

      {/* Skills line */}
      <div className="h-3 bg-slate-100 rounded w-1/2" />

      {/* Bottom bar */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
        <div className="h-3.5 bg-slate-200 rounded w-1/2" />
        <div className="h-7 bg-slate-200 rounded w-20 shrink-0" />
      </div>
    </div>
  );
};
