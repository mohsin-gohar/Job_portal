import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { JobApplication } from '../types/job';
import { jobsApi, getStoredApplications } from '../services/api';
import { useToast } from './ToastContext';

interface ApplicationContextType {
  applications: JobApplication[];
  loading: boolean;
  hasApplied: (jobId: string) => boolean;
  getApplicationByJobId: (jobId: string) => JobApplication | undefined;
  submitApplication: (
    data: Omit<JobApplication, 'id' | 'appliedAt' | 'status'>
  ) => Promise<{ success: boolean; application?: JobApplication; error?: string }>;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

const SEED_APPLICATIONS: JobApplication[] = [
  {
    id: 'APP-729411',
    jobId: 'job-001',
    jobTitle: 'Senior Frontend Engineer',
    company: 'Linear Labs',
    fullName: 'Alex Vance',
    email: 'alex.vance@example.com',
    phone: '+1 (555) 234-5678',
    resumeFileName: 'Alex_Vance_Staff_Frontend_Resume.pdf',
    portfolioUrl: 'https://alexvance.design',
    experienceYears: 6,
    coverLetter: 'I have spent the last 6 years obsessing over frontend latency budgets, fluid animations, and developer tooling. I am thrilled by Linear’s attention to design detail.',
    noticePeriod: '2 weeks',
    status: 'In Review',
    appliedAt: '2026-10-19T14:22:00.000Z',
  },
];

export const ApplicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<JobApplication[]>(() => {
    const stored = getStoredApplications();
    if (stored.length === 0) {
      try {
        localStorage.setItem('lumina_applications_data', JSON.stringify(SEED_APPLICATIONS));
      } catch {
        // ignore
      }
      return SEED_APPLICATIONS;
    }
    return stored;
  });

  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const hasApplied = useCallback(
    (jobId: string) => applications.some((app) => app.jobId === jobId),
    [applications]
  );

  const getApplicationByJobId = useCallback(
    (jobId: string) => applications.find((app) => app.jobId === jobId),
    [applications]
  );

  const submitApplication = useCallback(
    async (data: Omit<JobApplication, 'id' | 'appliedAt' | 'status'>) => {
      setLoading(true);
      try {
        const response = await jobsApi.submitApplication(data);
        if (response.data) {
          setApplications((prev) => [response.data, ...prev]);
          showToast('Application submitted successfully!', 'success', `Ref #${response.data.id}`);
          return { success: true, application: response.data };
        }
        return { success: false, error: 'No application data returned' };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to submit application';
        showToast('Application submission failed', 'error', message);
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  return (
    <ApplicationContext.Provider
      value={{
        applications,
        loading,
        hasApplied,
        getApplicationByJobId,
        submitApplication,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplication = (): ApplicationContextType => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplication must be used within ApplicationProvider');
  }
  return context;
};
