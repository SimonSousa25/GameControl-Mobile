import { auth, obterIdToken } from "@/services/firebase";
import sessionService from "@/services/sessionService";
import type { AuthResponse } from "@/services/userService";

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080/api";

let ouvinteSessao: ((sessao: AuthResponse | null) => void) | null = null;
let renovacaoEmAndamento: Promise<AuthResponse | null> | null = null;
let antesDeSair: (() => Promise<void>) | null = null;

export function definirOuvinteSessao(
  ouvinte: ((sessao: AuthResponse | null) => void) | null,
) {
  ouvinteSessao = ouvinte;
}

/**
 * Permite que outra parte do app (ex.: notificações push) faça uma limpeza que
 * ainda precisa do login válido, como remover o token do aparelho no logout.
 */
export function definirAntesDeSair(acao: (() => Promise<void>) | null) {
  antesDeSair = acao;
}

/** Executada pelo logout antes de encerrar a sessão; nunca trava por mais de 3 s. */
export async function executarAntesDeSair(): Promise<void> {
  if (!antesDeSair) return;
  const limite = new Promise<void>((resolve) => setTimeout(resolve, 3000));
  await Promise.race([antesDeSair().catch(() => {}), limite]);
}

/**
 * Pede um ID token novo ao Firebase (a renovação é do SDK) e atualiza a sessão
 * salva. Retorna null se não houver usuário autenticado no Firebase.
 */
async function renovarSessao(): Promise<AuthResponse | null> {
  const atual = await sessionService.carregar();
  if (!atual) return null;
  try {
    const token = await obterIdToken(true);
    if (!token) return null;
    const nova: AuthResponse = {
      ...atual,
      token,
      refreshToken: auth.currentUser?.refreshToken ?? atual.refreshToken,
    };
    await sessionService.salvar(nova);
    return nova;
  } catch {
    return null;
  }
}

function comToken(init: RequestInit, token?: string): RequestInit {
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return { ...init, headers };
}

export async function apiFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const sessao = await sessionService.carregar();
  // O token vem do Firebase (renovado automaticamente quando necessário).
  const token = await obterIdToken();
  const response = await fetch(
    `${API_BASE_URL}${path}`,
    comToken(init, token ?? undefined),
  );
  if (response.status !== 401 || !sessao) return response;

  renovacaoEmAndamento ??= renovarSessao().finally(() => {
    renovacaoEmAndamento = null;
  });
  const nova = await renovacaoEmAndamento;

  if (!nova) {
    await sessionService.limpar();
    ouvinteSessao?.(null);
    return response;
  }

  ouvinteSessao?.(nova);
  return fetch(`${API_BASE_URL}${path}`, comToken(init, nova.token));
}