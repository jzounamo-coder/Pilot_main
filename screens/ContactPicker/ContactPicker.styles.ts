// 
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  searchHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F0F0F0', 
    margin: 10, 
    borderRadius: 10, 
    paddingHorizontal: 5 
  },
  searchBar: { 
    flex: 1, 
    padding: 12, 
    fontSize: 16 
  },
  item: { 
    flexDirection: 'row', 
    padding: 15, 
    alignItems: 'center', 
    borderBottomWidth: 0.5, 
    borderBottomColor: '#eee' 
  },
  avatar: { 
    width: 45, 
    height: 45, 
    borderRadius: 22.5, 
    backgroundColor: '#1A237E', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15 
  },
  avatarText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 18 
  },
  name: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#333' 
  },
  phone: { 
    color: '#666', 
    marginTop: 3 
  }
});