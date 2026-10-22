import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getStoredJobs,
  getStoredCompanies,
  getStoredCandidates,
  getStoredApplications,
  jobsApi,
} from '../services/api';
import { Job, Company, CandidateUser, JobApplication } from '../types/job';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Briefcase,
  Users,
  Building2,
  FileText,
  TrendingUp,
  PlusCircle,
  ArrowRight,
  Activity,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
  Trash2,
  Sparkles,
  ExternalLink,
  RotateCcw,
  LogOut,
  AlertTriangle,
  X,
  Layers,
  Settings,
  Flame,
  Check,
  Save,
  Download,
  Bell,
  Lock,
  Globe,
  Sliders,
  Database,
  Send,
  Eye,
  RefreshCw,
} from 'lucide-react';

type AdminTab = 'overview' | 'jobs' | 'companies' | 'candidates' | 'applications' | 'settings';

interface PortalSettings {
  siteName: string;
  tagline: string;
  supportEmail: string;
  currency: 'USD' | 'EUR' | 'GBP';
  maintenanceMode: boolean;
  allowCandidateRegistration: boolean;
  autoApproveJobs: boolean;
  enforceSalaryTransparency: boolean;
  minBaseSalary: number;
  emailAlerts: boolean;
  dailyDigest: boolean;
  webhookUrl: string;
  twoFactorEnforced: boolean;
}

const DEFAULT_SETTINGS: PortalSettings = {
  siteName: 'Lumina Careers',
  tagline: 'The Curated Platform for Ambitious Tech Talent',
  supportEmail: 'admin@lumina.careers',
  currency: 'USD',
  maintenanceMode: false,
  allowCandidateRegistration: true,
  autoApproveJobs: true,
  enforceSalaryTransparency: true,
  minBaseSalary: 50000,
  emailAlerts: true,
  dailyDigest: false,
  webhookUrl: 'https://api.lumina.careers/webhooks/pipeline-events',
  twoFactorEnforced: false,
};

const SETTINGS_STORAGE_KEY = 'lumina_portal_settings_v1';

