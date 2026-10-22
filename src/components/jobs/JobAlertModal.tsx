import React, { useState } from 'react';
import { X, Bell, CheckCircle2 } from 'lucide-react';
import { useCandidate } from '../../context/CandidateContext';

interface JobAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: string;
}

export const JobAlertModal: React.FC<JobAlertModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'All',
}) => {
  const { addJobAlert } = useCandidate();
  const [email, setEmail] = useState('');
  const [keywords, setKeywords] = useState('');
  const [category, setCategory] = useState(defaultCategory);
  const [location, setLocation] = useState('Remote');
  const [frequency, setFrequency] = useState<'Daily' | 'Weekly'>('Daily');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please provide a valid email address');
      return;
    }

    addJobAlert({
      email: email.trim(),
      keywords: keywords.trim(),
      category,
      location,
      frequency,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
    >
      <div
        className="bg-white rounded-lg border border-slate-200 shadow-xl w-full max-w-md p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-800">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Create Job Alert</h3>
              <p className="text-xs text-slate-500">Get notified when new matching roles launch</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900">Job Alert Subscribed!</h4>
            <p className="text-xs text-slate-500">
              We'll send curated notifications directly to <span className="font-semibold text-slate-800">{email}</span>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="alert-email" className="block text-xs font-semibold text-slate-800 mb-1">
                Your Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                id="alert-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="you@company.com"
                className={`w-full px-3 py-2 text-xs bg-white border rounded-md text-slate-900 focus:outline-hidden ${
                  error ? 'border-rose-400' : 'border-slate-200 focus:border-slate-800'
                }`}
              />
              {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
            </div>

            <div>
              <label htmlFor="alert-keywords" className="block text-xs font-semibold text-slate-800 mb-1">
                Target Keywords / Roles
              </label>
              <input
                id="alert-keywords"
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g. Senior Frontend, Staff AI, Rust"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md text-slate-900 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="alert-category" className="block text-xs font-semibold text-slate-800 mb-1">
                  Department
                </label>
                <select
                  id="alert-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-800 focus:outline-hidden"
                >
                  <option value="All">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Data & AI">Data & AI</option>
                  <option value="Design">Design</option>
                  <option value="Product">Product</option>
                </select>
              </div>

              <div>
                <label htmlFor="alert-freq" className="block text-xs font-semibold text-slate-800 mb-1">
                  Frequency
                </label>
                <select
                  id="alert-freq"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as 'Daily' | 'Weekly')}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-800 focus:outline-hidden"
                >
                  <option value="Daily">Daily Digest</option>
                  <option value="Weekly">Weekly Summary</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800"
              >
                Create Alert
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
