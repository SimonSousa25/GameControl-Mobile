import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
    backgroundColor: 'inherit',
  },
  wrapper: {
    position: 'relative',
  },
  slide: {
    height: 340,
  },
  image: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 50,
    paddingBottom: 60,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: 'rgba(10, 14, 21, 0.65)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#F5F7FF',
    fontFamily: 'Orbitron',
  },
  gameTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F52E8F',
    fontFamily: 'Orbitron',
    marginBottom: 8,
    maxWidth: '65%',
  },
  description: {
    fontSize: 12,
    lineHeight: 18,
    color: '#C7CBD1',
    maxWidth: '58%',
    marginBottom: 18,
  },
  ctaButton: {
    alignSelf: 'flex-start',
    borderRadius: 24,
    overflow: 'hidden',
  },
  ctaGradient: {
    paddingHorizontal: 22,
    paddingVertical: 11,
  },
  ctaText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F5F7FF',
    fontFamily: 'Orbitron',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    marginTop: -18,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(10, 14, 21, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(245, 247, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  prevButton: {
    left: 12,
  },
  nextButton: {
    right: 12,
  },
  pagination: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    zIndex: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(245, 247, 255, 0.4)',
  },
  dotActive: {
    width: 18,
    backgroundColor: '#F52E8F',
  },
  loadingContainer: {
    height: 340,
    backgroundColor: '#0A0E15',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
