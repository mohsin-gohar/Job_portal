import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Github, Linkedin, Twitter, Mail } from 'lucide-react';

export const Footer = memo(() => {
  const columns: { title: string; links: { label: string; to: string }[] }[] = [
    {
      title: 'Product',
      links: [
        { label: 'Browse Jobs', to: '/' },
        { label: 'Explore Directory', to: '/explore' },
        { label: 'Companies', to: '/companies' },
        { label: 'Talent Directory', to: '/talent' },
      ],
    },
    {
      title: 'For Recruiters',
      links: [
        { label: 'Post a Job', to: '/post-job' },
        { label: 'ATS Console', to: '/ats' },
        { label: 'Talent Sourcing', to: '/talent' },
        { label: 'Candidate Pipeline', to: '/ats' },
        { label: 'Employer Branding', to: '/companies' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Saved Roles', to: '/saved' },
        { label: 'My Applications', to: '/applications' },
        { label: 'About Lumina', to: '/about' },
        { label: 'Contact Us', to: '/contact' },
        { label: 'Help Center', to: '/' },
        { label: 'Privacy Policy', to: '/' },
      ],
    },
  ];

  return (
    <footer className="relative mt-24 border-t border-slate-200/90 bg-white">
      {/* Subtle top accent divider */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <span className="w-8 h-8 rounded-lg bg-slate-950 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                <span className="tracking-tighter font-extrabold text-white">L</span>
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-slate-950 tracking-tight">Lumina</span>
                <span className="text-xs font-semibold text-slate-400 border-l border-slate-300 pl-1.5">
                  Careers
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              The premium career ecosystem connecting world-class engineers, designers, and product leaders with the
              technology companies shaping tomorrow.
            </p>
            <div className="flex items-center gap-2 pt-2">
              {[
                { Icon: Twitter, href: '#', label: 'Twitter' },
                { Icon: Linkedin, href: '#', label: 'LinkedIn' },
                { Icon: Github, href: '#', label: 'GitHub' },
                { Icon: Mail, href: '#', label: 'Email' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200/80 border border-slate-200/70 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors shadow-2xs"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-slate-600 hover:text-indigo-600 transition-colors font-medium"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Minimalist realistic stats strip */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-slate-200/80">
          {[
            { value: '50', label: 'Open Roles' },
            { value: '30', label: 'Verified Companies' },
            { value: '165+', label: 'Active Candidates' },
            { value: '96%', label: 'Salary Parity' },
          ].map((s) => (
            <div key={s.label} className="text-center p-3 rounded-xl bg-slate-50/70 border border-slate-200/60">
              <div className="text-2xl font-display font-bold text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Bottom copyright & meta info */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Lumina Careers. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span>React 19 + REST Architecture</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Enterprise Talent CRM</span>
          </div>
        </div>
      </div>
    </footer>
  );
});
