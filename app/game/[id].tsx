import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";

import BackButton from "@/components/BackButton/BackButton";
import GamePage from "@/pages/GamePage/GamePage";
import Header from "@/components/Header/Header";
import NavBottom from "@/components/NavBottom/NavBottom";
import { View } from "@/components/Themed";

export default function GameDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const handleTabPress = (tabId: string) => {
    if (tabId === "home") {
      router.replace("/home");
      return;
    }
    if (tabId === "catalog") {
      router.push("/catalog");
      return;
    }
    if (tabId === "profile") {
      router.push("/profile");
      return;
    }
    console.log(`${tabId} pressed`);
  };

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/home");
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.headerContainer}>
        <Header
          onSearchPress={() => {
            console.log("Search pressed");
          }}
        />
      </View>
      <View
        style={styles.backRow}
        lightColor="transparent"
        darkColor="transparent"
      >
        <BackButton onPress={goBack} />
      </View>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {id ? (
          <GamePage
            gameId={id}
            onReviewsPress={() => router.push(`/game/${id}/reviews`)}
          />
        ) : null}
      </ScrollView>
      <NavBottom onTabPress={handleTabPress} />
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
  backRow: {
    maxWidth: 402,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 6,
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
