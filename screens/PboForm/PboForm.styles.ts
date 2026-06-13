import { StyleSheet } from 'react-native';

export const PRIMARY_BLUE = '#1A237E';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f0f2f5', 
    padding: 20 
  },
  formCard: { 
    backgroundColor: 'white', 
    padding: 20, 
    borderRadius: 15, 
    elevation: 3 
  },
  inputLabel: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: PRIMARY_BLUE, 
    marginTop: 15 
  },
  input: { 
    borderBottomWidth: 1, 
    borderBottomColor: '#ccc', 
    paddingVertical: 8, 
    fontSize: 16, 
    color: '#333' 
  },
  btnValider: { 
    backgroundColor: PRIMARY_BLUE, 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginTop: 30, 
    minHeight: 50, 
    justifyContent: 'center' 
  },
  btnText: { 
    color: 'white', 
    fontWeight: 'bold' 
  }
});