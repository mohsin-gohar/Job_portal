import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';
import { JobApplication } from '../types/job';
import {
  FileCheck,
  ArrowLeft,
  ArrowUpRight,
  Clock,
  FileText,
  CheckCircle2,
  Calendar,
  Sparkles,
  Building,
} from 'lucide-react';

const STAGES: JobApplication['status'][] = [
  'Submitted',
  'In Review',
  'Interview Scheduled',
  'Offer Extended',
];

export const ApplicationsPage: React.FC = () => {
  const { applications } = useApplication();
  const [statusFilter, setStatusFilter] = useState<'All' | JobApplication['status']>('All');

  const filtered = applications.filter((app) => {
    if (statusFilter === 'All') return true;
    return app.status === statusFilter;
  });

  const getStageIndex = (status: JobApplication['status']) => {
    return STAGES.indexOf(status);
  };

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header Card */}
      <div className="relative bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-soft overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-32 pointer-events-none overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2000&q=80"
            alt=""
            className="w-full h-full object-cover object-center opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/90 to-white" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="text-slate-500 hover:text-slate-900 transition-colors p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80"
                aria-label="Back to jobs directory"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <h1 className="text-2xl font-bold text-slate-950 tracking-tight flex items-center gap-2.5">
                <span>Candidate Application Tracker</span>
                <span className="text-sm font-mono tabular-nums text-slate-500 font-normal">
                  ({applications.length})
                </span>
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real-time pipeline monitoring, interview stages, and resume verification records.
            </p>
          </div>

          <Link
            to="/"
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-xs hover:shadow-sm"
          >
            <span>Explore More Openings</span>
          </Link>
        </div>
      </div>

      {/* Recruitment Status Filter Chips */}
      {applications.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Pipeline Stage:</span>
          {(['All', 'Submitted', 'In Review', 'Interview Scheduled', 'Offer Extended'] as const).map(
            (stage) => {
              const count =
                stage === 'All'
                  ? applications.length
                  : applications.filter((a) => a.status === stage).length;
              return (
                <button
                  key={stage}
                  type="button"
                  onClick={() => setStatusFilter(stage)}
                  className={`px-3 py-1 rounded-md font-medium transition-colors ${
                    statusFilter === stage
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {stage} <span className="font-mono tabular-nums opacity-75">({count})</span>
                </button>
              );
            }
          )}
        </div>
      )}

      {applications.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center max-w-md mx-auto my-12 space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">No applications submitted yet</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              When you submit your application and resume to any job, you can track response times and stages right here.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors shadow-xs"
            >
              Explore Job Listings
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {filtered.map((app) => {
            const currentStageIdx = getStageIndex(app.status);

            return (
              <article
                key={app.id}
                className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-5 shadow-2xs hover:border-slate-300 transition-colors"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-bold text-slate-900">{app.company}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="font-mono tabular-nums text-slate-500">Ref #{app.id}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-emerald-700 font-medium">Direct Submission</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-0.5">
                      {app.jobTitle}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{app.status}</span>
                    </span>
                  </div>
                </div>

                {/* Progress Pipeline Stepper */}
                <div className="pt-2 pb-1">
                  <div className="grid grid-cols-4 gap-2">
                    {STAGES.map((stage, idx) => {
                      const isComplete = idx <= currentStageIdx;
                      const isCurrent = idx === currentStageIdx;

                      return (
                        <div key={stage} className="space-y-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all ${
                              isComplete ? 'bg-slate-900' : 'bg-slate-100'
                            }`}
                          />
                          <p
                            className={`text-[11px] truncate ${
                              isCurrent
                                ? 'font-bold text-slate-900'
                                : isComplete
                                ? 'text-slate-700 font-medium'
                                : 'text-slate-400'
                            }`}
                          >
                            {stage}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Candidate Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-200/70">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Candidate</span>
                    <span className="font-semibold text-slate-900">{app.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Contact Email</span>
                    <span className="font-mono text-slate-800">{app.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Notice Period</span>
                    <span className="text-slate-800">{app.noticePeriod}</span>
                  </div>
                </div>

                {/* Resume & Cover note */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-900">{app.resumeFileName}</span>
                    {app.portfolioUrl && (
                      <>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <a
                          href={app.portfolioUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 hover:underline"
                        >
                          Portfolio Link
                        </a>
                      </>
                    )}
                  </div>
                  <p className="text-slate-600 bg-white p-3 rounded-md border border-slate-200/80 leading-relaxed italic">
                    "{app.coverLetter}"
                  </p>
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2 font-mono tabular-nums">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      Submitted on {new Date(app.appliedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <Link
                    to={`/jobs/${app.jobId}`}
                    className="inline-flex items-center gap-1 text-slate-800 hover:text-indigo-600 font-semibold self-end sm:self-auto transition-colors"
                  >
                    <span>View Role Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
      {/* Tips */}
      <section className="grid sm:grid-cols-2 gap-4 pt-2">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-1.5">Track statuses</h3>
          <p className="text-xs text-slate-600 leading-relaxed">Keep an eye on Pending, Reviewed, and Interview stages to know when to follow up.</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-1.5">Stay organized</h3>
          <p className="text-xs text-slate-600 leading-relaxed">Withdraw roles you're no longer interested in to keep your pipeline clean.</p>
        </div>
      </section>
    </div>
  );
};
