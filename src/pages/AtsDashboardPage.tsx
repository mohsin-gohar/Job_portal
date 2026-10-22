import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { jobsApi, getStoredApplications, getStoredJobs } from '../services/api';
import { JobApplication } from '../types/job';
import { useToast } from '../context/ToastContext';
import {
  Users,
  Briefcase,
  CheckCircle2,
  Clock,
  PlusCircle,
  Search,
  FileText,
  ChevronRight,
  TrendingUp,
  Award,
  ArrowUpRight,
  MessageSquare,
  Sparkles,
  LayoutGrid,
  List as ListIcon,
  Download,
  Filter,
  Eye,
  X,
  Mail,
  Phone,
  Globe,
  Calendar,
  Check,
  Archive,
  ArrowRight,
  Building,
  RotateCcw,
} from 'lucide-react';

const ATS_STAGES: JobApplication['status'][] = [
  'Submitted',
  'In Review',
  'Interview Scheduled',
  'Offer Extended',
];

const STAGE_CONFIG: Record<
  JobApplication['status'],
  { label: string; dotColor: string; badgeBg: string; badgeText: string; description: string }
> = {
  Submitted: {
    label: 'Submitted',
    dotColor: 'bg-slate-400',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-700',
    description: 'New incoming candidate dossiers awaiting initial screening',
  },
  'In Review': {
    label: 'In Review',
    dotColor: 'bg-amber-500',
    badgeBg: 'bg-amber-50 border-amber-200/80',
    badgeText: 'text-amber-800',
    description: 'Resume & technical portfolio under review by squad leads',
  },
  'Interview Scheduled': {
    label: 'Interviewing',
    dotColor: 'bg-indigo-500',
    badgeBg: 'bg-indigo-50 border-indigo-200/80',
    badgeText: 'text-indigo-800',
    description: 'Live technical architecture rounds & cultural evaluation',
  },
  'Offer Extended': {
    label: 'Offer Extended',
    dotColor: 'bg-emerald-500',
    badgeBg: 'bg-emerald-50 border-emerald-200/80',
    badgeText: 'text-emerald-800',
    description: 'Compensation negotiation & final contract issuance',
  },
  Archived: {
    label: 'Archived / Rejected',
    dotColor: 'bg-rose-400',
    badgeBg: 'bg-rose-50 border-rose-200/80',
    badgeText: 'text-rose-800',
    description: 'Archived candidates kept in database for future openings',
  },
};

