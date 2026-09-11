import { useRouter } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";

import Header from "@/components/Header/Header";
import HeroBanner from "@/components/HeroBanner/HeroBanner";
import GameCarousel from "@/components/GameCarousel/GameCarousel";
import GameOfWeek from "@/components/GameOfWeek/GameOfWeek";
import PlayersHighlight from "@/components/PlayersHighlight/PlayersHighlight";
import NavBottom from "@/components/NavBottom/NavBottom";
import { View } from "@/components/Themed";

// TODO: Separar essa home em /pages
// TODO: Colocar components e services dentro de /app
export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.screenContainer}>
      <View style={styles.headerContainer}>
        <Header
          onSearchPress={() => {
            console.log("Search pressed");
          }}
        />
      </View>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <HeroBanner
          onGamePress={(gameId) => {
            console.log("Game pressed:", gameId);
          }}
        />

        <GameCarousel
          title="Em destaque"
          fetchRecent={true}
          onGamePress={(gameId) => {
            router.push(`/game/${gameId}`);
          }}
          onViewAllPress={() => {
            console.log("View all pressed");
          }}
        />

        <GameOfWeek
          onGamePress={(gameId) => {
            router.push(`/game/${gameId}`);
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
