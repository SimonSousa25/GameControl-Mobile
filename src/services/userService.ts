import { apiFetch } from "@/services/api";
import authService from "@/services/authService";

/** Quais notificações o usuário quer receber (o backend filtra o envio). */
export interface NotificationPreferences {
  likes: boolean;
  comments: boolean;
  followers: boolean;
}

export interface UserDTO {
  id: string;
  username: string;
  email: string;
  profilePictureUrl?: string;
  bio?: string;
  country?: string;
  /** Ids de quem segue / quem é seguido (arrays do Firestore). */
  followers?: string[];
  following?: string[];
  /** Sempre preenchido pela API; ausente = tudo ativo. */
  notificationPreferences?: NotificationPreferences;
  followersCount?: number;
  followingCount?: number;
  createdAt?: string;
}

interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  bio?: string;
  country?: string;
  /** Formato AAAA-MM-DD. */
  birthDate?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: UserDTO;
}

const userService = {
  async listarUsuarios(): Promise<UserDTO[]> {
    try {
      const response = await apiFetch(`/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao listar usuários: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      throw error;
    }
  },

  // TODO: Testar quando tivermos profile page
  async buscarUsuarioPorId(id: string): Promise<UserDTO> {
    try {
      const response = await apiFetch(`/users/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar usuário: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      throw error;
    }
  },

  /**
   * Cadastro em duas etapas: a conta (e-mail e senha) é criada no Firebase
   * Authentication e só o perfil vai para o backend, que identifica o usuário
   * pelo ID token (nenhum e-mail, senha ou papel é enviado no corpo).
   */
  async cadastrarUsuario(dados: CreateUserRequest): Promise<UserDTO> {
    await authService.criarConta(dados.email, dados.password);

    try {
      const response = await apiFetch(`/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: dados.username,
          bio: dados.bio,
          country: dados.country,
          birthDate: dados.birthDate,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Erro ao criar perfil: HTTP ${response.status} ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      // Sem perfil, a conta ficaria "órfã" e o e-mail não poderia ser reutilizado.
      await authService.removerContaAtual().catch(() => {});
      throw error;
    }
  },

  /**
   * Login direto no Firebase Authentication; depois busca o perfil no backend
   * usando o ID token. Mantém o formato AuthResponse usado pelo restante do app.
   */
  async login(dados: LoginRequest): Promise<AuthResponse> {
    const sessao = await authService.entrar(dados.email, dados.password);

    try {
      const user = await userService.buscarUsuarioPorId(sessao.uid);
      return {
        user,
        token: sessao.token,
        refreshToken: sessao.refreshToken,
        expiresIn: sessao.expiresIn,
      };
    } catch (error) {
      // Autenticou no Firebase mas não achou o perfil: não deixa meio logado.
      await authService.sair().catch(() => {});
      throw error;
    }
  },

  // TODO: Testar quando tivermos att user
  async atualizarUsuario(
    id: string,
    dados: Partial<UserDTO>,
  ): Promise<UserDTO> {
    try {
      const response = await apiFetch(`/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });

      if (!response.ok) {
        throw new Error(`Erro ao atualizar usuário: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      throw error;
    }
  },

  async atualizarFotoPerfil(id: string, base64Image: string): Promise<UserDTO> {
    try {
      const response = await apiFetch(
        `/users/${id}/profile-picture`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ profilePictureUrl: base64Image }),
        },
      );

      if (!response.ok) {
        throw new Error(`Erro ao atualizar foto: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao atualizar foto:", error);
      throw error;
    }
  },

  // TODO: Testar quando tivermos profile page
  async seguirUsuario(userId: string, targetUserId: string): Promise<void> {
    try {
      const response = await apiFetch(
        `/users/${userId}/follow/${targetUserId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Erro ao seguir usuário: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erro ao seguir usuário:", error);
      throw error;
    }
  },

  async deixarDeSeguirUsuario(
    userId: string,
    targetUserId: string,
  ): Promise<void> {
    try {
      const response = await apiFetch(
        `/users/${userId}/follow/${targetUserId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Erro ao deixar de seguir: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erro ao deixar de seguir:", error);
      throw error;
    }
  },
};

export default userService;