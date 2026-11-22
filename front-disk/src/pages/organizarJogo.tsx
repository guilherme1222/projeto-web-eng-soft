"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  Calendar,
  Search,
  Star,
  ChevronRight,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { Button } from "../components/atoms/Button";

type CourtType = "Areia" | "Society" | "Campo" | "Salão" | "Outra";

interface QuadraCard {
  id: string;
  nome: string;
  local: string;
  tipo: CourtType;
  verificada: boolean;
  horarios: string[];
  preco: number;
  precoPessoa: number;
  nota: number;
}

const HORARIOS_PADRAO = ["18:00", "19:00", "20:00", "21:00"];

const tipoQuadraLabel: Record<number, CourtType> = {
  0: "Areia",
  1: "Society",
  2: "Campo",
  3: "Salão",
};

export default function OrganizarJogo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuadra, setSelectedQuadra] = useState<QuadraCard | null>(null);
  
  const [quadras, setQuadras] = useState<QuadraCard[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [confirmando, setConfirmando] = useState(false);

  // === NOVO ESTADO PARA O FILTRO DE TEXTO ===
  const [filtroLocal, setFiltroLocal] = useState("");

  useEffect(() => {
    const carregarQuadras = async () => {
      try {
        setCarregando(true);
        setErro(null);

        const response = await fetch("http://localhost:3333/api/quadras");
        const dados = await response.json();

        if (!response.ok) {
          throw new Error(dados?.mensagem || "Não foi possível carregar as quadras.");
        }

        const quadrasFormatadas: QuadraCard[] = Array.isArray(dados)
          ? dados.map((quadra: any) => {
              const price = Number(quadra.hour_value ?? 0);
              const local = [quadra.street, quadra.number, quadra.city, quadra.state]
                .filter(Boolean)
                .join(", ");

              return {
                id: quadra.id,
                nome: quadra.name,
                local: local || quadra.complex_name || "Local não informado",
                tipo: tipoQuadraLabel[quadra.type] ?? "OUTRA",
                verificada: Boolean(quadra.complex_id),
                horarios: HORARIOS_PADRAO,
                preco: price,
                precoPessoa: price / 10,
                nota: quadra.complex_id ? 4.8 : 4.5,
              };
            })
          : [];

        setQuadras(quadrasFormatadas);
      } catch (error) {
        const mensagem = error instanceof Error ? error.message : "Erro inesperado ao carregar quadras.";
        setErro(mensagem);
      } finally {
        setCarregando(false);
      }
    };

    carregarQuadras();
  }, []);

  const abrirModal = (quadra: QuadraCard) => {
    setSelectedQuadra(quadra);
    setIsModalOpen(true);
  };

  const confirmarPartida = async () => {
    if (!selectedQuadra) return;

    try {
      setConfirmando(true);
      const response = await fetch('http://localhost:3333/api/partidas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courtId: selectedQuadra.id,
          date: selectedDate,
          status: 'agendada',
        }),
      });
      const dados = await response.json();

      if (!response.ok) {
        throw new Error(dados?.mensagem || 'Não foi possível criar a partida.');
      }

      console.log('Partida criada com sucesso:', dados.data);
      setIsModalOpen(false);
      setSelectedQuadra(null);
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Erro inesperado ao criar a partida.';
      alert(mensagem);
    } finally {
      setConfirmando(false);
    }
  };

  // === LÓGICA DE FILTRAGEM (RODA EM TEMPO REAL) ===
  const quadrasExibidas = quadras.filter((quadra) => {
    return filtroLocal === "" || 
      quadra.nome.toLowerCase().includes(filtroLocal.toLowerCase()) ||
      quadra.local.toLowerCase().includes(filtroLocal.toLowerCase()) ||
      quadra.tipo.toLowerCase().includes(filtroLocal.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-green-600 selection:text-white">
      <main className="pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= SEÇÃO DE BUSCA E FILTROS ================= */}
        <section className="mb-12">
          <h1 className="text-3xl font-black text-slate-900 mb-2">
            Organize uma partida
          </h1>

          <div className="bg-white p-4 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
            
            {/* Input de Texto Dinâmico */}
            <div className="flex-1 flex items-center bg-white border border-slate-300 rounded-xl px-4 py-3 focus-within:border-green-600 focus-within:ring-1 focus-within:ring-green-600 transition-all shadow-sm">
              <MapPin className="text-slate-400 w-5 h-5 mr-3" />
              <input
                type="text"
                value={filtroLocal}
                onChange={(e) => setFiltroLocal(e.target.value)}
                placeholder="Busque por nome da quadra, cidade, ou tipo..."
                className="bg-transparent w-full outline-none text-slate-900 placeholder-slate-400 font-medium"
              />
            </div>

            <Button className="w-full md:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg shadow-blue-600/30 gap-2 border-none">
              <Search className="w-5 h-5" />
              Buscar
            </Button>
          </div>
        </section>

        {/* ================= CABEÇALHO DE RESULTADOS ================= */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-slate-600 font-medium">
            Mostrando <strong className="text-slate-900">{quadrasExibidas.length} quadras</strong>{" "}
            disponíveis
          </p>
        </div>

        {carregando ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
          </div>
        ) : erro ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
            {erro}
          </div>
        ) : quadrasExibidas.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <p className="text-slate-500 font-medium text-lg">
              Nenhuma quadra encontrada com essa pesquisa.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quadrasExibidas.map((quadra) => (
              <div
                key={quadra.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl shadow-slate-200/40 hover:border-green-300 hover:shadow-2xl hover:shadow-green-500/10 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-slate-100 text-slate-600 text-xs font-black px-3 py-1.5 rounded-lg tracking-wider">
                      {quadra.tipo}
                    </span>
                    {quadra.verificada && (
                      <div className="bg-green-50 p-1.5 rounded-full" title="Quadra Verificada">
                        <ShieldCheck className="w-5 h-5 text-green-600" />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">
                      {quadra.nome}
                    </h3>
                    <div className="flex items-center gap-1 bg-amber-50 text-amber-700 font-bold text-sm px-2 py-1 rounded-lg border border-amber-100">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />{" "}
                      {quadra.nota}
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm font-medium flex items-center gap-1.5 mb-6">
                    <MapPin className="w-4 h-4" /> {quadra.local}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-end">
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                      Preço da Hora
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-slate-900">R$</span>
                      <span className="text-3xl font-black text-slate-900">
                        {quadra.preco.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <p className="text-green-600 text-xs font-bold mt-1">
                      ~ R$ {quadra.precoPessoa.toFixed(2).replace('.', ',')} por pessoa
                    </p>
                  </div>

                  <button
                    onClick={() => abrirModal(quadra)}
                    className="w-12 h-12 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-600/30 group-hover:scale-110 transition-transform"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && selectedQuadra ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Criar partida
              </h3>
              <p className="text-slate-500 mb-8">
                Configure a data antes de criar a partida na <strong className="text-slate-900">{selectedQuadra.nome}</strong>.
              </p>

              <div className="space-y-4 mb-8">
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Tipo da quadra
                  </p>
                  <p className="text-sm font-bold text-slate-900">{selectedQuadra.tipo}</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Data do jogo
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(event) => setSelectedDate(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                  />
                </div>

                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Resumo
                  </p>
                  <p className="text-sm text-slate-700">
                    {selectedQuadra.nome} em {selectedDate.split('-').reverse().join('/')}.
                  </p>
                  <p className="text-sm font-bold text-slate-900 mt-1">
                    Cota: R$ {(selectedQuadra.preco / 10).toFixed(2).replace(".", ",")}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-slate-500 hover:bg-slate-100 font-bold transition-colors rounded-xl"
                >
                  Cancelar
                </button>

                <button
                  onClick={confirmarPartida}
                  disabled={confirmando}
                  className="px-5 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-green-600/20 transition-all"
                >
                  {confirmando ? 'Criando...' : 'Confirmar'}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}