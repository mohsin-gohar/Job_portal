import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { Job, JobFiltersState, PaginationData } from '../types/job';
import { jobsApi } from '../services/api';

const DEFAULT_FILTERS: JobFiltersState = {
  search: '',
  category: 'All',
  type: 'All',
  location: 'All',
  experienceLevel: 'All',
  minSalary: 0,
  remoteOnly: false,
  sortBy: 'newest',
};

interface JobContextType {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  filters: JobFiltersState;
  pagination: PaginationData;
  activeFilterCount: number;
  itemsPerPage: number;
  simulateLatency: number;
  simulateError: boolean;
  updateFilters: (partial: Partial<JobFiltersState>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  setItemsPerPage: (limit: number) => void;
  setSimulateLatency: (ms: number) => void;
  setSimulateError: (simulate: boolean) => void;
  refetchJobs: () => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<JobFiltersState>(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPageState] = useState<number>(9);

  // Responsive latency
  const [simulateLatency, setSimulateLatency] = useState<number>(120);
  const [simulateError, setSimulateError] = useState<boolean>(false);

  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 9,
  });

  // Calculate number of active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search.trim()) count++;
    if (filters.category !== 'All') count++;
    if (filters.type !== 'All') count++;
    if (filters.location !== 'All') count++;
    if (filters.experienceLevel !== 'All') count++;
    if (filters.minSalary > 0) count++;
    if (filters.remoteOnly) count++;
    if (filters.sortBy !== 'newest') count++;
    return count;
  }, [filters]);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await jobsApi.getJobs({
        filters,
        page: currentPage,
        limit: itemsPerPage,
        simulateDelay: simulateLatency,
        forceError: simulateError,
      });

      setJobs(response.data);
      if (response.meta) {
        setPagination(response.meta);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred while loading jobs.';
      setError(msg);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, itemsPerPage, simulateLatency, simulateError]);

  // Load jobs whenever filters, page, itemsPerPage, or simulation toggles change
  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const updateFilters = useCallback((partial: Partial<JobFiltersState>) => {
    setFilters((prev) => ({
      ...prev,
      ...partial,
    }));
    // Reset to page 1 whenever filters change
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  }, []);

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const setItemsPerPage = useCallback((limit: number) => {
    setItemsPerPageState(limit);
    setCurrentPage(1);
  }, []);

  const refetchJobs = useCallback(() => {
    loadJobs();
  }, [loadJobs]);

  return (
    <JobContext.Provider
      value={{
        jobs,
        loading,
        error,
        filters,
        pagination,
        activeFilterCount,
        itemsPerPage,
        simulateLatency,
        simulateError,
        updateFilters,
        resetFilters,
        setPage,
        setItemsPerPage,
        setSimulateLatency,
        setSimulateError,
        refetchJobs,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = (): JobContextType => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within JobProvider');
  }
  return context;
};
