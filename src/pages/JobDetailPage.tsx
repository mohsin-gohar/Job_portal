import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  MapPin,
  Calendar,
  Briefcase,
  CheckCircle,
  ExternalLink,
  Check,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useJobDetails } from '../hooks/useJobs';
import { useJobPortal } from '../context/JobPortalContext';
import { JobCard } from '../components/JobCard';
import { jobApi } from '../services/api';
import { Job } from '../types/job';
import teamCultureImg from '../assets/images/team_culture_banner_1790882887201.jpg';
import interviewImg from '../assets/images/interview_session_1790882900579.jpg';

export const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { job, loading, error, refetch } = useJobDetails(id);
  const { isJobSaved, toggleSaveJob, openApplyModal, isJobApplied, showNotification } = useJobPortal();

  const [similarJobs, setSimilarJobs] = useState<Job[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (job) {
      jobApi
        .getJobs({ category: job.category }, 1, 3)
        .then((res) => {
          setSimilarJobs(res.data.filter((j) => j.id !== job.id).slice(0, 2));
        })
        .catch(() => {});
    }
  }, [job]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    showNotification('Job link copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="h-4 bg-slate-200 rounded w-28 animate-pulse" />
          <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-4 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-200 rounded-2xl" />
              <div className="space-y-2 flex-1">
                <div className="h-6 bg-slate-200 rounded w-1/2" />
                <div className="h-4 bg-slate-100 rounded w-1/4" />
              </div>
            </div>
            <div className="h-4 bg-slate-100 rounded w-full pt-4" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-4">
          <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto border border-red-200">
            <Briefcase className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Position Not Found</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {error || 'This job listing might have been filled, removed, or expired.'}
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 btn-primary-theme rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              Browse All Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const saved = isJobSaved(job.id);
  const applied = isJobApplied(job.id);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Back navigation */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover-text-primary-theme transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Jobs</span>
          </Link>
        </div>

        {/* Hero Header Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start gap-4 sm:gap-5">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0 shadow-sm ${job.companyColor}`}
              >
                {job.companyInitials}
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {job.title}
                  </h1>
                  {job.featured && (
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-primary-light-theme">
                      Featured
                    </span>
                  )}
                  {applied && (
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Applied
                    </span>
                  )}
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="font-semibold text-slate-900">{job.company}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job.location} {job.isRemote && '(Remote)'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{job.department}</span>
                  <span aria-hidden="true">·</span>
                  <span>{job.experienceLevel}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1 font-mono text-slate-500">
                    <Clock className="w-3 h-3" /> Posted {job.postedDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions & Salary header box */}
            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
              <div className="md:text-right">
                <div className="text-xs text-slate-400 font-medium">Estimated Compensation</div>
                <div className="text-lg sm:text-xl font-bold text-slate-900 font-mono tabular-nums">
                  ${(job.salaryMin / 1000).toFixed(0)}k – ${(job.salaryMax / 1000).toFixed(0)}k
                  <span className="text-xs font-normal text-slate-500 font-sans"> / year</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                  title="Share job"
                  aria-label="Share job"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => toggleSaveJob(job)}
                  className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                    saved
                      ? 'btn-primary-theme'
                      : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  title={saved ? 'Remove from saved' : 'Save job'}
                  aria-label={saved ? 'Remove from saved' : 'Save job'}
                >
                  <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={() => openApplyModal(job)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
                    applied
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'btn-primary-theme'
                  }`}
                >
                  {applied ? 'View Application' : 'Apply for this Role'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Body Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Overview */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-3 shadow-xs">
              <h2 className="text-base font-bold text-slate-900">Job Description</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{job.description}</p>
            </div>

            {/* Responsibilities */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
              <h2 className="text-base font-bold text-slate-900">Key Responsibilities</h2>
              <ul className="space-y-3">
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
              <h2 className="text-base font-bold text-slate-900">Requirements & Qualifications</h2>
              <ul className="space-y-3">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0 mt-2" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack & Tags */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-3 shadow-xs">
              <h2 className="text-base font-bold text-slate-900">Required Skills & Technologies</h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-medium text-slate-800 bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Benefits & Perks */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
              <h2 className="text-base font-bold text-slate-900">Benefits & Perks</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {job.benefits.map((benefit, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5"
                  >
                    <ShieldCheck className="w-4 h-4 text-primary-theme shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-700 leading-snug">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Apply Bar */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
              <div>
                <h3 className="text-sm font-bold text-white">Interested in joining {job.company}?</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Applications are reviewed directly by the hiring team.
                </p>
              </div>
              <button
                type="button"
                onClick={() => openApplyModal(job)}
                className="w-full sm:w-auto px-6 py-2.5 btn-primary-theme rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer shadow-sm"
              >
                {applied ? 'View Application' : 'Apply for this Job'}
              </button>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Company Profile Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${job.companyColor}`}
                >
                  {job.companyInitials}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{job.company}</h3>
                  <a
                    href={job.companyWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-primary-theme no-underline hover:opacity-80 flex items-center gap-1 mt-0.5 font-medium transition-opacity"
                  >
                    <span>Visit website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{job.companyDescription}</p>

              {/* Team culture banner image */}
              <div className="rounded-xl overflow-hidden border border-slate-100 aspect-video bg-slate-100">
                <img
                  src={teamCultureImg}
                  alt={`${job.company} workplace`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Headquarters</span>
                  <span className="font-medium text-slate-800">{job.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Work Policy</span>
                  <span className="font-medium text-slate-800">
                    {job.isRemote ? 'Remote-Friendly' : 'On-Site Office'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Applicants</span>
                  <span className="font-mono tabular-nums font-medium text-slate-800">
                    {job.applicantsCount} candidates
                  </span>
                </div>
              </div>
            </div>

            {/* Hiring Process */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Interview Process
              </h3>
              <div className="rounded-xl overflow-hidden border border-slate-100 aspect-[4/3] bg-slate-100">
                <img
                  src={interviewImg}
                  alt="Candidate interview session"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center font-mono font-bold text-[10px]">
                    1
                  </span>
                  <span>Introductory screening call (30 mins)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center font-mono font-bold text-[10px]">
                    2
                  </span>
                  <span>Technical or portfolio interview</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center font-mono font-bold text-[10px]">
                    3
                  </span>
                  <span>Team collaboration & leadership chat</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Similar Roles Section */}
        {similarJobs.length > 0 && (
          <div className="pt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                More Jobs in {job.category}
              </h2>
              <Link
                to={`/?category=${encodeURIComponent(job.category)}`}
                className="text-xs font-semibold text-primary-theme no-underline hover:opacity-80 transition-opacity"
              >
                View all in {job.category} →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {similarJobs.map((simJob) => (
                <JobCard key={simJob.id} job={simJob} viewMode="list" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
