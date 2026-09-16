import { useState } from "react";
import { ScrollView } from "react-native";

import GameCarousel from "@/components/GameCarousel/GameCarousel";
import GameOfWeek from "@/components/GameOfWeek/GameOfWeek";
import Header from "@/components/Header/Header";
import HeroBanner from "@/components/HeroBanner/HeroBanner";
import NavBottom from "@/components/NavBottom/NavBottom";
import PlayersHighlight from "@/components/PlayersHighlight/PlayersHighlight";
import { View } from "@/components/Themed";

import { styles } from "./styles";

export interface HomeProps {
  onSearchSubmit?: (searchTerm: string) => void;
  onFeaturedGamePress?: (gameId: string) => void;
  onGamePress?: (gameId: string) => void;
  onViewAllFeaturedPress?: () => void;
  onUserPress?: (userId: string) => void;
  onViewAllPlayersPress?: () => void;
  onTabPress?: (tabId: string) => void;
}

export function Home({
  onSearchSubmit,
  onFeaturedGamePress,
  onGamePress,
  onViewAllFeaturedPress,
  onUserPress,
  onViewAllPlayersPress,
  onTabPress,
}: HomeProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchSubmit = () => {
    onSearchSubmit?.(searchTerm.trim());
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchTerm("");
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.headerContainer}>
        <Header
          variant={isSearchOpen ? "search" : "icon"}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchPress={() => setIsSearchOpen(true)}
          onSearchSubmit={handleSearchSubmit}
          onClose={closeSearch}
          autoFocusSearch={isSearchOpen}
        />
      </View>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <HeroBanner onGamePress={onFeaturedGamePress} />

        <GameCarousel
          title="Em destaque"
          fetchRecent={true}
          onGamePress={onGamePress}
          onViewAllPress={onViewAllFeaturedPress}
        />

        <GameOfWeek onGamePress={onGamePress} />

        <PlayersHighlight
          onUserPress={onUserPress}
          onViewAllPress={onViewAllPlayersPress}
        />
      </ScrollView>
      <NavBottom activeTab="home" onTabPress={onTabPress} />
    </View>
  );
}

export default Home;
