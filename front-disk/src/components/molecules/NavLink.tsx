import React from 'react';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: 'emerald' | 'blue' | 'white';
  className?: string;
}

export const NavLink: React.FC<NavLinkProps> = ({
  href,
  children,
  variant = 'white',
  className = ''
}) => {
  const variants = {
    emerald: 'hover:text-emerald-400',
    blue: 'hover:text-blue-400',
    white: 'hover:text-white',
  };

  return (
    <a
      href={href}
      className={`text-sm font-medium text-slate-300 transition-colors ${variants[variant]} ${className}`}
    >
      {children}
    </a>
  );
};
