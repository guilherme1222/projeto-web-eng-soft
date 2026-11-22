import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  icon,
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-1 w-full">
      {label && <label className="text-sm font-medium text-slate-300 ml-1">{label}</label>}
      <div className="relative group">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-slate-500 group-focus-within:text-emerald-400 transition-colors">
              {icon}
            </span>
          </div>
        )}
        <input
          className={`block w-full ${icon ? 'pl-11' : 'pl-4'} pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
    </div>
  );
};
