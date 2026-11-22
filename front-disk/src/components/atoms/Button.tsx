import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
  href?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  href,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all rounded-xl focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-lg shadow-emerald-500/20',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700',
    outline: 'bg-transparent border border-slate-800 hover:bg-slate-900 text-slate-300 hover:text-white',
    ghost: 'bg-transparent text-slate-300 hover:text-emerald-400',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-4 text-lg',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`;

  if (href) {
    return (
      // Nota: O React Router usa "to" em vez de "href" nativamente, 
      // mas repassamos a nossa prop 'href' para ele aqui.
      <Link to={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={combinedClasses}
      {...props}
    >
      {children}
    </button>
  );
};
