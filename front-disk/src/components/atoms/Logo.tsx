import React from 'react';
import { Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
  variant?: 'default' | 'centered';
  href?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  iconSize = 20,
  textSize = 'text-xl',
  variant = 'default',
  href
}) => {
  const containerClasses = variant === 'centered'
    ? 'flex flex-col items-center gap-4'
    : 'flex items-center gap-2';

  const logoBoxClasses = variant === 'centered'
    ? 'w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30'
    : 'w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20';

  const textClasses = variant === 'centered'
    ? `text-3xl font-bold tracking-tight text-white`
    : `${textSize} font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400`;

  // 1. Guardamos o visual da logo nesta variável
  const logoContent = (
    <>
      <div className={logoBoxClasses}>
        <Trophy size={iconSize} className="text-white" />
      </div>
      <span className={textClasses}>
        Disk<span className="text-emerald-400">Fut</span>
      </span>
    </>
  );

  // 2. Se tiver href, renderiza o Link com a logo dentro
  if (href) {
    return (        
      <Link to={href} className={`${containerClasses} hover:opacity-80 transition-opacity ${className}`}>
        {logoContent}
      </Link>
    );
  }

  // 3. Se não tiver, renderiza a div normal com a logo dentro
  return (
    <div className={`${containerClasses} ${className}`}>
      {logoContent}
    </div>
  );
};
