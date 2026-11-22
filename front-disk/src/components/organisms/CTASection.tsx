import React from 'react';
import { Button } from '../atoms/Button';

export const CTASection: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-slate-950"></div>
      <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
        <h2 className="text-4xl font-bold mb-6">Pronto para entrar em campo?</h2>
        <p className="text-xl text-slate-300 mb-10">
          Junte-se a centenas de jogadores e dezenas de quadras que já estão revolucionando o esporte amador.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="px-8 py-4">Sou Jogador</Button>
          <Button variant="secondary" size="lg" className="px-8 py-4">Sou Dono de Quadra</Button>
        </div>
      </div>
    </section>
  );
};
