import { apiFetch } from "@/services/api";
import {
  isNotFoundError,
  isTooManyRequestsError,
} from "@/services/apiError";
import userService from "@/services/userService";

jest.mock("@/services/api", () => ({
  apiFetch: jest.fn(),
}));
jest.mock("@/services/authService", () => ({}));

const mockedApiFetch = apiFetch as jest.Mock;

function mockResponse(status: number, body?: unknown) {
  return {
    status,
    ok: status >= 200 && status < 300,
    statusText: `HTTP ${status}`,
    json: async () => body,
  };
}

describe("userService - seguir e pedidos para seguir", () => {
  beforeEach(() => {
    mockedApiFetch.mockReset();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("seguir perfil público (201) resulta em FOLLOWING", async () => {
    mockedApiFetch.mockResolvedValueOnce(mockResponse(201));

    await expect(userService.seguirUsuario("a", "b")).resolves.toBe("FOLLOWING");
    expect(mockedApiFetch).toHaveBeenCalledWith(
      "/users/a/follow/b",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("seguir perfil privado (202) resulta em REQUESTED", async () => {
    mockedApiFetch.mockResolvedValueOnce(mockResponse(202, { status: "REQUESTED" }));

    await expect(userService.seguirUsuario("a", "b")).resolves.toBe("REQUESTED");
  });

  it("pedido recusado há pouco (429) lança erro identificável", async () => {
    mockedApiFetch.mockResolvedValueOnce(mockResponse(429));

    const error = await userService.seguirUsuario("a", "b").catch((e) => e);
    expect(isTooManyRequestsError(error)).toBe(true);
  });

  it("consulta o status de seguir", async () => {
    const dto = { status: "REQUESTED", retryAfterSeconds: 0 };
    mockedApiFetch.mockResolvedValueOnce(mockResponse(200, dto));

    await expect(userService.buscarStatusSeguir("a", "b")).resolves.toEqual(dto);
    expect(mockedApiFetch).toHaveBeenCalledWith("/users/a/follow-status/b");
  });

  it("lista os pedidos recebidos", async () => {
    const pedidos = [{ requesterId: "x", requesterUsername: "xis" }];
    mockedApiFetch.mockResolvedValueOnce(mockResponse(200, pedidos));

    await expect(userService.listarPedidosSeguir("a")).resolves.toEqual(pedidos);
    expect(mockedApiFetch).toHaveBeenCalledWith("/users/a/follow-requests");
  });

  it("aceita e recusa pedidos nas rotas certas", async () => {
    mockedApiFetch.mockResolvedValue(mockResponse(204));

    await userService.aceitarPedidoSeguir("dono", "x");
    await userService.recusarPedidoSeguir("dono", "y");

    expect(mockedApiFetch).toHaveBeenNthCalledWith(
      1,
      "/users/dono/follow-requests/x/accept",
      { method: "POST" },
    );
    expect(mockedApiFetch).toHaveBeenNthCalledWith(
      2,
      "/users/dono/follow-requests/y/reject",
      { method: "POST" },
    );
  });

  it("aceitar pedido que não existe mais (404) lança erro identificável", async () => {
    mockedApiFetch.mockResolvedValueOnce(mockResponse(404));

    const error = await userService.aceitarPedidoSeguir("dono", "x").catch((e) => e);
    expect(isNotFoundError(error)).toBe(true);
  });
});
