// RenseignerPoteau.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F6FA' 
  },
  header: { 
    paddingHorizontal: 15, 
    paddingBottom: 25, 
    paddingTop: 30, 
    backgroundColor: '#1A237E',
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  form: { 
    padding: 20 
  },
  label: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 10, 
    marginTop: 15 
  },
  input: { 
    backgroundColor: 'white', 
    borderWidth: 1, 
    borderColor: '#DDD', 
    borderRadius: 8, 
    padding: 12, 
    fontSize: 16 
  },
  pickerContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 10 
  },
  radioBtn: { 
    flex: 1, 
    paddingVertical: 10, 
    borderWidth: 2, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginHorizontal: 2 
  },
  radioText: { 
    fontWeight: 'bold', 
    fontSize: 11 
  },
  submitBtn: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 15, 
    borderRadius: 12, 
    marginTop: 30, 
    elevation: 3 
  },
  submitBtnText: { 
    color: 'white', 
    fontWeight: 'bold', 
    marginLeft: 10, 
    fontSize: 16 
  }
});