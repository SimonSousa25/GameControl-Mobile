import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Keyboard } from "react-native";

import PostCard from "@/components/PostCard/PostCard";
import { UserPostDTO } from "@/services/userPostService";

// Ícones carregam fontes de forma assíncrona e geram avisos de act() nos testes.
jest.mock("@expo/vector-icons", () => ({ Ionicons: "Ionicons" }));

// O módulo nativo do AsyncStorage não existe no Jest; o Text do app depende dele.
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

// Simula estar dentro de um KeyboardAwareScrollView.
const mockScrollToView = jest.fn();
jest.mock("@/components/KeyboardAwareScrollView/KeyboardAwareScrollView", () => ({
  useKeyboardScroll: () => ({ scrollToView: mockScrollToView }),
}));

const basePost: UserPostDTO = {
  id: "1",
  userId: "u1",
  username: "Jogador1",
  text: "Meu primeiro post!",
  likedUserIds: [],
  likesCount: 2,
  commentIds: ["c1", "c2", "c3"],
  createdAt: "2026-01-10T12:00:00",
};

describe("PostCard", () => {
  it("exibe usuário, texto e contadores de curtidas/comentários", () => {
    const { getByText } = render(
      <PostCard post={basePost} colorIndex={0} likedByMe={false} />,
    );

    expect(getByText("Jogador1")).toBeTruthy();
    expect(getByText("Meu primeiro post!")).toBeTruthy();
    expect(getByText("3")).toBeTruthy();
    expect(getByText("2")).toBeTruthy();
  });

  it("mostra a tag VOCÊ apenas quando isOwnPost é true", () => {
    const { queryByText, rerender } = render(
      <PostCard post={basePost} colorIndex={0} likedByMe={false} />,
    );
    expect(queryByText("VOCÊ")).toBeNull();

    rerender(
      <PostCard post={basePost} colorIndex={0} likedByMe={false} isOwnPost />,
    );
    expect(queryByText("VOCÊ")).toBeTruthy();
  });

  it("chama onLikePress ao tocar no botão de curtir", () => {
    const onLikePress = jest.fn();
    const { getByLabelText } = render(
      <PostCard
        post={basePost}
        colorIndex={0}
        likedByMe={false}
        onLikePress={onLikePress}
      />,
    );

    fireEvent.press(getByLabelText("Curtir post"));

    expect(onLikePress).toHaveBeenCalledTimes(1);
  });

  it("chama onUserPress ao tocar no cabeçalho", () => {
    const onUserPress = jest.fn();
    const { getByText } = render(
      <PostCard
        post={basePost}
        colorIndex={0}
        likedByMe={false}
        onUserPress={onUserPress}
      />,
    );

    fireEvent.press(getByText("Jogador1"));

    expect(onUserPress).toHaveBeenCalledTimes(1);
  });

  describe("edição", () => {
    const renderEditing = (onEditSubmit = jest.fn()) => {
      const utils = render(
        <PostCard
          post={basePost}
          colorIndex={0}
          likedByMe={false}
          isOwnPost
          onEditSubmit={onEditSubmit}
        />,
      );
      fireEvent.press(utils.getByLabelText("Opções do post"));
      fireEvent.press(utils.getByLabelText("Editar post"));
      return utils;
    };

    beforeEach(() => {
      mockScrollToView.mockClear();
      jest.spyOn(Keyboard, "dismiss").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("pede ao scroll para trazer o editor acima do teclado ao começar a editar", () => {
      renderEditing();

      expect(mockScrollToView).toHaveBeenCalled();
    });

    it("pede de novo quando o campo de edição recebe foco", () => {
      const { getByDisplayValue } = renderEditing();
      mockScrollToView.mockClear();

      fireEvent(getByDisplayValue("Meu primeiro post!"), "focus");

      expect(mockScrollToView).toHaveBeenCalledTimes(1);
    });

    it("fecha o teclado ao cancelar a edição", () => {
      const { getByLabelText, queryByDisplayValue } = renderEditing();

      fireEvent.press(getByLabelText("Cancelar edição"));

      expect(Keyboard.dismiss).toHaveBeenCalled();
      expect(queryByDisplayValue("Meu primeiro post!")).toBeNull();
    });

    it("salva o texto editado e fecha o teclado", async () => {
      const onEditSubmit = jest.fn().mockResolvedValue(undefined);
      const { getByLabelText, getByDisplayValue } = renderEditing(onEditSubmit);

      fireEvent.changeText(getByDisplayValue("Meu primeiro post!"), "  Texto novo  ");
      fireEvent.press(getByLabelText("Salvar edição"));

      await waitFor(() => expect(onEditSubmit).toHaveBeenCalledWith("Texto novo"));
      await waitFor(() => expect(Keyboard.dismiss).toHaveBeenCalled());
    });
  });
});
