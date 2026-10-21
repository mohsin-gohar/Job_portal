import React, { createContext, useContext, useState, useEffect } from 'react';
import { Job, JobApplication } from '../types/job';
import { jobApi } from '../services/api';

export type ThemeColor = 'blue' | 'emerald' | 'teal' | 'slate' | 'violet' | 'rose' | 'indigo';

interface NotificationState {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface JobPortalContextType {
  savedJobIds: string[];
  savedJobs: Job[];
  toggleSaveJob: (job: Job) => void;
  isJobSaved: (jobId: string) => boolean;
  applications: JobApplication[];
  submitApplication: (appData: Omit<JobApplication, 'id' | 'appliedDate' | 'status'>) => Promise<JobApplication>;
  isJobApplied: (jobId: string) => boolean;
  notification: NotificationState | null;
  showNotification: (message: string, type?: 'success' | 'info' | 'error') => void;
  activeJobForModal: Job | null;
  openApplyModal: (job: Job) => void;
  closeApplyModal: () => void;
  refreshApplications: () => Promise<void>;
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
}

const JobPortalContext = createContext<JobPortalContextType | undefined>(undefined);

const SAVED_JOBS_KEY = 'nextrole_saved_job_ids';
const SAVED_JOBS_OBJECTS_KEY = 'nextrole_saved_job_objects';
const THEME_COLOR_KEY = 'nextrole_theme_color';

export const JobPortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeColor, setThemeColorState] = useState<ThemeColor>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_COLOR_KEY) as ThemeColor;
      // If user had indigo or not set, default to the fresh modern Cobalt Blue!
      if (savedTheme && ['blue', 'emerald', 'teal', 'slate', 'violet', 'rose', 'indigo'].includes(savedTheme)) {
        return savedTheme;
      }
      return 'blue';
    } catch {
      return 'blue';
    }
  });

  const setThemeColor = (color: ThemeColor) => {
    setThemeColorState(color);
    try {
      localStorage.setItem(THEME_COLOR_KEY, color);
      document.documentElement.setAttribute('data-theme', color);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeColor);
  }, [themeColor]);

  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(SAVED_JOBS_KEY);
      return saved ? JSON.parse(saved) : ['job-1', 'job-4'];
    } catch {
      return ['job-1', 'job-4'];
    }
  });

  const [savedJobs, setSavedJobs] = useState<Job[]>(() => {
    try {
      const saved = localStorage.getItem(SAVED_JOBS_OBJECTS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [activeJobForModal, setActiveJobForModal] = useState<Job | null>(null);

  // Load applications and initialize saved jobs on mount
  useEffect(() => {
    const init = async () => {
      try {
        const apps = await jobApi.getApplications();
        setApplications(apps);

        if (savedJobs.length === 0 && savedJobIds.length > 0) {
          const all = await jobApi.getJobs({}, 1, 100);
          const matched = all.data.filter((j) => savedJobIds.includes(j.id));
          setSavedJobs(matched);
          localStorage.setItem(SAVED_JOBS_OBJECTS_KEY, JSON.stringify(matched));
        }
      } catch (err) {
        console.error('Failed to initialize portal context data', err);
      }
    };
    init();
  }, []);

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setNotification({ id, message, type });
    setTimeout(() => {
      setNotification((prev) => (prev?.id === id ? null : prev));
    }, 4000);
  };

  const toggleSaveJob = (job: Job) => {
    if (savedJobIds.includes(job.id)) {
      const updatedIds = savedJobIds.filter((id) => id !== job.id);
      const updatedJobs = savedJobs.filter((j) => j.id !== job.id);
      setSavedJobIds(updatedIds);
      setSavedJobs(updatedJobs);
      localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(updatedIds));
      localStorage.setItem(SAVED_JOBS_OBJECTS_KEY, JSON.stringify(updatedJobs));
      showNotification(`Removed "${job.title}" from saved jobs`, 'info');
    } else {
      const updatedIds = [...savedJobIds, job.id];
      const updatedJobs = [job, ...savedJobs];
      setSavedJobIds(updatedIds);
      setSavedJobs(updatedJobs);
      localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(updatedIds));
      localStorage.setItem(SAVED_JOBS_OBJECTS_KEY, JSON.stringify(updatedJobs));
      showNotification(`Saved "${job.title}" to your job list`, 'success');
    }
  };

  const isJobSaved = (jobId: string) => savedJobIds.includes(jobId);

  const isJobApplied = (jobId: string) => applications.some((app) => app.jobId === jobId);

  const submitApplication = async (
    appData: Omit<JobApplication, 'id' | 'appliedDate' | 'status'>
  ): Promise<JobApplication> => {
    const newApp = await jobApi.submitApplication(appData);
    setApplications((prev) => [newApp, ...prev]);
    showNotification(`Application submitted successfully for ${newApp.jobTitle}!`, 'success');
    return newApp;
  };

  const refreshApplications = async () => {
    const apps = await jobApi.getApplications();
    setApplications(apps);
  };

  const openApplyModal = (job: Job) => {
    setActiveJobForModal(job);
  };

  const closeApplyModal = () => {
    setActiveJobForModal(null);
  };

  return (
    <JobPortalContext.Provider
      value={{
        savedJobIds,
        savedJobs,
        toggleSaveJob,
        isJobSaved,
        applications,
        submitApplication,
        isJobApplied,
        notification,
        showNotification,
        activeJobForModal,
        openApplyModal,
        closeApplyModal,
        refreshApplications,
        themeColor,
        setThemeColor,
      }}
    >
      {children}
    </JobPortalContext.Provider>
  );
};

export const useJobPortal = (): JobPortalContextType => {
  const context = useContext(JobPortalContext);
  if (!context) {
    throw new Error('useJobPortal must be used within a JobPortalProvider');
  }
  return context;
};
