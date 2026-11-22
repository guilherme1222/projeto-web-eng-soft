import React from 'react';
import { Users, CreditCard, Search, ShieldCheck, Calendar, Smartphone } from 'lucide-react';
import { FeatureCard } from './FeatureCard';

export const FeatureSection: React.FC = () => {
  return (
    <section className="py-20 border-t border-slate-900 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16">
          <FeatureCard
            id="jogadores"
            icon={<Users />}
            title="Para Jogadores"
            description="Esqueça o grupo do WhatsApp. Organize seu time, encontre horários vagos em tempo real e não pague o pato pelos caloteiros."
            buttonText="Baixar App do Jogador"
            variant="emerald"
            features={[
              {
                icon: <CreditCard />,
                title: "Split de Pagamento Automático",
                description: "O sistema cobra a cota de cada um no PIX. Ninguém paga pelos outros."
              },
              {
                icon: <Search />,
                title: "Partidas Abertas (Matchmaking)",
                description: "Faltou gente pro jogo? Abra vagas e o app notifica jogadores do mesmo nível."
              }
            ]}
          />

          <FeatureCard
            id="quadras"
            icon={<ShieldCheck />}
            title="Para Donos de Quadras"
            description="O fim da agenda de papel e das mensagens ignoradas. Profissionalize sua gestão e diminua drasticamente a ociosidade da sua quadra."
            buttonText="Acessar Painel do Gestor"
            variant="blue"
            features={[
              {
                icon: <Calendar />,
                title: "Agenda Sincronizada 24/7",
                description: "Controle tudo pelo painel web. Horários livres são anunciados automaticamente."
              },
              {
                icon: <Smartphone />,
                title: "Menos Calotes e Cancelamentos",
                description: "Reservas garantidas por pagamento antecipado e taxas rigorosas de no-show."
              }
            ]}
          />
        </div>
      </div>
    </section>
  );
};
