import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ children, icon }) => {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-sm font-medium text-slate-300 mb-8">
      {icon || <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>}
      {children}
    </div>
  );
};
