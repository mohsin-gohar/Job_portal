import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, X, Globe, Mail, MessageCircle, Send, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const [modalContent, setModalContent] = useState<{ title: string; text: string } | null>(null);

  const openInfoModal = (title: string, text: string) => {
    setModalContent({ title, text });
  };

  const socialLinks = [
    { label: 'Website', icon: Globe },
    { label: 'Email', icon: Mail },
    { label: 'Community', icon: MessageCircle },
    { label: 'Share', icon: Send },
  ];

  return (
    <>
      <footer className="relative mt-24 bg-slate-950 text-slate-300 overflow-hidden">
        {/* Top accent line & ambient glow */}
        <div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[42rem] h-[42rem] aurora"
          style={{ backgroundColor: 'var(--color-primary)', opacity: 0.08 }}
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl btn-primary-theme text-white flex items-center justify-center font-bold text-base shadow-glow">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold font-display tracking-tight text-white group-hover:text-[var(--color-primary)] transition-colors">
                    NextRole
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold tracking-[0.18em] uppercase">
                    Job Portal & Careers
                  </span>
                </div>
              </Link>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                A modern job portal connecting verified developers, designers, and business operators with leading companies worldwide.
              </p>
              <div className="flex items-center gap-2.5 pt-1">
                {socialLinks.map(({ label, icon: Icon }) => (
                  <a
                    key={label}
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    aria-label={label}
                    title={label}
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-[var(--color-primary)] hover:border-transparent transition-colors flex items-center justify-center"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Explore Roles */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                Explore Roles
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link to="/?category=Engineering" className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5">
                    <ArrowRight className="w-3 h-3 text-slate-600" /> Engineering & Architecture
                  </Link>
                </li>
                <li>
                  <Link to="/?category=Design" className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5">
                    <ArrowRight className="w-3 h-3 text-slate-600" /> Product & UI/UX Design
                  </Link>
                </li>
                <li>
                  <Link to="/?category=Data%20%26%20AI" className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5">
                    <ArrowRight className="w-3 h-3 text-slate-600" /> Data Science & AI / ML
                  </Link>
                </li>
                <li>
                  <Link to="/?category=Product" className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5">
                    <ArrowRight className="w-3 h-3 text-slate-600" /> Product Management
                  </Link>
                </li>
              </ul>
            </div>

            {/* Candidate Resources */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                Candidate Resources
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link to="/saved" className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5">
                    <ArrowRight className="w-3 h-3 text-slate-600" /> Saved Jobs Watchlist
                  </Link>
                </li>
                <li>
                  <Link to="/applications" className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5">
                    <ArrowRight className="w-3 h-3 text-slate-600" /> My Applications Tracker
                  </Link>
                </li>
                <li>
                  <Link to="/?remoteOnly=true" className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5">
                    <ArrowRight className="w-3 h-3 text-slate-600" /> Remote-Only Positions
                  </Link>
                </li>
                <li>
                  <Link to="/post-job" className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5">
                    <ArrowRight className="w-3 h-3 text-slate-600" /> Post a Job Opening
                  </Link>
                </li>
              </ul>
            </div>

            {/* About / Company */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                About NextRole
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                A premium job portal built with React 19, Bootstrap 5, and full REST API integration.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    openInfoModal(
                      'Privacy Policy',
                      'NextRole stores your saved bookmarks and job application history locally within your browser session. No personal data or tracking cookies are sold to third parties.'
                    )
                  }
                  className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  Privacy
                </button>
                <button
                  type="button"
                  onClick={() =>
                    openInfoModal(
                      'Terms of Service',
                      'All job listings published on NextRole are verified for salary accuracy and active hiring status. Employers agree to abide by fair compensation transparency laws.'
                    )
                  }
                  className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  Terms
                </button>
                <button
                  type="button"
                  onClick={() =>
                    openInfoModal(
                      'Verification Standards',
                      'Positions listed as Verified include direct recruiter contacts, confirmed compensation ranges, and direct transmission guarantees without intermediate recruiters.'
                    )
                  }
                  className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  Verification
                </button>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© {new Date().getFullYear()} NextRole Job Portal. All rights reserved.</p>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10">React 19</span>
              <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10">REST API</span>
              <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10">Bootstrap 5</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Info Dialog Modal for Policy/Terms Links */}
      {modalContent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold font-display text-slate-900">{modalContent.title}</h3>
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
