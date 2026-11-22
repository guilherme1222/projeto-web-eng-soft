import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom' 

// 1. Importando o seu AuthProvider aqui no topo
import { AuthProvider } from './context/AuthContext';

import { Navbar } from './components/organisms/Navbar' 

import Login from './pages/Login.tsx'
import App from './pages/index.tsx'
import PainelAdm from './pages/painelAdm.tsx'
import PainelGestor from './pages/painelGestor.tsx'
import PainelJogador from './pages/painelJogador.tsx'
import OrganizarJogo from './pages/organizarJogo.tsx'
import BuscarJogo from './pages/buscarJogo.tsx'
import Cadastro from './pages/Cadastro.tsx'
import { useAuth } from './context/AuthContext';

const RequireRole = ({
    children,
    roles,
}: {
    children: JSX.Element;
    roles: Array<'player' | 'manager' | 'admin'>;
}) => {
    const { user } = useAuth();
    const role = user?.role || 'player';

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!roles.includes(role)) {
        return <Navigate to={role === 'admin' ? '/painelAdm' : '/painelJogador'} replace />;
    }

    return children;
};

const RootLayout = () => {
  return (
    <div className="bg-slate-950 min-h-screen">
      <Navbar />
      {/* O paddingTop é para o conteúdo não ficar escondido atrás da Navbar fixa */}
      <main className="pt-20"> 
        <Outlet />
      </main>
    </div>
  )
}

// 2. Colocamos o RootLayout como pai de todas as rotas
const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />, // O Layout abraça todo mundo
        children: [
            {
                path: '/', // Esta é a página inicial (Home)
                element: <App />,
            },
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/painelAdm',
                element: <RequireRole roles={['admin']}><PainelAdm /></RequireRole>
            },
            {
                path: '/painelGestor',
                element: <RequireRole roles={['manager', 'admin']}><PainelGestor /></RequireRole>
            },
            {
                path: '/painelJogador',
                element: <RequireRole roles={['player', 'manager', 'admin']}><PainelJogador /></RequireRole>
            },
            {
                path: '/organizarJogo',
                element: <OrganizarJogo />
            },
            {
                path: '/buscarJogo',
                element: <BuscarJogo />
            },
            {
                path: '/cadastro',
                element: <Cadastro />
            }
        ]
    }
]);

// 3. Um único render para o App inteiro!
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        {/* O AuthProvider abraça o RouterProvider. 
            Assim, todas as suas rotas têm acesso aos dados do usuário! */}
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </StrictMode>,
);