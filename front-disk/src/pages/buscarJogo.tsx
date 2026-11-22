"use client";

import { useState, useEffect } from "react";
import {
    Search,
    Calendar,
    MapPin,
    Users,
    X,
    CheckCircle
} from "lucide-react";
import { Button } from "../components/atoms/Button";
import { Footer } from "../components/organisms/Footer";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const tipoQuadraLabel: Record<number, string> = {
    0: "Areia",
    1: "Society",
    2: "Campo",
    3: "Salão",
};

interface PartidaAberta {
    id: string;
    titulo: string;
    organizador: {
        nome: string;
        avatar: string;
        avaliacao: number;
    };
    esporte: string;
    local: string;
    data: string;
    hora: string;
    precoCota: number;
}

export default function BuscarJogo() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Estados da Página e Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [partidaSelecionada, setPartidaSelecionada] = useState<PartidaAberta | null>(null);
    
    // Estados para os dados do Banco
    const [partidas, setPartidas] = useState<PartidaAberta[]>([]);
    const [carregando, setCarregando] = useState(true);

    // === NOVOS ESTADOS PARA O FILTRO DE BUSCA ===
    const [filtroLocal, setFiltroLocal] = useState("");
    const [filtroData, setFiltroData] = useState("");

    useEffect(() => {
        const carregarPartidas = async () => {
            try {
                const response = await fetch('http://localhost:3333/partidas');
                const dados = await response.json();

                if (Array.isArray(dados)) {
                    const partidasFormatadas = dados.map((dbMatch: any) => {
                        const dataObj = new Date(dbMatch.date);
                        const valorHora = Number(dbMatch.hour_value ?? 0);
                        const cota = valorHora > 0 ? valorHora / 10 : 0;
                        
                        const localFormatado = dbMatch.local || [dbMatch.street, dbMatch.number, dbMatch.city, dbMatch.state]
                            .filter(Boolean)
                            .join(', ');
                        const tipoQuadra = tipoQuadraLabel[Number(dbMatch.court_type)] ?? 'Quadra';
                        
                        return {
                            id: dbMatch.id,
                            titulo: `${dbMatch.court_name}`, 
                            organizador: {
                                nome: `Jogador ${dbMatch.id.substring(0, 4)}`,
                                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${dbMatch.id}`,
                                avaliacao: 5.0
                            },
                            esporte: tipoQuadra,
                            local: localFormatado || dbMatch.court_name || 'Endereço não informado',
                            data: dataObj.toLocaleDateString('pt-BR'), 
                            hora: dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                            precoCota: cota
                        };
                    });
                    
                    setPartidas(partidasFormatadas);
                }
            } catch (error) {
                console.error("Erro ao buscar partidas:", error);
            } finally {
                setCarregando(false);
            }
        };

        carregarPartidas();
    }, []);

    const abrirModal = (partida: PartidaAberta) => {
        setPartidaSelecionada(partida);
        setIsModalOpen(true);
    };

    const confirmarInscricao = async () => {
        if (!user?.id || !partidaSelecionada) {
            alert("Você precisa estar logado para entrar em uma partida.");
            navigate("/login");
            return;
        }

        try {
            const response = await fetch("http://localhost:3333/api/partidas/participar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    matchId: partidaSelecionada.id,
                    userId: user.id,
                    quotaValue: partidaSelecionada.precoCota,
                }),
            });
            const dados = await response.json();

            if (!response.ok) {
                throw new Error(dados?.mensagem || "Não foi possível confirmar a inscrição.");
            }

            setIsModalOpen(false);
            setPartidaSelecionada(null);
            navigate("/painelJogador");
        } catch (error) {
            const mensagem = error instanceof Error ? error.message : "Erro inesperado ao confirmar inscrição.";
            alert(mensagem);
        }
    };

    // === LÓGICA DE FILTRAGEM (RODA AUTOMATICAMENTE) ===
    const partidasExibidas = partidas.filter((partida) => {
        // 1. Verifica se o local ou título bate com o que o usuário digitou
        const matchLocal = filtroLocal === "" || 
            partida.local.toLowerCase().includes(filtroLocal.toLowerCase()) ||
            partida.titulo.toLowerCase().includes(filtroLocal.toLowerCase());

        // 2. Verifica se a data bate (O input HTML retorna AAAA-MM-DD, então ajustamos para DD/MM/AAAA)
        let matchData = true;
        if (filtroData !== "") {
            const [ano, mes, dia] = filtroData.split('-');
            const dataFormatadaInput = `${dia}/${mes}/${ano}`;
            matchData = partida.data === dataFormatadaInput;
        }

        return matchLocal && matchData;
    });

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <main className="pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="mb-10">
                    <h1 className="text-3xl font-black text-slate-900 mb-2">
                        Buscar Partidas 
                    </h1>
                    
                    <div className="bg-white p-4 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 flex items-center bg-white border border-slate-300 rounded-xl px-4 py-3 focus-within:border-green-600 focus-within:ring-1 focus-within:ring-green-600 transition-all shadow-sm">
                            <MapPin className="text-slate-400 w-5 h-5 mr-3" />
                            <input
                                type="text"
                                value={filtroLocal}
                                onChange={(e) => setFiltroLocal(e.target.value)}
                                placeholder="Localização (Cidade, Bairro, Quadra)"
                                className="bg-transparent w-full outline-none text-slate-900 placeholder-slate-400 font-medium"
                            />
                        </div>

                        <div className="w-full md:w-64 flex items-center bg-white border border-slate-300 rounded-xl px-4 py-3 focus-within:border-green-600 focus-within:ring-1 focus-within:ring-green-600 transition-all shadow-sm">
                            <Calendar className="text-slate-400 w-5 h-5 mr-3" />
                            <input
                                type="date"
                                value={filtroData}
                                onChange={(e) => setFiltroData(e.target.value)}
                                className="bg-transparent w-full outline-none text-slate-700 font-medium"
                            />
                        </div>

                        {/* O botão fica apenas como visual, pois a filtragem é feita em tempo real enquanto digita */}
                        <Button className="w-full md:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg shadow-blue-600/30 gap-2 border-none">
                            <Search className="w-5 h-5" />
                            Buscar
                        </Button>
                    </div>
                </div>

                {carregando ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : partidasExibidas.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
                        <p className="text-slate-500 font-medium text-lg">Nenhuma partida encontrada com esses filtros.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {partidasExibidas.map((partida) => {
                            return (
                                <div
                                    key={partida.id}
                                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg shadow-slate-200/40 hover:border-blue-300 hover:shadow-xl transition-all flex flex-col"
                                >
                                    <div className="mb-6 flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{partida.esporte}</span>
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900 mb-4">{partida.titulo}</h3>

                                        <div className="space-y-2 text-sm text-slate-600 font-medium">
                                            <p className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                                {partida.data}
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-slate-400" />
                                                {partida.local}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-5 border-t border-slate-100 mt-auto">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-medium text-slate-500">Cota por jogador</p>
                                                <p className="text-xl font-black text-slate-900">R$ {partida.precoCota.toFixed(2).replace('.', ',')}</p>
                                            </div>
                                            <Button
                                                onClick={() => abrirModal(partida)}
                                                className="bg-slate-900 hover:bg-blue-600 text-white rounded-xl shadow-lg border-none transition-colors"
                                            >
                                                Quero Jogar
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            <Footer />

            {/* MODAL MANTIDO IGUAL */}
            {isModalOpen && partidaSelecionada && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden my-8 transform transition-all">

                        <div className="bg-blue-600 p-6 text-white relative">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <h3 className="text-2xl font-bold mb-1 flex items-center gap-2">
                                <CheckCircle className="w-6 h-6" /> Confirmar Presença
                            </h3>
                            <p className="text-blue-100">Garante sua vaga antes que acabe!</p>
                        </div>

                        <div className="p-6">
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6">
                                <h4 className="font-bold text-slate-900 text-lg mb-3">{partidaSelecionada.titulo}</h4>
                                <div className="space-y-2 text-sm text-slate-600 mb-4">
                                    <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400" /> {partidaSelecionada.data}</p>
                                    <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400" /> {partidaSelecionada.local}</p>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-200">
                                    <div className="flex items-center gap-2 text-slate-700">
                                        <Users className="w-5 h-5 text-blue-500" /> Cota a pagar:
                                    </div>
                                    <span className="text-xl font-black text-slate-900">
                                        R$ {partidaSelecionada.precoCota.toFixed(2).replace('.', ',')}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
                                <p className="text-sm font-medium text-amber-800">
                                    ⚠️ Ao confirmar, você se compromete com o rateio da quadra. Se faltar, pode ser penalizado na plataforma.
                                </p>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-3 text-slate-500 hover:bg-slate-100 font-bold transition-colors rounded-xl"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmarInscricao}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all"
                                >
                                    Confirmar Inscrição
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}