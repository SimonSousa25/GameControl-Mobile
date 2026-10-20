import { apiFetch } from "@/services/api";

export interface PostCommentDTO {
  id?: string;
  userId?: string;
  username?: string;
  postId?: string;
  content?: string;
  createdAt?: string;
}

export interface CreatePostCommentRequest {
  userId: string;
  postId: string;
  content: string;
}

class PostCommentService {
  async listarComentariosDoPost(postId: string): Promise<PostCommentDTO[]> {
    try {
      const response = await apiFetch(`/postcomments/post/${postId}`);
      if (!response.ok) {
        throw new Error(`Erro ao listar comentários: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao listar comentários do post:", error);
      throw error;
    }
  }

  async criarComentario(dados: CreatePostCommentRequest): Promise<PostCommentDTO> {
    try {
      const response = await apiFetch("/postcomments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      if (!response.ok) {
        throw new Error(`Erro ao criar comentário: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao criar comentário:", error);
      throw error;
    }
  }

  async deletarComentario(id: string): Promise<void> {
    try {
      const response = await apiFetch(`/postcomments/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Erro ao excluir comentário: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erro ao excluir comentário:", error);
      throw error;
    }
  }
}

export default new PostCommentService();
