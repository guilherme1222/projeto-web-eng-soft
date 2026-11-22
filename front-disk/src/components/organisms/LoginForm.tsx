import { useState } from "react";
import { useAuth } from "../../context/AuthContext"; // Ajuste o caminho conforme sua pasta

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState(""); // Para mostrar mensagens de erro na tela
  
  const { login } = useAuth(); // Pega a função de gravar os dados globais

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(""); // Limpa erros antigos ao tentar de novo

    try {
      // 1. Faz a requisição para a sua API Node.js real
      const resposta = await fetch("http://localhost:3333/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password })
      });

      const dados = await resposta.json();

      // COLOCAMOS ISSO AQUI PARA VER O QUE A API DEVOLVEU!
      console.log("RESPOSTA DA API:", dados);

      // 2. Verifica se a API confirmou as credenciais
      if (resposta.ok && dados.sucesso) {
        // Agora pegamos as chaves exatas que a sua API devolveu!
        login({
          id: dados.usuarioId,
          nome: dados.nome,
          role: dados.role || 'player'
        }); 
        
        // Redireciona para o painel correto conforme o papel do usuário
        if (dados.role === 'admin') {
          window.location.href = "/painelAdm";
        } else if (dados.role === 'manager') {
          window.location.href = "/painelGestor";
        } else {
          window.location.href = "/painelJogador";
        }
      } else {
        // Mostra o erro retornado pela API (ex: "Senha incorreta")
        setErro(dados.mensagem || "Credenciais inválidas");
      }
    } catch (error) {
      console.error(error);
      setErro("Erro ao conectar com o servidor. Verifique se a API está rodando.");
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex flex-col gap-4 bg-slate-900/50 p-6 rounded-xl border border-slate-800 shadow-2xl backdrop-blur-sm"
    >
      {/* Exibe a mensagem de erro caso exista */}
      {erro && (
        <div className="bg-red-500/20 text-red-400 p-3 rounded-lg text-sm border border-red-500/50">
          {erro}
        </div>
      )}

      <div>
        <label htmlFor="email" className="text-slate-400 text-sm mb-1 block">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
          placeholder="jogador@email.com"
          required
        />
      </div>

      <div>
        <label htmlFor="senha" className="text-slate-400 text-sm mb-1 block">
          Senha
        </label>
        <input
          id="senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
          placeholder="••••••••"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 px-4 rounded-lg transition-all mt-4"
      >
        Entrar
      </button>
    </form>
  );
}