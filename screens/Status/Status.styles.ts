import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA' 
  },
  headerIconsContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginRight: 15 
  },
  searchIconBulle: { 
    backgroundColor: 'rgba(255,255,255,0.15)', 
    padding: 8, 
    borderRadius: 20 
  },
  headerSearchInput: { 
    color: 'white', 
    fontSize: 17, 
    width: 220, 
    borderBottomWidth: 1, 
    borderBottomColor: 'rgba(255,255,255,0.3)' 
  },
  emptyText: { 
    textAlign: 'center', 
    marginTop: 30, 
    color: '#999' 
  },
  ticketRow: { 
    flexDirection: 'row', 
    padding: 15, 
    backgroundColor: 'white', 
    alignItems: 'center', 
    borderBottomWidth: 0.5, 
    borderBottomColor: '#eee' 
  },
  avatar: { 
    width: 55, 
    height: 55, 
    borderRadius: 27.5, 
    marginRight: 15, 
    backgroundColor: '#DFE5E7' 
  },
  content: { 
    flex: 1 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 5 
  },
  phoneText: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#000' 
  },
  dateText: { 
    fontSize: 12, 
    color: '#666' 
  },
  footer: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  subLabel: { 
    fontSize: 13, 
    color: '#666' 
  },
  subNumber: { 
    fontSize: 13, 
    color: '#1A237E', 
    fontWeight: '600' 
  },
  fab: { 
    position: 'absolute', 
    bottom: 25, 
    right: 25, 
    backgroundColor: '#1A237E', 
    width: 65, 
    height: 65, 
    borderRadius: 32.5, 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65
  }
});