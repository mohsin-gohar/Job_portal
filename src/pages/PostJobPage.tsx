import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { jobApi } from '../services/api';
import { JobCategory, JobType, ExperienceLevel } from '../types/job';
import { useJobPortal } from '../context/JobPortalContext';

export const PostJobPage: React.FC = () => {
  const navigate = useNavigate();
  const { showNotification } = useJobPortal();

  const [form, setForm] = useState({
    title: '',
    company: '',
    companyWebsite: 'https://',
    companyDescription: '',
    category: 'Engineering' as JobCategory,
    type: 'Full-time' as JobType,
    location: '',
    isRemote: true,
    experienceLevel: 'Mid-Level' as ExperienceLevel,
    salaryMin: 120000,
    salaryMax: 160000,
    department: 'Core Team',
    description: '',
    responsibilitiesText: '',
    requirementsText: '',
    benefitsText: '',
    tagsText: 'React, TypeScript, TailwindCSS',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!form.title.trim()) errs.title = 'Job title is required';
    if (!form.company.trim()) errs.company = 'Company name is required';
    if (!form.location.trim()) errs.location = 'Location is required';
    if (form.salaryMin <= 0) errs.salaryMin = 'Minimum salary must be greater than zero';
    if (form.salaryMax < form.salaryMin) errs.salaryMax = 'Maximum salary cannot be less than minimum salary';
    if (!form.description.trim() || form.description.trim().length < 30) {
      errs.description = 'Please provide a descriptive overview (at least 30 characters)';
    }
    if (!form.responsibilitiesText.trim()) {
      errs.responsibilitiesText = 'Please provide at least 2 responsibilities (one per line)';
    }
    if (!form.requirementsText.trim()) {
      errs.requirementsText = 'Please provide at least 2 requirements (one per line)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    try {
      const responsibilities = form.responsibilitiesText
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const requirements = form.requirementsText
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const benefits = form.benefitsText
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const tags = form.tagsText
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const newJob = await jobApi.postJob({
        title: form.title.trim(),
        company: form.company.trim(),
        companyWebsite: form.companyWebsite.trim(),
        companyDescription:
          form.companyDescription.trim() ||
          `${form.company.trim()} is an innovative organization hiring talent for high-growth initiatives.`,
        category: form.category,
        type: form.type,
        location: form.location.trim(),
        isRemote: form.isRemote,
        experienceLevel: form.experienceLevel,
        salaryMin: Number(form.salaryMin),
        salaryMax: Number(form.salaryMax),
        salaryCurrency: 'USD',
        department: form.department.trim() || 'General',
        description: form.description.trim(),
        responsibilities:
          responsibilities.length > 0
            ? responsibilities
            : ['Drive product engineering roadmap', 'Collaborate across teams'],
        requirements:
          requirements.length > 0
            ? requirements
            : ['3+ years relevant domain experience', 'Strong team communication skills'],
        benefits:
          benefits.length > 0
            ? benefits
            : ['Health and dental insurance', 'Remote work flexibility', 'Home office allowance'],
        tags: tags.length > 0 ? tags : ['Full-Time', 'Tech'],
      });

      showNotification(`Job listing for "${newJob.title}" published!`, 'success');
      navigate(`/jobs/${newJob.id}`);
    } catch (err) {
      showNotification('Failed to post job. Please try again.', 'error');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-900">
            <Briefcase className="w-5 h-5 text-primary-theme" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Post a New Job Opening
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Reach thousands of qualified developers, designers, and business operators.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs"
        >
          {/* Section 1: Role Overview */}
          <div className="space-y-4">
            <h2 className="text-xs font-semibold text-slate-900 pb-2 border-b border-slate-100 uppercase tracking-wider">
              1. Job Details
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:border-[var(--color-primary)] outline-none"
              />
              {errors.title && <p className="text-[11px] text-red-600 mt-1">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="e.g. Acme Tech Labs"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:border-[var(--color-primary)] outline-none"
                />
                {errors.company && <p className="text-[11px] text-red-600 mt-1">{errors.company}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Company Website URL
                </label>
                <input
                  type="text"
                  value={form.companyWebsite}
                  onChange={(e) => setForm({ ...form, companyWebsite: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:border-[var(--color-primary)] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">Department</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as JobCategory })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:border-[var(--color-primary)] outline-none bg-white cursor-pointer"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Product">Product</option>
                  <option value="Data & AI">Data & AI</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Employment Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as JobType })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:border-[var(--color-primary)] outline-none bg-white cursor-pointer"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Experience Level
                </label>
                <select
                  value={form.experienceLevel}
                  onChange={(e) =>
                    setForm({ ...form, experienceLevel: e.target.value as ExperienceLevel })
                  }
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:border-[var(--color-primary)] outline-none bg-white cursor-pointer"
                >
                  <option value="Entry-Level">Entry-Level</option>
                  <option value="Mid-Level">Mid-Level</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead / Executive">Lead / Executive</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Job Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. San Francisco, CA or Remote"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:border-[var(--color-primary)] outline-none"
                />
                {errors.location && <p className="text-[11px] text-red-600 mt-1">{errors.location}</p>}
              </div>

              <div className="pt-5">
                <label className="flex items-center gap-2 cursor-pointer select-none bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <input
                    type="checkbox"
                    checked={form.isRemote}
                    onChange={(e) => setForm({ ...form, isRemote: e.target.checked })}
                    className="w-4 h-4 rounded cursor-pointer"
                    style={{ accentColor: 'var(--color-primary)' }}
                  />
                  <span className="text-xs font-semibold text-slate-800">
                    Remote-friendly role
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: Compensation */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-xs font-semibold text-slate-900 pb-2 border-b border-slate-100 uppercase tracking-wider">
              2. Annual Salary Band (USD)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Minimum Annual Salary ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="5000"
                  value={form.salaryMin}
                  onChange={(e) => setForm({ ...form, salaryMin: Number(e.target.value) })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:border-[var(--color-primary)] outline-none font-mono"
                />
                {errors.salaryMin && <p className="text-[11px] text-red-600 mt-1">{errors.salaryMin}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Maximum Annual Salary ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="5000"
                  value={form.salaryMax}
                  onChange={(e) => setForm({ ...form, salaryMax: Number(e.target.value) })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:border-[var(--color-primary)] outline-none font-mono"
                />
                {errors.salaryMax && <p className="text-[11px] text-red-600 mt-1">{errors.salaryMax}</p>}
              </div>
            </div>
          </div>

          {/* Section 3: Description */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-xs font-semibold text-slate-900 pb-2 border-b border-slate-100 uppercase tracking-wider">
              3. Description & Responsibilities
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Role Overview <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the mission of this role and the problems the candidate will solve..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:border-[var(--color-primary)] outline-none"
              />
              {errors.description && (
                <p className="text-[11px] text-red-600 mt-1">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Responsibilities (One per line) <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={form.responsibilitiesText}
                onChange={(e) => setForm({ ...form, responsibilitiesText: e.target.value })}
                placeholder="Build scalable React components&#10;Optimize client bundle performance&#10;Mentor junior teammates"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:border-[var(--color-primary)] outline-none"
              />
              {errors.responsibilitiesText && (
                <p className="text-[11px] text-red-600 mt-1">{errors.responsibilitiesText}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Requirements & Qualifications (One per line) <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={form.requirementsText}
                onChange={(e) => setForm({ ...form, requirementsText: e.target.value })}
                placeholder="3+ years with TypeScript and modern frameworks&#10;Deep understanding of browser APIs&#10;Strong communication skills"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:border-[var(--color-primary)] outline-none"
              />
              {errors.requirementsText && (
                <p className="text-[11px] text-red-600 mt-1">{errors.requirementsText}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Tags & Tech Stack (Comma separated)
              </label>
              <input
                type="text"
                value={form.tagsText}
                onChange={(e) => setForm({ ...form, tagsText: e.target.value })}
                placeholder="React, TypeScript, GraphQL, Next.js"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:border-[var(--color-primary)] outline-none"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 text-xs font-bold text-white btn-primary-theme rounded-lg transition-colors shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Publishing Listing...</span>
                </>
              ) : (
                <>
                  <span>Publish Job Listing</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
