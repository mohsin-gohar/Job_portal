import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'candidate' | 'employer' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarColor?: string;
}

export interface LoginResult {
  success: boolean;
  role?: UserRole;
  error?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<LoginResult>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'lumina_auth_user';

// Predefined administrator accounts
const ADMIN_EMAILS = ['admin@lumina.careers', 'admin@shopsphere.studio'];
const ADMIN_PASSWORDS = ['admin123', 'admin2026'];

const VALID_ROLES: UserRole[] = ['candidate', 'employer', 'admin'];

function isAuthUser(value: unknown): value is AuthUser {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    candidate.id.length > 0 &&
    typeof candidate.name === 'string' &&
    candidate.name.length > 0 &&
    typeof candidate.email === 'string' &&
    /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(candidate.email) &&
    typeof candidate.role === 'string' &&
    VALID_ROLES.includes(candidate.role as UserRole) &&
    (candidate.avatarColor === undefined || typeof candidate.avatarColor === 'string')
  );
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (isAuthUser(parsed)) {
          // Never restore an admin session unless the email is still allow-listed.
          if (parsed.role === 'admin' && !ADMIN_EMAILS.includes(parsed.email)) {
            localStorage.removeItem(STORAGE_KEY);
          } else {
            setUser(parsed);
          }
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const persist = (u: AuthUser | null) => {
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const login = async (
    email: string,
    password: string,
    selectedRole: UserRole = 'candidate'
  ): Promise<LoginResult> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPw = password.trim();

    if (!cleanEmail || !cleanPw) {
      return { success: false, error: 'Email and password are required' };
    }

    // 1. Check for Admin Login (Secret entry)
    const isAdminEmail = ADMIN_EMAILS.includes(cleanEmail);
    if (isAdminEmail) {
      if (ADMIN_PASSWORDS.includes(cleanPw)) {
        const adminUser: AuthUser = {
          id: 'admin_root',
          name: 'Platform Administrator',
          email: cleanEmail,
          role: 'admin',
          avatarColor: 'bg-slate-950',
        };
        setUser(adminUser);
        persist(adminUser);
        return { success: true, role: 'admin' };
      } else {
        return { success: false, error: 'Invalid security credentials for this account' };
      }
    }

    // 2. Regular Candidate or Employer Login
    // Prevent non-admin users from claiming admin role
    const effectiveRole: UserRole = selectedRole === 'employer' ? 'employer' : 'candidate';
    const regularUser: AuthUser = {
      id: `u_${Date.now()}`,
      name: cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email: cleanEmail,
      role: effectiveRole,
      avatarColor: effectiveRole === 'employer' ? 'bg-indigo-600' : 'bg-slate-800',
    };

    setUser(regularUser);
    persist(regularUser);
    return { success: true, role: effectiveRole };
  };

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    if (!name.trim() || !email.trim() || !password.trim()) return false;
    if (password.trim().length < 8) return false;
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email.trim())) return false;
    
    // Regular registration cannot register as admin
    const effectiveRole: UserRole = role === 'employer' ? 'employer' : 'candidate';

    const u: AuthUser = {
      id: `u_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: effectiveRole,
      avatarColor: effectiveRole === 'employer' ? 'bg-indigo-600' : 'bg-slate-800',
    };

    setUser(u);
    persist(u);
    return true;
  };

  const logout = () => {
    setUser(null);
    persist(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
