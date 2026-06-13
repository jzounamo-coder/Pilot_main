import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA' 
  },
  scrollContent: { 
    padding: 20, 
    paddingBottom: 100 
  },
  header: { 
    alignItems: 'center', 
    marginBottom: 25 
  },
  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#1A237E' 
  },
  subtitle: { 
    fontSize: 14, 
    color: '#666' 
  },
  photoGrid: { 
    width: '100%' 
  },
  photoCard: { 
    backgroundColor: 'white', 
    borderRadius: 12, 
    padding: 10, 
    marginBottom: 20, 
    elevation: 3 
  },
  label: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 8 
  },
  image: { 
    width: '100%', 
    height: 200, 
    borderRadius: 8 
  },
  zoomIcon: { 
    position: 'absolute', 
    right: 10, 
    top: 10, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    borderRadius: 5, 
    padding: 4 
  },
  actionRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    paddingVertical: 10 
  },
  actionBtn: { 
    padding: 5 
  },
  descInput: { 
    backgroundColor: '#f9f9f9', 
    borderRadius: 8, 
    padding: 8, 
    marginTop: 10, 
    minHeight: 40 
  },
  emptyImage: { 
    width: '100%', 
    height: 200, 
    borderRadius: 8, 
    backgroundColor: '#f0f0f0', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  footer: { 
    position: 'absolute', 
    bottom: 0, 
    backgroundColor: 'white', 
    padding: 20, 
    width: '100%', 
    borderTopWidth: 1, 
    borderColor: '#eee' 
  },
  btnFinal: { 
    backgroundColor: '#1A237E', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  btnText: { 
    color: 'white', 
    fontWeight: 'bold' 
  }
});