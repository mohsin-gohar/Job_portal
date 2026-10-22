import React, { useState, useEffect } from 'react';
import { jobsApi } from '../services/api';
import { CandidateUser, JobCategory, PaginationData } from '../types/job';
import { useToast } from '../context/ToastContext';
import { Pagination } from '../components/jobs/Pagination';
import {
  Users,
  Search,
  CheckCircle2,
  MapPin,
  Briefcase,
  DollarSign,
  Mail,
  Send,
  Sparkles,
  X,
  Filter,
} from 'lucide-react';

const CATEGORIES: ('All' | JobCategory)[] = [
  'All',
  'Engineering',
  'Data & AI',
  'Design',
  'Product',
  'Marketing',
  'Sales',
];

export const TalentPage: React.FC = () => {
  const [candidates, setCandidates] = useState<CandidateUser[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [openToWorkOnly, setOpenToWorkOnly] = useState(false);
  const [selectedCandidateForInvite, setSelectedCandidateForInvite] = useState<CandidateUser | null>(null);
  const [inviteJobTitle, setInviteJobTitle] = useState('Senior Full-Stack Engineer');
  const [inviteMessage, setInviteMessage] = useState('We reviewed your profile on Lumina and would love to discuss an open role on our team.');
  const [isSendingInvite, setIsSendingInvite] = useState(false);

  const { showToast } = useToast();

  const loadCandidates = async (page = 1) => {
    setLoading(true);
    const resp = await jobsApi.getCandidates({
      search,
      category,
      openToWorkOnly,
      page,
      limit: 12,
    });
    setCandidates(resp.data);
    if (resp.meta) {
      setPagination(resp.meta);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCandidates(1);
  }, [search, category, openToWorkOnly]);

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidateForInvite) return;
    setIsSendingInvite(true);
    setTimeout(() => {
      setIsSendingInvite(false);
      showToast(
        'Job invitation delivered!',
        'success',
        `Invitation sent to ${selectedCandidateForInvite.name} for ${inviteJobTitle}`
      );
      setSelectedCandidateForInvite(null);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Editorial Header */}
      <section className="relative border-b border-slate-200/80 pt-12 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Architectural Image */}
        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80"
            alt=""
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/92 via-white/85 to-slate-50" />
        </div>
        <div className="max-w-4xl mx-auto text-center space-y-3 relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-800">
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            <span>165+ Vetted Tech & Product Craftspeople</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Verified Tech Talent CRM & Directory
          </h1>

          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Directly discover, filter, and invite vetted software engineers, AI researchers, and designers open to high-impact opportunities.
          </p>

          {/* Search bar */}
          <div className="pt-2 max-w-xl mx-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidate name, skill (e.g. React, PyTorch, Go), or city..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors shadow-2xs"
            />
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Filter bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium mr-1">Discipline:</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  category === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={openToWorkOnly}
                onChange={(e) => setOpenToWorkOnly(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <span className="font-medium text-slate-800">Actively Open to Work</span>
            </label>

            <span className="text-slate-400 font-mono tabular-nums">
              {pagination.totalItems} Candidates
            </span>
          </div>
        </div>

        {/* Talent Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-slate-200 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                    <div className="h-3 bg-slate-200 rounded w-1/3" />
                  </div>
                </div>
                <div className="h-12 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        ) : candidates.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-xl max-w-md mx-auto">
            <Users className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-900">No candidates match filters</h3>
            <p className="text-xs text-slate-500 mt-1">Try broadening your search keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {candidates.map((candidate) => (
              <article
                key={candidate.id}
                className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4 shadow-2xs hover:border-slate-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Avatar + Name header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className="w-11 h-11 rounded-full text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs"
                        style={{ backgroundColor: candidate.avatarColor }}
                      >
                        {candidate.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
                            {candidate.name}
                          </h3>
                          {candidate.verified && (
                            <span title="Identity & Resume Verified">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-slate-600 truncate mt-0.5">
                          {candidate.title}
                        </p>
                      </div>
                    </div>

                    {candidate.openToWork && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Open
                      </span>
                    )}
                  </div>

                  {/* Bio */}
                  <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {candidate.bio}
                  </p>

                  {/* Skill Badges */}
                  <div className="mt-3 flex flex-wrap gap-1 text-xs">
                    {candidate.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Meta & Action */}
                <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="space-y-0.5">
                    <span className="flex items-center gap-1 text-slate-600">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{candidate.location}</span>
                    </span>
                    <span className="font-mono tabular-nums font-semibold text-slate-900 block">
                      ${Math.round(candidate.expectedSalary / 1000)}k / yr exp.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedCandidateForInvite(candidate)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-md text-xs font-semibold hover:bg-slate-800 transition-colors shadow-2xs"
                  >
                    <Send className="w-3 h-3" />
                    <span>Invite</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.totalItems > 0 && (
          <Pagination
            meta={pagination}
            onPageChange={(page) => loadCandidates(page)}
          />
        )}
      </div>

      {/* Invite Modal */}
      {selectedCandidateForInvite && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
        >
          <div
            className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-lg p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Invite {selectedCandidateForInvite.name} to Interview
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Send a personalized interview invitation and job opportunity pitch.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCandidateForInvite(null)}
                className="p-1 text-slate-400 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">Position Title</label>
                <input
                  type="text"
                  value={inviteJobTitle}
                  onChange={(e) => setInviteJobTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-slate-900 focus:outline-hidden focus:border-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Message to Candidate</label>
                <textarea
                  rows={4}
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-slate-900 focus:outline-hidden focus:border-slate-800"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCandidateForInvite(null)}
                  className="px-4 py-2 border border-slate-200 rounded-md text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingInvite}
                  className="px-5 py-2 bg-slate-900 text-white rounded-md font-semibold hover:bg-slate-800 shadow-xs"
                >
                  {isSendingInvite ? 'Sending...' : 'Deliver Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Talent insights */}
      <section className="grid sm:grid-cols-3 gap-4 pt-2">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-1.5">In-demand skills</h3>
          <p className="text-xs text-slate-600 leading-relaxed">TypeScript, Rust, and LLM tooling top recruiter searches.</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-1.5">Salary transparency</h3>
          <p className="text-xs text-slate-600 leading-relaxed">Every profile includes compensation expectations upfront.</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-1.5">Open to work</h3>
          <p className="text-xs text-slate-600 leading-relaxed">Filter by availability to find candidates ready to start immediately.</p>
        </div>
      </section>

    </div>
  );
};
