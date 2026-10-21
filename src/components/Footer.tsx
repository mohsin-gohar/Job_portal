import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, X } from 'lucide-react';

export const Footer: React.FC = () => {
  const [modalContent, setModalContent] = useState<{ title: string; text: string } | null>(null);

  const openInfoModal = (title: string, text: string) => {
    setModalContent({ title, text });
  };

  return (
    <>
      <footer className="border-t border-slate-200 bg-white mt-20 text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-7 h-7 rounded-lg btn-primary-theme text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  <Briefcase className="w-4 h-4" />
                </div>
                <span className="font-bold tracking-tight text-slate-900 group-hover:text-[var(--color-primary)] transition-colors">
                  NextRole
                </span>
              </Link>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                NextRole is a modern, responsive job portal connecting verified developers, designers, and business operators with leading companies worldwide.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Explore Roles
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link
                    to="/?category=Engineering"
                    className="text-slate-600 hover-text-primary-theme transition-colors inline-block"
                  >
                    Engineering & Architecture
                  </Link>
                </li>
                <li>
                  <Link
                    to="/?category=Design"
                    className="text-slate-600 hover-text-primary-theme transition-colors inline-block"
                  >
                    Product & UI/UX Design
                  </Link>
                </li>
                <li>
                  <Link
                    to="/?category=Data%20%26%20AI"
                    className="text-slate-600 hover-text-primary-theme transition-colors inline-block"
                  >
                    Data Science & AI / ML
                  </Link>
                </li>
                <li>
                  <Link
                    to="/?category=Product"
                    className="text-slate-600 hover-text-primary-theme transition-colors inline-block"
                  >
                    Product Management
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Candidate Resources
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link
                    to="/saved"
                    className="text-slate-600 hover-text-primary-theme transition-colors inline-block"
                  >
                    Saved Jobs Watchlist
                  </Link>
                </li>
                <li>
                  <Link
                    to="/applications"
                    className="text-slate-600 hover-text-primary-theme transition-colors inline-block"
                  >
                    My Applications Tracker
                  </Link>
                </li>
                <li>
                  <Link
                    to="/?remoteOnly=true"
                    className="text-slate-600 hover-text-primary-theme transition-colors inline-block"
                  >
                    Remote-Only Positions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/post-job"
                    className="text-slate-600 hover-text-primary-theme transition-colors inline-block"
                  >
                    Post a Job Opening
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                About NextRole
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Assignment Project: Job Portal built with React 19, Bootstrap 5, and full REST API integration.
              </p>
              <div className="mt-3 text-xs text-slate-400 font-mono">
                React 19 · REST API · Bootstrap 5
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© {new Date().getFullYear()} NextRole Job Portal. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() =>
                  openInfoModal(
                    'Privacy Policy',
                    'NextRole stores your saved bookmarks and job application history locally within your browser session. No personal data or tracking cookies are sold to third parties.'
                  )
                }
                className="hover-text-primary-theme transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={() =>
                  openInfoModal(
                    'Terms of Service',
                    'All job listings published on NextRole are verified for salary accuracy and active hiring status. Employers agree to abide by fair compensation transparency laws.'
                  )
                }
                className="hover-text-primary-theme transition-colors cursor-pointer"
              >
                Terms of Service
              </button>
              <button
                type="button"
                onClick={() =>
                  openInfoModal(
                    'Verification Standards',
                    'Positions listed as Verified include direct recruiter contacts, confirmed compensation ranges, and direct transmission guarantees without intermediate recruiters.'
                  )
                }
                className="hover-text-primary-theme transition-colors cursor-pointer"
              >
                Verification Standards
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Info Dialog Modal for Policy/Terms Links */}
      {modalContent && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">{modalContent.title}</h3>
              <button
                type="button"
                onClick={() => setModalContent(null)}
                className="p-1 text-slate-400 hover:text-slate-900 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{modalContent.text}</p>
            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setModalContent(null)}
                className="px-4 py-2 btn-primary-theme rounded-lg text-xs font-semibold cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
