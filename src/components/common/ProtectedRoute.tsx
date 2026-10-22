import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, ArrowLeft } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: 'candidate' | 'employer' | 'admin';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    if (role === 'admin') {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white border border-slate-200/90 rounded-2xl p-8 text-center shadow-soft space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-2xs">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200/80">
                403 Forbidden · Restricted Area
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-950 mt-3">
                Administrative Privileges Required
              </h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                You do not possess root administrator authorization to view this management console. This access boundary is restricted to verified platform administrators.
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Careers Homepage</span>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
