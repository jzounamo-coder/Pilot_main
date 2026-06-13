import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f0f2f5' 
  },
  scrollContent: { 
    paddingBottom: 50 
  },
  formCard: { 
    backgroundColor: 'white', 
    marginHorizontal: 15, 
    padding: 20, 
    borderRadius: 15, 
    elevation: 2,
    marginTop: 20
  },
  inputLabel: { 
    fontSize: 11, 
    fontWeight: 'bold', 
    color: '#1A237E', 
    marginBottom: 2, 
    marginTop: 12, 
    textTransform: 'uppercase' 
  },
  input: { 
    borderBottomWidth: 1, 
    borderBottomColor: '#ccc', 
    paddingVertical: 5, 
    fontSize: 16, 
    color: '#333' 
  },
  rowContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  halfWidth: { 
    width: '48%' 
  },
  btnValider: { 
    backgroundColor: '#1A237E', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginTop: 30 
  },
  btnText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  btnRetour: { 
    marginTop: 15, 
    alignItems: 'center' 
  },
  retourText: { 
    color: '#666' 
  }
});