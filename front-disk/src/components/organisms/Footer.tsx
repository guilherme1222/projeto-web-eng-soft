import React from 'react';
import { Trophy } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-emerald-500" />
          <span className="font-bold text-slate-300">DiskFut</span>
        </div>
        <p className="text-slate-500 text-sm text-center md:text-left">
          © 2026 DiskFut
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-sm text-slate-500 hover:text-emerald-400">Termos</a>
          <a href="#" className="text-sm text-slate-500 hover:text-emerald-400">Privacidade</a>
          <a href="#" className="text-sm text-slate-500 hover:text-emerald-400">Contato</a>
        </div>
      </div>
    </footer>
  );
};
