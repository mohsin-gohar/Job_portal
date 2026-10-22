import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationData } from '../../types/job';

interface PaginationProps {
  meta: PaginationData;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  meta,
  onPageChange,
  onLimitChange,
}) => {
  const { currentPage, totalPages, totalItems, itemsPerPage } = meta;

  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers with smart ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Summary with tabular figures */}
      <div className="text-xs text-slate-500 font-mono tabular-nums">
        Showing <span className="font-semibold text-slate-800">{startItem}</span>–
        <span className="font-semibold text-slate-800">{endItem}</span> of{' '}
        <span className="font-semibold text-slate-800">{totalItems}</span> jobs
      </div>

      {/* Page controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 text-xs font-mono text-slate-400 select-none"
                >
                  …
                </span>
              );
            }

            const pageNum = Number(page);
            const isCurrent = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                aria-current={isCurrent ? 'page' : undefined}
                className={`min-w-8 h-8 px-2 text-xs font-mono tabular-nums font-medium rounded-md transition-colors ${
                  isCurrent
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Per page selector */}
      {onLimitChange && (
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="px-2 py-1 text-xs font-mono tabular-nums bg-white border border-slate-200 rounded-md text-slate-700 focus:outline-hidden"
          >
            <option value="6">6</option>
            <option value="9">9</option>
            <option value="12">12</option>
          </select>
        </div>
      )}
    </div>
  );
};
