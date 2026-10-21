import React, { useState, useRef } from 'react';
import { X, UploadCloud, CheckCircle2, FileText, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { Job } from '../types/job';
import { useJobPortal } from '../context/JobPortalContext';
import { useNavigate } from 'react-router-dom';

interface ApplicationModalProps {
  job: Job | null;
  onClose: () => void;
}

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  portfolioUrl: string;
  coverLetter: string;
  resumeFile: File | null;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  portfolioUrl?: string;
  coverLetter?: string;
  resumeFile?: string;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({ job, onClose }) => {
  const { submitApplication } = useJobPortal();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormState>({
    fullName: '',
    email: '',
    phone: '',
    portfolioUrl: '',
    coverLetter: '',
    resumeFile: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successAppId, setSuccessAppId] = useState<string | null>(null);

  if (!job) return null;

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address';
    }

    // Phone validation
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (phoneDigits.length < 8) {
      newErrors.phone = 'Please provide a valid phone number (at least 8 digits)';
    }

    // Portfolio URL validation
    if (formData.portfolioUrl.trim()) {
      try {
        const url = new URL(
          formData.portfolioUrl.startsWith('http')
            ? formData.portfolioUrl
            : `https://${formData.portfolioUrl}`
        );
        if (!url.hostname) {
          newErrors.portfolioUrl = 'Invalid URL format';
        }
      } catch {
        newErrors.portfolioUrl = 'Please enter a valid website or profile URL';
      }
    }

    // Resume validation
    if (!formData.resumeFile) {
      newErrors.resumeFile = 'Please attach your resume document';
    } else {
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      const ext = formData.resumeFile.name.split('.').pop()?.toLowerCase();
      if (!validTypes.includes(formData.resumeFile.type) && !['pdf', 'doc', 'docx'].includes(ext || '')) {
        newErrors.resumeFile = 'Only PDF, DOC, or DOCX formats are accepted';
      } else if (formData.resumeFile.size > 5 * 1024 * 1024) {
        newErrors.resumeFile = 'Resume file size must not exceed 5MB';
      }
    }

    // Cover letter validation
    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = 'Please write a brief statement of interest';
    } else if (formData.coverLetter.trim().length < 30) {
      newErrors.coverLetter = `Statement must be at least 30 characters (${formData.coverLetter.trim().length}/30)`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, resumeFile: file }));
      setErrors((prev) => ({ ...prev, resumeFile: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setUploadProgress(25);

    try {
      await new Promise((r) => setTimeout(r, 200));
      setUploadProgress(70);
      await new Promise((r) => setTimeout(r, 250));
      setUploadProgress(100);

      const fileSizeMb = formData.resumeFile
        ? `${(formData.resumeFile.size / (1024 * 1024)).toFixed(2)} MB`
        : '1.2 MB';

      const app = await submitApplication({
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        applicantName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        portfolioUrl: formData.portfolioUrl.trim() || undefined,
        resumeFileName: formData.resumeFile?.name || 'Resume.pdf',
        resumeFileSize: fileSizeMb,
        coverLetter: formData.coverLetter.trim(),
      });

      setIsSubmitting(false);
      setSuccessAppId(app.id);
    } catch (err) {
      setIsSubmitting(false);
      setErrors({ fullName: 'Submission failed. Please check details and try again.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="relative bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Apply for Position
            </span>
            <h3 className="text-base font-bold text-slate-900 line-clamp-1">{job.title}</h3>
            <div className="text-xs text-slate-600 mt-0.5 font-medium">
              {job.company} · {job.location}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {successAppId ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h4 className="text-xl font-bold text-slate-900">Application Submitted!</h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Your application for <strong className="text-slate-900">{job.title}</strong> at{' '}
              <strong className="text-slate-900">{job.company}</strong> has been transmitted directly to their hiring team.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 max-w-xs mx-auto font-mono">
              Tracking ID: <span className="font-bold text-slate-900">{successAppId}</span>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/applications');
                }}
                className="w-full sm:w-auto px-5 py-2.5 btn-primary-theme rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Track in My Applications</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => {
                  setFormData({ ...formData, fullName: e.target.value });
                  if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                }}
                placeholder="e.g. Jane Doe"
                className={`w-full text-xs px-3 py-2 rounded-lg border outline-none transition-colors ${
                  errors.fullName
                    ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                    : 'border-slate-300 focus:border-[var(--color-primary)]'
                }`}
              />
              {errors.fullName && (
                <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.fullName}</span>
                </p>
              )}
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  placeholder="jane.doe@example.com"
                  className={`w-full text-xs px-3 py-2 rounded-lg border outline-none transition-colors ${
                    errors.email
                      ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                      : 'border-slate-300 focus:border-[var(--color-primary)]'
                  }`}
                />
                {errors.email && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: undefined });
                  }}
                  placeholder="+1 (555) 000-0000"
                  className={`w-full text-xs px-3 py-2 rounded-lg border outline-none transition-colors ${
                    errors.phone
                      ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                      : 'border-slate-300 focus:border-[var(--color-primary)]'
                  }`}
                />
                {errors.phone && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.phone}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Portfolio / LinkedIn */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Portfolio, GitHub, or LinkedIn URL{' '}
                <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={formData.portfolioUrl}
                onChange={(e) => {
                  setFormData({ ...formData, portfolioUrl: e.target.value });
                  if (errors.portfolioUrl) setErrors({ ...errors, portfolioUrl: undefined });
                }}
                placeholder="https://github.com/janedoe or https://linkedin.com/in/janedoe"
                className={`w-full text-xs px-3 py-2 rounded-lg border outline-none transition-colors ${
                  errors.portfolioUrl
                    ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                    : 'border-slate-300 focus:border-[var(--color-primary)]'
                }`}
              />
              {errors.portfolioUrl && (
                <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.portfolioUrl}</span>
                </p>
              )}
            </div>

            {/* Resume Upload Dropzone */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Resume / CV <span className="text-red-500">*</span>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                  errors.resumeFile
                    ? 'border-red-300 bg-red-50/20'
                    : formData.resumeFile
                    ? 'border-emerald-400 bg-emerald-50/20'
                    : 'border-slate-200 hover:border-slate-400 bg-slate-50/50'
                }`}
              >
                {formData.resumeFile ? (
                  <div className="flex items-center justify-between px-3 py-1">
                    <div className="flex items-center gap-2 text-left">
                      <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-slate-900">
                          {formData.resumeFile.name}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {(formData.resumeFile.size / 1024).toFixed(1)} KB · Ready to transmit
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-primary-theme no-underline font-semibold hover:opacity-80">Change</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <UploadCloud className="w-6 h-6 text-slate-400 mx-auto" />
                    <div className="text-xs font-medium text-slate-700">
                      Click to upload your resume
                    </div>
                    <div className="text-[10px] text-slate-400">PDF, DOC, or DOCX (Max 5MB)</div>
                  </div>
                )}
              </div>
              {errors.resumeFile && (
                <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.resumeFile}</span>
                </p>
              )}
            </div>

            {/* Cover Letter */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-800">
                  Statement of Interest / Cover Note <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {formData.coverLetter.length} chars (min 30)
                </span>
              </div>
              <textarea
                rows={3}
                value={formData.coverLetter}
                onChange={(e) => {
                  setFormData({ ...formData, coverLetter: e.target.value });
                  if (errors.coverLetter) setErrors({ ...errors, coverLetter: undefined });
                }}
                placeholder="Introduce yourself, highlight relevant achievements, and share why you are excited about this role..."
                className={`w-full text-xs px-3 py-2 rounded-lg border outline-none transition-colors ${
                  errors.coverLetter
                    ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                    : 'border-slate-300 focus:border-[var(--color-primary)]'
                }`}
              />
              {errors.coverLetter && (
                <p className="text-[11px] text-red-600 mt-0.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.coverLetter}</span>
                </p>
              )}
            </div>

            {/* Progress Bar */}
            {isSubmitting && (
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="btn-primary-theme h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-semibold text-white btn-primary-theme rounded-lg transition-colors shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Transmitting...</span>
                  </>
                ) : (
                  <span>Submit Application</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
