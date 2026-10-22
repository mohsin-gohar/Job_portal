import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, Building2, TrendingUp, Heart, Shield, Zap, Globe, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

const STATS = [
  { value: '50', label: 'Open Roles', icon: Briefcase },
  { value: '30', label: 'Verified Companies', icon: Building2 },
  { value: '165+', label: 'Active Candidates', icon: Users },
  { value: '96%', label: 'Salary Parity Index', icon: TrendingUp },
];

const VALUES = [
  { icon: Heart, title: 'Candidate-first', desc: 'Every interaction is designed around the candidate experience — transparent salaries, clear expectations, and respectful communication.' },
  { icon: Shield, title: 'Trust & verification', desc: 'All companies and candidates are verified. No ghost jobs, no fabricated listings, no misleading compensation.' },
  { icon: Zap, title: 'Speed without sacrifice', desc: 'Sub-second search, instant filters, and a pipeline that moves as fast as your hiring needs.' },
  { icon: Globe, title: 'Inclusive by design', desc: 'Remote-first listings, accessibility-first UI, and compensation transparency across every region.' },
];

const TEAM = [
  { name: 'Ava Chen', role: 'Founder & CEO', initials: 'AC' },
  { name: 'Marcus Reid', role: 'Head of Product', initials: 'MR' },
  { name: 'Priya Nair', role: 'Engineering Lead', initials: 'PN' },
  { name: 'Diego Alvarez', role: 'Design Director', initials: 'DA' },
];

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative pt-18 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 overflow-hidden">
        {/* Background Architectural Image */}
        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2000&q=80"
            alt=""
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/92 via-white/85 to-slate-50" />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-6 relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-full text-xs font-semibold text-indigo-700 shadow-2xs animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            <span>About Lumina</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-display font-bold text-slate-950 tracking-tight [text-wrap:balance]">
            Building the <span className="text-indigo-600 font-extrabold">future of work</span>, one connection at a time
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Lumina is a premium career ecosystem connecting world-class engineers, designers, and product leaders with the
            technology companies shaping tomorrow. We believe great work deserves great matches.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link to="/" className="btn-primary">
              Browse open roles <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="btn-secondary">
              Get in touch
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-card p-6 text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover">
              <div className="w-11 h-11 mx-auto rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center shadow-glow mb-3">
                <s.icon className="w-5 h-5" />
              </div>
              <div className="text-3xl font-display font-bold text-slate-950">{s.value}</div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
      {/* Mission */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">Our Mission</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-950 tracking-tight [text-wrap:balance]">
              Make every career move a confident one
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Hiring is broken for both sides. Candidates apply into black boxes. Employers drown in unqualified
              pipelines. Lumina fixes this with verified data, transparent compensation, and a CRM-grade pipeline that
              respects everyone's time.
            </p>
            <ul className="space-y-3">
              {['Verified companies & candidates only', 'Transparent salary & equity benchmarks', 'Real-time pipeline visibility', 'Accessibility & remote-first by default'].map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl bg-slate-900 border border-slate-800 shadow-card flex items-center justify-center overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-20"
              />
              <div className="relative z-10 text-center space-y-2">
                <div className="text-6xl font-display font-bold text-white tracking-tight">Lumina</div>
                <div className="text-sm text-slate-300">Since 2024 · 50+ roles placed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="rounded-3xl overflow-hidden shadow-card-hover">
            <img src="https://images.unsplash.com/photo-1552664730-d307ca884992?auto=format&fit=crop&w=1200&q=80" alt="Our story" loading="lazy" decoding="async" className="w-full h-80 object-cover" />
          </div>
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">Our story</span>
            <h2 className="text-3xl font-display font-bold text-slate-950 tracking-tight">From a spreadsheet to a platform</h2>
            <p className="text-slate-600 leading-relaxed">
              Lumina started as a shared spreadsheet of open roles among friends. Today it powers transparent, fast,
              and respectful hiring for engineers, designers, and product leaders across the globe. We keep the
              candidate at the center of every decision.
            </p>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Verified companies only</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Transparent compensation ranges</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Sub-second search & filters</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">What we stand for</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-950 tracking-tight mt-2">Our values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v) => (
              <div key={v.title} className="bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">{v.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">The team</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-950 tracking-tight mt-2">Built by people who care</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {TEAM.map((m) => (
              <div key={m.name} className="text-center">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center text-xl font-bold shadow-glow mb-3">
                  {m.initials}
                </div>
                <div className="text-sm font-bold text-slate-900">{m.name}</div>
                <div className="text-xs text-slate-500">{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-12 shadow-glow text-white">
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-3">Ready to find your next role?</h2>
          <p className="text-indigo-100 mb-6 max-w-xl mx-auto">Join 165+ verified candidates and 30 leading companies already on Lumina.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 font-bold rounded-xl shadow-soft hover:bg-indigo-50 transition-colors">
              Browse jobs <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/post-job" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/30 text-white font-bold rounded-xl hover:bg-white/20 transition-colors">
              Post a job
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

