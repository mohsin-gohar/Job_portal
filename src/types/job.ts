export type JobCategory = 
  | 'Engineering' 
  | 'Design' 
  | 'Product' 
  | 'Marketing' 
  | 'Data & AI' 
  | 'Sales' 
  | 'Operations';

export type JobType = 
  | 'Full-time' 
  | 'Part-time' 
  | 'Contract' 
  | 'Remote' 
  | 'Internship';

export type ExperienceLevel = 
  | 'Entry-Level' 
  | 'Mid-Level' 
  | 'Senior' 
  | 'Lead / Executive';

export interface Job {
  id: string;
  title: string;
  company: string;
  companyInitials: string;
  companyColor: string;
  category: JobCategory;
  type: JobType;
  location: string;
  isRemote: boolean;
  experienceLevel: ExperienceLevel;
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
  postedDate: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  tags: string[];
  featured?: boolean;
  department: string;
  applicantsCount: number;
  companyDescription: string;
  companyWebsite: string;
}

export interface JobFilterParams {
  search?: string;
  category?: string;
  type?: string;
  location?: string;
  experienceLevel?: string;
  minSalary?: number;
  remoteOnly?: boolean;
  sortBy?: 'recent' | 'salary-high' | 'salary-low' | 'applicants';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  applicantName: string;
  email: string;
  phone: string;
  portfolioUrl?: string;
  resumeFileName: string;
  resumeFileSize: string;
  coverLetter: string;
  appliedDate: string;
  status: 'Submitted' | 'In Review' | 'Interview Scheduled' | 'Offer Extended';
}
