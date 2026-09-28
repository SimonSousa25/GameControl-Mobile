import AsyncStorage from "@react-native-async-storage/async-storage";

import type { AuthResponse } from "@/services/userService";

const SESSION_KEY = "@gamecontrol/session";

/**
 * Persistência da sessão no aparelho. Guardamos o usuário retornado pelo login
 * e o token, para o app continuar logado depois de fechar.
 */
const sessionService = {
  async salvar(session: AuthResponse): Promise<void> {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },

  async carregar(): Promise<AuthResponse | null> {
    try {
      const raw = await AsyncStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as AuthResponse;
      // Sessão corrompida ou de versão antiga do app: ignora.
      if (!parsed?.user?.id || !parsed?.token) return null;
      return parsed;
    } catch {
      return null;
    }
  },

  async limpar(): Promise<void> {
    await AsyncStorage.removeItem(SESSION_KEY);
  },
};

export default sessionService;
