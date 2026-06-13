import { StyleSheet } from 'react-native';

export const PRIMARY_BLUE = '#1A237E';
export const BACKGROUND_LIGHT = '#f5f5f5';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: BACKGROUND_LIGHT,
    padding: 20
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10
  },
  text: { 
    fontSize: 16, 
    color: 'gray', 
    textAlign: 'center', 
    lineHeight: 24
  }
});