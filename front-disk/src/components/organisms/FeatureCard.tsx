import React from 'react';
import { PlayCircle } from 'lucide-react';
import { FeatureItem } from '../molecules/FeatureItem';

interface FeatureCardProps {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  features: Array<{ icon: React.ReactNode; title: string; description: string }>;
  buttonText: string;
  variant?: 'emerald' | 'blue';
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  id,
  icon,
  title,
  description,
  features,
  buttonText,
  variant = 'emerald'
}) => {
  const glowColor = variant === 'emerald' ? 'bg-emerald-500/10' : 'bg-blue-500/10';
  const iconBg = variant === 'emerald' ? 'bg-emerald-500/10' : 'bg-blue-500/10';
  const iconBorder = variant === 'emerald' ? 'border-emerald-500/20' : 'border-blue-500/20';
  const iconColor = variant === 'emerald' ? 'text-emerald-400' : 'text-blue-400';
  const buttonColor = variant === 'emerald' ? 'text-emerald-400 hover:text-emerald-300' : 'text-blue-400 hover:text-blue-300';

  return (
    <div id={id} className="space-y-8 p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/50 relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 ${glowColor} blur-[50px]`}></div>

      <div className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center border ${iconBorder}`}>
        {React.cloneElement(icon as React.ReactElement, { className: `w-7 h-7 ${iconColor}` })}
      </div>
      <h2 className="text-3xl font-bold">{title}</h2>
      <p className="text-slate-400 leading-relaxed">{description}</p>

      <ul className="space-y-4">
        {features.map((feature, index) => (
          <FeatureItem
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            variant={variant}
          />
        ))}
      </ul>

      <button className={`mt-4 flex items-center gap-2 font-medium transition-colors ${buttonColor}`}>
        {buttonText} <PlayCircle className="w-5 h-5" />
      </button>
    </div>
  );
};
