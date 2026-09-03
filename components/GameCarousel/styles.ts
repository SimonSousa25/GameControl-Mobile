import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
    backgroundColor: 'inherit'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'inherit',
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
    fontSize: 18,
    fontWeight: '700',
    color: '#F5F7FF',
    fontFamily: 'Orbitron',
    flex: 1,
  },
  viewAll: {
    fontSize: 7,
    color: '#F52E8F',
    fontWeight: '700',
    fontFamily: 'Orbitron',
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
    backgroundColor: '#f0f0f0',
  },
  gameTitle: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  loadingContainer: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
