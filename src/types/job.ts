export type JobType = 'Full-time' | 'Part-time' | 'Remote' | 'Contract' | 'Internship';

export type JobCategory = 
  | 'Engineering' 
  | 'Product' 
  | 'Design' 
  | 'Marketing' 
  | 'Sales' 
  | 'Data & AI' 
  | 'Operations';

export type ExperienceLevel = 'Entry Level' | 'Mid Level' | 'Senior Level' | 'Staff / Lead';

export interface Company {
  id: string;
  name: string;
  initial: string;
  brandColor: string;
  category: JobCategory;
  location: string;
  employees: string;
  stage: 'Seed' | 'Series A' | 'Series B' | 'Series C+' | 'Public';
  openJobsCount: number;
  techStack: string[];
  description: string;
  website: string;
  foundedYear: number;
}

export interface CandidateUser {
  id: string;
  name: string;
  title: string;
  category: JobCategory;
  experienceYears: number;
  location: string;
  openToWork: boolean;
  skills: string[];
  bio: string;
  expectedSalary: number;
  avatarColor: string;
  preferredType: JobType;
  verified: boolean;
}

export interface Job {
  id: string;
  title: string;
  companyId?: string;
  company: string;
  companyLogo?: string;
  companyInitial: string;
  brandColor: string;
  location: string;
  isRemote: boolean;
  type: JobType;
  category: JobCategory;
  experienceLevel: ExperienceLevel;
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
  postedAt: string;
  featured?: boolean;
  urgent?: boolean;
  applicantsCount: number;
  department: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  benefits: string[];
  aboutCompany: string;
  teamSize?: string;
  website?: string;
}

export interface JobFiltersState {
  search: string;
  category: string;
  type: string;
  location: string;
  experienceLevel: string;
  minSalary: number;
  remoteOnly: boolean;
  companyId?: string;
  sortBy: 'newest' | 'salary-high' | 'salary-low' | 'relevance';
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  fullName: string;
  email: string;
  phone: string;
  resumeFileName: string;
  portfolioUrl?: string;
  experienceYears: number;
  coverLetter: string;
  noticePeriod: string;
  status: 'Submitted' | 'In Review' | 'Interview Scheduled' | 'Offer Extended' | 'Archived';
  appliedAt: string;
  notes?: string;
}

export interface JobAlert {
  id: string;
  email: string;
  keywords: string;
  category: string;
  location: string;
  frequency: 'Daily' | 'Weekly';
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: PaginationData;
  message?: string;
  status: number;
}
