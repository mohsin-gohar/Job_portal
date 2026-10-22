import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jobsApi, getStoredJobs } from '../services/api';
import { Job } from '../types/job';
import { useSavedJobs } from '../context/SavedJobsContext';
import { useToast } from '../context/ToastContext';
import { useCandidate } from '../context/CandidateContext';
import { useApplication } from '../context/ApplicationContext';
import { ApplicationModal } from '../components/jobs/ApplicationModal';
import { JobCard } from '../components/jobs/JobCard';
import {
  ChevronLeft,
  Bookmark,
  Share2,
  CheckCircle2,
  Building,
  Globe,
  Users,
  Clock,
  Sparkles,
  DollarSign,
  Briefcase,
  ShieldCheck,
} from 'lucide-react';

export const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const { isSaved, toggleSaveJob } = useSavedJobs();
  const { showToast } = useToast();
  const { calculateJobMatchScore } = useCandidate();
  const { hasApplied, getApplicationByJobId } = useApplication();

  useEffect(() => {
    let isMounted = true;
    const fetchJob = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const response = await jobsApi.getJobById(id);
        if (isMounted) {
          setJob(response.data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Job not found');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchJob();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleShare = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(window.location.href);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = window.location.href;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      showToast('Job link copied to clipboard', 'success');
    } catch {
      showToast('Unable to copy link', 'error');
    }
  };

  const formatSalary = (min: number, max: number, currency: string) => {
    const symbol = currency === 'USD' ? '$' : currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : currency === 'SGD' ? 'S$' : 'C$';
    return `${symbol}${Math.round(min / 1000)}k – ${symbol}${Math.round(max / 1000)}k / yr`;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6 animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-1/4" />
        <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-6">
          <div className="flex gap-4">
            <div className="w-14 h-14 bg-slate-200 rounded-lg" />
            <div className="space-y-2 w-3/4">
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-6 bg-slate-200 rounded w-2/3" />
            </div>
          </div>
          <div className="space-y-3 pt-4">
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-5/6" />
            <div className="h-4 bg-slate-200 rounded w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900">Job Not Found</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          {error || "The job posting you are looking for doesn't exist or has been removed."}
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Job Listings</span>
          </Link>
        </div>
      </div>
    );
  }

  const saved = isSaved(job.id);
  const alreadyApplied = hasApplied(job.id);
  const existingApplication = getApplicationByJobId(job.id);
  const { score: matchScore, matching } = calculateJobMatchScore(job.skills);

  // Similar jobs
  const allJobs = getStoredJobs();
  const similarJobs = allJobs
    .filter((j) => j.id !== job.id && (j.category === job.category || j.type === job.type))
    .slice(0, 2);

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-slate-900 transition-colors flex items-center gap-1 font-medium">
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>All Jobs</span>
        </Link>
        <span aria-hidden="true" className="text-slate-300">/</span>
        <span className="text-slate-700">{job.category}</span>
        <span aria-hidden="true" className="text-slate-300">/</span>
        <span className="text-slate-900 font-semibold truncate max-w-xs">{job.title}</span>
      </nav>

      {/* Main Header Card with Architectural Backdrop */}
      <section className="relative bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-card overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-32 pointer-events-none overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2000&q=80"
            alt=""
            className="w-full h-full object-cover object-center opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/90 to-white" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-xl text-white font-bold text-2xl flex items-center justify-center shrink-0 shadow-sm"
              style={{ backgroundColor: job.brandColor || '#0F172A' }}
            >
              {job.companyInitial}
            </div>

            <div className="space-y-1">
              {/* Unboxed Kicker */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-bold text-slate-900">{job.company}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>{job.department}</span>

                {job.featured && (
                  <>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="inline-flex items-center gap-1 text-indigo-700 font-semibold">
                      <Sparkles className="w-3 h-3" />
                      Featured
                    </span>
                  </>
                )}

                {job.urgent && (
                  <>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-amber-700 font-semibold">Immediate Hire</span>
                  </>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                {job.title}
              </h1>

              {/* Unboxed Metadata Strip */}
              <div className="pt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-600">
                <span className="font-semibold text-slate-900">{job.type}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>{job.location}</span>
                {job.isRemote && (
                  <>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-emerald-700 font-medium">100% Remote Option</span>
                  </>
                )}
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="font-mono tabular-nums font-bold text-slate-900">
                  {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-slate-500">Posted {new Date(job.postedAt).toLocaleDateString()}</span>
                {job.applicantsCount && (
                  <>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="font-mono text-slate-500 tabular-nums">
                      {job.applicantsCount} candidates applied
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2.5 shrink-0 self-start">
            <button
              type="button"
              onClick={handleShare}
              className="p-2.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              aria-label="Share job link"
              title="Copy share link"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => toggleSaveJob(job)}
              className={`p-2.5 rounded-lg border transition-colors ${
                saved
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              aria-label={saved ? 'Remove from saved' : 'Save job to list'}
              title={saved ? 'Job is saved' : 'Save job'}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
            </button>

            {alreadyApplied ? (
              <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-md border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Applied ({existingApplication?.status || 'Submitted'})</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(true)}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-xs hover:shadow-sm"
              >
                Apply for Position
              </button>
            )}
          </div>
        </div>

        {/* Candidate Match Alert Card */}
        {matchScore > 0 && (
          <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-lg flex items-center justify-between text-xs text-indigo-900">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                <strong>{matchScore}% Compatibility:</strong> Your candidate profile matches{' '}
                <strong>{matching.length}</strong> of the <strong>{job.skills.length}</strong> required technologies ({matching.join(', ')}).
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Grid: 2 Columns - Main Description (Left) & Company Overview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Job Description, Responsibilities, Requirements, Benefits */}
        <div className="lg:col-span-2 space-y-8 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
          {/* Mission & Overview */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-slate-700" />
              <span>About the Role</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Key Responsibilities */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Key Responsibilities
            </h2>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              {job.responsibilities.map((resp, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-2 shrink-0" />
                  <span className="leading-relaxed">{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Qualifications & Experience
            </h2>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              {job.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-2 shrink-0" />
                  <span className="leading-relaxed">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Skills & Technologies */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Core Skills & Tools
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              {job.skills.map((skill) => {
                const isMatch = matching.some((m) => m.toLowerCase() === skill.toLowerCase());
                return (
                  <span
                    key={skill}
                    className={`px-3 py-1 text-xs font-semibold rounded-md ${
                      isMatch
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {isMatch && '✓ '}
                    {skill}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Benefits & Perks */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Benefits & Culture Perks
            </h2>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              {job.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span className="leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Company Snapshot Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Company Snapshot
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              {job.aboutCompany}
            </p>

            <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>Industry</span>
                </span>
                <span className="font-semibold text-slate-900">{job.category}</span>
              </div>

              {job.teamSize && (
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Team Size</span>
                  </span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900">
                    {job.teamSize}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Workplace</span>
                </span>
                <span className="font-semibold text-slate-900">
                  {job.isRemote ? 'Remote First' : 'Hybrid / Office'}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Verification</span>
                </span>
                <span className="text-emerald-700 font-semibold">Direct Employer</span>
              </div>

              {job.website && (
                <div className="pt-2">
                  <a
                    href={job.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full py-2 border border-slate-200 rounded-md text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Visit Company Website</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Quick Apply Callout Card */}
          <div className="bg-slate-900 text-white rounded-xl p-6 space-y-3 shadow-md">
            <h4 className="text-sm font-bold tracking-tight">Interested in this role?</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Applications are reviewed immediately by the engineering squad. Direct recruiter response within 3 business days.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(true)}
                className="w-full py-2.5 text-xs font-bold text-slate-900 bg-white rounded-lg hover:bg-slate-100 transition-colors shadow-xs"
              >
                {alreadyApplied ? 'Review Your Application' : 'Apply Now'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Jobs Section */}
      {similarJobs.length > 0 && (
        <section className="pt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Recommended Similar Positions
            </h3>
            <Link to="/" className="text-xs text-slate-600 hover:text-slate-900 font-medium">
              Browse all roles →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {similarJobs.map((simJob) => (
              <JobCard key={simJob.id} job={simJob} />
            ))}
          </div>
        </section>
      )}

      {/* Perks */}
      <section className="grid sm:grid-cols-3 gap-4 pt-2">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-1.5">Remote-friendly</h3>
          <p className="text-xs text-slate-600 leading-relaxed">Work from anywhere with flexible hours and async collaboration.</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-1.5">Learning budget</h3>
          <p className="text-xs text-slate-600 leading-relaxed">Annual stipend for courses, conferences, and certifications.</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-1.5">Health & wellness</h3>
          <p className="text-xs text-slate-600 leading-relaxed">Comprehensive medical, dental, and mental-health coverage.</p>
        </div>
      </section>

      {/* Application Modal */}
      <ApplicationModal
        job={job}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </div>
  );
};
