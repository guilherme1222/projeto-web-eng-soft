"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Loader2,
  MapPin,
  Star,
  X,
} from "lucide-react";
import { Footer } from "../components/organisms/Footer";
import { useAuth } from "../context/AuthContext";

// 1. O Formato dos dados que virão do seu Banco de Dados (Java)
interface JogoAgendado {
  id: string;
  dia: string;
  hora: string;
  esporte: string;
  status: "Confirmado" | "Organizando";
  titulo: string;
  local: string;
  jogadores: number;
}

const tipoQuadraLabel: Record<number, string> = {
  0: "Areia",
  1: "Society",
  2: "Campo",
  3: "Salão",
};

export default function PainelJogador() {
  const { user } = useAuth();

  // 2. Estados para controlar a janelinha (Modal)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jogoParaCancelar, setJogoParaCancelar] = useState<JogoAgendado | null>(null);
  const [jogos, setJogos] = useState<JogoAgendado[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const carregarAgenda = async () => {
      if (!user?.id) {
        setCarregando(false);
        setJogos([]);
        return;
      }

      try {
        setCarregando(true);
        setErro(null);

        const response = await fetch(`http://localhost:3333/api/usuarios/${user.id}/partidas`);
        const dados = await response.json();

        if (!response.ok) {
          throw new Error(dados?.mensagem || "Não foi possível carregar sua agenda.");
        }

        const agendaFormatada: JogoAgendado[] = Array.isArray(dados)
          ? dados.map((jogo: any) => {
              const dataObj = new Date(jogo.date);
              const localFormatado = jogo.local || [jogo.street, jogo.number, jogo.city, jogo.state]
                  .filter(Boolean)
                  .join(', ');

              return {
                id: jogo.match_id,
                dia: dataObj.toLocaleDateString("pt-BR", { weekday: "short" }),
                hora: dataObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
                esporte: tipoQuadraLabel[Number(jogo.court_type)] ?? "Quadra",
                status: jogo.status === "agendada" ? "Organizando" : "Confirmado",
                titulo: jogo.court_name || "Partida agendada",
                local: localFormatado || jogo.complex_name || jogo.court_name || "Endereço não informado",
                jogadores: 0,
              };
            })
          : [];

        setJogos(agendaFormatada);
      } catch (error) {
        const mensagem = error instanceof Error ? error.message : "Erro inesperado ao carregar sua agenda.";
        setErro(mensagem);
      } finally {
        setCarregando(false);
      }
    };

    carregarAgenda();
  }, [user?.id]);

  // Função que o botão de cancelar vai chamar
  const abrirModalCancelamento = (jogo: JogoAgendado) => {
    setJogoParaCancelar(jogo);
    setIsModalOpen(true);
  };

  const confirmarCancelamento = async () => {
    if (!user?.id || !jogoParaCancelar) {
      return;
    }

    try {
      const response = await fetch("http://localhost:3333/api/partidas/remover", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: jogoParaCancelar.id,
          userId: user.id,
        }),
      });

      const dados = await response.json();

      if (!response.ok) {
        throw new Error(dados?.mensagem || "Não foi possível cancelar sua inscrição.");
      }

      setJogos((currentJogos) => currentJogos.filter((jogo) => jogo.id !== jogoParaCancelar.id));
      setIsModalOpen(false);
      setJogoParaCancelar(null);
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : "Erro inesperado ao cancelar inscrição.";
      alert(mensagem);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-green-600 selection:text-white relative">
      <main className="pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ================= CABEÇALHO DO PERFIL ================= */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/40 mb-8 gap-6 relative overflow-hidden">
          {/* Efeito visual de fundo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 blur-[80px] rounded-full pointer-events-none"></div>

          <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
            {/* Avatar / Foto de Perfil */}
            <div className="w-20 h-20 bg-slate-100 rounded-full border-4 border-white shadow-lg overflow-hidden flex-shrink-0">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felipe&backgroundColor=e2e8f0"
                alt="Avatar do Jogador"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">
                E aí, {user?.nome || "Jogador"}! ⚽
              </h1>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-sm font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                  <Star className="w-4 h-4 fill-amber-500" /> 4.8
                </span>
                <span className="text-sm font-medium text-slate-500">
                </span>
              </div>
            </div>
          </div>
        </div>

        {carregando ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
          </div>
        ) : erro ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 mb-8">
            {erro}
          </div>
        ) : !user?.id ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600 mb-8">
            Faça login para ver suas partidas.
          </div>
        ) : null}

          {/*Minha Agenda*/}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center px-1">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-green-600" /> Minha Agenda
              </h2>
            </div>

            {/* JOGOS DINÂMICOS COM .MAP() */}
            {jogos.map((jogo) => {
              const isConfirmado = jogo.status === "Confirmado";

              return (
                <div
                  key={jogo.id}
                  className={`bg-white rounded-3xl p-6 border shadow-sm transition-all group relative
                    ${
                      isConfirmado
                        ? "border-slate-200 shadow-slate-200/40 hover:border-green-300"
                        : "border-slate-200 opacity-75 hover:opacity-100"
                    }
                  `}
                >
                  {/* Botão de Cancelar no canto superior direito */}
                  <button
                    onClick={() => abrirModalCancelamento(jogo)}
                    className="absolute top-4 right-4 p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="Cancelar Inscrição"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex gap-4">
                      {/* Data em destaque com cor dinâmica */}
                      <div
                        className={`border rounded-2xl p-3 flex flex-col items-center justify-center min-w-[70px]
                        ${
                          isConfirmado
                            ? "bg-green-50 border-green-100"
                            : "bg-slate-50 border-slate-100"
                        }
                      `}
                      >
                        <span
                          className={`text-xs font-bold uppercase ${
                            isConfirmado ? "text-green-600" : "text-slate-500"
                          }`}
                        >
                          {jogo.dia}
                        </span>
                        <span
                          className={`text-2xl font-black ${
                            isConfirmado ? "text-green-700" : "text-slate-700"
                          }`}
                        >
                        </span>
                      </div>

                      {/* Detalhes do jogo */}
                      <div className="pr-8">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {jogo.esporte}
                          </span>
                          <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-md
                            ${
                              isConfirmado
                                ? "text-green-600 bg-green-50"
                                : "text-slate-500 bg-slate-100"
                            }
                          `}
                          >
                            {jogo.status}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">
                          {jogo.titulo}
                        </h3>
                        <p className="text-sm text-slate-500 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" /> {jogo.local}
                        </p>
                      </div>
                    </div>

                    {/* Avatares dos jogadores (Condicional: só mostra se tiver jogadores) */}
                    {jogo.jogadores > 0 && (
                      <div className="flex sm:flex-col justify-end items-center sm:items-end gap-3 mt-4 sm:mt-0 border-t sm:border-t-0 border-slate-100 pt-4 sm:pt-0">
                        <div className="flex -space-x-2">
                          <img
                            className="w-8 h-8 rounded-full border-2 border-white"
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=J1"
                            alt="J1"
                          />
                          <img
                            className="w-8 h-8 rounded-full border-2 border-white"
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=J2"
                            alt="J2"
                          />
                          <img
                            className="w-8 h-8 rounded-full border-2 border-white"
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=J3"
                            alt="J3"
                          />
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                            +{jogo.jogadores > 3 ? jogo.jogadores - 3 : 0}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {!carregando && !erro && user?.id && jogos.length === 0 && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 text-slate-500 text-center">
                Você ainda não está cadastrado em nenhuma partida.
              </div>
            )}
          </div>
      </main>

      <Footer />

      {/* ================= JANELINHA DE CANCELAMENTO (MODAL) ================= */}
      {isModalOpen && jogoParaCancelar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl">
            {/* Cabeçalho do modal */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-900">
                Cancelar Inscrição
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-500 mb-8">
              Tem certeza que deseja cancelar sua vaga no jogo{" "}
              <strong className="text-slate-900">
                {jogoParaCancelar.titulo}
              </strong>
              ? Essa ação não pode ser desfeita e você perderá seu lugar.
            </p>

            {/* Botões */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-slate-500 hover:bg-slate-100 font-bold transition-colors rounded-xl"
              >
                Voltar
              </button>
              <button
                onClick={confirmarCancelamento}
                className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-500/20 transition-all"
              >
                Sim, quero cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}