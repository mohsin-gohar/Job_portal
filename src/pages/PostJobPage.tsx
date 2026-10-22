import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, PlusCircle, AlertCircle, Loader2 } from 'lucide-react';
import { jobsApi } from '../services/api';
import { useJobs } from '../context/JobContext';
import { useToast } from '../context/ToastContext';
import { JobCategory, JobType, ExperienceLevel } from '../types/job';

interface PostJobForm {
  title: string;
  company: string;
  location: string;
  isRemote: boolean;
  type: JobType;
  category: JobCategory;
  experienceLevel: ExperienceLevel;
  salaryMin: number;
  salaryMax: number;
  department: string;
  description: string;
  responsibilities: string;
  requirements: string;
  skills: string;
  benefits: string;
  aboutCompany: string;
}

export const PostJobPage: React.FC = () => {
  const navigate = useNavigate();
  const { refetchJobs } = useJobs();
  const { showToast } = useToast();

  const [form, setForm] = useState<PostJobForm>({
    title: '',
    company: '',
    location: 'San Francisco, CA',
    isRemote: true,
    type: 'Full-time',
    category: 'Engineering',
    experienceLevel: 'Senior Level',
    salaryMin: 140000,
    salaryMax: 180000,
    department: 'Product Engineering',
    description: '',
    responsibilities: 'Build performant, scalable features\nCollaborate with design and product teams\nConduct technical code reviews',
    requirements: '3+ years of production experience with modern web frameworks\nDeep understanding of TypeScript and state management\nClear written and verbal communication',
    skills: 'React, TypeScript, Tailwind CSS, REST APIs',
    benefits: 'Competitive equity package\nComprehensive healthcare coverage\nFlexible remote-first culture\nAnnual learning & conference stipend',
    aboutCompany: 'Fast-growing software technology company dedicated to building intuitive products.',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Job title is required';
    if (!form.company.trim()) errs.company = 'Company name is required';
    if (!form.location.trim()) errs.location = 'Location is required';
    if (!form.department.trim()) errs.department = 'Department is required';
    if (!form.description.trim() || form.description.trim().length < 30) {
      errs.description = 'Please write at least 30 characters for the description';
    }
    if (form.salaryMin > form.salaryMax) {
      errs.salaryMax = 'Maximum salary must be greater than or equal to minimum salary';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const resp = await jobsApi.postJob({
        title: form.title.trim(),
        company: form.company.trim(),
        companyInitial: form.company.trim().charAt(0).toUpperCase() || 'C',
        location: form.location.trim(),
        isRemote: form.isRemote,
        type: form.type,
        category: form.category,
        experienceLevel: form.experienceLevel,
        salaryMin: Number(form.salaryMin),
        salaryMax: Number(form.salaryMax),
        salaryCurrency: 'USD',
        featured: false,
        brandColor: '#4F46E5',
        applicantsCount: 0,
        department: form.department.trim(),
        description: form.description.trim(),
        responsibilities: form.responsibilities.split('\n').filter((s) => s.trim().length > 0),
        requirements: form.requirements.split('\n').filter((s) => s.trim().length > 0),
        skills: form.skills.split(',').map((s) => s.trim()).filter((s) => s.length > 0),
        benefits: form.benefits.split('\n').filter((s) => s.trim().length > 0),
        aboutCompany: form.aboutCompany.trim(),
      });

      showToast('Job listing published successfully!', 'success');
      refetchJobs();
      navigate(`/jobs/${resp.data.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to publish job';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="relative bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-soft overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-32 pointer-events-none overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2000&q=80"
            alt=""
            className="w-full h-full object-cover object-center opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/90 to-white" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <Link
            to="/"
            className="text-slate-600 hover:text-slate-900 transition-colors p-2 rounded-lg bg-slate-100 hover:bg-slate-200/80"
            aria-label="Back to jobs directory"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-950 tracking-tight">
              Create a New Job Listing
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Post an opening to reach qualified engineers, designers, and tech talent worldwide.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block text-xs font-semibold text-slate-800 mb-1">
              Job Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Senior Backend Engineer"
              className={`w-full px-3 py-2 text-xs bg-white border rounded-md text-slate-900 focus:outline-hidden ${
                errors.title ? 'border-rose-400' : 'border-slate-200 focus:border-slate-800'
              }`}
            />
            {errors.title && (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.title}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="company" className="block text-xs font-semibold text-slate-800 mb-1">
              Company Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="company"
              type="text"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder="e.g. Stripe, Linear"
              className={`w-full px-3 py-2 text-xs bg-white border rounded-md text-slate-900 focus:outline-hidden ${
                errors.company ? 'border-rose-400' : 'border-slate-200 focus:border-slate-800'
              }`}
            />
            {errors.company && (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.company}
              </p>
            )}
          </div>
        </div>

        {/* Category, Type, Department */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="category" className="block text-xs font-semibold text-slate-800 mb-1">
              Category
            </label>
            <select
              id="category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as JobCategory })}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md text-slate-800 focus:outline-hidden"
            >
              <option value="Engineering">Engineering</option>
              <option value="Data & AI">Data & AI</option>
              <option value="Design">Design</option>
              <option value="Product">Product</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Operations">Operations</option>
            </select>
          </div>

          <div>
            <label htmlFor="type" className="block text-xs font-semibold text-slate-800 mb-1">
              Employment Type
            </label>
            <select
              id="type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as JobType })}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md text-slate-800 focus:outline-hidden"
            >
              <option value="Full-time">Full-time</option>
              <option value="Remote">Remote</option>
              <option value="Contract">Contract</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div>
            <label htmlFor="department" className="block text-xs font-semibold text-slate-800 mb-1">
              Department / Team
            </label>
            <input
              id="department"
              type="text"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              placeholder="e.g. Core Platform"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md text-slate-800 focus:outline-hidden"
            >
            </input>
          </div>
        </div>

        {/* Location & Remote checkbox */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <label htmlFor="location" className="block text-xs font-semibold text-slate-800 mb-1">
              Location
            </label>
            <input
              id="location"
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. San Francisco, CA or Remote"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md text-slate-800 focus:outline-hidden"
            />
          </div>

          <div className="pt-5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.isRemote}
                onChange={(e) => setForm({ ...form, isRemote: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <span className="text-xs font-medium text-slate-700">Remote candidates accepted</span>
            </label>
          </div>
        </div>

        {/* Salary Min / Max in USD */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="salaryMin" className="block text-xs font-semibold text-slate-800 mb-1">
              Minimum Salary (USD / yr)
            </label>
            <input
              id="salaryMin"
              type="number"
              step="5000"
              value={form.salaryMin}
              onChange={(e) => setForm({ ...form, salaryMin: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md font-mono tabular-nums text-slate-800 focus:outline-hidden"
            />
          </div>

          <div>
            <label htmlFor="salaryMax" className="block text-xs font-semibold text-slate-800 mb-1">
              Maximum Salary (USD / yr)
            </label>
            <input
              id="salaryMax"
              type="number"
              step="5000"
              value={form.salaryMax}
              onChange={(e) => setForm({ ...form, salaryMax: Number(e.target.value) })}
              className={`w-full px-3 py-2 text-xs bg-white border rounded-md font-mono tabular-nums text-slate-800 focus:outline-hidden ${
                errors.salaryMax ? 'border-rose-400' : 'border-slate-200'
              }`}
            />
            {errors.salaryMax && (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.salaryMax}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-xs font-semibold text-slate-800 mb-1">
            Job Description & Mission <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="description"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe the objective of this role, the problems you are solving, and what success looks like..."
            className={`w-full px-3 py-2 text-xs bg-white border rounded-md text-slate-800 focus:outline-hidden ${
              errors.description ? 'border-rose-400' : 'border-slate-200 focus:border-slate-800'
            }`}
          />
          {errors.description && (
            <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.description}
            </p>
          )}
        </div>

        {/* Responsibilities & Requirements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="responsibilities" className="block text-xs font-semibold text-slate-800 mb-1">
              Responsibilities (One per line)
            </label>
            <textarea
              id="responsibilities"
              rows={4}
              value={form.responsibilities}
              onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md text-slate-800 focus:outline-hidden font-mono"
            />
          </div>

          <div>
            <label htmlFor="requirements" className="block text-xs font-semibold text-slate-800 mb-1">
              Requirements & Qualifications (One per line)
            </label>
            <textarea
              id="requirements"
              rows={4}
              value={form.requirements}
              onChange={(e) => setForm({ ...form, requirements: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md text-slate-800 focus:outline-hidden font-mono"
            />
          </div>
        </div>

        {/* Skills & Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="skills" className="block text-xs font-semibold text-slate-800 mb-1">
              Skills (Comma-separated)
            </label>
            <input
              id="skills"
              type="text"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              placeholder="e.g. React, TypeScript, GraphQL, Node.js"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md text-slate-800 focus:outline-hidden"
            />
          </div>

          <div>
            <label htmlFor="benefits" className="block text-xs font-semibold text-slate-800 mb-1">
              Benefits (One per line)
            </label>
            <textarea
              id="benefits"
              rows={2}
              value={form.benefits}
              onChange={(e) => setForm({ ...form, benefits: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md text-slate-800 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Link
            to="/"
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-xs"
          >
            {submitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Publishing listing...</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Publish Job Opening</span>
              </>
            )}
          </button>
        </div>
      </form>

      <section className="grid sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-1.5">How it works</h3>
          <p className="text-xs text-slate-600 leading-relaxed">Submit your listing, get reviewed by our team, and go live within 24 hours to reach verified candidates.</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-1.5">Pricing</h3>
          <p className="text-xs text-slate-600 leading-relaxed">Free standard listings. Featured placements available for high-priority roles with boosted visibility.</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-1.5">Support</h3>
          <p className="text-xs text-slate-600 leading-relaxed">Our team helps refine job descriptions and screening questions for better applicant quality.</p>
        </div>
      </section>
    </div>
  );
};
