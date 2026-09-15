export interface UserDTO {
  id: string;
  username: string;
  email: string;
  profilePictureUrl?: string;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
  createdAt?: string;
}

interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserDTO;
}

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080/api";

const userService = {
  async listarUsuarios(): Promise<UserDTO[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
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
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
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

  // TODO: Testar quando tivermos cadastro
  async cadastrarUsuario(dados: CreateUserRequest): Promise<UserDTO> {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });

      if (!response.ok) {
        throw new Error(`Erro ao cadastrar usuário: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      throw error;
    }
  },

  // TODO: Testar quando tivermos login
  async login(dados: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });

      if (!response.ok) {
        throw new Error(`Erro ao fazer login: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  },

  // TODO: Testar quando tivermos att user
  async atualizarUsuario(
    id: string,
    dados: Partial<UserDTO>,
  ): Promise<UserDTO> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
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
      const response = await fetch(
        `${API_BASE_URL}/users/${id}/profile-picture`,
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
      const response = await fetch(
        `${API_BASE_URL}/users/${userId}/follow/${targetUserId}`,
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
      const response = await fetch(
        `${API_BASE_URL}/users/${userId}/follow/${targetUserId}`,
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