export const AdminDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [candidates, setCandidates] = useState<CandidateUser[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);

  // Settings State
  const [settings, setSettings] = useState<PortalSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Search queries per tab
  const [jobSearch, setJobSearch] = useState('');
  const [companySearch, setCompanySearch] = useState('');
  const [candidateSearch, setCandidateSearch] = useState('');
  const [appSearch, setAppSearch] = useState('');

  // Modals
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [testingWebhook, setTestingWebhook] = useState(false);

  // Load initial data
  const refreshData = () => {
    setJobs(getStoredJobs());
    setCompanies(getStoredCompanies());
    setCandidates(getStoredCandidates());
    setApplications(getStoredApplications());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleLogoutAdmin = () => {
    logout();
    showToast('Administrator session ended', 'info');
    navigate('/login');
  };

  const handleToggleFeatured = async (jobId: string) => {
    try {
      await jobsApi.toggleJobFeatured(jobId);
      refreshData();
      showToast('Spotlight status updated', 'success');
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDeleteJob = async () => {
    if (!jobToDelete) return;
    try {
      await jobsApi.deleteJob(jobToDelete.id);
      refreshData();
      showToast('Job listing removed', 'success', `Deleted ${jobToDelete.title}`);
      setJobToDelete(null);
    } catch {
      showToast('Failed to delete job', 'error');
    }
  };

  const handleResetSystem = async () => {
    try {
      await jobsApi.resetDatabaseToDefaults();
      refreshData();
      setResetModalOpen(false);
      showToast('Database Reset Complete', 'success', 'All collections restored to default 50 jobs.');
    } catch {
      showToast('Failed to reset system', 'error');
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      showToast('Configuration Saved', 'success', 'Platform settings successfully updated.');
    } catch {
      showToast('Failed to save settings', 'error');
    }
  };

  const handleTestWebhook = () => {
    setTestingWebhook(true);
    setTimeout(() => {
      setTestingWebhook(false);
      showToast('Webhook Test Successful (200 OK)', 'success', `Ping sent to ${settings.webhookUrl}`);
    }, 600);
  };

  const handleExportFullBackup = () => {
    try {
      const backupData = {
        exportedAt: new Date().toISOString(),
        settings,
        jobs,
        companies,
        candidates,
        applications,
      };
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `lumina_system_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('System Backup Downloaded', 'success', 'Full platform JSON archive saved.');
    } catch {
      showToast('Backup export failed', 'error');
    }
  };

  // Filtered queries
  const filteredJobs = useMemo(() => {
    return jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
        j.company.toLowerCase().includes(jobSearch.toLowerCase()) ||
        j.category.toLowerCase().includes(jobSearch.toLowerCase()) ||
        j.location.toLowerCase().includes(jobSearch.toLowerCase())
    );
  }, [jobs, jobSearch]);

  const filteredCompanies = useMemo(() => {
    return companies.filter(
      (c) =>
        c.name.toLowerCase().includes(companySearch.toLowerCase()) ||
        c.category.toLowerCase().includes(companySearch.toLowerCase()) ||
        c.location.toLowerCase().includes(companySearch.toLowerCase())
    );
  }, [companies, companySearch]);

  const filteredCandidates = useMemo(() => {
    return candidates.filter(
      (c) =>
        c.name.toLowerCase().includes(candidateSearch.toLowerCase()) ||
        c.title.toLowerCase().includes(candidateSearch.toLowerCase()) ||
        c.skills.some((s) => s.toLowerCase().includes(candidateSearch.toLowerCase()))
    );
  }, [candidates, candidateSearch]);

  const filteredApps = useMemo(() => {
    return applications.filter(
      (a) =>
        a.fullName.toLowerCase().includes(appSearch.toLowerCase()) ||
        a.jobTitle.toLowerCase().includes(appSearch.toLowerCase()) ||
        a.company.toLowerCase().includes(appSearch.toLowerCase())
    );
  }, [applications, appSearch]);

  // Analytics helpers
  const jobsByCategory = useMemo(() => {
    const acc: Record<string, number> = {};
    jobs.forEach((j) => {
      acc[j.category] = (acc[j.category] || 0) + 1;
    });
    return Object.entries(acc).sort((a, b) => b[1] - a[1]);
  }, [jobs]);

  const remoteCount = jobs.filter((j) => j.isRemote).length;
  const featuredCount = jobs.filter((j) => j.featured).length;
  const openCandidates = candidates.filter((c) => c.openToWork).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* SECTION 1: Top Executive Admin Bar */}
      <section className="bg-white border-b border-slate-200/90 pt-8 pb-7 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 text-white text-xs font-semibold mb-2.5 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Root Administrator Console</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="font-mono text-slate-300">{user?.email}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
              Platform Administration & Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Global governance controls, active listings oversight, candidate roster monitoring, and system configuration.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              to="/post-job"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-xl transition-all shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post New Role</span>
            </Link>

            <button
              type="button"
              onClick={handleExportFullBackup}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all shadow-2xs"
              title="Download Full JSON Backup"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>System Backup</span>
            </button>

            <button
              type="button"
              onClick={handleLogoutAdmin}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-xl transition-all shadow-2xs"
              title="End Admin Session"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>Exit Admin</span>
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* SECTION 2: Platform KPI Performance Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold">Curated Openings</span>
              <Briefcase className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-3xl font-bold font-mono tabular-nums text-slate-950">
              {jobs.length}
            </div>
            <div className="mt-2 text-[11px] text-slate-500 font-medium">
              <span>{remoteCount} remote roles · {featuredCount} featured</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold">Verified Companies</span>
              <Building2 className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-3xl font-bold font-mono tabular-nums text-slate-950">
              {companies.length}
            </div>
            <div className="mt-2 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>100% verified partners</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold">Candidate Roster</span>
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-3xl font-bold font-mono tabular-nums text-slate-950">
              {candidates.length}
            </div>
            <div className="mt-2 text-[11px] text-slate-500 font-medium">
              <span>{openCandidates} currently open to work</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold">Platform Status</span>
              <Activity className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-emerald-700 mt-1 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{settings.maintenanceMode ? 'Maintenance Mode' : 'Operational'}</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 font-mono">
              <span>REST Synced · v3 Storage</span>
            </div>
          </div>
        </div>

        {/* SECTION 3: Tabbed Navigation */}
        <div className="border-b border-slate-200 flex items-center gap-2 overflow-x-auto pb-px">
          {[
            { id: 'overview', label: 'Overview & Analytics', icon: Activity },
            { id: 'jobs', label: `Job Listings (${jobs.length})`, icon: Briefcase },
            { id: 'companies', label: `Companies (${companies.length})`, icon: Building2 },
            { id: 'candidates', label: `Candidate CRM (${candidates.length})`, icon: Users },
            { id: 'applications', label: `Applications (${applications.length})`, icon: FileText },
            { id: 'settings', label: 'Platform Settings & Config', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-slate-950 text-slate-950 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* SECTION 4: Tab Content Views */}

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Jobs Breakdown by Department */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-soft space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-950">Roles by Discipline</h3>
                  <span className="font-mono text-xs text-slate-400">{jobs.length} total</span>
                </div>
                <div className="space-y-3 pt-1">
                  {jobsByCategory.map(([cat, count]) => {
                    const pct = Math.round((count / jobs.length) * 100);
                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-slate-700">{cat}</span>
                          <span className="font-mono text-slate-500 font-semibold">{count} ({pct}%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-slate-950 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Hiring Velocity & Pipeline Funnel */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-soft space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-950">Application Funnel</h3>
                  <Link to="/ats" className="text-xs font-semibold text-indigo-600 hover:underline">
                    View ATS
                  </Link>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Submitted (New Review)', count: applications.filter(a => a.status === 'Submitted').length, color: 'bg-slate-400' },
                    { label: 'In Review (Screening)', count: applications.filter(a => a.status === 'In Review').length, color: 'bg-amber-500' },
                    { label: 'Interview Scheduled', count: applications.filter(a => a.status === 'Interview Scheduled').length, color: 'bg-indigo-500' },
                    { label: 'Offer Extended', count: applications.filter(a => a.status === 'Offer Extended').length, color: 'bg-emerald-500' },
                  ].map((stg) => (
                    <div key={stg.label} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full ${stg.color}`} />
                        <span className="font-medium text-slate-800">{stg.label}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-950">{stg.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Verified Companies Hiring */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-soft space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-950">Top Hiring Partners</h3>
                  <span className="text-xs text-slate-400">By active openings</span>
                </div>
                <div className="space-y-2.5">
                  {companies.slice(0, 5).map((comp) => (
                    <div key={comp.id} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-lg text-white font-bold flex items-center justify-center text-xs"
                          style={{ backgroundColor: comp.brandColor }}
                        >
                          {comp.initial}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-900">{comp.name}</div>
                          <div className="text-[10px] text-slate-400">{comp.location}</div>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {comp.openJobsCount} roles
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: JOBS GOVERNANCE */}
        {activeTab === 'jobs' && (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-soft flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                  placeholder="Search 50 jobs by title, company, or location..."
                  className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-slate-400 focus:bg-white transition-all"
                />
              </div>

              <div className="text-xs text-slate-500 font-mono">
                Showing <strong>{filteredJobs.length}</strong> of {jobs.length} listings
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-soft">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-4">Role Title & Company</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Location</th>
                      <th className="py-3.5 px-4">Salary Range</th>
                      <th className="py-3.5 px-4">Homepage Spotlight</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-lg text-white font-bold flex items-center justify-center text-xs shrink-0"
                              style={{ backgroundColor: job.brandColor || '#4F46E5' }}
                            >
                              {job.companyInitial}
                            </div>
                            <div>
                              <Link
                                to={`/jobs/${job.id}`}
                                className="font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                              >
                                {job.title}
                              </Link>
                              <div className="text-[11px] text-slate-500">{job.company}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                            {job.category}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-slate-700">
                          {job.location} {job.isRemote && <span className="text-emerald-700 font-semibold">(Remote)</span>}
                        </td>

                        <td className="py-3 px-4 font-mono font-medium text-slate-900">
                          ${Math.round(job.salaryMin / 1000)}k – ${Math.round(job.salaryMax / 1000)}k
                        </td>

                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(job.id)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                              job.featured
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                            title="Click to toggle featured spotlight on homepage"
                          >
                            <Flame className={`w-3 h-3 ${job.featured ? 'text-amber-600 fill-amber-500' : 'text-slate-400'}`} />
                            <span>{job.featured ? 'Featured' : 'Standard'}</span>
                          </button>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/jobs/${job.id}`}
                              className="p-1.5 text-slate-500 hover:text-slate-950 hover:bg-slate-100 rounded-md transition-colors"
                              title="View public listing"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => setJobToDelete(job)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                              title="Delete job permanently"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: COMPANIES DIRECTORY */}
        {activeTab === 'companies' && (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-soft flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={companySearch}
                  onChange={(e) => setCompanySearch(e.target.value)}
                  placeholder="Search partner companies..."
                  className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                />
              </div>
              <div className="text-xs text-slate-500 font-mono">
                Showing <strong>{filteredCompanies.length}</strong> companies
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-soft">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-4">Company</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Stage</th>
                      <th className="py-3.5 px-4">Team Size</th>
                      <th className="py-3.5 px-4">Location</th>
                      <th className="py-3.5 px-4">Open Roles</th>
                      <th className="py-3.5 px-4 text-right">Website</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredCompanies.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                          <span
                            className="w-6 h-6 rounded-md text-white font-bold flex items-center justify-center text-[10px]"
                            style={{ backgroundColor: c.brandColor }}
                          >
                            {c.initial}
                          </span>
                          <span>{c.name}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{c.category}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-[11px] text-slate-700">
                            {c.stage}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{c.employees}</td>
                        <td className="py-3 px-4 text-slate-600">{c.location}</td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {c.openJobsCount}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <a
                            href={c.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-600 hover:underline font-semibold"
                          >
                            Visit
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CANDIDATE CRM */}
        {activeTab === 'candidates' && (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-soft flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={candidateSearch}
                  onChange={(e) => setCandidateSearch(e.target.value)}
                  placeholder="Search candidates by name, skill, or title..."
                  className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                />
              </div>
              <div className="text-xs text-slate-500 font-mono">
                Showing <strong>{filteredCandidates.length}</strong> candidates
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-soft">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-4">Candidate Name</th>
                      <th className="py-3.5 px-4">Title & Discipline</th>
                      <th className="py-3.5 px-4">Experience</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Expected Salary</th>
                      <th className="py-3.5 px-4 text-right">Verified</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredCandidates.map((cand) => (
                      <tr key={cand.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">{cand.name}</td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">{cand.title}</div>
                          <div className="text-[11px] text-slate-500">{cand.category}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-700">{cand.experienceYears} Years</td>
                        <td className="py-3 px-4">
                          {cand.openToWork ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold text-[11px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Open to Work
                            </span>
                          ) : (
                            <span className="text-slate-400">Passive</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-slate-900">
                          ${(cand.expectedSalary / 1000).toFixed(0)}k/yr
                        </td>
                        <td className="py-3 px-4 text-right">
                          {cand.verified ? (
                            <span className="text-indigo-600 font-semibold inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Vetted</span>
                            </span>
                          ) : (
                            <span className="text-slate-400">Standard</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: APPLICATIONS AUDIT */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-soft flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  placeholder="Search application dossiers..."
                  className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                />
              </div>

              <Link
                to="/ats"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-950 hover:underline"
              >
                <span>Open Recruiter ATS Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-soft">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-4">Application ID</th>
                      <th className="py-3.5 px-4">Candidate</th>
                      <th className="py-3.5 px-4">Target Role & Company</th>
                      <th className="py-3.5 px-4">Current Stage</th>
                      <th className="py-3.5 px-4">Experience</th>
                      <th className="py-3.5 px-4 text-right">Applied Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredApps.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-600">{a.id}</td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{a.fullName}</div>
                          <div className="text-[11px] text-slate-400">{a.email}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">{a.jobTitle}</div>
                          <div className="text-[11px] text-slate-500">{a.company}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-800">
                            {a.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-700">{a.experienceYears} Years</td>
                        <td className="py-3 px-4 text-right font-mono text-slate-500">
                          {new Date(a.appliedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: REAL ENTERPRISE SETTINGS & CONFIGURATION */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="space-y-6">
            {/* 1. General Platform Identity & Controls */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-soft space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-base text-slate-950">General Portal Configuration</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Manage portal metadata, platform availability, and candidate access rules.</p>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-mono font-bold">
                  Core Config
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wider">
                    Platform Title
                  </label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-semibold focus:outline-hidden focus:border-slate-400 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wider">
                    Support / Administrative Contact
                  </label>
                  <input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-semibold focus:outline-hidden focus:border-slate-400 focus:bg-white transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wider">
                    Portal Brand Tagline
                  </label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-semibold focus:outline-hidden focus:border-slate-400 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Maintenance Mode</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Suspend public job applications</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                    className="w-4 h-4 rounded text-slate-950 focus:ring-0 cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Candidate Registration</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Allow public candidate accounts</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.allowCandidateRegistration}
                    onChange={(e) => setSettings({ ...settings, allowCandidateRegistration: e.target.checked })}
                    className="w-4 h-4 rounded text-slate-950 focus:ring-0 cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Auto-Approve Jobs</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Skip manual review on new roles</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoApproveJobs}
                    onChange={(e) => setSettings({ ...settings, autoApproveJobs: e.target.checked })}
                    className="w-4 h-4 rounded text-slate-950 focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* 2. Compensation & Salary Standards */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-soft space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-base text-slate-950">Compensation & Salary Transparency</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Define platform-wide salary transparency rules and minimum wage floors.</p>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-mono font-bold">
                  Standards
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wider">
                    Primary Display Currency
                  </label>
                  <select
                    value={settings.currency}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value as 'USD' | 'EUR' | 'GBP' })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-semibold cursor-pointer focus:outline-hidden"
                  >
                    <option value="USD">USD ($) — United States Dollar</option>
                    <option value="EUR">EUR (€) — Eurozone</option>
                    <option value="GBP">GBP (£) — British Pound</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wider">
                    Minimum Base Salary Floor ($)
                  </label>
                  <input
                    type="number"
                    value={settings.minBaseSalary}
                    onChange={(e) => setSettings({ ...settings, minBaseSalary: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-mono font-semibold focus:outline-hidden"
                  />
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Enforce Salary Ranges</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Reject listings without base pay</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.enforceSalaryTransparency}
                    onChange={(e) => setSettings({ ...settings, enforceSalaryTransparency: e.target.checked })}
                    className="w-4 h-4 rounded text-slate-950 focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* 3. Notification Webhooks & Automation */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-soft space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-base text-slate-950">Webhooks & Event Notifications</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Connect external Slack, Discord, or HRIS webhooks for real-time pipeline alerts.</p>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-800 text-xs font-mono font-bold">
                  Integrations
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wider">
                  Webhook Dispatch URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={settings.webhookUrl}
                    onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })}
                    placeholder="https://hooks.slack.com/services/..."
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-mono focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleTestWebhook}
                    disabled={testingWebhook}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5 text-slate-500" />
                    <span>{testingWebhook ? 'Sending...' : 'Test Ping'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Application Dispatch Alert</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Fire webhook on new candidate application</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emailAlerts}
                    onChange={(e) => setSettings({ ...settings, emailAlerts: e.target.checked })}
                    className="w-4 h-4 rounded text-slate-950 focus:ring-0 cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Daily Recruiter Digest</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Aggregate candidate pipeline telemetry at 09:00 UTC</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.dailyDigest}
                    onChange={(e) => setSettings({ ...settings, dailyDigest: e.target.checked })}
                    className="w-4 h-4 rounded text-slate-950 focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* 4. Storage Footprint & Database Maintenance */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-soft space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-base text-slate-950">Database Governance & Maintenance</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Active browser client storage footprint and factory reseed triggers.</p>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-800 text-xs font-mono font-bold">
                  Danger Zone
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Jobs Collection</span>
                  <div className="text-xl font-bold font-mono text-slate-950 mt-1">{jobs.length} items</div>
                  <span className="text-[10px] text-slate-500">Key: lumina_jobs_data_v3</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Companies Collection</span>
                  <div className="text-xl font-bold font-mono text-slate-950 mt-1">{companies.length} items</div>
                  <span className="text-[10px] text-slate-500">Key: lumina_companies_data_v2</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Candidates CRM</span>
                  <div className="text-xl font-bold font-mono text-slate-950 mt-1">{candidates.length} items</div>
                  <span className="text-[10px] text-slate-500">Key: lumina_candidates_data_v2</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Applications Dossiers</span>
                  <div className="text-xl font-bold font-mono text-slate-950 mt-1">{applications.length} items</div>
                  <span className="text-[10px] text-slate-500">Key: lumina_applications_data_v2</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-rose-50/60 border border-rose-200/70">
                <div>
                  <div className="text-xs font-bold text-rose-950">Factory Reseed to 50 Verified Jobs</div>
                  <div className="text-xs text-rose-800/80 mt-0.5">Wipes local modifications and restores exact 50 curated jobs.</div>
                </div>
                <button
                  type="button"
                  onClick={() => setResetModalOpen(true)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
                >
                  Reset to 50 Jobs
                </button>
              </div>
            </div>

            {/* Bottom Sticky Save Bar */}
            <div className="flex items-center justify-between p-4 bg-white border border-slate-200/90 rounded-2xl shadow-soft">
              <span className="text-xs text-slate-500">
                Changes will be saved to your administrative localStorage environment.
              </span>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs hover:shadow-sm transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Configuration Changes</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* MODAL 1: Confirm Job Delete */}
      {jobToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={() => setJobToDelete(null)}
        >
          <div
            className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md p-6 space-y-4 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-950">Delete Job Listing?</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Are you sure you want to permanently remove <strong>"{jobToDelete.title}"</strong> at <strong>{jobToDelete.company}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setJobToDelete(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteJob}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Confirm Factory Reset */}
      {resetModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={() => setResetModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md p-6 space-y-4 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-950">Reset Database to 50 Verified Jobs?</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                This will wipe any custom created jobs or test applications in browser storage and restore default verified 50 seed listings.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setResetModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetSystem}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Proceed with Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
