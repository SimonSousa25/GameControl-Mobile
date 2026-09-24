import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import sessionService from "@/services/sessionService";
import type { AuthResponse, UserDTO } from "@/services/userService";

interface AuthContextValue {
  /** Usuário logado (null quando não há sessão). */
  user: UserDTO | null;
  token: string | null;
  /** true enquanto a sessão salva ainda está sendo lida do aparelho. */
  loading: boolean;
  signIn: (auth: AuthResponse) => Promise<void>;
  signOut: () => Promise<void>;
  /** Atualiza o usuário guardado (ex.: após editar perfil ou recarregar da API). */
  updateUser: (user: UserDTO) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  // Espelho da sessão para callbacks estáveis (evita re-renders/re-fetch em cascata).
  const sessionRef = useRef<AuthResponse | null>(null);

  const applySession = useCallback((next: AuthResponse | null) => {
    sessionRef.current = next;
    setSession(next);
  }, []);

  useEffect(() => {
    let cancelled = false;
    sessionService.carregar().then((saved) => {
      if (cancelled) return;
      applySession(saved);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [applySession]);

  const signIn = useCallback(async (auth: AuthResponse) => {
    await sessionService.salvar(auth);
    applySession(auth);
  }, [applySession]);

  const signOut = useCallback(async () => {
    await sessionService.limpar();
    applySession(null);
  }, [applySession]);

  const updateUser = useCallback(
    async (user: UserDTO) => {
      const current = sessionRef.current;
      if (!current) return;
      const next = { ...current, user };
      await sessionService.salvar(next);
      applySession(next);
    },
    [applySession],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      loading,
      signIn,
      signOut,
      updateUser,
    }),
    [session, loading, signIn, signOut, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>.");
  }
  return ctx;
}
