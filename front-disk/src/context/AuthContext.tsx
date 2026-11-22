import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(() => {
    try {
      // Tenta pegar o user do localStorage
      const saved = localStorage.getItem("@DiskPelada:user");
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      // Se o JSON estiver quebrado, ele limpa sozinho e não trava o site!
      localStorage.removeItem("@DiskPelada:user");
      return null;
    }
  });

  const login = (userData: any) => {
    setUser(userData);
    localStorage.setItem("@DiskPelada:user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("@DiskPelada:user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para facilitar o uso em qualquer arquivo
export const useAuth = () => useContext(AuthContext);