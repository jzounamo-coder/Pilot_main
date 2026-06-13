import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F4F5F7' 
  },
  scrollContent: { 
    padding: 20 
  },
  infoCard: { 
    backgroundColor: 'white', 
    borderRadius: 15, 
    padding: 20, 
    elevation: 4, 
    marginBottom: 25 
  },
  clientName: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#1A237E', 
    textAlign: 'center', 
    marginBottom: 20 
  },
  infoRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F0F0F0' 
  },
  infoLabel: { 
    color: '#666', 
    fontSize: 16 
  },
  infoValue: { 
    fontWeight: 'bold', 
    color: '#333', 
    fontSize: 16 
  },
  buttonContainer: { 
    marginTop: 10, 
    gap: 12 
  },
  btnVISUALISATION: { 
    backgroundColor: '#1A237E', 
    flexDirection: 'row', 
    padding: 18, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center', 
    elevation: 3 
  },
  btnValidate: { 
    backgroundColor: '#b1550a', 
    flexDirection: 'row', 
    padding: 18, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center', 
    elevation: 3 
  },
  btnText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 16, 
    marginLeft: 10 
  }
});