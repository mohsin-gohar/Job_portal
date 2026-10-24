import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center space-y-6">
        <div className="mx-auto w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center">
          <span className="text-3xl font-display font-bold text-slate-400">404</span>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
            Page not found
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            The page you are looking for doesn&apos;t exist or has been moved. Use the links below to get back on track.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-900 text-sm font-semibold rounded-xl border border-slate-200 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Browse Jobs</span>
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-slate-600 hover:text-slate-950 text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};