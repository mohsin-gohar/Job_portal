import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useJobPortal } from '../context/JobPortalContext';

export const NotificationToast: React.FC = () => {
  const { notification } = useJobPortal();

  if (!notification) return null;

  const isSuccess = notification.type === 'success';
  const isError = notification.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-800 flex items-center gap-3 max-w-md">
        {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
        {isError && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
        {!isSuccess && !isError && (
          <Info
            className="w-4 h-4 shrink-0"
            style={{ color: 'var(--color-primary)' }}
          />
        )}

        <p className="text-xs font-medium text-slate-100 flex-1">{notification.message}</p>
      </div>
    </div>
  );
};
