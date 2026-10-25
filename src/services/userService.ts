import { apiFetch } from "@/services/api";
import { ApiError } from "@/services/apiError";
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
  /**
   * Perfil privado: posts e playlists só aparecem para quem segue.
   * Ausente (contas antigas) = público.
   */
  isPrivate?: boolean;
}

/** Resultado de seguir: perfil público segue direto; privado fica pendente. */
export type FollowResult = "FOLLOWING" | "REQUESTED";

/** Relação de quem consulta com outro usuário (decide o botão de seguir). */
export type FollowStatus = "FOLLOWING" | "REQUESTED" | "NONE";

export interface FollowStatusDTO {
  status: FollowStatus;
  /** Após uma recusa, segundos até poder pedir de novo (0 = já pode). */
  retryAfterSeconds: number;
}

/** Pedido de seguir pendente recebido por um perfil privado. */
export interface FollowRequestDTO {
  requesterId: string;
  requesterUsername?: string;
  requesterProfilePictureUrl?: string;
  /** ISO-8601 (UTC). */
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

async function responderPedidoSeguir(
  userId: string,
  requesterId: string,
  acao: "accept" | "reject",
): Promise<void> {
  try {
    const response = await apiFetch(
      `/users/${userId}/follow-requests/${requesterId}/${acao}`,
      { method: "POST" },
    );

    if (!response.ok) {
      throw new ApiError(
        response.status,
        `Erro ao responder pedido para seguir: ${response.statusText}`,
      );
    }
  } catch (error) {
    // 404 = o pedido já não existe (cancelado); a tela trata sem alarde.
    if (!(error instanceof ApiError && error.status === 404)) {
      console.error("Erro ao responder pedido para seguir:", error);
    }
    throw error;
  }
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

  /**
   * 201 = passou a seguir; 202 = o perfil é privado e ficou um pedido pendente
   * de aprovação; 429 (ApiError) = pedido recusado há pouco, é preciso esperar.
   */
  async seguirUsuario(
    userId: string,
    targetUserId: string,
  ): Promise<FollowResult> {
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

      if (response.status === 202) return "REQUESTED";

      if (!response.ok) {
        throw new ApiError(
          response.status,
          `Erro ao seguir usuário: ${response.statusText}`,
        );
      }
      return "FOLLOWING";
    } catch (error) {
      // 429 é esperado (tratado na tela); não precisa poluir o console.
      if (!(error instanceof ApiError && error.status === 429)) {
        console.error("Erro ao seguir usuário:", error);
      }
      throw error;
    }
  },

  /** Relação do usuário logado com outro: FOLLOWING, REQUESTED ou NONE. */
  async buscarStatusSeguir(
    userId: string,
    targetUserId: string,
  ): Promise<FollowStatusDTO> {
    try {
      const response = await apiFetch(
        `/users/${userId}/follow-status/${targetUserId}`,
      );

      if (!response.ok) {
        throw new ApiError(
          response.status,
          `Erro ao consultar status de seguir: ${response.statusText}`,
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao consultar status de seguir:", error);
      throw error;
    }
  },

  /** Pedidos para seguir pendentes recebidos pelo usuário (perfil privado). */
  async listarPedidosSeguir(userId: string): Promise<FollowRequestDTO[]> {
    try {
      const response = await apiFetch(`/users/${userId}/follow-requests`);

      if (!response.ok) {
        throw new ApiError(
          response.status,
          `Erro ao listar pedidos para seguir: ${response.statusText}`,
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao listar pedidos para seguir:", error);
      throw error;
    }
  },

  async aceitarPedidoSeguir(
    userId: string,
    requesterId: string,
  ): Promise<void> {
    await responderPedidoSeguir(userId, requesterId, "accept");
  },

  async recusarPedidoSeguir(
    userId: string,
    requesterId: string,
  ): Promise<void> {
    await responderPedidoSeguir(userId, requesterId, "reject");
  },

  /**
   * Também cancela um pedido pendente: o backend remove o pedido quando o
   * solicitante "deixa de seguir" (toque em "Solicitado").
   */
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