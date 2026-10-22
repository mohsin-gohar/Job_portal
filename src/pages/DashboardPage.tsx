import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSavedJobs } from '../context/SavedJobsContext';
import { useApplication } from '../context/ApplicationContext';
import { useCandidate } from '../context/CandidateContext';
import { getStoredJobs } from '../services/api';
import {
  LayoutDashboard,
  Briefcase,
  Bookmark,
  FileText,
  ArrowRight,
  Sparkles,
  Users,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Target,
  Zap,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { savedJobs, savedCount } = useSavedJobs();
  const { applications } = useApplication();
  const { candidateSkills, calculateJobMatchScore, jobAlerts } = useCandidate();

  const allJobs = useMemo(() => getStoredJobs(), []);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Submitted: 0,
      'In Review': 0,
      'Interview Scheduled': 0,
      'Offer Extended': 0,
      Archived: 0,
    };
    applications.forEach((a) => {
      if (counts[a.status] !== undefined) counts[a.status] += 1;
    });
    return counts;
  }, [applications]);

  const recommended = useMemo(() => {
    if (!candidateSkills.length) return allJobs.slice(0, 5).map((job) => ({ job, score: 0, matching: [] as string[] }));
    return allJobs
      .map((job) => ({ job, ...calculateJobMatchScore(job.skills) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [allJobs, candidateSkills, calculateJobMatchScore]);

  const totalApps = applications.length;
  const interviews = statusCounts['Interview Scheduled'];
  const offers = statusCounts['Offer Extended'];
  const inReview = statusCounts['In Review'];

  const greeting = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 shadow-card">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-medium mb-3">
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Personal Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome back, {greeting}
            </h1>
            <p className="text-sm text-slate-300 mt-1.5 max-w-xl">
              {user?.role === 'admin'
                ? 'Platform overview and administrative controls at a glance.'
                : user?.role === 'employer'
                ? 'Track your hiring pipeline, candidates and job postings.'
                : 'Track your applications, saved roles and skill-based matches.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {user?.role === 'admin' && (
              <Link to="/admin" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-slate-950 text-xs font-semibold rounded-xl shadow-xs hover:bg-slate-100 transition-colors">
                <ShieldCheck className="w-4 h-4" /> Admin Console
              </Link>
            )}
            {user?.role === 'employer' && (
              <Link to="/ats" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-slate-950 text-xs font-semibold rounded-xl shadow-xs hover:bg-slate-100 transition-colors">
                <Users className="w-4 h-4" /> ATS Pipeline
              </Link>
            )}
            <Link to="/" className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl shadow-xs hover:bg-indigo-700 transition-colors">
              <Briefcase className="w-4 h-4" /> Browse Jobs
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Saved Roles', value: savedCount, icon: Bookmark, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Applications', value: totalApps, icon: FileText, color: 'text-slate-700', bg: 'bg-slate-100' },
          { label: 'In Review', value: inReview, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Interviews', value: interviews, icon: Users, color: 'text-violet-600', bg: 'bg-violet-50' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{s.label}</span>
                <span className={`w-9 h-9 rounded-xl ${s.bg} ${s.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3 text-3xl font-display font-bold text-slate-950 tabular-nums">{s.value}</div>
            </div>
          );
        })}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-950">Application Pipeline</h2>
            <Link to="/applications" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {(['Submitted', 'In Review', 'Interview Scheduled', 'Offer Extended', 'Archived'] as const).map((stage) => {
              const count = statusCounts[stage];
              const pct = totalApps > 0 ? Math.round((count / totalApps) * 100) : 0;
              return (
                <div key={stage}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700">{stage}</span>
                    <span className="font-mono tabular-nums text-slate-500">{count} · {pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          {totalApps === 0 && (
            <p className="text-xs text-slate-500 mt-4">No applications yet. Start by browsing open roles.</p>
          )}
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-950">Your Skills</h2>
            <Link to="/explore" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1">
              Tune <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {candidateSkills.length === 0 && (
              <span className="text-xs text-slate-500">No skills selected yet.</span>
            )}
            {candidateSkills.map((skill) => (
              <span key={skill} className="px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold">
                {skill}
              </span>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Target className="w-4 h-4 text-indigo-500" />
              <span>{jobAlerts.length} active job alert{jobAlerts.length === 1 ? '' : 's'}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 mt-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{offers} offer{offers === 1 ? '' : 's'} extended</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" /> Recommended for you
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Ranked by skill match against your profile.</p>
          </div>
          <Link to="/explore" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1">
            Explore all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recommended.length === 0 && (
            <p className="text-xs text-slate-500">No matches yet. Add skills to your profile.</p>
          )}
          {recommended.map(({ job, score, matching }) => (
            <Link key={job.id} to={`/jobs/${job.id}`} className="group flex items-center gap-3 p-3 rounded-xl border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ backgroundColor: job.brandColor }}>
                {job.companyInitial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-slate-900 truncate group-hover:text-indigo-700">{job.title}</div>
                <div className="text-xs text-slate-500 truncate">{job.company} · {job.location}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs font-bold text-indigo-600">{score}% match</div>
                <div className="text-[10px] text-slate-400">{matching.length} skills</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-950">Recent Applications</h2>
          <Link to="/applications" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1">
            Manage <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {applications.length === 0 ? (
          <p className="text-xs text-slate-500">You haven't applied to any roles yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {applications.slice(0, 6).map((app) => (
              <li key={app.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-900 truncate">{app.jobTitle}</div>
                  <div className="text-xs text-slate-500 truncate">{app.company} · {new Date(app.appliedAt).toLocaleDateString()}</div>
                </div>
                <span className="shrink-0 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                  {app.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { to: '/saved', icon: Bookmark, title: 'Saved Roles', desc: `${savedJobs.length} roles bookmarked` },
          { to: '/post-job', icon: Zap, title: 'Post a Job', desc: 'Hiring? Publish a listing' },
          { to: '/talent', icon: Users, title: 'Talent Directory', desc: 'Browse verified candidates' },
        ].map((a) => {
          const Icon = a.icon;
          return (
            <Link key={a.to} to={a.to} className="group bg-white border border-slate-200/90 rounded-2xl p-5 shadow-soft hover:border-indigo-300 transition-colors flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Icon className="w-5 h-5" />
              </span>
              <div>
                <div className="text-sm font-semibold text-slate-900">{a.title}</div>
                <div className="text-xs text-slate-500">{a.desc}</div>
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
};