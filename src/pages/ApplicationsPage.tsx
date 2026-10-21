import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle2, Clock, Calendar, ArrowRight, ExternalLink } from 'lucide-react';
import { useJobPortal } from '../context/JobPortalContext';

export const ApplicationsPage: React.FC = () => {
  const { applications } = useJobPortal();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Submitted':
        return (
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-light-theme flex items-center gap-1">
            <Clock className="w-3 h-3 text-primary-theme" /> Submitted
          </span>
        );
      case 'In Review':
        return (
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
            <Clock className="w-3 h-3" /> In Review
          </span>
        );
      case 'Interview Scheduled':
        return (
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Interview Scheduled
          </span>
        );
      default:
        return (
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header banner */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-theme" />
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                My Job Applications
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Track your application status, review submitted cover notes, and monitor response stages.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 font-mono tabular-nums">
              {applications.length} {applications.length === 1 ? 'application' : 'applications'}
            </span>
            <Link
              to="/"
              className="px-4 py-2 btn-primary-theme rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>Explore Roles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Applications list */}
        {applications.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center space-y-4 max-w-xl mx-auto shadow-2xs">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
              <FileText className="w-7 h-7" />
            </div>
            <h2 className="text-base font-bold text-slate-900">No Applications Submitted Yet</h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
              When you submit your application and resume for any job opening, your submission reference and review status will appear here.
            </p>
            <div className="pt-2">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 btn-primary-theme rounded-xl text-xs font-semibold transition-colors shadow-sm cursor-pointer"
              >
                <span>Browse & Apply for Positions</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs hover:border-slate-300 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] font-mono text-slate-400 uppercase">
                      ID: {app.id}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{app.jobTitle}</h3>
                    <div className="text-xs text-slate-600 font-medium">{app.company}</div>
                  </div>

                  <div className="flex sm:flex-col items-start sm:items-end gap-2">
                    {getStatusBadge(app.status)}
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" />
                      Applied on {app.appliedDate}
                    </span>
                  </div>
                </div>

                {/* Candidate details row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                      Applicant
                    </span>
                    <span className="font-semibold text-slate-800">{app.applicantName}</span>
                    <div className="text-slate-500 truncate">{app.email}</div>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                      Attached Document
                    </span>
                    <span className="font-semibold text-slate-800 truncate block">
                      {app.resumeFileName}
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">{app.resumeFileSize}</span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                        Current Review Stage
                      </span>
                      <span className="font-semibold text-slate-800">Recruiter Evaluation</span>
                    </div>
                    <Link
                      to={`/jobs/${app.jobId}`}
                      className="text-primary-theme no-underline hover:opacity-80 flex items-center gap-1 text-[11px] font-semibold pt-1 transition-opacity"
                    >
                      <span>View Original Job</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {/* Cover letter snippet */}
                <div className="pt-2 text-xs text-slate-500 border-t border-slate-100">
                  <span className="font-semibold text-slate-700">Submitted Statement: </span>
                  <span className="italic line-clamp-2">&quot;{app.coverLetter}&quot;</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
