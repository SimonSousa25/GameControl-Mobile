import { fireEvent, render } from "@testing-library/react-native";

import PostCard from "@/components/PostCard/PostCard";
import { UserPostDTO } from "@/services/userPostService";

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
});
