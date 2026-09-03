import { ScrollView, StyleSheet } from "react-native";

import GameCarousel from "@/components/GameCarousel/GameCarousel";
import GameOfWeek from "@/components/GameOfWeek/GameOfWeek";
import NavBottom from "@/components/NavBottom/NavBottom";
import PlayersHighlight from "@/components/PlayersHighlight/PlayersHighlight";
import { View } from "@/components/Themed";

// TODO: Separar essa home em /pages
// TODO: Tirar esses Tab One e Tab two, que doidera é essa? kkkk
// TODO: Colocar components e services dentro de /app
export default function HomeScreen() {
  return (
    <View style={styles.screenContainer}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* TODO: Galera aqui os clicks estão com logs, vou deixar com log mesmo e quando começarmos a fazer navegação trocamos aqui. */}
        <GameCarousel
          title="Em destaque"
          fetchRecent={true}
          onGamePress={(gameId) => {
            console.log("Game pressed:", gameId);
          }}
          onViewAllPress={() => {
            console.log("View all pressed");
          }}
        />

        <GameOfWeek
          onGamePress={(gameId) => {
            console.log("Game pressed:", gameId);
          }}
        />

        <PlayersHighlight
          onUserPress={(userId) => {
            console.log("User pressed:", userId);
          }}
          onViewAllPress={() => {
            console.log("View all players pressed");
          }}
        />
      </ScrollView>
      <NavBottom activeTab="home" />
    </View>
  );
}

const styles = StyleSheet.create({
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
  contentContainer: {
    paddingTop: 16,
    paddingBottom: 100,
  },
});
