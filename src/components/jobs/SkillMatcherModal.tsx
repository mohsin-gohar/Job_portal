import React from 'react';
import { X, Sparkles, Check, RotateCcw } from 'lucide-react';
import { useCandidate, POPULAR_TECH_SKILLS } from '../../context/CandidateContext';

interface SkillMatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SkillMatcherModal: React.FC<SkillMatcherModalProps> = ({ isOpen, onClose }) => {
  const { candidateSkills, toggleCandidateSkill, clearCandidateSkills } = useCandidate();

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
    >
      <div
        className="bg-white rounded-lg border border-slate-200 shadow-xl w-full max-w-lg p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Interactive Skill Matcher</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Select Your Tech Stack & Proficiencies
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Positions across the portal will compute a real-time compatibility score based on your selected skills.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected skills status bar */}
        <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-md border border-slate-200">
          <span className="font-medium text-slate-700">
            Active Skills: <strong className="font-mono tabular-nums text-slate-900">{candidateSkills.length}</strong> selected
          </span>
          {candidateSkills.length > 0 && (
            <button
              type="button"
              onClick={clearCandidateSkills}
              className="flex items-center gap-1 text-slate-500 hover:text-rose-600 transition-colors text-xs font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Skill tags grid */}
        <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto pr-1">
          {POPULAR_TECH_SKILLS.map((skill) => {
            const selected = candidateSkills.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggleCandidateSkill(skill)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  selected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                {selected && <Check className="w-3.5 h-3.5" />}
                <span>{skill}</span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Scores dynamically adjust on all job listings
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors"
          >
            View Matching Positions
          </button>
        </div>
      </div>
    </div>
  );
};
