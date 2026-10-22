import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="bg-white border border-rose-200 rounded-lg p-8 sm:p-12 text-center max-w-lg mx-auto">
      <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mx-auto text-rose-600 mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 tracking-tight">API Request Failed</h3>
      <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed max-w-md mx-auto">
        {error}
      </p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>
      </div>
    </div>
  );
};
