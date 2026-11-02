import AsyncStorage from "@react-native-async-storage/async-storage";

import type { AuthResponse } from "@/services/userService";

jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(() => Promise.resolve()),
    removeItem: jest.fn(() => Promise.resolve()),
  },
}));

const storage = AsyncStorage as unknown as {
  getItem: jest.Mock;
  setItem: jest.Mock;
  removeItem: jest.Mock;
};

const sessao = {
  user: { id: "u1" },
  token: "t1",
  refreshToken: "r1",
} as unknown as AuthResponse;

// O cache é estado do módulo: cada teste carrega o módulo do zero.
function carregarModulo() {
  let servico!: typeof import("@/services/sessionService").default;
  jest.isolateModules(() => {
    servico = require("@/services/sessionService").default;
  });
  return servico;
}

describe("sessionService (cache em memória)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("lê o disco só na primeira consulta", async () => {
    storage.getItem.mockResolvedValue(JSON.stringify(sessao));
    const servico = carregarModulo();

    expect(await servico.carregar()).toEqual(sessao);
    expect(await servico.carregar()).toEqual(sessao);
    expect(await servico.carregar()).toEqual(sessao);

    expect(storage.getItem).toHaveBeenCalledTimes(1);
  });

  it("consultas simultâneas na abertura compartilham uma única leitura", async () => {
    storage.getItem.mockResolvedValue(JSON.stringify(sessao));
    const servico = carregarModulo();

    const [a, b, c] = await Promise.all([
      servico.carregar(),
      servico.carregar(),
      servico.carregar(),
    ]);

    expect(a).toEqual(sessao);
    expect(b).toEqual(sessao);
    expect(c).toEqual(sessao);
    expect(storage.getItem).toHaveBeenCalledTimes(1);
  });

  it("salvar atualiza a memória sem reler o disco", async () => {
    storage.getItem.mockResolvedValue(null);
    const servico = carregarModulo();

    await servico.salvar(sessao);

    expect(await servico.carregar()).toEqual(sessao);
    expect(storage.setItem).toHaveBeenCalledTimes(1);
    expect(storage.getItem).not.toHaveBeenCalled();
  });

  it("limpar zera a memória e não volta a ler o disco", async () => {
    storage.getItem.mockResolvedValue(JSON.stringify(sessao));
    const servico = carregarModulo();
    await servico.carregar();

    await servico.limpar();

    expect(await servico.carregar()).toBeNull();
    expect(storage.removeItem).toHaveBeenCalledTimes(1);
    expect(storage.getItem).toHaveBeenCalledTimes(1);
  });

  it("ignora sessão corrompida e a lembra como vazia", async () => {
    storage.getItem.mockResolvedValue("{json quebrado");
    const servico = carregarModulo();

    expect(await servico.carregar()).toBeNull();
    expect(await servico.carregar()).toBeNull();
    expect(storage.getItem).toHaveBeenCalledTimes(1);
  });
});
