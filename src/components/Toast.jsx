'use client';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  const typeConfig = {
    success: {
      border: 'border-emerald-600',
      icon: 'fa-circle-check text-emerald-600'
    },
    error: {
      border: 'border-rose-600',
      icon: 'fa-circle-xmark text-rose-600'
    },
    warning: {
      border: 'border-amber-500',
      icon: 'fa-circle-exclamation text-amber-500'
    },
    info: {
      border: 'border-emerald-500',
      icon: 'fa-circle-info text-emerald-600'
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const config = typeConfig[toast.type] || typeConfig.info;

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between space-x-3 px-4 py-3 rounded-xl border-2 border-l-8 bg-white shadow-xl text-xs font-semibold text-slate-900 animate-slideUp ${config.border}`}
          >
            <div className="flex items-center space-x-2.5">
              <i className={`fa-solid ${config.icon} text-base shrink-0`}></i>
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        );
      })}
    </div>
  );
}
