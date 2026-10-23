import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useJobPortal } from '../context/JobPortalContext';

export const NotificationToast: React.FC = () => {
  const { notification } = useJobPortal();

  if (!notification) return null;

  const isSuccess = notification.type === 'success';
  const isError = notification.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-up">
      <div className="relative overflow-hidden bg-slate-900/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-lift border border-white/10 flex items-center gap-3 max-w-md">
        <span
          className="absolute inset-y-0 left-0 w-1"
          style={{
            backgroundColor: isSuccess ? '#10b981' : isError ? '#f87171' : 'var(--color-primary)',
          }}
          aria-hidden="true"
        />
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
        {isError && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
        {!isSuccess && !isError && (
          <Info
            className="w-5 h-5 shrink-0"
            style={{ color: 'var(--color-primary)' }}
          />
        )}

        <p className="text-xs font-medium text-slate-100 flex-1">{notification.message}</p>
      </div>
    </div>
  );
};