export const AtsDashboardPage: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [selectedAppForNote, setSelectedAppForNote] = useState<JobApplication | null>(null);
  const [selectedAppForDossier, setSelectedAppForDossier] = useState<JobApplication | null>(null);
  const [noteText, setNoteText] = useState('');

  const { showToast } = useToast();
  const allJobs = getStoredJobs();

  useEffect(() => {
    setApplications(getStoredApplications());
  }, []);

  // Unique job titles for filtering
  const uniqueRoles = useMemo(() => {
    const set = new Set<string>();
    applications.forEach((a) => set.add(a.jobTitle));
    allJobs.slice(0, 10).forEach((j) => set.add(j.title));
    return Array.from(set);
  }, [applications, allJobs]);

  const handleAdvanceStage = async (appId: string, nextStage: JobApplication['status']) => {
    try {
      const resp = await jobsApi.updateApplicationStatus(appId, nextStage);
      setApplications((prev) => prev.map((a) => (a.id === appId ? resp.data : a)));
      if (selectedAppForDossier?.id === appId) {
        setSelectedAppForDossier(resp.data);
      }
      showToast('Stage updated successfully', 'success', `Candidate moved to ${nextStage}`);
    } catch {
      showToast('Failed to update stage', 'error');
    }
  };

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppForNote) return;
    try {
      const resp = await jobsApi.updateApplicationStatus(
        selectedAppForNote.id,
        selectedAppForNote.status,
        noteText
      );
      setApplications((prev) => prev.map((a) => (a.id === selectedAppForNote.id ? resp.data : a)));
      if (selectedAppForDossier?.id === selectedAppForNote.id) {
        setSelectedAppForDossier(resp.data);
      }
      showToast('Recruiter evaluation saved', 'success');
      setSelectedAppForNote(null);
    } catch {
      showToast('Failed to save note', 'error');
    }
  };

  const handleExportCSV = () => {
    try {
      const headers = ['ID', 'Full Name', 'Email', 'Role', 'Company', 'Stage', 'Experience (Years)', 'Notice Period', 'Applied Date', 'Notes'];
      const rows = applications.map((a) => [
        `"${a.id}"`,
        `"${a.fullName}"`,
        `"${a.email}"`,
        `"${a.jobTitle}"`,
        `"${a.company}"`,
        `"${a.status}"`,
        `"${a.experienceYears}"`,
        `"${a.noticePeriod}"`,
        `"${new Date(a.appliedAt).toISOString().split('T')[0]}"`,
        `"${(a.notes || '').replace(/"/g, '""')}"`,
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `lumina_ats_pipeline_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Pipeline CSV exported', 'success', 'Downloaded candidate report to your device.');
    } catch {
      showToast('Export failed', 'error');
    }
  };

  const filteredApps = useMemo(() => {
    return applications.filter((a) => {
      const matchesSearch =
        a.fullName.toLowerCase().includes(search.toLowerCase()) ||
        a.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
        a.company.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase()) ||
        a.id.toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter === 'All' || a.jobTitle === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [applications, search, roleFilter]);

  // Candidate avatar initial helper
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  // Color generator based on name
  const getAvatarColor = (name: string) => {
    const colors = ['#4F46E5', '#0284C7', '#059669', '#D97706', '#7C3AED', '#DB2777', '#2563EB'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* SECTION 1: Executive Top Header */}
      <section className="bg-white border-b border-slate-200/90 pt-10 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-700 mb-3 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <span>Enterprise Recruiter Console</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="font-mono text-slate-500">Pipeline v2.4</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
              Talent Pipeline & ATS
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Track candidate progression across recruitment funnels, review technical evaluation dossiers, and manage hiring velocity.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl transition-all shadow-2xs"
              title="Download Pipeline as CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>

            <Link
              to="/talent"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl transition-all shadow-2xs"
            >
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>Talent CRM</span>
            </Link>

            <Link
              to="/post-job"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-xl transition-all shadow-xs hover:shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post New Role</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* SECTION 2: Metric KPI Performance Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold">Open Positions</span>
              <Briefcase className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-3xl font-bold font-mono tabular-nums text-slate-950">
              {allJobs.length}
            </div>
            <div className="mt-2 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>+14 active this month</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold">Total Pipeline Dossiers</span>
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-3xl font-bold font-mono tabular-nums text-slate-950">
              {applications.length}
            </div>
            <div className="mt-2 text-[11px] text-indigo-700 font-medium">
              <span>96% candidate responsiveness</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold">Active Tech Interviews</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-bold font-mono tabular-nums text-slate-950">
              {applications.filter((a) => a.status === 'Interview Scheduled').length + 8}
            </div>
            <div className="mt-2 text-[11px] text-slate-500 font-medium">
              <span>Scheduled across engineering squads</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold">Avg. Time-to-Hire</span>
              <Clock className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold font-mono tabular-nums text-slate-950">
              14 Days
            </div>
            <div className="mt-2 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Top 5% tech hiring speed</span>
            </div>
          </div>
        </div>

        {/* SECTION 3: Recruiter Control Dock (Search, Role Filter, View Switcher) */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Box */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, role, email, or application ID..."
                className="w-full pl-10 pr-8 py-2.5 text-xs bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-slate-400 focus:bg-white transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Role Filter Selector */}
            <div className="sm:w-64">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-slate-50/80 border border-slate-200 rounded-xl text-slate-800 font-medium cursor-pointer focus:outline-hidden focus:border-slate-400 focus:bg-white transition-all"
              >
                <option value="All">All Open Roles ({applications.length})</option>
                {uniqueRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Controls: Filter reset & View mode toggle */}
          <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              Showing <strong>{filteredApps.length}</strong> candidates
            </span>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-slate-200 rounded-xl p-0.5 bg-slate-100">
              <button
                type="button"
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'kanban'
                    ? 'bg-white text-slate-950 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Kanban Board View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Kanban</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-slate-950 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Tabular List View"
              >
                <ListIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 4: Pipeline View (Kanban OR Table) */}
        {viewMode === 'kanban' ? (
          /* KANBAN BOARD VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
            {ATS_STAGES.map((stage) => {
              const stageApps = filteredApps.filter((a) => a.status === stage);
              const config = STAGE_CONFIG[stage];

              return (
                <div
                  key={stage}
                  className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3.5 shadow-soft flex flex-col min-h-[580px]"
                >
                  {/* Column Header */}
                  <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${config.dotColor}`} />
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        {stage}
                      </h3>
                    </div>
                    <span className="font-mono text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                      {stageApps.length}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-snug">
                    {config.description}
                  </p>

                  {/* Candidate Dossier Cards */}
                  <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
                    {stageApps.length === 0 ? (
                      <div className="py-14 text-center border-2 border-dashed border-slate-200/80 rounded-xl">
                        <Users className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs text-slate-400 font-medium">No candidates in this stage</p>
                      </div>
                    ) : (
                      stageApps.map((app) => (
                        <div
                          key={app.id}
                          className="group bg-white border border-slate-200/90 rounded-xl p-4 space-y-3 shadow-2xs hover:shadow-soft hover:border-slate-300 transition-all duration-150"
                        >
                          {/* Top Row: Avatar & Metadata */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className="w-8 h-8 rounded-lg text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs"
                                style={{ backgroundColor: getAvatarColor(app.fullName) }}
                              >
                                {getInitials(app.fullName)}
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-slate-950 truncate group-hover:text-indigo-600 transition-colors">
                                  {app.fullName}
                                </h4>
                                <div className="text-[10px] text-slate-400 font-mono truncate">
                                  {app.id}
                                </div>
                              </div>
                            </div>

                            <span className="text-[10px] text-slate-400 font-mono shrink-0">
                              {new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          </div>

                          {/* Role & Company */}
                          <div>
                            <div className="text-xs font-semibold text-slate-800 line-clamp-1">
                              {app.jobTitle}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <Building className="w-3 h-3 text-slate-400" />
                              <span>{app.company}</span>
                            </div>
                          </div>

                          {/* Quick Badges: Experience & Notice */}
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                              {app.experienceYears}y exp
                            </span>
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                              {app.noticePeriod}
                            </span>
                            {app.portfolioUrl && (
                              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium">
                                Portfolio
                              </span>
                            )}
                          </div>

                          {/* Recruiter Note snippet (if any) */}
                          {app.notes && (
                            <div className="p-2 rounded-lg bg-amber-50/80 border border-amber-200/60 text-[11px] text-amber-900 line-clamp-2 italic leading-relaxed">
                              "{app.notes}"
                            </div>
                          )}

                          {/* Bottom Card Action Bar */}
                          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setSelectedAppForDossier(app)}
                                className="p-1.5 text-slate-500 hover:text-slate-950 hover:bg-slate-100 rounded-md transition-colors"
                                title="View Complete Candidate Dossier"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedAppForNote(app);
                                  setNoteText(app.notes || '');
                                }}
                                className="p-1.5 text-slate-500 hover:text-slate-950 hover:bg-slate-100 rounded-md transition-colors"
                                title="Add Recruiter Notes"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Advance Stage Button */}
                            {stage !== 'Offer Extended' ? (
                              <button
                                type="button"
                                onClick={() => {
                                  const nextIdx = ATS_STAGES.indexOf(stage) + 1;
                                  handleAdvanceStage(app.id, ATS_STAGES[nextIdx]);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors shadow-2xs"
                              >
                                <span>Advance</span>
                                <ChevronRight className="w-3 h-3 text-slate-600" />
                              </button>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/70">
                                <Check className="w-3 h-3" />
                                <span>Finalized</span>
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* TABULAR PIPELINE LIST VIEW */
          <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4">Candidate</th>
                    <th className="py-3.5 px-4">Role & Company</th>
                    <th className="py-3.5 px-4">Pipeline Stage</th>
                    <th className="py-3.5 px-4">Experience</th>
                    <th className="py-3.5 px-4">Notice Period</th>
                    <th className="py-3.5 px-4">Applied</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredApps.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        No candidates matching current filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredApps.map((app) => {
                      const stageConfig = STAGE_CONFIG[app.status] || STAGE_CONFIG.Submitted;
                      return (
                        <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-lg text-white font-bold flex items-center justify-center text-xs shrink-0"
                                style={{ backgroundColor: getAvatarColor(app.fullName) }}
                              >
                                {getInitials(app.fullName)}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900">{app.fullName}</div>
                                <div className="text-[11px] text-slate-400 font-mono">{app.email}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-800">{app.jobTitle}</div>
                            <div className="text-[11px] text-slate-500">{app.company}</div>
                          </td>

                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${stageConfig.badgeBg} ${stageConfig.badgeText}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${stageConfig.dotColor}`} />
                              <span>{app.status}</span>
                            </span>
                          </td>

                          <td className="py-3 px-4 text-slate-700 font-medium">
                            {app.experienceYears} Years
                          </td>

                          <td className="py-3 px-4 text-slate-700">
                            {app.noticePeriod}
                          </td>

                          <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                            {new Date(app.appliedAt).toLocaleDateString()}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedAppForDossier(app)}
                                className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                              >
                                Dossier
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedAppForNote(app);
                                  setNoteText(app.notes || '');
                                }}
                                className="p-1 text-slate-400 hover:text-slate-800"
                                title="Add Notes"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 5: Recruiter Standards & Process Hygiene Strip */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-soft">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200/70 text-indigo-700 flex items-center justify-center mb-3">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-950 text-sm mb-1.5">SLA Stage Hygiene</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Maintain an active feedback cycle by advancing or declining candidates within 48 hours of stage completion.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-soft">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/70 text-emerald-700 flex items-center justify-center mb-3">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-950 text-sm mb-1.5">Structured Evaluation Trail</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Always record system design scorecards and interview takeaways into the candidate dossier notes for hiring panel alignment.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-soft">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200/70 text-purple-700 flex items-center justify-center mb-3">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-950 text-sm mb-1.5">165+ Candidate CRM</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Explore the pre-vetted candidate directory to proactively invite top engineering talent directly into your interview stages.
            </p>
          </div>
        </section>
      </div>

      {/* MODAL 1: Full Candidate Dossier Viewer */}
      {selectedAppForDossier && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={() => setSelectedAppForDossier(null)}
        >
          <div
            className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dossier Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3.5">
                <div
                  className="w-12 h-12 rounded-xl text-white font-bold flex items-center justify-center text-base shadow-xs"
                  style={{ backgroundColor: getAvatarColor(selectedAppForDossier.fullName) }}
                >
                  {getInitials(selectedAppForDossier.fullName)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-950">
                    {selectedAppForDossier.fullName}
                  </h3>
                  <p className="text-xs font-semibold text-slate-600">
                    Applying for: <span className="text-slate-900">{selectedAppForDossier.jobTitle}</span>
                  </p>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {selectedAppForDossier.company} · ID: {selectedAppForDossier.id}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAppForDossier(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-950 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Contact & Meta Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{selectedAppForDossier.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedAppForDossier.phone}</span>
              </div>
              {selectedAppForDossier.portfolioUrl ? (
                <div className="flex items-center gap-2 text-indigo-700">
                  <Globe className="w-3.5 h-3.5" />
                  <a
                    href={selectedAppForDossier.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline truncate font-semibold"
                  >
                    View Portfolio
                  </a>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-slate-400">
                  <Globe className="w-3.5 h-3.5" />
                  <span>No Portfolio</span>
                </div>
              )}
            </div>

            {/* Stage Selector Pill Bar */}
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-2 uppercase tracking-wider">
                Current Pipeline Stage
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ATS_STAGES.map((stg) => {
                  const isCurrent = selectedAppForDossier.status === stg;
                  return (
                    <button
                      key={stg}
                      type="button"
                      onClick={() => handleAdvanceStage(selectedAppForDossier.id, stg)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold text-center transition-all ${
                        isCurrent
                          ? 'bg-slate-950 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {stg}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Candidate Statement / Cover Letter */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Candidate Pitch / Cover Letter
              </h4>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                {selectedAppForDossier.coverLetter || 'No cover letter provided with this submission.'}
              </div>
            </div>

            {/* Attached Resume */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{selectedAppForDossier.resumeFileName}</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {selectedAppForDossier.experienceYears} Years Experience · Notice: {selectedAppForDossier.noticePeriod}
                  </div>
                </div>
              </div>

              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md">
                Verified File
              </span>
            </div>

            {/* Recruiter Evaluation Notes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Internal Hiring Panel Notes
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAppForNote(selectedAppForDossier);
                    setNoteText(selectedAppForDossier.notes || '');
                  }}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline"
                >
                  Edit Notes
                </button>
              </div>
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-950 italic leading-relaxed">
                {selectedAppForDossier.notes || 'No evaluation notes recorded yet. Click "Edit Notes" to add interviewer feedback.'}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedAppForDossier(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Quick Recruiter Note Editor */}
      {selectedAppForNote && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={() => setSelectedAppForNote(null)}
        >
          <div
            className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md p-6 space-y-4 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h3 className="text-base font-bold text-slate-950">
                Interviewer Notes: {selectedAppForNote.fullName}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Record technical scorecard, salary expectation alignment, or hiring manager feedback.
              </p>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-4 text-xs">
              <textarea
                rows={5}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="e.g. Scored 9/10 on systems architecture challenge. Strongly recommended for Staff position..."
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-slate-400 focus:bg-white transition-all leading-relaxed"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAppForNote(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-950 hover:bg-slate-800 text-white rounded-xl font-semibold shadow-xs transition-colors"
                >
                  Save Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
