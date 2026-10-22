import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
  Building2,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ContactPage: React.FC = () => {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: '',
    email: '',
    category: 'General Inquiry',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email address';
    if (!form.subject.trim()) e.subject = 'Subject line is required';
    if (!form.message.trim() || form.message.trim().length < 15) {
      e.message = 'Please provide a message with at least 15 characters';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 700));
    setSending(false);
    setSubmitted(true);
    showToast('Inquiry Dispatched', 'success', 'Our team will respond within 24 business hours.');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200/90 pt-16 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 border border-slate-200/80 rounded-full text-xs font-semibold text-slate-700 shadow-2xs">
            <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
            <span>Connect with Lumina Operations</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-950">
            We'd love to hear from you.
          </h1>

          <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Whether you're exploring enterprise recruitment solutions, seeking candidate support, or interested in platform partnerships, our team responds within one business day.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Direct Inboxes & Hubs */}
          <div className="space-y-4">
            {[
              {
                icon: Mail,
                title: 'General Inquiries',
                value: 'hello@lumina.careers',
                sub: 'Response within 24 business hours',
              },
              {
                icon: Building2,
                title: 'Employer Partnerships',
                value: 'partners@lumina.careers',
                sub: 'For ATS integration & team recruiting',
              },
              {
                icon: ShieldCheck,
                title: 'Candidate Support',
                value: 'support@lumina.careers',
                sub: 'Help with applications & dossiers',
              },
              {
                icon: MapPin,
                title: 'San Francisco HQ',
                value: '548 Market St, Suite 120',
                sub: 'San Francisco, CA 94104',
              },
            ].map((c) => (
              <div
                key={c.title}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-soft p-5 flex items-start gap-4 transition-all hover:border-slate-300 hover:shadow-card-hover"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center shrink-0">
                  <c.icon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {c.title}
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{c.value}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{c.sub}</div>
                </div>
              </div>
            ))}

            {/* Support hours */}
            <div className="p-5 rounded-2xl bg-slate-950 text-white space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Support Availability</span>
              </div>
              <div className="text-sm font-semibold">Monday – Friday, 08:00 – 18:00 PT</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Emergency recruitment SLA monitoring active 24/7 for Enterprise ATS accounts.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 shadow-soft p-6 sm:p-9">
            {submitted ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-950">Inquiry Received</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out, <strong>{form.name}</strong>. A dedicated partner representative has received your dossier and will reply to <strong>{form.email}</strong> shortly.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        name: '',
                        email: '',
                        category: 'General Inquiry',
                        subject: '',
                        message: '',
                      });
                    }}
                    className="px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-950">Send an Inquiry</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Fill out the fields below and our engineering recruitment leads will connect with you.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wider">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Alex Vance"
                      className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:bg-white transition-all ${
                        errors.name ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-slate-400'
                      }`}
                    />
                    {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wider">
                      Work or Personal Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="alex@company.com"
                      className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:bg-white transition-all ${
                        errors.email ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-slate-400'
                      }`}
                    />
                    {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wider">
                      Inquiry Category
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium cursor-pointer focus:outline-hidden focus:border-slate-400 focus:bg-white transition-all"
                    >
                      <option value="General Inquiry">General Platform Inquiry</option>
                      <option value="Employer Partnership">Employer ATS & Job Posting</option>
                      <option value="Candidate Support">Candidate Application Support</option>
                      <option value="Press & Media">Press, Media & Partnerships</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wider">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="Brief summary of your inquiry..."
                      className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:bg-white transition-all ${
                        errors.subject ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-slate-400'
                      }`}
                    />
                    {errors.subject && <p className="text-[11px] text-rose-600 mt-1">{errors.subject}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wider">
                    Detailed Message
                  </label>
                  <textarea
                    rows={5}
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about your team's hiring roadmap, technical questions, or candidate inquiry..."
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:bg-white transition-all leading-relaxed ${
                      errors.message ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-slate-400'
                    }`}
                  />
                  {errors.message && <p className="text-[11px] text-rose-600 mt-1">{errors.message}</p>}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full sm:w-auto px-7 py-3 bg-slate-950 hover:bg-slate-800 disabled:opacity-60 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{sending ? 'Dispatching Message...' : 'Submit Inquiry'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};