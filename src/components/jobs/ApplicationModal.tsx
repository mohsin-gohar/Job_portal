import React, { useState, useEffect } from 'react';
import { X, Upload, CheckCircle2, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { Job } from '../../types/job';
import { useApplication } from '../../context/ApplicationContext';
import { Link } from 'react-router-dom';

interface ApplicationModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

interface FormValues {
  fullName: string;
  email: string;
  phone: string;
  portfolioUrl: string;
  experienceYears: number;
  noticePeriod: string;
  coverLetter: string;
  resumeFileName: string;
  resumeFileSize: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  portfolioUrl?: string;
  coverLetter?: string;
  resume?: string;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  job,
  isOpen,
  onClose,
}) => {
  const { submitApplication } = useApplication();

  const [values, setValues] = useState<FormValues>({
    fullName: '',
    email: '',
    phone: '',
    portfolioUrl: '',
    experienceYears: 4,
    noticePeriod: '2 weeks',
    coverLetter: '',
    resumeFileName: '',
    resumeFileSize: '',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  // Reset form when modal opens with a new job
  useEffect(() => {
    if (isOpen) {
      setValues({
        fullName: '',
        email: '',
        phone: '',
        portfolioUrl: '',
        experienceYears: 4,
        noticePeriod: '2 weeks',
        coverLetter: '',
        resumeFileName: '',
        resumeFileSize: '',
      });
      setTouched({});
      setErrors({});
      setSubmittedRef(null);
      setUploadProgress(null);
    }
  }, [isOpen, job]);

  if (!isOpen || !job) return null;

  // Validation function
  const validate = (currentValues: FormValues): FormErrors => {
    const newErrors: FormErrors = {};

    if (!currentValues.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (currentValues.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!currentValues.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentValues.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!currentValues.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (currentValues.phone.trim().length < 7) {
      newErrors.phone = 'Please enter a valid contact number';
    }

    if (currentValues.portfolioUrl.trim()) {
      try {
        new URL(currentValues.portfolioUrl.trim());
      } catch {
        newErrors.portfolioUrl = 'Must be a valid URL (including https://)';
      }
    }

    if (!currentValues.coverLetter.trim()) {
      newErrors.coverLetter = 'Cover letter / brief pitch is required';
    } else if (currentValues.coverLetter.trim().length < 20) {
      newErrors.coverLetter = `Please provide at least 20 characters (${currentValues.coverLetter.trim().length}/20)`;
    }

    if (!currentValues.resumeFileName) {
      newErrors.resume = 'Please upload your resume (PDF or DOCX)';
    }

    return newErrors;
  };

  const handleBlur = (field: keyof FormValues) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(values));
  };

  const handleChange = (field: keyof FormValues, val: string | number) => {
    const updated = { ...values, [field]: val };
    setValues(updated);
    if (touched[field]) {
      setErrors(validate(updated));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
      setErrors((prev) => ({ ...prev, resume: 'Only PDF or Word documents (.pdf, .docx) are accepted' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, resume: 'File size exceeds maximum limit of 5MB' }));
      return;
    }

    // Simulate instant upload progress
    setUploadProgress(20);
    setTimeout(() => setUploadProgress(65), 150);
    setTimeout(() => {
      setUploadProgress(100);
      const sizeFormatted = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      const updated = {
        ...values,
        resumeFileName: file.name,
        resumeFileSize: sizeFormatted,
      };
      setValues(updated);
      setErrors((prev) => {
        const next = { ...prev };
        delete next.resume;
        return next;
      });
      setTimeout(() => setUploadProgress(null), 300);
    }, 350);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      portfolioUrl: true,
      coverLetter: true,
      resumeFileName: true,
    });

    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    const result = await submitApplication({
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      resumeFileName: values.resumeFileName,
      portfolioUrl: values.portfolioUrl.trim() || undefined,
      experienceYears: Number(values.experienceYears),
      coverLetter: values.coverLetter.trim(),
      noticePeriod: values.noticePeriod,
    });

    setIsSubmitting(false);
    if (result.success && result.application) {
      setSubmittedRef(result.application.id);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs"
    >
      <div
        className="relative bg-white rounded-lg border border-slate-200 shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 id="modal-title" className="text-base font-bold text-slate-900 tracking-tight">
              {submittedRef ? 'Application Submitted' : `Apply for ${job.title}`}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>{job.company}</span>
              <span aria-hidden="true">·</span>
              <span>{job.location}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {submittedRef ? (
            /* Success confirmation screen */
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Your application has been received!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="font-semibold">{values.fullName}</span>. Your application for{' '}
                  <span className="font-semibold">{job.title}</span> at {job.company} is recorded.
                </p>
              </div>

              {/* Reference ID card */}
              <div className="bg-slate-50 border border-slate-200 rounded-md p-4 text-xs font-mono tabular-nums inline-block text-slate-700">
                Application Reference: <span className="font-bold text-slate-900">{submittedRef}</span>
              </div>

              <div className="text-xs text-slate-500 max-w-sm mx-auto">
                The hiring squad will review your application materials within 3 business days. You can track this in your applications tracker.
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/applications"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors text-center shadow-xs"
                >
                  View My Applications
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Application Form */
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-xs font-semibold text-slate-800 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={values.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  onBlur={() => handleBlur('fullName')}
                  placeholder="e.g. Elena Rostova"
                  className={`w-full px-3 py-2 text-xs bg-white border rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-hidden transition-colors ${
                    errors.fullName && touched.fullName
                      ? 'border-rose-400 focus:border-rose-500'
                      : 'border-slate-200 focus:border-slate-800'
                  }`}
                />
                {errors.fullName && touched.fullName && (
                  <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-slate-800 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={values.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    placeholder="elena@example.com"
                    className={`w-full px-3 py-2 text-xs bg-white border rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-hidden transition-colors ${
                      errors.email && touched.email
                        ? 'border-rose-400 focus:border-rose-500'
                        : 'border-slate-200 focus:border-slate-800'
                    }`}
                  />
                  {errors.email && touched.email && (
                    <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold text-slate-800 mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={values.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    placeholder="+1 (555) 019-2834"
                    className={`w-full px-3 py-2 text-xs bg-white border rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-hidden transition-colors ${
                      errors.phone && touched.phone
                        ? 'border-rose-400 focus:border-rose-500'
                        : 'border-slate-200 focus:border-slate-800'
                    }`}
                  />
                  {errors.phone && touched.phone && (
                    <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Resume File Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Resume / CV Document <span className="text-rose-500">*</span>
                </label>

                {values.resumeFileName ? (
                  <div className="flex items-center justify-between p-3 border border-slate-200 rounded-md bg-slate-50">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-5 h-5 text-slate-700 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-900 truncate">
                          {values.resumeFileName}
                        </p>
                        <p className="text-[11px] text-slate-500 font-mono tabular-nums">
                          {values.resumeFileSize}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setValues((v) => ({ ...v, resumeFileName: '', resumeFileSize: '' }))}
                      className="text-xs text-rose-600 hover:text-rose-800 font-medium px-2 py-1"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white">
                    <Upload className="w-6 h-6 text-slate-400 mb-2" />
                    <span className="text-xs font-medium text-slate-800">
                      Click to upload or drag & drop your resume
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1">
                      PDF, DOC, or DOCX (Max 5MB)
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}

                {uploadProgress !== null && (
                  <div className="mt-2 space-y-1">
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-900 transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono text-right">
                      Uploading... {uploadProgress}%
                    </p>
                  </div>
                )}

                {errors.resume && (
                  <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.resume}</span>
                  </p>
                )}
              </div>

              {/* Portfolio URL & Notice Period */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="portfolioUrl" className="block text-xs font-semibold text-slate-800 mb-1">
                    Portfolio or LinkedIn URL <span className="text-slate-400 text-[11px] font-normal">(Optional)</span>
                  </label>
                  <input
                    id="portfolioUrl"
                    type="url"
                    value={values.portfolioUrl}
                    onChange={(e) => handleChange('portfolioUrl', e.target.value)}
                    onBlur={() => handleBlur('portfolioUrl')}
                    placeholder="https://github.com/yourhandle"
                    className={`w-full px-3 py-2 text-xs bg-white border rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-hidden transition-colors ${
                      errors.portfolioUrl && touched.portfolioUrl
                        ? 'border-rose-400 focus:border-rose-500'
                        : 'border-slate-200 focus:border-slate-800'
                    }`}
                  />
                  {errors.portfolioUrl && touched.portfolioUrl && (
                    <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.portfolioUrl}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="noticePeriod" className="block text-xs font-semibold text-slate-800 mb-1">
                    Earliest Start Date / Notice
                  </label>
                  <select
                    id="noticePeriod"
                    value={values.noticePeriod}
                    onChange={(e) => handleChange('noticePeriod', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md text-slate-800 focus:outline-hidden focus:border-slate-800"
                  >
                    <option value="Immediate">Immediate Availability</option>
                    <option value="2 weeks">2 Weeks Notice</option>
                    <option value="1 month">1 Month Notice</option>
                    <option value="2+ months">2+ Months Notice</option>
                  </select>
                </div>
              </div>

              {/* Experience Years Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <span>Years of Relevant Experience</span>
                  <span className="font-mono tabular-nums text-slate-900">
                    {values.experienceYears} {values.experienceYears === 1 ? 'year' : 'years'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="1"
                  value={values.experienceYears}
                  onChange={(e) => handleChange('experienceYears', Number(e.target.value))}
                  className="w-full accent-slate-900 cursor-pointer"
                />
              </div>

              {/* Cover Letter / Pitch */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="coverLetter" className="text-xs font-semibold text-slate-800">
                    Why are you a great match for this role? <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] font-mono tabular-nums text-slate-400">
                    {values.coverLetter.length} chars
                  </span>
                </div>
                <textarea
                  id="coverLetter"
                  rows={3}
                  value={values.coverLetter}
                  onChange={(e) => handleChange('coverLetter', e.target.value)}
                  onBlur={() => handleBlur('coverLetter')}
                  placeholder="Highlight your relevant experience, proudest technical project, and what excites you about this company..."
                  className={`w-full px-3 py-2 text-xs bg-white border rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-hidden transition-colors ${
                    errors.coverLetter && touched.coverLetter
                      ? 'border-rose-400 focus:border-rose-500'
                      : 'border-slate-200 focus:border-slate-800'
                  }`}
                />
                {errors.coverLetter && touched.coverLetter && (
                  <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.coverLetter}</span>
                  </p>
                )}
              </div>

              {/* Form Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-xs"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting...</span>
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
    </div>
  );
};
