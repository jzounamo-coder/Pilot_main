import { StyleSheet } from 'react-native';

export const PRIMARY_BLUE = '#1A237E';

export const styles = StyleSheet.create({
  groupHeader: { 
    paddingTop: 50, 
    paddingBottom: 15, 
    paddingHorizontal: 15, 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  contactItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    borderBottomWidth: 0.5, 
    borderBottomColor: '#eee' 
  },
  avatarBase: { 
    width: 45, 
    height: 45, 
    borderRadius: 22.5, 
    marginRight: 15, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  fab: { 
    position: 'absolute', 
    bottom: 30, 
    right: 30, 
    width: 65, 
    height: 65, 
    borderRadius: 32.5, 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 5 
  }
});