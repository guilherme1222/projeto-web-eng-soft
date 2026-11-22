import { Logo } from "../components/atoms/Logo";
import { LoginForm } from "../components/organisms/LoginForm";

export default function Login() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center relative overflow-hidden font-sans selection:bg-emerald-500 selection:text-white p-4">
      {/* Background Efeitos (Glow) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Container Principal do Login */}
      <div className="w-full max-w-md relative z-10">
        {/* Logo Centralizada */}
        <Logo variant="centered" className="mb-8" />

        {/* Cartão de Login */}
        <LoginForm />

        {/* Link para Cadastro */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            Ainda não tem conta?{" "}
            <a
              href="/cadastro"
              className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
            >
              Cadastre-se grátis
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
