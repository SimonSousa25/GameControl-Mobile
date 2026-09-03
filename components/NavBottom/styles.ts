import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#03070D',
    borderTopWidth: 1,
    borderTopColor: '#0A0E15',
    paddingBottom: 12,
    maxWidth: 402,
    margin: 'auto'
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 12,
    backgroundColor: '#03070D',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 4,
  },
  navItemActive: {
    backgroundColor: 'rgba(245, 46, 143, 0.1)',
    borderRadius: 12,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#A0A0A0',
  },
  iconActive: {
    tintColor: '#F52E8F',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: '#A0A0A0',
    fontFamily: 'Orbitron',
  },
  labelActive: {
    color: '#F52E8F',
  },
});
