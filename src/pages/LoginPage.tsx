import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Briefcase, Building, CheckCircle2 } from 'lucide-react';
import { useAuth, UserRole } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState<'candidate' | 'employer'>('candidate');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide both your email address and password.');
      return;
    }

    setLoading(true);
    const res = await login(email, password, accountType);
    setLoading(false);

    if (!res.success) {
      setError(res.error || 'Invalid email address or password. Please try again.');
      return;
    }

    // Role-based silent routing:
    if (res.role === 'admin') {
      showToast('Administrator Authenticated', 'success', 'Entering Root Management Console...');
      navigate('/admin');
    } else if (res.role === 'employer') {
      showToast('Hiring Team Console', 'success', 'Welcome back to your ATS pipeline.');
      navigate('/ats');
    } else {
      showToast('Welcome back', 'success', 'Successfully signed in to Lumina Careers.');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Column: Premium Interactive Login Card */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md space-y-7">
          {/* Brand Monogram */}
          <div className="space-y-3">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-slate-950 text-white flex items-center justify-center font-bold text-sm shadow-xs transition-transform group-hover:scale-105">
                <span className="tracking-tighter font-extrabold text-white">L</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold text-slate-950 tracking-tight">Lumina</span>
                <span className="text-xs font-semibold text-slate-400 border-l border-slate-300 pl-1.5">
                  Careers
                </span>
              </div>
            </Link>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
                Sign in to your account
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Access your applications, saved roles, or recruiter dashboard.
              </p>
            </div>
          </div>

          {/* Account Category Switcher (Candidate vs Employer only — zero admin indication) */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => {
                setAccountType('candidate');
                setError('');
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                accountType === 'candidate'
                  ? 'bg-white text-slate-950 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-slate-500" />
              <span>Jobseeker</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAccountType('employer');
                setError('');
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                accountType === 'employer'
                  ? 'bg-white text-slate-950 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building className="w-3.5 h-3.5 text-slate-500" />
              <span>Hiring Team</span>
            </button>
          </div>

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Work or Personal Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    accountType === 'employer'
                      ? 'recruiter@company.com'
                      : 'developer@example.com'
                  }
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-slate-400 focus:ring-3 focus:ring-slate-950/5 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => showToast('Password reset link sent to registered email', 'info')}
                  className="text-xs text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-slate-400 focus:ring-3 focus:ring-slate-950/5 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-xs text-rose-700 font-medium animate-fade-in">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-slate-950 hover:bg-slate-800 disabled:opacity-60 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign in to Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Bottom helper */}
          <div className="pt-2 text-center text-xs text-slate-500">
            <span>Don't have a Lumina account yet? </span>
            <Link
              to="/register"
              className="font-semibold text-slate-950 hover:underline"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column: Architectural Editorial Showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden items-end p-12 text-white">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80"
          alt="Modern Architectural Headquarters"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

        <div className="relative z-10 space-y-4 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-slate-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Enterprise Talent Infrastructure</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
            "Lumina gave our engineering leads direct access to world-class Staff talent within 48 hours."
          </h2>

          <div className="pt-2 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              SL
            </div>
            <div>
              <div className="text-xs font-bold text-white">Sarah Lindqvist</div>
              <div className="text-[11px] text-slate-400">VP of Engineering at Linear Labs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
