import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
  resetText?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No jobs found matching your criteria',
  description = 'Try widening your search terms, removing active filters, or selecting all categories.',
  onReset,
  resetText = 'Clear All Filters',
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-10 sm:p-14 text-center max-w-lg mx-auto">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-500 mb-4">
        <SearchX className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 tracking-tight">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed max-w-sm mx-auto">
        {description}
      </p>
      {onReset && (
        <div className="mt-6">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{resetText}</span>
          </button>
        </div>
      )}
    </div>
  );
};
