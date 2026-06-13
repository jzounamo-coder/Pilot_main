// Profile.styles.ts
import { StyleSheet } from 'react-native';

export const PRIMARY_BLUE = '#1A237E';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F5F5' 
  },
  header: { 
    backgroundColor: 'white', 
    padding: 30, 
    alignItems: 'center', 
    borderBottomWidth: 1, 
    borderBottomColor: '#EEE' 
  },
  avatarContainer: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    backgroundColor: PRIMARY_BLUE, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 15 
  },
  username: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  email: { 
    fontSize: 14, 
    color: 'gray', 
    marginTop: 5 
  },
  section: { 
    padding: 20 
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: PRIMARY_BLUE, 
    marginBottom: 15 
  },
  emptyBox: { 
    height: 150, 
    backgroundColor: 'white', 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderStyle: 'dashed', 
    borderWidth: 1, 
    borderColor: '#CCC' 
  },
  emptyText: { 
    color: '#AAA', 
    marginTop: 10 
  },
  logoutButton: { 
    margin: 20, 
    backgroundColor: '#FFEBEE', 
    flexDirection: 'row', 
    padding: 15, 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#FFCDD2' 
  },
  logoutText: { 
    color: '#D32F2F', 
    fontWeight: 'bold', 
    marginLeft: 10 
  }
});