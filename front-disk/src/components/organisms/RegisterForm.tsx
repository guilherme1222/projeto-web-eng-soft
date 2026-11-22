import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importando o hook de navegação
import { User, Mail, Lock, FileDigit, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../atoms/Button';

export const RegisterForm = () => {
  const navigate = useNavigate(); // Inicializando o navegador

  // Estado dos inputs do formulário
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    dataNasc: '', 
    senha: '',
    confirmarSenha: ''
  });

  // 2. Estado para controlar a "Janelinha Bonitinha" (Toast)
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success' // pode ser 'success' ou 'error'
  });

  // Função auxiliar para disparar o aviso que some sozinho
  const mostrarAviso = (mensagem: string, tipo: 'success' | 'error') => {
    setToast({ show: true, message: mensagem, type: tipo });
    
    // Faz a janelinha sumir depois de 3 segundos (3000 milissegundos)
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.senha !== formData.confirmarSenha) {
      mostrarAviso("As senhas não coincidem!", 'error');
      return;
    }

    const dadosParaJava = {
      nome: formData.nome,
      cpf: formData.cpf,
      email: formData.email,
      senha: formData.senha,
      dataNasc: formData.dataNasc,
      type: 'player'
    };

    try {
      const response = await fetch('http://localhost:3333/api/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosParaJava),
      });

      const dados = await response.json();

      // === AQUI ESTÁ O IF CORRIGIDO ===
      if (dados.sucesso) {
        mostrarAviso("Conta criada com sucesso! Redirecionando...", 'success');
        
        // Limpa o formulário
        setFormData({ nome: '', cpf: '', email: '', dataNasc: '', senha: '', confirmarSenha: '' });
        
        // Aguarda 2 segundos para o usuário conseguir ler a mensagem antes de mudar de tela
        setTimeout(() => {
          navigate('/'); // Redireciona para a página inicial (ajuste a rota se necessário)
        }, 2000);

      } else {
        mostrarAviso(`Ops! ${dados.mensagem}`, 'error');
      }

    } catch (error) {
      mostrarAviso("Servidor offline. Verifique o backend!", 'error');
    }
  };

  return (
    <div className="relative">
      
      {/* 3. A JANELINHA BONITINHA (TOAST) FLUTUANTE */}
      <div 
        className={`absolute -top-16 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 transition-all duration-300 z-50
          ${toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
          ${toast.type === 'success' ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-red-500 text-white shadow-red-500/20'}
        `}
      >
        {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
        <p className="text-sm font-bold">{toast.message}</p>
      </div>

      {/* FORMULÁRIO */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl shadow-slate-900/50">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Crie sua conta</h2>
          <p className="text-slate-400 text-sm">
            Preencha seus dados para começar a jogar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-1.5 ml-1">Nome Completo</label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Digite seu nome"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-slate-200 outline-none focus:border-emerald-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* CPF */}
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-1.5 ml-1">CPF</label>
            <div className="relative">
              <FileDigit className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-slate-200 outline-none focus:border-emerald-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* E-mail */}
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-1.5 ml-1">E-mail</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-slate-200 outline-none focus:border-emerald-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Data de Nascimento */}
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-1.5 ml-1">Data de Nascimento</label>
            <div className="relative">
              <Calendar className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text" 
                name="dataNasc" 
                value={formData.dataNasc}
                onChange={handleChange}
                placeholder="Selecione sua data"
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => {
                  if (!e.target.value) e.target.type = "text";
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-slate-200 scheme-dark outline-none focus:border-emerald-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Senhas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-1.5 ml-1">Senha</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-slate-200 outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-1.5 ml-1">Confirmar Senha</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="confirmarSenha"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-slate-200 outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            className="mt-6 py-4 text-base"
          >
            Criar Conta
          </Button>
        </form>
      </div>
    </div>
  );
};