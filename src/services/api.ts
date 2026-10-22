import {
  Job,
  JobFiltersState,
  PaginationData,
  ApiResponse,
  JobApplication,
  Company,
  CandidateUser,
  JobCategory,
} from '../types/job';
import { GENERATED_JOBS, SEED_COMPANIES, GENERATED_CANDIDATES } from '../data/db';

const STORAGE_KEY_JOBS = 'lumina_jobs_data_v3';
const STORAGE_KEY_APPLICATIONS = 'lumina_applications_data_v2';
const STORAGE_KEY_COMPANIES = 'lumina_companies_data_v2';
const STORAGE_KEY_CANDIDATES = 'lumina_candidates_data_v2';

// Helper to get all current jobs from localStorage or fallback to GENERATED_JOBS
export const getStoredJobs = (): Job[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_JOBS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_JOBS, JSON.stringify(GENERATED_JOBS));
      return GENERATED_JOBS;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : GENERATED_JOBS;
  } catch {
    return GENERATED_JOBS;
  }
};

export const saveJobsToStorage = (jobs: Job[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY_JOBS, JSON.stringify(jobs));
  } catch (e) {
    console.error('Failed to save jobs to localStorage', e);
  }
};

export const getStoredCompanies = (): Company[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_COMPANIES);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_COMPANIES, JSON.stringify(SEED_COMPANIES));
      return SEED_COMPANIES;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_COMPANIES;
  } catch {
    return SEED_COMPANIES;
  }
};

export const getStoredCandidates = (): CandidateUser[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_CANDIDATES);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_CANDIDATES, JSON.stringify(GENERATED_CANDIDATES));
      return GENERATED_CANDIDATES;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length >= 100 ? parsed : GENERATED_CANDIDATES;
  } catch {
    return GENERATED_CANDIDATES;
  }
};

export const getStoredApplications = (): JobApplication[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_APPLICATIONS);
    if (data) return JSON.parse(data);

    // Initial realistic seeded pipeline applications
    const initialApps: JobApplication[] = [
      {
        id: 'APP-942810',
        jobId: 'job-001',
        jobTitle: 'Senior Frontend Engineer',
        company: 'Linear Labs',
        fullName: 'Alex Vance',
        email: 'alex.vance@example.com',
        phone: '+1 (555) 234-5678',
        resumeFileName: 'Alex_Vance_Staff_Frontend.pdf',
        portfolioUrl: 'https://alexvance.design',
        experienceYears: 6,
        coverLetter: 'Obsessed with keyboard interaction states, latency budgets, and canvas render loops.',
        noticePeriod: '2 weeks',
        status: 'Interview Scheduled',
        appliedAt: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
        notes: 'Technical interview round scheduled with Lead Architect on Thursday.',
      },
      {
        id: 'APP-817293',
        jobId: 'job-002',
        jobTitle: 'Staff AI Systems Architect',
        company: 'Anthra Neural',
        fullName: 'Dr. Elena Rostova',
        email: 'elena.rostova@ai-research.org',
        phone: '+1 (555) 890-1234',
        resumeFileName: 'Dr_Elena_Rostova_Distributed_Systems.pdf',
        portfolioUrl: 'https://github.com/erostova',
        experienceYears: 8,
        coverLetter: 'Specialist in KV-cache compression and multi-node Triton inference cluster deployments.',
        noticePeriod: '1 month',
        status: 'In Review',
        appliedAt: new Date(Date.now() - 1 * 24 * 3600000).toISOString(),
      },
      {
        id: 'APP-654321',
        jobId: 'job-003',
        jobTitle: 'Product Designer (Design Systems)',
        company: 'Veloce Studio',
        fullName: 'Marcus Chen',
        email: 'marcus.chen@designcraft.io',
        phone: '+44 20 7946 0912',
        resumeFileName: 'Marcus_Chen_Design_Tokens.pdf',
        portfolioUrl: 'https://marcuschen.design',
        experienceYears: 5,
        coverLetter: 'Built design systems utilized by 40+ product squads with automated token CI pipelines.',
        noticePeriod: 'Immediate',
        status: 'Offer Extended',
        appliedAt: new Date(Date.now() - 7 * 24 * 3600000).toISOString(),
        notes: 'Offer letter extended at $120k GBP base + equity.',
      },
    ];

    localStorage.setItem(STORAGE_KEY_APPLICATIONS, JSON.stringify(initialApps));
    return initialApps;
  } catch {
    return [];
  }
};

