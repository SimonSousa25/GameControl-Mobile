import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#03070D",
  },
  // TODO: Apenas um questionamento, não seria melhor trabalharmos com 360?

  // 'A largura padrão mais recomendada para design mobile em CSS e web design responsivo é de 320 a 360 pixels para o limite mínimo.'

  // Lá no trabalho a gnt trabalha usando 360, em alguns dispositivos menores (se formos testar usando eles) pode parecer bugado se usarmos um width maior (Vamos perguntar qual a largura de tela do celular da professora kkkkkk)
  container: {
    flex: 1,
    maxWidth: 402, // Largura máxima para parecer mobile
    alignSelf: "center",
    width: "100%",
  },
  headerContainer: {
    maxWidth: 402, // Largura máxima para parecer mobile
    alignSelf: "center",
    width: "100%",
    backgroundColor: "#03070D",
  },
  contentContainer: {
    paddingTop: 16,
    paddingBottom: 70,
  },
});
