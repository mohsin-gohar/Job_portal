import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { JobAlert } from '../types/job';
import { useToast } from './ToastContext';

interface CandidateContextType {
  candidateSkills: string[];
  toggleCandidateSkill: (skill: string) => void;
  setCandidateSkills: (skills: string[]) => void;
  clearCandidateSkills: () => void;
  calculateJobMatchScore: (jobSkills: string[]) => { score: number; matching: string[] };
  jobAlerts: JobAlert[];
  addJobAlert: (alert: Omit<JobAlert, 'id' | 'createdAt'>) => void;
  removeJobAlert: (id: string) => void;
}

const CandidateContext = createContext<CandidateContextType | undefined>(undefined);

const STORAGE_SKILLS_KEY = 'lumina_candidate_skills';
const STORAGE_ALERTS_KEY = 'lumina_job_alerts';

export const POPULAR_TECH_SKILLS = [
  'React',
  'TypeScript',
  'JavaScript',
  'Tailwind CSS',
  'Python',
  'Go (Golang)',
  'Kubernetes',
  'AWS',
  'Docker',
  'SQL',
  'Figma',
  'Design Systems',
  'PyTorch',
  'Distributed Systems',
  'REST APIs',
  'GraphQL',
];

export const CandidateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [candidateSkills, setCandidateSkillsState] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_SKILLS_KEY);
      return stored ? JSON.parse(stored) : ['React', 'TypeScript'];
    } catch {
      return ['React', 'TypeScript'];
    }
  });

  const [jobAlerts, setJobAlerts] = useState<JobAlert[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_ALERTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SKILLS_KEY, JSON.stringify(candidateSkills));
    } catch (e) {
      console.error(e);
    }
  }, [candidateSkills]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ALERTS_KEY, JSON.stringify(jobAlerts));
    } catch (e) {
      console.error(e);
    }
  }, [jobAlerts]);

  const toggleCandidateSkill = useCallback((skill: string) => {
    setCandidateSkillsState((prev) => {
      if (prev.includes(skill)) {
        return prev.filter((s) => s !== skill);
      } else {
        return [...prev, skill];
      }
    });
  }, []);

  const setCandidateSkills = useCallback((skills: string[]) => {
    setCandidateSkillsState(skills);
  }, []);

  const clearCandidateSkills = useCallback(() => {
    setCandidateSkillsState([]);
  }, []);

  const calculateJobMatchScore = useCallback(
    (jobSkills: string[]) => {
      if (!candidateSkills.length || !jobSkills.length) {
        return { score: 0, matching: [] };
      }
      const matching = jobSkills.filter((js) =>
        candidateSkills.some((cs) => cs.toLowerCase() === js.toLowerCase())
      );
      const score = Math.round((matching.length / jobSkills.length) * 100);
      return { score, matching };
    },
    [candidateSkills]
  );

  const addJobAlert = useCallback(
    (alertData: Omit<JobAlert, 'id' | 'createdAt'>) => {
      const newAlert: JobAlert = {
        ...alertData,
        id: `alert-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setJobAlerts((prev) => [newAlert, ...prev]);
      showToast('Job alert active!', 'success', `Alerts will be sent to ${alertData.email}`);
    },
    [showToast]
  );

  const removeJobAlert = useCallback(
    (id: string) => {
      setJobAlerts((prev) => prev.filter((a) => a.id !== id));
      showToast('Job alert removed', 'info');
    },
    [showToast]
  );

  return (
    <CandidateContext.Provider
      value={{
        candidateSkills,
        toggleCandidateSkill,
        setCandidateSkills,
        clearCandidateSkills,
        calculateJobMatchScore,
        jobAlerts,
        addJobAlert,
        removeJobAlert,
      }}
    >
      {children}
    </CandidateContext.Provider>
  );
};

export const useCandidate = (): CandidateContextType => {
  const context = useContext(CandidateContext);
  if (!context) {
    throw new Error('useCandidate must be used within CandidateProvider');
  }
  return context;
};
