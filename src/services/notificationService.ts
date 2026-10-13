import { apiFetch } from "@/services/api";

export type NotificationType = "NEW_FOLLOWER" | "POST_LIKED" | "POST_COMMENTED";

export interface NotificationDTO {
  id: string;
  recipientId: string;
  actorId: string;
  actorUsername: string;
  /** Post relacionado (curtida/comentário). Ausente em NEW_FOLLOWER. */
  postId?: string;
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: string;
}

class NotificationService {
  async listarDoUsuario(userId: string): Promise<NotificationDTO[]> {
    try {
      const response = await apiFetch(`/notifications/user/${userId}`);
      if (!response.ok) {
        throw new Error(`Erro ao listar notificações: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao listar notificações:", error);
      throw error;
    }
  }

  /**
   * Chamado por polling: não usa console.error para não abrir o overlay de
   * erro a cada ciclo quando a API está fora do ar. Quem chama trata a falha.
   */
  async contarNaoLidas(userId: string): Promise<number> {
    const response = await apiFetch(
      `/notifications/user/${userId}/unread-count`,
    );
    if (!response.ok) {
      throw new Error(
        `Erro ao contar notificações: HTTP ${response.status} ${response.statusText}`,
      );
    }
    const data: { count: number } = await response.json();
    return data.count;
  }

  async marcarComoLida(id: string): Promise<void> {
    try {
      const response = await apiFetch(`/notifications/${id}/read`, {
        method: "PATCH",
      });
      if (!response.ok) {
        throw new Error(`Erro ao marcar notificação: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
      throw error;
    }
  }

  async marcarTodasComoLidas(userId: string): Promise<void> {
    try {
      const response = await apiFetch(
        `/notifications/user/${userId}/read-all`,
        { method: "PATCH" },
      );
      if (!response.ok) {
        throw new Error(`Erro ao marcar notificações: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erro ao marcar todas as notificações como lidas:", error);
      throw error;
    }
  }

  async registrarTokenDoAparelho(
    userId: string,
    token: string,
    platform: string,
  ): Promise<void> {
    try {
      const response = await apiFetch(`/notifications/device-tokens`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, token, platform }),
      });
      if (!response.ok) {
        throw new Error(`Erro ao registrar token: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erro ao registrar token do aparelho:", error);
      throw error;
    }
  }

  async removerTokenDoAparelho(token: string): Promise<void> {
    try {
      const response = await apiFetch(
        `/notifications/device-tokens?token=${encodeURIComponent(token)}`,
        { method: "DELETE" },
      );
      if (!response.ok) {
        throw new Error(`Erro ao remover token: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erro ao remover token do aparelho:", error);
      throw error;
    }
  }
}

export default new NotificationService();