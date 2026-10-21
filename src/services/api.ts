import { INITIAL_JOBS } from '../data/mockJobs';
import { Job, JobApplication, JobCategory, JobFilterParams, JobType, ExperienceLevel, PaginatedResult } from '../types/job';

const STORAGE_KEYS = {
  JOBS: 'nextrole_custom_jobs',
  APPLICATIONS: 'nextrole_applications',
  SAVED: 'nextrole_saved_job_ids',
  REMOTIVE_CACHE: 'nextrole_remotive_cache',
};

// In-memory cache for live public REST API jobs
let inMemoryLiveJobs: Job[] = [];
let hasFetchedLiveJobs = false;

// Helper to strip HTML tags from API description strings
const stripHtml = (html: string): string => {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

// Map Remotive category to internal category
const mapApiCategory = (cat: string): JobCategory => {
  const lower = (cat || '').toLowerCase();
  if (lower.includes('software') || lower.includes('dev') || lower.includes('qa')) return 'Engineering';
  if (lower.includes('design')) return 'Design';
  if (lower.includes('product')) return 'Product';
  if (lower.includes('data') || lower.includes('ai') || lower.includes('machine')) return 'Data & AI';
  if (lower.includes('marketing') || lower.includes('content') || lower.includes('growth')) return 'Marketing';
  if (lower.includes('sales') || lower.includes('account') || lower.includes('customer')) return 'Sales';
  return 'Operations';
};

// Map Remotive job type to internal type
const mapApiType = (t: string): JobType => {
  const lower = (t || '').toLowerCase();
  if (lower.includes('contract') || lower.includes('freelance')) return 'Contract';
  if (lower.includes('part_time') || lower.includes('part-time')) return 'Part-time';
  if (lower.includes('intern')) return 'Internship';
  return 'Full-time';
};

// Fetch live jobs from Remotive Public REST API
const fetchLiveRestApiJobs = async (): Promise<Job[]> => {
  if (hasFetchedLiveJobs && inMemoryLiveJobs.length > 0) {
    return inMemoryLiveJobs;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch('https://remotive.com/api/remote-jobs?limit=30', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`REST API returned ${res.status}`);
    }

    const json = await res.json();
    if (json && Array.isArray(json.jobs)) {
      const colors = [
        'bg-slate-900 text-white',
        'bg-blue-600 text-white',
        'bg-indigo-600 text-white',
        'bg-teal-700 text-white',
        'bg-emerald-700 text-white',
        'bg-purple-700 text-white',
      ];

      const mapped: Job[] = json.jobs.map((item: any, idx: number) => {
        const cleanDesc = stripHtml(item.description || '').slice(0, 450) + '...';
        const company = item.company_name || 'Global Tech';
        const initials = company
          .split(' ')
          .map((w: string) => w[0])
          .join('')
          .slice(0, 2)
          .toUpperCase() || 'GT';

        const titleLower = (item.title || '').toLowerCase();
        let expLevel: ExperienceLevel = 'Mid-Level';
        if (titleLower.includes('senior') || titleLower.includes('lead') || titleLower.includes('principal') || titleLower.includes('staff')) {
          expLevel = 'Senior';
        } else if (titleLower.includes('director') || titleLower.includes('head') || titleLower.includes('vp')) {
          expLevel = 'Lead / Executive';
        } else if (titleLower.includes('junior') || titleLower.includes('intern') || titleLower.includes('associate')) {
          expLevel = 'Entry-Level';
        }

        return {
          id: `live-${item.id}`,
          title: item.title,
          company,
          companyInitials: initials,
          companyColor: colors[idx % colors.length],
          category: mapApiCategory(item.category),
          type: mapApiType(item.job_type),
          location: item.candidate_required_location || 'Worldwide (Remote)',
          isRemote: true,
          experienceLevel: expLevel,
          salaryMin: 110000 + (idx % 6) * 15000,
          salaryMax: 155000 + (idx % 6) * 20000,
          salaryCurrency: 'USD',
          postedDate: item.publication_date ? item.publication_date.split('T')[0] : '2026-09-28',
          description: cleanDesc,
          responsibilities: [
            'Lead implementation of user-facing systems and high-scale services',
            'Collaborate with global distributed teams in an asynchronous setting',
            'Conduct comprehensive code reviews and maintain automated tests',
            'Contribute to sprint roadmaps, architecture decisions, and documentation',
          ],
          requirements: [
            'Proven track record delivering reliable software in distributed production systems',
            'Excellent asynchronous written and verbal communication in English',
            'Comfort with cross-timezone collaboration and high ownership',
          ],
          benefits: [
            '100% remote flexibility from anywhere in required timezone',
            'Competitive international compensation and equity participation',
            'Annual continuous education & home office workstation stipend',
            'Comprehensive healthcare support and flexible paid time off',
          ],
          tags: Array.isArray(item.tags) && item.tags.length > 0 ? item.tags.slice(0, 5) : ['Remote', 'REST API', 'Tech'],
          featured: idx % 7 === 0,
          department: item.category || 'Engineering',
          applicantsCount: 15 + (idx * 3) % 45,
          companyDescription: `${company} is a leading remote-first technology company hiring global talent.`,
          companyWebsite: item.url || 'https://remotive.com',
        };
      });

      inMemoryLiveJobs = mapped;
      hasFetchedLiveJobs = true;
      return mapped;
    }
  } catch (e) {
    // If live API is unavailable or rate limited, gracefully fall back
    console.info('Live Remotive REST API fetch returned offline or timed out, continuing with curated repository.', e);
  }

  return [];
};

