import { StyleSheet } from 'react-native';

export const PRIMARY_BLUE = '#1A237E';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  loaderText: { marginTop: 10 }
});