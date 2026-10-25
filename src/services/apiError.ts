/** Erro de resposta HTTP da API, com o status para o chamador decidir o que fazer. */
export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** 403 nos posts/playlists = perfil privado visto por quem não segue. */
export function isPrivateProfileError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 403;
}

/** 429 ao pedir para seguir = pedido recusado há pouco, é preciso esperar. */
export function isTooManyRequestsError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 429;
}

/** 404 = o recurso não existe mais (ex.: pedido já cancelado pelo solicitante). */
export function isNotFoundError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404;
}
