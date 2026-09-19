import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "expo-router/react-navigation";
import { FontDisplay, useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/components/useColorScheme";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Os arquivos locais evitam depender do carregamento do pacote de fontes.
  const [loaded, error] = useFonts({
    Orbitron: {
      uri: require("../assets/fonts/Orbitron.ttf"),
      display: FontDisplay.BLOCK,
    },
    OrbitronMedium: {
      uri: require("../assets/fonts/OrbitronMedium.ttf"),
      display: FontDisplay.BLOCK,
    },
    OrbitronBold: {
      uri: require("../assets/fonts/OrbitronBold.ttf"),
      display: FontDisplay.BLOCK,
    },
    OrbitronBlack: {
      uri: require("../assets/fonts/OrbitronBlack.ttf"),
      display: FontDisplay.BLOCK,
    },
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Mantém o splash até o primeiro layout já estar usando a Orbitron.
  const handleRootLayout = useCallback(() => {
    if (loaded) {
      void SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <View onLayout={handleRootLayout} style={styles.root}>
      <RootLayoutNav />
    </View>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="catalog" options={{ headerShown: false }} />
        <Stack.Screen name="game/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="playlists" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#03070D",
  },
});
