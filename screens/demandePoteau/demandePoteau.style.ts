import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: 'white' 
  },
  topActions: { 
    padding: 15, 
    zIndex: 10, 
    backgroundColor: 'white', 
    elevation: 4 
  },
  btnAction: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 14, 
    borderRadius: 12 
  },
  btnText: { 
    color: 'white', 
    fontWeight: 'bold', 
    marginLeft: 10 
  },
  map: { 
    width: '100%', 
    flex: 1 
  },
  loading: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  markerContainer: { 
    alignItems: 'center', 
    justifyContent: 'center',
    width: 40,
  },
  pboBox: {
    backgroundColor: '#1A237E', 
    padding: 5,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'white',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    zIndex: 2,
  },
  poleLine: {
    width: 4,
    height: 25,
    backgroundColor: '#444', 
    marginTop: -2, 
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  badgeIndex: {
    position: 'absolute',
    top: -12,
    backgroundColor: '#D32F2F',
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'white'
  },
  badgeIndexText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold'
  },
  confirmFab: { 
    position: 'absolute', 
    bottom: 30, 
    alignSelf: 'center', 
    backgroundColor: '#d1820c', 
    paddingHorizontal: 30, 
    paddingVertical: 15, 
    borderRadius: 30, 
    elevation: 8 
  },
  confirmFabText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 16 
  }
});