export const saveApplicationToStorage = (application: JobApplication): void => {
  try {
    const current = getStoredApplications();
    const updated = [application, ...current];
    localStorage.setItem(STORAGE_KEY_APPLICATIONS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save application', e);
  }
};

export interface FetchJobsParams {
  filters?: Partial<JobFiltersState>;
  page?: number;
  limit?: number;
  simulateDelay?: number;
  forceError?: boolean;
}

export const jobsApi = {
  // Fetch Jobs with pagination & filtering
  async getJobs({
    filters = {},
    page = 1,
    limit = 9,
    simulateDelay = 200,
    forceError = false,
  }: FetchJobsParams = {}): Promise<ApiResponse<Job[]>> {
    if (simulateDelay > 0) {
      await new Promise((resolve) => setTimeout(resolve, simulateDelay));
    }

    if (forceError) {
      throw new Error('500 Internal Server Error: Failed to fetch jobs.');
    }

    let allJobs = getStoredJobs();

    // 1. Search Query
    if (filters.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      allJobs = allJobs.filter((job) => {
        const titleMatch = job.title.toLowerCase().includes(q);
        const companyMatch = job.company.toLowerCase().includes(q);
        const deptMatch = job.department.toLowerCase().includes(q);
        const skillMatch = job.skills.some((s) => s.toLowerCase().includes(q));
        const descMatch = job.description.toLowerCase().includes(q);
        return titleMatch || companyMatch || deptMatch || skillMatch || descMatch;
      });
    }

    // 2. Company Filter
    if (filters.companyId) {
      allJobs = allJobs.filter((j) => j.companyId === filters.companyId);
    }

    // 3. Category Filter
    if (filters.category && filters.category !== 'All') {
      allJobs = allJobs.filter((job) => job.category.toLowerCase() === filters.category!.toLowerCase());
    }

    // 4. Job Type Filter
    if (filters.type && filters.type !== 'All') {
      allJobs = allJobs.filter((job) => job.type.toLowerCase() === filters.type!.toLowerCase());
    }

    // 5. Location Filter
    if (filters.location && filters.location !== 'All') {
      const loc = filters.location.toLowerCase();
      if (loc === 'remote') {
        allJobs = allJobs.filter((job) => job.isRemote);
      } else {
        allJobs = allJobs.filter((job) => job.location.toLowerCase().includes(loc));
      }
    }

    // 6. Remote Only flag
    if (filters.remoteOnly) {
      allJobs = allJobs.filter((job) => job.isRemote);
    }

    // 7. Experience Level
    if (filters.experienceLevel && filters.experienceLevel !== 'All') {
      allJobs = allJobs.filter((job) => job.experienceLevel.toLowerCase() === filters.experienceLevel!.toLowerCase());
    }

    // 8. Salary Filter (minSalary)
    if (filters.minSalary && filters.minSalary > 0) {
      allJobs = allJobs.filter((job) => job.salaryMax >= filters.minSalary!);
    }

    // 9. Sorting
    const sortBy = filters.sortBy || 'newest';
    if (sortBy === 'newest') {
      allJobs.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
    } else if (sortBy === 'salary-high') {
      allJobs.sort((a, b) => b.salaryMax - a.salaryMax);
    } else if (sortBy === 'salary-low') {
      allJobs.sort((a, b) => a.salaryMin - b.salaryMin);
    }

    // 10. Pagination
    const totalItems = allJobs.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    const validatedPage = Math.min(Math.max(1, page), totalPages);
    const startIndex = (validatedPage - 1) * limit;
    const paginatedItems = allJobs.slice(startIndex, startIndex + limit);

    return {
      status: 200,
      data: paginatedItems,
      meta: {
        currentPage: validatedPage,
        totalPages,
        totalItems,
        itemsPerPage: limit,
      },
      message: 'Jobs retrieved successfully',
    };
  },

  async getJobById(id: string, simulateDelay = 150): Promise<ApiResponse<Job>> {
    if (simulateDelay > 0) {
      await new Promise((resolve) => setTimeout(resolve, simulateDelay));
    }
    const allJobs = getStoredJobs();
    const job = allJobs.find((j) => j.id === id);

    if (!job) {
      throw new Error(`Job with ID "${id}" does not exist.`);
    }

    return {
      status: 200,
      data: job,
      message: 'Job found',
    };
  },

  // 30 Companies APIs
  async getCompanies({
    search = '',
    category = 'All',
  }: {
    search?: string;
    category?: string;
  } = {}): Promise<ApiResponse<Company[]>> {
    const allCompanies = getStoredCompanies();
    let result = [...allCompanies];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.techStack.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (category && category !== 'All') {
      result = result.filter((c) => c.category.toLowerCase() === category.toLowerCase());
    }

    return {
      status: 200,
      data: result,
      meta: {
        currentPage: 1,
        totalPages: 1,
        totalItems: result.length,
        itemsPerPage: result.length,
      },
      message: 'Companies retrieved',
    };
  },

  async getCompanyById(id: string): Promise<ApiResponse<Company>> {
    const companies = getStoredCompanies();
    const comp = companies.find((c) => c.id === id);
    if (!comp) throw new Error('Company not found');
    return { status: 200, data: comp };
  },

  // 160+ Candidates Directory APIs
  async getCandidates({
    search = '',
    category = 'All',
    openToWorkOnly = false,
    skill = '',
    page = 1,
    limit = 12,
  }: {
    search?: string;
    category?: string;
    openToWorkOnly?: boolean;
    skill?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<ApiResponse<CandidateUser[]>> {
    let allCandidates = getStoredCandidates();

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      allCandidates = allCandidates.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (category && category !== 'All') {
      allCandidates = allCandidates.filter((c) => c.category.toLowerCase() === category.toLowerCase());
    }

    if (openToWorkOnly) {
      allCandidates = allCandidates.filter((c) => c.openToWork);
    }

    if (skill) {
      allCandidates = allCandidates.filter((c) =>
        c.skills.some((s) => s.toLowerCase() === skill.toLowerCase())
      );
    }

    const totalItems = allCandidates.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    const validatedPage = Math.min(Math.max(1, page), totalPages);
    const start = (validatedPage - 1) * limit;

    return {
      status: 200,
      data: allCandidates.slice(start, start + limit),
      meta: {
        currentPage: validatedPage,
        totalPages,
        totalItems,
        itemsPerPage: limit,
      },
      message: 'Candidates retrieved successfully',
    };
  },

  // Application Submission & ATS Management
  async submitApplication(
    data: Omit<JobApplication, 'id' | 'appliedAt' | 'status'>,
    simulateDelay = 400
  ): Promise<ApiResponse<JobApplication>> {
    if (simulateDelay > 0) {
      await new Promise((resolve) => setTimeout(resolve, simulateDelay));
    }

    const newApplication: JobApplication = {
      ...data,
      id: `APP-${Date.now().toString().slice(-6)}`,
      status: 'Submitted',
      appliedAt: new Date().toISOString(),
    };

    saveApplicationToStorage(newApplication);

    return {
      status: 201,
      data: newApplication,
      message: 'Application submitted successfully',
    };
  },

  async updateApplicationStatus(
    id: string,
    status: JobApplication['status'],
    notes?: string
  ): Promise<ApiResponse<JobApplication>> {
    const current = getStoredApplications();
    const index = current.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Application not found');

    const updated = {
      ...current[index],
      status,
      ...(notes ? { notes } : {}),
    };
    current[index] = updated;
    localStorage.setItem(STORAGE_KEY_APPLICATIONS, JSON.stringify(current));

    return {
      status: 200,
      data: updated,
      message: 'Application status updated',
    };
  },

  async postJob(jobData: Omit<Job, 'id' | 'postedAt'>, simulateDelay = 350): Promise<ApiResponse<Job>> {
    if (simulateDelay > 0) {
      await new Promise((resolve) => setTimeout(resolve, simulateDelay));
    }

    const currentJobs = getStoredJobs();
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now().toString().slice(-4)}`,
      postedAt: new Date().toISOString(),
    };

    saveJobsToStorage([newJob, ...currentJobs]);

    return {
      status: 201,
      data: newJob,
      message: 'Job listing posted successfully',
    };
  },

  async deleteJob(id: string): Promise<ApiResponse<boolean>> {
    const currentJobs = getStoredJobs();
    const updated = currentJobs.filter((j) => j.id !== id);
    saveJobsToStorage(updated);
    return {
      status: 200,
      data: true,
      message: 'Job listing deleted successfully',
    };
  },

  async toggleJobFeatured(id: string): Promise<ApiResponse<Job>> {
    const currentJobs = getStoredJobs();
    const index = currentJobs.findIndex((j) => j.id === id);
    if (index === -1) throw new Error('Job not found');
    currentJobs[index].featured = !currentJobs[index].featured;
    saveJobsToStorage([...currentJobs]);
    return {
      status: 200,
      data: currentJobs[index],
      message: 'Featured status updated',
    };
  },

  async resetDatabaseToDefaults(): Promise<ApiResponse<boolean>> {
    localStorage.removeItem(STORAGE_KEY_JOBS);
    localStorage.removeItem('lumina_jobs_data_v2');
    localStorage.removeItem(STORAGE_KEY_APPLICATIONS);
    localStorage.removeItem(STORAGE_KEY_COMPANIES);
    localStorage.removeItem(STORAGE_KEY_CANDIDATES);
    getStoredJobs();
    getStoredCompanies();
    getStoredCandidates();
    getStoredApplications();
    return {
      status: 200,
      data: true,
      message: 'Database reset to default seed data',
    };
  },
};
