"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  CalendarDays,
  Clock,
  Users,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Plus,
  MapPin,
  DollarSign,
  Activity,
  X,
  Calendar,
} from "lucide-react";
import { Footer } from "../components/organisms/Footer";
import { useAuth } from "../context/AuthContext";

type CourtForm = {
  complexName: string;
  courtName: string;
  street: string;
  number: string;
  city: string;
  state: string;
  cep: string;
  cnpj: string;
  type: string;
  hourValue: string;
};

// Interface para as partidas que vêm do banco
type PartidaGestor = {
  id: string;
  date: string;
  status: string;
  court_name: string;
  court_type: number;
  complex_name: string;
};

const initialForm: CourtForm = {
  complexName: "", courtName: "", street: "", number: "", city: "", state: "", cep: "", cnpj: "", type: "", hourValue: "",
};

// Função auxiliar para traduzir o tipo da quadra
const traduzirModalidade = (tipo: number) => {
  switch (tipo) {
    case 0: return "Areia";
    case 1: return "Society";
    case 2: return "Campo";
    case 3: return "Salão";
    default: return "Outros";
  }
};

export default function PainelGestor() {
  const { user } = useAuth();
  const [isModalQuadraOpen, setIsModalQuadraOpen] = useState(false);
  const [formData, setFormData] = useState<CourtForm>(initialForm);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  // Estados das estatísticas e da lista de jogos
  const [stats, setStats] = useState({ receitaHoje: 0, reservasHoje: 0, jogadoresHoje: 0 });
  const [proximosJogos, setProximosJogos] = useState<PartidaGestor[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarDadosGestor = async () => {
    if (!user?.id) return;
    try {
      // Faz as duas requisições de uma vez só!
      const [resStats, resPartidas] = await Promise.all([
        fetch(`http://localhost:3333/api/gestores/${user.id}/estatisticas`),
        fetch(`http://localhost:3333/api/gestores/${user.id}/partidas`)
      ]);

      const dadosStats = await resStats.json();
      const dadosPartidas = await resPartidas.json();

      if (dadosStats.sucesso) {
        setStats({
          receitaHoje: dadosStats.receitaHoje,
          reservasHoje: dadosStats.reservasHoje,
          jogadoresHoje: dadosStats.jogadoresHoje
        });
      }

      if (dadosPartidas.sucesso) {
        setProximosJogos(dadosPartidas.partidas);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do gestor:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDadosGestor();
  }, [user?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const salvarQuadra = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setMensagem(null);
    if (!user?.id) return setErro("Autenticação necessária.");

    try {
      setSalvando(true);
      const response = await fetch("http://localhost:3333/api/quadras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requesterId: user.id,
          ...formData,
          number: formData.number ? Number(formData.number) : null,
          type: Number(formData.type),
          hourValue: Number(formData.hourValue),
        }),
      });
      const dados = await response.json();
      if (!response.ok) throw new Error(dados?.mensagem || "Erro ao cadastrar quadra.");

      setMensagem("Quadra cadastrada com sucesso.");
      setFormData(initialForm);
      setIsModalQuadraOpen(false);
      carregarDadosGestor(); // Recarrega os números se adicionar quadra nova

    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro inesperado.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-green-600 selection:text-white relative">
      <main className="pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Painel do Gestor</h1>
            <p className="text-slate-500 font-medium">Cadastre quadras e acompanhe a operação da sua arena.</p>
          </div>
          <button onClick={() => setIsModalQuadraOpen(true)} className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white rounded-2xl px-5 py-3 font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-slate-900/20">
            <Plus className="w-5 h-5" /> Nova quadra
          </button>
        </div>

        {mensagem && <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 font-medium">{mensagem}</div>}
        {erro && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 font-medium">{erro}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40">
            <div className="flex justify-between items-start mb-4"><div className="bg-green-100 p-3 rounded-2xl"><TrendingUp className="w-6 h-6 text-green-600" /></div></div>
            <p className="text-slate-500 font-medium mb-1">Receita Esperada (Hoje)</p>
            <h3 className="text-3xl font-black text-slate-900">{loading ? "..." : `R$ ${stats.receitaHoje.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40">
            <div className="flex justify-between items-start mb-4"><div className="bg-blue-100 p-3 rounded-2xl"><CalendarDays className="w-6 h-6 text-blue-600" /></div></div>
            <p className="text-slate-500 font-medium mb-1">Reservas Hoje</p>
            <h3 className="text-3xl font-black text-slate-900">{loading ? "..." : stats.reservasHoje} <span className="text-lg font-medium text-slate-400">horários</span></h3>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40">
            <div className="flex justify-between items-start mb-4"><div className="bg-orange-100 p-3 rounded-2xl"><Users className="w-6 h-6 text-orange-600" /></div></div>
            <p className="text-slate-500 font-medium mb-1">Jogadores Esperados Hoje</p>
            <h3 className="text-3xl font-black text-slate-900">{loading ? "..." : stats.jogadoresHoje}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ================= PRÓXIMOS JOGOS (DINÂMICO) ================= */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">Próximos Jogos</h2>
            </div>

            <div className="divide-y divide-slate-100">
              {loading ? (
                <div className="p-10 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
              ) : proximosJogos.length === 0 ? (
                <div className="p-10 text-center text-slate-500">Nenhuma partida agendada para suas quadras ainda.</div>
              ) : (
                proximosJogos.map((partida) => {
                  const dataObj = new Date(partida.date);
                  const dataFormatada = dataObj.toLocaleDateString('pt-BR');
                  const horaFormatada = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                  return (
                    <div key={partida.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        {/* Bloco de Data e Hora */}
                        <div className="bg-slate-100 text-slate-900 font-bold px-4 py-3 rounded-2xl text-center min-w-[90px]">
                          <span className="flex justify-center mb-1 text-slate-400"><Calendar className="w-4 h-4" /></span>
                          {dataFormatada}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-lg">Reserva - {partida.complex_name}</h4>
                          <p className="text-slate-500 text-sm flex items-center gap-1 font-medium mt-1">
                            {partida.court_name} ({traduzirModalidade(partida.court_type)})
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-medium ${partida.status.toUpperCase() === 'CONFIRMADA'
                            ? 'bg-green-50 border-green-200 text-green-700'
                            : 'bg-orange-50 border-orange-200 text-orange-700'
                          }`}>
                          {partida.status.toUpperCase() === 'CONFIRMADA' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                          {partida.status.toUpperCase()}
                        </div>
                        <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="w-5 h-5" /></button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Gestão de Quadras</h2>
              <p className="text-slate-500 text-sm mb-6">Cadastre o complexo e a quadra para disponibilizá-los no aplicativo.</p>
              <button onClick={() => setIsModalQuadraOpen(true)} className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-slate-900/20 group">
                <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" /> Adicionar Quadra
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* MODAL DE CADASTRO DE QUADRA (AGORA COMPLETO!) */}
      {isModalQuadraOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-8 transform transition-all">
            <div className="bg-slate-900 p-6 text-white relative">
              <button
                onClick={() => setIsModalQuadraOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-2xl font-bold mb-1 flex items-center gap-2">
                <Plus className="w-6 h-6 text-green-400" /> Cadastrar nova quadra
              </h3>
              <p className="text-slate-400 text-sm">Preencha o complexo, endereço e a quadra para salvar no banco.</p>
            </div>

            <div className="p-6">
              <form onSubmit={salvarQuadra} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Nome do complexo</label>
                  <div className="relative">
                    <MapPin className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="complexName"
                      value={formData.complexName}
                      onChange={handleChange}
                      placeholder="Ex: Arena Central"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-700 outline-none focus:border-slate-900 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Cidade</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Belo Horizonte"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 outline-none focus:border-slate-900 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Estado</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="MG"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 outline-none focus:border-slate-900 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Rua</label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      placeholder="Rua A"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 outline-none focus:border-slate-900 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Número</label>
                    <input
                      type="number"
                      name="number"
                      value={formData.number}
                      onChange={handleChange}
                      placeholder="10"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 outline-none focus:border-slate-900 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">CEP</label>
                    <input
                      type="text"
                      name="cep"
                      value={formData.cep}
                      onChange={handleChange}
                      placeholder="30000-001"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 outline-none focus:border-slate-900 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">CNPJ do complexo</label>
                    <input
                      type="text"
                      name="cnpj"
                      value={formData.cnpj}
                      onChange={handleChange}
                      placeholder="00.000.000/0001-00"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 outline-none focus:border-slate-900 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Nome da quadra</label>
                    <input
                      type="text"
                      name="courtName"
                      value={formData.courtName}
                      onChange={handleChange}
                      placeholder="Quadra Society 1"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 outline-none focus:border-slate-900 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Modalidade</label>
                    <div className="relative">
                      <Activity className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-700 outline-none focus:border-slate-900 transition-colors appearance-none"
                        required
                      >
                        <option value="">Selecione o esporte...</option>
                        <option value="0">Areia</option>
                        <option value="1">Society</option>
                        <option value="2">Campo</option>
                        <option value="3">Salão</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Valor da hora</label>
                    <div className="relative">
                      <DollarSign className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        name="hourValue"
                        value={formData.hourValue}
                        onChange={handleChange}
                        placeholder="120"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-700 outline-none focus:border-slate-900 transition-colors"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalQuadraOpen(false)}
                    className="px-6 py-3 text-slate-500 hover:bg-slate-100 font-bold transition-colors rounded-xl"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={salvando}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-slate-900/20 transition-all flex items-center gap-2"
                  >
                    {salvando ? (
                      <span className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5" />
                    )}
                    Salvar Quadra
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}