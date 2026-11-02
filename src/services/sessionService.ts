import AsyncStorage from "@react-native-async-storage/async-storage";

import type { AuthResponse } from "@/services/userService";

const SESSION_KEY = "@gamecontrol/session";

/**
 * Cópia da sessão em memória. O disco (AsyncStorage) só é lido uma vez, na
 * primeira consulta; depois disso `carregar()` responde direto da memória.
 *
 * - `undefined`: ainda não lemos do disco.
 * - `null`: lemos e não há sessão válida (ou ela foi encerrada).
 *
 * Só este módulo escreve em SESSION_KEY, então a memória nunca fica defasada
 * em relação ao disco.
 */
let sessaoEmMemoria: AuthResponse | null | undefined;
// Leituras simultâneas na abertura do app compartilham a mesma leitura de disco.
let leituraEmAndamento: Promise<AuthResponse | null> | null = null;

async function lerDoDisco(): Promise<AuthResponse | null> {
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthResponse;
    // Sessão corrompida ou de versão antiga do app: ignora.
    if (!parsed?.user?.id || !parsed?.token || !parsed?.refreshToken) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Persistência da sessão no aparelho. Guardamos o usuário retornado pelo login
 * e o token, para o app continuar logado depois de fechar.
 */
const sessionService = {
  async salvar(session: AuthResponse): Promise<void> {
    // Atualiza a memória antes do disco: quem consultar agora já vê a sessão nova.
    sessaoEmMemoria = session;
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },

  async carregar(): Promise<AuthResponse | null> {
    if (sessaoEmMemoria !== undefined) return sessaoEmMemoria;

    leituraEmAndamento ??= lerDoDisco().then((sessao) => {
      // Se salvar()/limpar() rodou enquanto líamos, o valor em memória é mais novo.
      if (sessaoEmMemoria === undefined) sessaoEmMemoria = sessao;
      return sessaoEmMemoria;
    });

    try {
      return await leituraEmAndamento;
    } finally {
      leituraEmAndamento = null;
    }
  },

  async limpar(): Promise<void> {
    sessaoEmMemoria = null;
    await AsyncStorage.removeItem(SESSION_KEY);
  },
};

export default sessionService;
