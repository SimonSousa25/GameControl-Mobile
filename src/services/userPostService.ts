import { apiFetch } from "@/services/api";

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

  async listarPostsDoUsuario(userId: string): Promise<UserPostDTO[]> {
    try {
      const response = await apiFetch(`/posts/user/${userId}`);
      if (!response.ok) {
        throw new Error(
          `Erro ao listar posts do usuário: ${response.statusText}`,
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao listar posts do usuário:", error);
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

  async alternarCurtida(postId: string, userId: string): Promise<void> {
    try {
      const response = await apiFetch(`/posts/${postId}/like/${userId}`, {
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
