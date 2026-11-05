import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Keyboard, KeyboardAvoidingView, Modal, ScrollView } from "react-native";

import PostCommentsModal from "@/components/modals/PostCommentsModal/PostCommentsModal";
import postCommentService from "@/services/postCommentService";

// Ícones carregam fontes de forma assíncrona e geram avisos de act() nos testes.
jest.mock("@expo/vector-icons", () => ({ Ionicons: "Ionicons" }));

// O módulo nativo do AsyncStorage não existe no Jest; o Text do app depende dele.
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

jest.mock("@/services/postCommentService", () => ({
  __esModule: true,
  default: {
    listarComentariosDoPost: jest.fn(),
    criarComentario: jest.fn(),
    editarComentario: jest.fn(),
    deletarComentario: jest.fn(),
  },
}));

const mockService = postCommentService as jest.Mocked<typeof postCommentService>;

const comments = [
  {
    id: "c1",
    userId: "outro",
    username: "Ana",
    content: "Comentário da Ana",
    createdAt: "2026-01-01T10:00:00",
  },
  {
    id: "c2",
    userId: "eu",
    username: "Eu",
    content: "Meu comentário",
    createdAt: "2026-01-01T11:00:00",
  },
];

async function renderOpen() {
  mockService.listarComentariosDoPost.mockResolvedValue(comments);
  const utils = render(
    <PostCommentsModal visible postId="p1" userId="eu" onClose={jest.fn()} />,
  );
  await utils.findByText("Meu comentário");
  return utils;
}

function startEditing(utils: Awaited<ReturnType<typeof renderOpen>>) {
  fireEvent.press(utils.getByLabelText("Opções do comentário"));
  fireEvent.press(utils.getByLabelText("Editar comentário"));
}

describe("PostCommentsModal e o teclado", () => {
  beforeEach(() => {
    jest.spyOn(Keyboard, "dismiss").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it("desvia do teclado e ocupa a tela toda no Android", async () => {
    const utils = await renderOpen();

    expect(utils.UNSAFE_getByType(KeyboardAvoidingView).props.behavior).toBe("padding");
    const modal = utils.UNSAFE_getByType(Modal);
    expect(modal.props.statusBarTranslucent).toBe(true);
    expect(modal.props.navigationBarTranslucent).toBe(true);
  });

  it("não exige dois toques em Salvar/Cancelar com o teclado aberto", async () => {
    const utils = await renderOpen();

    expect(utils.UNSAFE_getByType(ScrollView).props.keyboardShouldPersistTaps).toBe(
      "handled",
    );
  });

  it("rola a lista até o comentário que está sendo editado", async () => {
    const utils = await renderOpen();
    const list = utils.UNSAFE_getByType(ScrollView).instance;
    const scrollTo = jest.spyOn(list, "scrollTo");

    // O comentário c2 está 200px abaixo do topo do conteúdo da lista.
    fireEvent(utils.getByTestId("comment-row-c2"), "layout", {
      nativeEvent: { layout: { x: 0, y: 200, width: 300, height: 80 } },
    });
    startEditing(utils);

    await waitFor(() =>
      expect(scrollTo).toHaveBeenCalledWith({ y: 196, animated: true }),
    );
  });

  it("rola de novo quando a lista é redimensionada (teclado abrindo)", async () => {
    const utils = await renderOpen();
    const scrollTo = jest.spyOn(utils.UNSAFE_getByType(ScrollView).instance, "scrollTo");

    fireEvent(utils.getByTestId("comment-row-c2"), "layout", {
      nativeEvent: { layout: { x: 0, y: 200, width: 300, height: 80 } },
    });
    startEditing(utils);
    await waitFor(() => expect(scrollTo).toHaveBeenCalled());
    scrollTo.mockClear();

    // O card encolhe quando o teclado aparece, e a lista recebe um novo layout.
    fireEvent(utils.UNSAFE_getByType(ScrollView), "layout", {
      nativeEvent: { layout: { x: 0, y: 0, width: 300, height: 150 } },
    });

    expect(scrollTo).toHaveBeenCalledWith({ y: 196, animated: true });
  });

  it("fecha o teclado ao cancelar a edição do comentário", async () => {
    const utils = await renderOpen();
    startEditing(utils);

    fireEvent.press(utils.getByLabelText("Cancelar edição"));

    expect(Keyboard.dismiss).toHaveBeenCalled();
  });

  it("salva o comentário editado e fecha o teclado", async () => {
    mockService.editarComentario.mockResolvedValue({
      ...comments[1],
      content: "Texto novo",
      edited: true,
    });
    const utils = await renderOpen();
    startEditing(utils);

    fireEvent.changeText(utils.getByDisplayValue("Meu comentário"), "Texto novo");
    fireEvent.press(utils.getByLabelText("Salvar edição"));

    await waitFor(() =>
      expect(mockService.editarComentario).toHaveBeenCalledWith("c2", "Texto novo"),
    );
    await waitFor(() => expect(Keyboard.dismiss).toHaveBeenCalled());
    expect(await utils.findByText(/Texto novo/)).toBeTruthy();
  });
});
