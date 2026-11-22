import React from 'react';
import { Logo } from '../atoms/Logo';
import { Button } from '../atoms/Button';
import { NavLink } from '../molecules/NavLink';
import { useAuth } from '../../context/AuthContext'; // Contexto de autenticação

export const Navbar: React.FC = () => {
  // Puxa os dados do usuário conectado e a função de logout 
  const { user, logout } = useAuth();
  
  // Captura o nível de acesso (role) do usuário atual 
  const role = user?.role;

  return (
    <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo do projeto */}
          <Logo href="/"/>

          {/* Menu de Navegação - Exclusivo Desktop */}
          <div className="flex items-center space-x-8">
            
            {/* Links Públicos (Qualquer um acessa) */}
            <NavLink href="organizarJogo" variant="blue">Organizar Jogo</NavLink>
            <NavLink href="buscarJogo" variant="blue">Buscar Jogo</NavLink>

            {/* Exibido apenas se o usuário estiver LOGADO (independente do tipo)  */}
            {user && (
               <NavLink href="painelJogador" variant="emerald">Perfil</NavLink>
            )}

            {/* Exibido apenas para usuários do tipo GESTOR ou ADMIN */}
            {user && (role === 'manager' || role === 'admin') && (
              <NavLink href="painelGestor" variant="blue">Painel Gestor</NavLink>
            )}

            {/* Exibido estritamente para usuários do tipo ADMIN */}
            {user && role === 'admin' && (
              <NavLink href="painelAdm" variant="emerald">Painel Adm</NavLink>
            )}
            
            {/* Bloco de Login / Identificação do Usuário */}
            <div className="flex items-center gap-4 border-l border-slate-800 pl-8">
              {user ? (
                // Se estiver logado, exibe saudação e botão Sair 
                <div className="flex items-center gap-4">
                  <span className="text-slate-300">
                    Fala, <strong className="text-emerald-400">{user.nome}</strong>!
                  </span>
                  <button 
                    onClick={logout} 
                    className="text-sm font-medium text-red-500 hover:text-red-400 transition-colors"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                // Se não estiver logado, exibe botões de autenticação 
                <>
                  <Button href="/login" variant="ghost">Login</Button> 
                  <Button href="/cadastro" variant="primary">Criar Conta</Button> 
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};