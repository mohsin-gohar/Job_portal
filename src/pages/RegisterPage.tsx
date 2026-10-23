import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth, UserRole } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('candidate');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Please enter your full name.'); return; }
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email.trim())) { setError('Please enter a valid email address.'); return; }
    if (password.trim().length < 8) { setError('Password must be at least 8 characters long.'); return; }
    setLoading(true);
    const ok = await register(name, email, password, role);
    setLoading(false);
    if (!ok) { setError('Registration failed. Please check your details and try again.'); return; }
    showToast('Account created successfully', 'success', `Welcome to Lumina, ${name.trim().split(' ')[0]}.`);
    if (role === 'employer') navigate('/ats');
    else navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80" alt="Office" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/80 via-indigo-900/70 to-slate-900/80" />
        <div className="relative z-10 flex flex-col justify-end p-12 text-white space-y-4">
          <h2 className="text-3xl font-display font-bold">Join Lumina Careers</h2>
          <p className="text-sm text-white/80 max-w-md">Create an account as a candidate or employer.</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-display font-bold text-slate-950">Create account</h1>
            <p className="text-sm text-slate-600">Pick your role to get started.</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(['candidate','employer'] as UserRole[]).map((r) => (
              <button key={r} type="button" onClick={() => setRole(r)} className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${role===r?'bg-indigo-600 text-white border-indigo-600 shadow-md':'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'}`}>{r.charAt(0).toUpperCase()+r.slice(1)}</button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Jane Doe" required autoComplete="name" className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type={showPw?'text':'password'} value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" required minLength={8} autoComplete="new-password" className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500" />
                <button type="button" onClick={()=>setShowPw(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">{showPw?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button>
              </div>
            </div>
            {error && <p className="text-xs text-rose-600">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed">{loading?'Creating...':(<>Create account <ArrowRight className="w-4 h-4"/></>)}</button>
          </form>
          <p className="text-center text-sm text-slate-600">Already have an account? <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};
