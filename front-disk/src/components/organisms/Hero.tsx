import React from 'react';
import { Badge } from '../atoms/Badge';
import { SearchBar } from '../molecules/SearchBar';

interface HeroProps {
  searchLocation: string;
  setSearchLocation: (val: string) => void;
  searchDate: string;
  setSearchDate: (val: string) => void;
  onSearch: () => void;
}

export const Hero: React.FC<HeroProps> = (props) => {
  return (
    <main className="pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden relative">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <Badge>Lançamento em Belo Horizonte</Badge>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8">
          A sua pelada,<br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500">
            sem dor de cabeça.
          </span>
        </h1>

        <p className="mt-4 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
          A infraestrutura definitiva para o esporte amador. Agende quadras, rache o PIX automaticamente e encontre partidas abertas. A ponte digital entre jogadores e donos de quadras.
        </p>

        <SearchBar {...props} />
      </div>
    </main>
  );
};
