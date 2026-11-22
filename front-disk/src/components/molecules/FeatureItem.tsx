import React from 'react';

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  variant?: 'emerald' | 'blue';
}

export const FeatureItem: React.FC<FeatureItemProps> = ({
  icon,
  title,
  description,
  variant = 'emerald'
}) => {
  const iconBg = variant === 'emerald' ? 'bg-emerald-500/20' : 'bg-blue-500/20';
  const iconColor = variant === 'emerald' ? 'text-emerald-400' : 'text-blue-400';

  return (
    <li className="flex items-start gap-3">
      <div className={`mt-1 ${iconBg} p-1 rounded-full`}>
        {React.cloneElement(icon as React.ReactElement, { className: `w-4 h-4 ${iconColor}` })}
      </div>
      <div>
        <strong className="block text-slate-200">{title}</strong>
        <span className="text-sm text-slate-500">{description}</span>
      </div>
    </li>
  );
};