// Helper to get all combined jobs (Custom posted + Live REST API + Initial Curated)
const getAllJobs = async (): Promise<Job[]> => {
  let customJobs: Job[] = [];
  try {
    const custom = localStorage.getItem(STORAGE_KEYS.JOBS);
    if (custom) {
      customJobs = JSON.parse(custom);
    }
  } catch (e) {
    console.error('Error loading custom jobs', e);
  }

  // Fetch live API jobs in background or use cache
  const liveJobs = await fetchLiveRestApiJobs();

  return [...customJobs, ...liveJobs, ...INITIAL_JOBS];
};

// Simulate network latency (200ms - 350ms)
const simulateNetworkDelay = (ms = 250): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const jobApi = {
  /**
   * Fetch jobs with filtering, search, sorting and pagination
   */
  async getJobs(
    filters: JobFilterParams = {},
    page = 1,
    limit = 9
  ): Promise<PaginatedResult<Job>> {
    await simulateNetworkDelay(200);

    let jobs = await getAllJobs();

    // 1. Search query (title, company, description, tags, location)
    if (filters.search && filters.search.trim() !== '') {
      const query = filters.search.toLowerCase().trim();
      jobs = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.department.toLowerCase().includes(query) ||
          job.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          job.location.toLowerCase().includes(query)
      );
    }

    // 2. Category filter
    if (filters.category && filters.category !== 'All') {
      jobs = jobs.filter((job) => job.category === filters.category);
    }

    // 3. Job Type filter (Full-time, Part-time, Remote, etc.)
    if (filters.type && filters.type !== 'All') {
      jobs = jobs.filter((job) => job.type === filters.type);
    }

    // 4. Experience Level filter
    if (filters.experienceLevel && filters.experienceLevel !== 'All') {
      jobs = jobs.filter((job) => job.experienceLevel === filters.experienceLevel);
    }

    // 5. Remote Only filter
    if (filters.remoteOnly) {
      jobs = jobs.filter((job) => job.isRemote);
    }

    // 6. Minimum Salary filter
    if (filters.minSalary && filters.minSalary > 0) {
      jobs = jobs.filter((job) => job.salaryMax >= (filters.minSalary || 0));
    }

    // 7. Location search filter
    if (filters.location && filters.location.trim() !== '' && filters.location !== 'All Locations') {
      const loc = filters.location.toLowerCase().trim();
      jobs = jobs.filter((job) => job.location.toLowerCase().includes(loc));
    }

    // 8. Sorting
    if (filters.sortBy === 'salary-high') {
      jobs.sort((a, b) => b.salaryMax - a.salaryMax);
    } else if (filters.sortBy === 'salary-low') {
      jobs.sort((a, b) => a.salaryMin - b.salaryMin);
    } else if (filters.sortBy === 'applicants') {
      jobs.sort((a, b) => b.applicantsCount - a.applicantsCount);
    } else {
      // Default: recent (newest posted first)
      jobs.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    }

    const total = jobs.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const validatedPage = Math.min(Math.max(1, page), totalPages);
    const startIndex = (validatedPage - 1) * limit;
    const paginatedData = jobs.slice(startIndex, startIndex + limit);

    return {
      data: paginatedData,
      total,
      page: validatedPage,
      limit,
      totalPages,
    };
  },

  /**
   * Fetch single job by ID
   */
  async getJobById(id: string): Promise<Job> {
    await simulateNetworkDelay(180);
    const jobs = await getAllJobs();
    const found = jobs.find((j) => j.id === id);

    if (!found) {
      throw new Error(`Job listing with ID "${id}" was not found.`);
    }

    return found;
  },

  /**
   * Fetch featured jobs
   */
  async getFeaturedJobs(limit = 3): Promise<Job[]> {
    await simulateNetworkDelay(150);
    const jobs = await getAllJobs();
    return jobs.filter((j) => j.featured).slice(0, limit);
  },

  /**
   * Fetch categories with job count
   */
  async getCategoryStats(): Promise<{ name: string; count: number }[]> {
    await simulateNetworkDelay(100);
    const jobs = await getAllJobs();
    const map: Record<string, number> = {};

    jobs.forEach((j) => {
      map[j.category] = (map[j.category] || 0) + 1;
    });

    return Object.entries(map).map(([name, count]) => ({ name, count }));
  },

  /**
   * Submit job application
   */
  async submitApplication(
    appData: Omit<JobApplication, 'id' | 'appliedDate' | 'status'>
  ): Promise<JobApplication> {
    await simulateNetworkDelay(350);

    const newApp: JobApplication = {
      ...appData,
      id: `APP-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Submitted',
    };

    try {
      const existing = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      const apps: JobApplication[] = existing ? JSON.parse(existing) : [];
      apps.unshift(newApp);
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
    } catch (e) {
      console.error('Error saving application to localStorage', e);
    }

    return newApp;
  },

  /**
   * Get all submitted applications
   */
  async getApplications(): Promise<JobApplication[]> {
    await simulateNetworkDelay(120);
    try {
      const existing = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      if (existing) {
        return JSON.parse(existing);
      }
    } catch (e) {
      console.error('Error reading applications', e);
    }
    return [];
  },

  /**
   * Post a new job (persisted in localStorage)
   */
  async postJob(
    jobData: Omit<Job, 'id' | 'postedDate' | 'applicantsCount' | 'companyInitials' | 'companyColor'>
  ): Promise<Job> {
    await simulateNetworkDelay(350);

    const initials = jobData.company
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const colors = [
      'bg-indigo-600 text-white',
      'bg-slate-900 text-white',
      'bg-blue-600 text-white',
      'bg-emerald-700 text-white',
      'bg-teal-700 text-white',
      'bg-violet-700 text-white',
    ];
    const companyColor = colors[Math.floor(Math.random() * colors.length)];

    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
      postedDate: new Date().toISOString().split('T')[0],
      applicantsCount: 0,
      companyInitials: initials || 'NR',
      companyColor,
      featured: false,
    };

    try {
      const custom = localStorage.getItem(STORAGE_KEYS.JOBS);
      const list: Job[] = custom ? JSON.parse(custom) : [];
      list.unshift(newJob);
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(list));
    } catch (e) {
      console.error('Error saving job to localStorage', e);
    }

    return newJob;
  },
};
