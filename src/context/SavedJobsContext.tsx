import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Job } from '../types/job';
import { getStoredJobs } from '../services/api';
import { useToast } from './ToastContext';

const STORAGE_KEY_SAVED = 'lumina_saved_jobs_ids';

interface SavedJobsContextType {
  savedJobIds: string[];
  savedJobs: Job[];
  savedCount: number;
  isSaved: (jobId: string) => boolean;
  toggleSaveJob: (job: Job) => void;
  clearSavedJobs: () => void;
}

const SavedJobsContext = createContext<SavedJobsContextType | undefined>(undefined);

export const SavedJobsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SAVED);
      return stored ? JSON.parse(stored) : ['job-001', 'job-004']; // initial sample saved jobs
    } catch {
      return ['job-001', 'job-004'];
    }
  });

  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(savedJobIds));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [savedJobIds]);

  const isSaved = useCallback((jobId: string) => savedJobIds.includes(jobId), [savedJobIds]);

  const toggleSaveJob = useCallback((job: Job) => {
    setSavedJobIds((prev) => {
      const exists = prev.includes(job.id);
      if (exists) {
        showToast('Removed from saved jobs', 'info', job.title);
        return prev.filter((id) => id !== job.id);
      } else {
        showToast('Saved to your job list', 'success', `${job.title} at ${job.company}`);
        return [...prev, job.id];
      }
    });
  }, [showToast]);

  const clearSavedJobs = useCallback(() => {
    setSavedJobIds([]);
    showToast('Saved jobs cleared', 'info');
  }, [showToast]);

  const allJobs = getStoredJobs();
  const savedJobs = allJobs.filter((j) => savedJobIds.includes(j.id));

  return (
    <SavedJobsContext.Provider
      value={{
        savedJobIds,
        savedJobs,
        savedCount: savedJobIds.length,
        isSaved,
        toggleSaveJob,
        clearSavedJobs,
      }}
    >
      {children}
    </SavedJobsContext.Provider>
  );
};

export const useSavedJobs = (): SavedJobsContextType => {
  const context = useContext(SavedJobsContext);
  if (!context) {
    throw new Error('useSavedJobs must be used within SavedJobsProvider');
  }
  return context;
};
