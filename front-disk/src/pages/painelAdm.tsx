"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Menu,
  X,
  Users,
  ShieldCheck,
  LogOut,
  TrendingUp,
  Crown,
  Dumbbell,
  BadgeCheck,
} from "lucide-react";
import { Logo } from "../components/atoms/Logo";
import { Button } from "../components/atoms/Button";
import { useAuth } from "../context/AuthContext"; 

type DbRole = 'player' | 'manager' | 'admin';

type PlayerProfile = {
  id: string;
  name: string;
  reference: string;
  type: string;
  dbRole: DbRole;
  description: string;
  actionLabel: string;
};

export default function PainelAdm() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [typeDrawerOpen, setTypeDrawerOpen] = useState(false);
  
  const [profiles, setProfiles] = useState<PlayerProfile[]>([]);
  const [receita, setReceita] = useState<number>(0); // Estado para a receita
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<PlayerProfile | null>(null);
  const [salvando, setSalvando] = useState(false);

  // Busca os usuários e as estatísticas do banco
  const carregarDadosDoPainel = async () => {
    try {
      // Faz as duas requisições ao mesmo tempo (paralelo)
      const [resUsuarios, resEstatisticas] = await Promise.all([
        fetch('http://localhost:3333/api/usuarios'),
        fetch('http://localhost:3333/api/estatisticas')
      ]);

      const dadosUsuarios = await resUsuarios.json();
      const dadosEstatisticas = await resEstatisticas.json();

      if (Array.isArray(dadosUsuarios)) {
        const perfisFormatados = dadosUsuarios.map((dbUser: any) => {
          const isPlayer = dbUser.role === 'player';
          const isManager = dbUser.role === 'manager';
          const isAdmin = dbUser.role === 'admin';

          return {
            id: dbUser.id,
            name: dbUser.name,
            reference: dbUser.email, 
            type: isManager ? 'Gestor' : isAdmin ? 'Admin' : 'Jogador',
            dbRole: dbUser.role,
            description: isManager 
              ? 'Tem acesso de gestão em uma ou mais quadras.' 
              : isAdmin 
                ? 'Administrador master do sistema.' 
                : 'Perfil exclusivo para participação em partidas.',
            actionLabel: isAdmin ? 'Inalterável' : 'Ajustar tipo'
          };
        });
        setProfiles(perfisFormatados);
      }

      if (dadosEstatisticas.sucesso) {
        setReceita(dadosEstatisticas.receita);
      }

    } catch (error) {
      console.error("Erro ao buscar dados do painel:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDadosDoPainel();
  }, []);

  const openDrawerForProfile = (profile: PlayerProfile) => {
    if (profile.dbRole === 'admin') {
      alert("O papel de Administrador não pode ser alterado.");
      return;
    }
    setSelectedProfile(profile);
    setTypeDrawerOpen(true);
  };

  const updateProfileType = async (newRole: 'player' | 'manager') => {
    if (!user?.id || !selectedProfile) return;

    setSalvando(true);
    try {
      const response = await fetch(`http://localhost:3333/api/usuarios/${selectedProfile.id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: newRole,
          requesterId: user.id
        })
      });

      const dados = await response.json();

      if (dados.sucesso) {
        await carregarDadosDoPainel(); // Recarrega tudo
        setTypeDrawerOpen(false);
      } else {
        alert(`Erro: ${dados.mensagem}`);
      }
    } catch (error) {
      alert("Erro de conexão ao tentar atualizar o usuário.");
    } finally {
      setSalvando(false);
    }
  };

  const totalJogadores = profiles.length;
  const totalGestores = profiles.filter(p => p.dbRole === 'manager').length;

  // Lógica para quebrar o número e estilizar os centavos bonitinho como no seu layout
  const receitaFormatada = receita.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const [inteiros, centavos] = receitaFormatada.split(',');

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-green-600 selection:text-white overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="h-20 flex items-center px-6 border-b border-slate-100">
            <Logo variant="default" />
            <span className="ml-2 text-xs font-bold text-slate-400 tracking-widest uppercase">Admin</span>
          </div>
          <nav className="p-4 space-y-2">
            <a href="#" className="flex items-center gap-3 px-4 py-3 bg-green-50 text-green-700 rounded-xl font-medium border-l-4 border-green-600 transition-all">
              <LayoutDashboard className="w-5 h-5" /> Centro de Controle
            </a>
          </nav>
        </div>
        <div className="p-4 border-t border-slate-100">
          <button onClick={logout} className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 hover:bg-slate-50 hover:text-red-600 rounded-xl font-medium transition-all">
            <LogOut className="w-5 h-5" /> Sair do Painel
          </button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden relative">
        <header className="min-h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between gap-4 px-4 sm:px-8 py-4 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="inline-flex items-center justify-center w-11 h-11 rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm md:hidden">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Visão Global da Plataforma</h1>
              <p className="text-sm text-slate-500 font-medium">Monitoramento em tempo real e gestão de perfis</p>
            </div>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-950 rounded-full flex items-center justify-center shadow-lg cursor-pointer">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          {/* CARDS DE MÉTRICAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full"></div>
              <div className="relative z-10 flex justify-between items-start mb-4">
                <p className="text-slate-500 font-medium text-sm">Total de Usuários Cadastrados</p>
                <div className="bg-blue-100 p-2 rounded-xl"><Users className="w-4 h-4 text-blue-600" /></div>
              </div>
              <h3 className="text-3xl font-black text-slate-900 relative z-10">{loading ? '...' : totalJogadores}</h3>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-orange-50 rounded-full"></div>
              <div className="relative z-10 flex justify-between items-start mb-4">
                <p className="text-slate-500 font-medium text-sm">Gestores Ativos</p>
                <div className="bg-orange-100 p-2 rounded-xl"><Crown className="w-4 h-4 text-orange-600" /></div>
              </div>
              <h3 className="text-3xl font-black text-slate-900 relative z-10">{loading ? '...' : totalGestores}</h3>
            </div>
            
            <div className="bg-white p-6 rounded-3xl border border-emerald-200 shadow-xl shadow-emerald-200/20 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full"></div>
              <div className="relative z-10 flex justify-between items-start mb-4">
                <p className="text-slate-500 font-medium text-sm">Receita DiskFut (10%)</p>
                <div className="bg-emerald-100 p-2 rounded-xl"><TrendingUp className="w-4 h-4 text-emerald-600" /></div>
              </div>
              <h3 className="text-3xl font-black text-slate-900 relative z-10">
                {loading ? '...' : (
                  <>R$ {inteiros}<span className="text-lg text-slate-400 font-bold">,{centavos}</span></>
                )}
              </h3>
            </div>
          </div>

          {/* TABELA DE GESTÃO */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-400" />
              <h2 className="text-lg font-bold text-slate-900">Status dos Jogadores por Tipo de Perfil</h2>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex justify-center p-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <th className="p-4 pl-6">Usuário</th>
                      <th className="p-4">Tipo Atual</th>
                      <th className="p-4">Descrição</th>
                      <th className="p-4 pr-6 text-right">Ação de Perfil</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {profiles.map((profile) => (
                      <tr key={profile.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 pl-6">
                          <span className="inline-flex items-center gap-2 font-bold text-slate-900 text-sm">
                            <Users className="w-4 h-4 text-slate-400" /> {profile.name}
                          </span>
                          <p className="text-xs text-slate-500 mt-1">{profile.reference}</p>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${
                              profile.type === "Jogador"
                                ? "bg-slate-100 text-slate-700 border-slate-200"
                                : profile.type === "Gestor"
                                  ? "bg-orange-50 text-orange-700 border-orange-100"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-100"
                            }`}
                          >
                            {profile.type === "Jogador" ? (
                              <Dumbbell className="w-3.5 h-3.5" />
                            ) : profile.type === "Gestor" ? (
                              <Crown className="w-3.5 h-3.5" />
                            ) : (
                              <ShieldCheck className="w-3.5 h-3.5" />
                            )}
                            {profile.type}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-slate-600">{profile.description}</p>
                        </td>
                        <td className="p-4 pr-6 flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-slate-700 border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                            onClick={() => openDrawerForProfile(profile)}
                            disabled={profile.dbRole === 'admin'}
                          >
                            {profile.actionLabel}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* DRAWER LATERAL DE EDIÇÃO */}
      {typeDrawerOpen && selectedProfile ? (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button type="button" className="absolute inset-0 bg-slate-950/40" onClick={() => setTypeDrawerOpen(false)} />
          <aside className="relative w-full max-w-md h-full bg-white shadow-2xl border-l border-slate-200 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-slate-400">Ajuste de perfil</p>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{selectedProfile.name}</h3>
                <p className="text-sm text-slate-500 mt-1">Tipo atual: {selectedProfile.type}</p>
              </div>
              <button onClick={() => setTypeDrawerOpen(false)} className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-sm font-medium text-slate-500">Descrição atual</p>
                <p className="text-sm text-slate-700 mt-1">{selectedProfile.description}</p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  disabled={salvando}
                  onClick={() => updateProfileType("player")}
                  className={`w-full flex items-center justify-between rounded-2xl border ${selectedProfile.dbRole === 'player' ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200'} px-4 py-4 text-left hover:bg-slate-50 transition-colors disabled:opacity-50`}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                      <Dumbbell className="w-5 h-5" />
                    </span>
                    <span>
                      <span className="block font-semibold text-slate-900">Jogador</span>
                      <span className="block text-sm text-slate-500">Acesso apenas como participante.</span>
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  disabled={salvando}
                  onClick={() => updateProfileType("manager")}
                  className={`w-full flex items-center justify-between rounded-2xl border ${selectedProfile.dbRole === 'manager' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-200'} px-4 py-4 text-left hover:bg-slate-50 transition-colors disabled:opacity-50`}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center">
                      <Crown className="w-5 h-5" />
                    </span>
                    <span>
                      <span className="block font-semibold text-slate-900">Gestor</span>
                      <span className="block text-sm text-slate-500">Acesso de administração de quadras.</span>
                    </span>
                  </span>
                </button>
              </div>

              <Button variant="secondary" fullWidth disabled={salvando} onClick={() => setTypeDrawerOpen(false)}>
                Cancelar
              </Button>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}