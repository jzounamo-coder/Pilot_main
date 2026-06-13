import { StyleSheet } from 'react-native';

export const PRIMARY_BLUE = '#1A237E';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA' 
  },
  scrollContent: { 
    padding: 20 
  },
  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: PRIMARY_BLUE, 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  photoCard: { 
    backgroundColor: 'white', 
    borderRadius: 12, 
    padding: 10, 
    marginBottom: 15, 
    alignItems: 'center', 
    elevation: 3 
  },
  cameraBtn: { 
    width: '100%', 
    height: 150, 
    backgroundColor: '#F0F2FF', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 10, 
    borderStyle: 'dashed', 
    borderWidth: 2, 
    borderColor: PRIMARY_BLUE 
  },
  image: { 
    width: '100%', 
    height: '100%', 
    borderRadius: 10 
  },
  label: { 
    marginTop: 8, 
    fontWeight: 'bold' 
  },
  footer: { 
    padding: 20, 
    backgroundColor: 'white', 
    borderTopWidth: 1, 
    borderColor: '#eee' 
  },
  btnNext: { 
    backgroundColor: PRIMARY_BLUE, 
    padding: 16, 
    borderRadius: 10, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  btnText: { 
    color: 'white', 
    fontWeight: 'bold' 
  }
});