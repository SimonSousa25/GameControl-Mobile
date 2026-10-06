import sessionService from "@/services/sessionService";
import type { AuthResponse } from "@/services/userService";

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080/api";

let ouvinteSessao: ((sessao: AuthResponse | null) => void) | null = null;
let renovacaoEmAndamento: Promise<AuthResponse | null> | null = null;

export function definirOuvinteSessao(
  ouvinte: ((sessao: AuthResponse | null) => void) | null,
) {
  ouvinteSessao = ouvinte;
}

async function renovarSessao(): Promise<AuthResponse | null> {
  const atual = await sessionService.carregar();
  if (!atual?.refreshToken) return null;
  try {
    const response = await fetch(`${API_BASE_URL}/users/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: atual.refreshToken }),
    });
    if (!response.ok) return null;
    const nova: AuthResponse = await response.json();
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
  const response = await fetch(
    `${API_BASE_URL}${path}`,
    comToken(init, sessao?.token),
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
