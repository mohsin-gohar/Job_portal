import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jobsApi, getStoredJobs } from '../services/api';
import { Company, Job } from '../types/job';
import { JobCard } from '../components/jobs/JobCard';
import { ApplicationModal } from '../components/jobs/ApplicationModal';
import { QuickViewDrawer } from '../components/jobs/QuickViewDrawer';
import {
  Building,
  MapPin,
  Users,
  Globe,
  Calendar,
  ArrowLeft,
  Briefcase,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export const CompanyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [companyJobs, setCompanyJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);
  const [quickViewJob, setQuickViewJob] = useState<Job | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const c = await jobsApi.getCompanyById(id);
        setCompany(c.data);
        const all = getStoredJobs();
        const matched = all.filter((j) => j.companyId === id || j.company.toLowerCase() === c.data.name.toLowerCase());
        setCompanyJobs(matched);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse space-y-6">
        <div className="h-6 bg-slate-200 rounded w-1/4" />
        <div className="h-40 bg-white border border-slate-200 rounded-xl" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900">Company Not Found</h2>
        <div className="mt-4">
          <Link
            to="/companies"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Companies</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80" alt="" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover opacity-[0.12] -z-10" />
      {/* Back button */}
      <Link
        to="/companies"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>All Companies</span>
      </Link>

      {/* Company Header Box */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-xl text-white font-bold text-2xl flex items-center justify-center shrink-0 shadow-sm"
              style={{ backgroundColor: company.brandColor }}
            >
              {company.initial}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                  {company.name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-800">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Verified Employer
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="font-semibold text-slate-800">{company.category}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{company.location}</span>
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono tabular-nums">{company.employees} employees</span>
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>Founded {company.foundedYear}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start">
            <a
              href={company.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>Visit Website</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Description & Tech Stack */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-3xl">
            {company.description}
          </p>

          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-900 block">Primary Tech Stack & Tools:</span>
            <div className="flex flex-wrap gap-1.5">
              {company.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Open Roles Listing */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-slate-700" />
            <span>Open Opportunities at {company.name}</span>
            <span className="font-mono tabular-nums text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded-full text-slate-700">
              {companyJobs.length}
            </span>
          </h2>
        </div>

        <div className="space-y-4">
          {companyJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onApplyClick={(j) => setSelectedJobForApply(j)}
              onQuickViewClick={(j) => setQuickViewJob(j)}
            />
          ))}
        </div>
      </section>

      {/* Quick View Drawer */}
      <QuickViewDrawer
        job={quickViewJob}
        onClose={() => setQuickViewJob(null)}
        onApply={(j) => setSelectedJobForApply(j)}
      />

      {/* Company insights */}
      <section className="grid sm:grid-cols-2 gap-4 pt-2">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-1.5">Culture & values</h3>
          <p className="text-xs text-slate-600 leading-relaxed">Collaborative, async-first teams with a strong focus on craft, ownership, and continuous learning.</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-1.5">Benefits</h3>
          <p className="text-xs text-slate-600 leading-relaxed">Competitive compensation, equity, flexible hours, and dedicated learning budgets for every employee.</p>
        </div>
      </section>

      {/* Application Modal */}
      <ApplicationModal
        job={selectedJobForApply}
        isOpen={Boolean(selectedJobForApply)}
        onClose={() => setSelectedJobForApply(null)}
      />
    </div>
  );
};
