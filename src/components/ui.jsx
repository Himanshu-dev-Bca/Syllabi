/**
 * components/ui.jsx
 * Minimal shared primitives. No decorative variants — only what's needed.
 */

import { X } from 'lucide-react';

// ── Button ───────────────────────────────────────────────────────────────────

const BUTTON_VARIANTS = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
  secondary: 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200',
  ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
};

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }) {
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-5 py-2.5 text-sm' };
  return (
    <button
      className={`inline-flex items-center gap-2 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${sizes[size]} ${BUTTON_VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// ── Input ────────────────────────────────────────────────────────────────────

export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="space-y-1">
      {label && <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">{label}</label>}
      <input
        className={`w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${error ? 'ring-2 ring-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ── Select ───────────────────────────────────────────────────────────────────

export function Select({ label, error, className = '', children, ...props }) {
  return (
    <div className="space-y-1">
      {label && <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">{label}</label>}
      <select
        className={`w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ── Modal ────────────────────────────────────────────────────────────────────

export function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ── Progress bar ─────────────────────────────────────────────────────────────

export function ProgressBar({ value, colorClass = 'bg-indigo-600', className = '' }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className={`w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden h-1.5 ${className}`}>
      <div
        className={`${colorClass} h-full rounded-full`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ── Badge ────────────────────────────────────────────────────────────────────

export function Badge({ children, className = '' }) {
  return (
    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded border ${className}`}>
      {children}
    </span>
  );
}

// ── Empty state ──────────────────────────────────────────────────────────────

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {Icon && (
        <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
          <Icon className="w-6 h-6 text-slate-400" />
        </div>
      )}
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{title}</p>
      {description && <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-xs">{description}</p>}
      {action}
    </div>
  );
}

// ── Toast ────────────────────────────────────────────────────────────────────

export function Toast({ message, type = 'success' }) {
  const colors = {
    success: 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900',
    error: 'bg-red-600 text-white',
    info: 'bg-slate-700 dark:bg-slate-200 text-white dark:text-slate-900',
  };
  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium ${colors[type]}`}>
      {message}
    </div>
  );
}

// ── Stat card ────────────────────────────────────────────────────────────────

export function StatCard({ label, value, sub, children }) {
  return (
    <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">{label}</p>
      <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 leading-none mb-1">{value}</p>
      {sub && <p className="text-xs text-slate-500 dark:text-slate-400">{sub}</p>}
      {children}
    </div>
  );
}

