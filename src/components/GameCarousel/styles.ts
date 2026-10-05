import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingLeft: 20,
    gap: 12,
  },
  titleGradientBar: {
    width: 4,
    height: 24,
    borderRadius: 2,
  },
  title: {
    fontSize: 12,
    color: '#F5F7FF',
    fontFamily: 'OrbitronBold',
    flex: 1,
  },
  viewAll: {
    fontSize: 7,
    color: '#F52E8F',
    fontFamily: 'OrbitronBold',
    paddingRight: 20,
  },
  carouselContainer: {
    paddingLeft: 20,
  },
  gameCard: {
    marginRight: 12,
    width: 72,
  },
  gameImage: {
    width: 72,
    height: 120,
    borderRadius: 9,
    marginBottom: 8,
    backgroundColor: '#0A0E15',
  },
  gameTitle: {
    fontSize: 12,
    fontFamily: 'OrbitronMedium',
    lineHeight: 16,
  },
  loadingContainer: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
