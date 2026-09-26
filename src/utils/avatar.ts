const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080/api";
const UPLOADS_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

/**
 * A foto de perfil pode vir como data URI (base64), URL completa ou apenas
 * o nome do arquivo salvo pelo backend.
 */
export function getAvatarUrl(picture?: string | null): string | undefined {
  if (!picture) return undefined;
  if (/^(https?:|data:)/.test(picture)) return picture;
  return `${UPLOADS_BASE_URL}/uploads/${picture}`;
}
