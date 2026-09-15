const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080/api";

export interface PlaylistDTO {
  id: string;
  nome: string;
  descricao?: string;
  usuarioId: string;
  jogosIds: string[];
  syncedAt?: string;
}

export interface CreatePlaylistRequest {
  nome: string;
  descricao?: string;
  jogosIds?: string[];
}

class PlaylistService {
  async criarPlaylist(
    usuarioId: string,
    dados: CreatePlaylistRequest,
  ): Promise<PlaylistDTO> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/usuario-playlists?usuarioId=${encodeURIComponent(usuarioId)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados),
        },
      );
      if (!response.ok) {
        throw new Error(`Erro ao criar playlist: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao criar playlist:", error);
      throw error;
    }
  }

  async atualizarPlaylist(
    id: string,
    dados: PlaylistDTO,
  ): Promise<PlaylistDTO> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuario-playlists/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      if (!response.ok) {
        throw new Error(`Erro ao atualizar playlist: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao atualizar playlist:", error);
      throw error;
    }
  }

  async deletarPlaylist(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuario-playlists/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Erro ao excluir playlist: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erro ao excluir playlist:", error);
      throw error;
    }
  }

  async listarPlaylistsDoUsuario(usuarioId: string): Promise<PlaylistDTO[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/usuario-playlists/usuario/${usuarioId}`,
      );
      if (!response.ok) {
        throw new Error(`Erro ao listar playlists: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao listar playlists do usuário:", error);
      throw error;
    }
  }

  async buscarPlaylistPorId(id: string): Promise<PlaylistDTO | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuario-playlists/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Erro ao buscar playlist: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar playlist por ID:", error);
      throw error;
    }
  }

  async adicionarJogo(playlistId: string, jogoId: string): Promise<PlaylistDTO> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/usuario-playlists/${playlistId}/jogos/${jogoId}`,
        { method: "POST" },
      );
      if (!response.ok) {
        throw new Error(
          `Erro ao adicionar jogo à playlist: ${response.statusText}`,
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao adicionar jogo à playlist:", error);
      throw error;
    }
  }

  async removerJogoDaPlaylist(
    playlistId: string,
    jogoId: string,
  ): Promise<PlaylistDTO> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/usuario-playlists/${playlistId}/jogos/${jogoId}`,
        { method: "DELETE" },
      );
      if (!response.ok) {
        throw new Error(
          `Erro ao remover jogo da playlist: ${response.statusText}`,
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao remover jogo da playlist:", error);
      throw error;
    }
  }
}

export default new PlaylistService();
