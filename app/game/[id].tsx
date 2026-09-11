import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";

import GamePage from "@/components/GamePage/GamePage";
import Header from "@/components/Header/Header";
import NavBottom from "@/components/NavBottom/NavBottom";
import { View } from "@/components/Themed";

export default function GameDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.screenContainer}>
      <View style={styles.headerContainer}>
        <Header
          showBack
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
        {id ? <GamePage gameId={id} /> : null}
      </ScrollView>
      <NavBottom />
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#03070D",
  },
  headerContainer: {
    maxWidth: 402,
    alignSelf: "center",
    width: "100%",
    backgroundColor: "#03070D",
  },
  container: {
    flex: 1,
    maxWidth: 402,
    alignSelf: "center",
    width: "100%",
  },
  contentContainer: {
    paddingBottom: 100,
  },
});
