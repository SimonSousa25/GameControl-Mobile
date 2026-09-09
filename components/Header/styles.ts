import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'inherit',
    paddingHorizontal: 20,
    paddingVertical: 6,
    gap: 12,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'inherit',
  },
  logoIcon: {
    width: 38,
    height: 32,
    resizeMode: 'contain',
  },
  logoText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F5F7FF',
    fontFamily: 'OrbitronBold',
  },
  logoTextAccent: {
    color: '#F52E8F',
  },
  searchButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F52E8F',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0A0E15',
    borderRadius: 20,
    paddingLeft: 16,
    paddingRight: 14,
    height: 40,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#F5F7FF',
  },
});
