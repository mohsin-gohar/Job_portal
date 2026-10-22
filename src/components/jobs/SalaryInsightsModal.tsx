import React from 'react';
import { X, TrendingUp, DollarSign, Award } from 'lucide-react';

interface SalaryInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BENCHMARKS = [
  { role: 'Staff AI Systems Architect', dept: 'Data & AI', p25: '$220k', median: '$255k', p90: '$290k', demand: 'High (+42%)' },
  { role: 'Principal Product Manager', dept: 'Product', p25: '$190k', median: '$215k', p90: '$240k', demand: 'Steady (+18%)' },
  { role: 'Senior Frontend Engineer', dept: 'Engineering', p25: '$155k', median: '$175k', p90: '$195k', demand: 'High (+28%)' },
  { role: 'Senior Backend Engineer (Go/Rust)', dept: 'Engineering', p25: '$145k', median: '$165k', p90: '$180k', demand: 'High (+35%)' },
  { role: 'Product Designer (Design Systems)', dept: 'Design', p25: '$95k', median: '$110k', p90: '$125k', demand: 'Moderate (+14%)' },
  { role: 'DevOps & Cloud Engineer', dept: 'Engineering', p25: '$90k', median: '$105k', p90: '$115k', demand: 'High (+24%)' },
  { role: 'Growth Marketing Manager', dept: 'Marketing', p25: '$115k', median: '$130k', p90: '$145k', demand: 'Steady (+12%)' },
];

export const SalaryInsightsModal: React.FC<SalaryInsightsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
    >
      <div
        className="bg-white rounded-lg border border-slate-200 shadow-xl w-full max-w-2xl p-6 space-y-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>2026 Tech Market Benchmarks</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Salary Insights & Compensation Explorer
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified market compensation benchmarks across top technology companies and remote startups.
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

        {/* Highlight Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <DollarSign className="w-3.5 h-3.5 text-slate-700" />
              <span>Median Senior Base</span>
            </div>
            <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-1">
              $175,000
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">+14% vs last year</p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Award className="w-3.5 h-3.5 text-slate-700" />
              <span>Top Paying Sector</span>
            </div>
            <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-1">
              AI Infrastructure
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">$220k - $290k+ base</p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <TrendingUp className="w-3.5 h-3.5 text-slate-700" />
              <span>Remote Equity Pool</span>
            </div>
            <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-1">
              0.15% – 0.65%
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Standard Series A-C</p>
          </div>
        </div>

        {/* Table of Roles */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Role & Track</th>
                <th className="py-2.5 px-3">25th %ile</th>
                <th className="py-2.5 px-3">Median</th>
                <th className="py-2.5 px-3">90th %ile</th>
                <th className="py-2.5 px-3">Growth YoY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {BENCHMARKS.map((item) => (
                <tr key={item.role} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3">
                    <span className="font-semibold text-slate-900 block">{item.role}</span>
                    <span className="text-[11px] text-slate-400">{item.dept}</span>
                  </td>
                  <td className="py-2.5 px-3 font-mono tabular-nums text-slate-600">{item.p25}</td>
                  <td className="py-2.5 px-3 font-mono tabular-nums font-semibold text-slate-900">{item.median}</td>
                  <td className="py-2.5 px-3 font-mono tabular-nums text-slate-600">{item.p90}</td>
                  <td className="py-2.5 px-3 font-medium text-emerald-700">{item.demand}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800"
          >
            Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
};
