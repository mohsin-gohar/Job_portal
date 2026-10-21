import { useState, useEffect, useCallback, useRef } from 'react';
import { Job, JobFilterParams, PaginatedResult } from '../types/job';
import { jobApi } from '../services/api';

interface UseJobsOptions {
  initialFilters?: JobFilterParams;
  initialPage?: number;
  initialLimit?: number;
}

export const useJobs = (options: UseJobsOptions = {}) => {
  const [filters, setFilters] = useState<JobFilterParams>(options.initialFilters || {});
  const [page, setPage] = useState<number>(options.initialPage || 1);
  const [limit, setLimit] = useState<number>(options.initialLimit || 9);

  const [data, setData] = useState<PaginatedResult<Job>>({
    data: [],
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 1,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const activeRequestRef = useRef<number>(0);

  const fetchJobs = useCallback(async () => {
    const requestId = ++activeRequestRef.current;
    setLoading(true);
    setError(null);

    try {
      const result = await jobApi.getJobs(filters, page, limit);
      // Ensure only the latest request updates state
      if (requestId === activeRequestRef.current) {
        setData(result);
        setLoading(false);
      }
    } catch (err: any) {
      if (requestId === activeRequestRef.current) {
        setError(err?.message || 'Failed to fetch job listings. Please try again.');
        setLoading(false);
      }
    }
  }, [filters, page, limit]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const updateFilters = useCallback((newFilters: Partial<JobFilterParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
    // Reset to page 1 on filter changes
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
    setPage(1);
  }, []);

  return {
    jobs: data.data,
    total: data.total,
    page: data.page,
    limit: data.limit,
    totalPages: data.totalPages,
    loading,
    error,
    filters,
    setFilters: updateFilters,
    resetFilters,
    setPage,
    setLimit,
    refetch: fetchJobs,
  };
};

export const useJobDetails = (jobId: string | undefined) => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJob = useCallback(async () => {
    if (!jobId) {
      setLoading(false);
      setError('Invalid Job ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await jobApi.getJobById(jobId);
      setJob(data);
      setLoading(false);
    } catch (err: any) {
      setError(err?.message || 'Job listing could not be found.');
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  return {
    job,
    loading,
    error,
    refetch: fetchJob,
  };
};
