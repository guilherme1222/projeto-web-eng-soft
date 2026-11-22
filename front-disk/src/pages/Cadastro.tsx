import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "../components/atoms/Logo";
import { RegisterForm } from "../components/organisms/RegisterForm";

export default function Cadastro() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center relative overflow-hidden font-sans selection:bg-emerald-500 selection:text-white p-4">
      {/* Background Efeitos (Glow) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Container Principal do Cadastro (um pouco mais largo que o login por causa dos inputs paralelos) */}
      <div className="w-full max-w-lg relative z-10 my-8">
        {/* Logo Centralizada */}
        <Logo variant="centered" className="mb-8" />

        {/* Cartão de Cadastro */}
        <RegisterForm />

        {/* Link para Login */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            Já tem uma conta?{" "}
            <Link
              to="/login"
              className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
            >
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}