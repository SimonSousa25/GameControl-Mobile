import { apiFetch } from "@/services/api";
import { ApiError } from "@/services/apiError";

export interface UserPostDTO {
  id?: string;
  userId?: string;
  username?: string;
  text?: string;
  likedUserIds?: string[];
  likesCount?: number;
  commentIds?: string[];
  createdAt?: string;
  profilePictureUrl?: string;
}

export interface CreateUserPostRequest {
  userId: string;
  text: string;
}

class UserPostService {
  async listarTodosPosts(): Promise<UserPostDTO[]> {
    try {
      const response = await apiFetch("/posts");
      if (!response.ok) {
        throw new Error(`Erro ao listar posts: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao listar posts:", error);
      throw error;
    }
  }

  /**
   * Perfil privado visto por quem não segue: o backend responde 403 e este
   * método lança um ApiError com status 403 (ver isPrivateProfileError).
   */
  async listarPostsDoUsuario(userId: string): Promise<UserPostDTO[]> {
    try {
      const response = await apiFetch(`/posts/user/${userId}`);
      if (!response.ok) {
        const mensagem = `Erro ao listar posts do usuário: ${response.statusText}`;
        throw response.status === 403
          ? new ApiError(403, mensagem)
          : new Error(mensagem);
      }
      return await response.json();
    } catch (error) {
      // 403 é esperado em perfil privado (a tela mostra o aviso).
      if (!(error instanceof ApiError && error.status === 403)) {
        console.error("Erro ao listar posts do usuário:", error);
      }
      throw error;
    }
  }

  async criarPost(dados: CreateUserPostRequest): Promise<UserPostDTO> {
    try {
      const response = await apiFetch("/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      if (!response.ok) {
        throw new Error(`Erro ao criar post: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao criar post:", error);
      throw error;
    }
  }

  /** Quem curte é o usuário do token; o backend não aceita um userId do cliente. */
  async alternarCurtida(postId: string): Promise<void> {
    try {
      const response = await apiFetch(`/posts/${postId}/like`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error(`Erro ao curtir post: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erro ao curtir post:", error);
      throw error;
    }
  }

  async deletarPost(id: string): Promise<void> {
    try {
      const response = await apiFetch(`/posts/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error(`Erro ao excluir post: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erro ao excluir post:", error);
      throw error;
    }
  }
}

export default new UserPostService();
