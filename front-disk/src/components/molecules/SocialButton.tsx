import React from 'react';

interface SocialButtonProps {
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

export const SocialButton: React.FC<SocialButtonProps> = ({ icon, children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-950 border border-slate-800 hover:bg-slate-800 rounded-xl transition-colors text-sm font-medium text-slate-300"
    >
      {icon}
      {children}
    </button>
  );
};
