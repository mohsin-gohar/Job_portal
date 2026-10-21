import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <main className="flex-1 flex items-center justify-center px-6 py-20">
      <div className="text-center max-w-md">
        <div className="mx-auto w-20 h-20 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center mb-6">
          <Compass className="w-10 h-10 text-[var(--color-primary)]" />
        </div>
        <p className="text-6xl font-black tracking-tight text-[var(--color-primary)] mb-2">404</p>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h1>
        <p className="text-slate-600 mb-8">
          The page you're looking for doesn't exist or may have been moved. Let's get you back to exploring jobs.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:opacity-90 transition"
        >
          Back to Job Explorer
        </Link>
      </div>
    </main>
  );
};
