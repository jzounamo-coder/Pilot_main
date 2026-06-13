import { StyleSheet } from 'react-native';

export const PRIMARY_BLUE = '#1A237E';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F6FA', 
    padding: 15 
  },
  scrollContent: { 
    paddingBottom: 30 
  },
  // BANDEAU INFO CLIENT
  clientHeader: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  headerTitleRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  clientName: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  clientId: { 
    fontSize: 12, 
    color: '#999', 
    fontWeight: '600' 
  },
  clientSub: { 
    fontSize: 14, 
    color: '#666', 
    marginTop: 5 
  },
  sectionTitle: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#555', 
    marginBottom: 15, 
    textTransform: 'uppercase' 
  },
  // STRUCTURE DES CARTES D'ÉTAPE
  stepCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  stepHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  stepCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  stepCircleDone: { 
    backgroundColor: '#388E3C' 
  },
  stepNumber: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 13 
  },
  stepTitle: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  stepContent: { 
    paddingLeft: 36 
  },
  // COMPOSANTS INTERNES ÉTAPES
  actionButton: {
    backgroundColor: PRIMARY_BLUE,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  actionButtonText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 14 
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  timeBadgeText: { 
    color: '#388E3C', 
    fontWeight: 'bold', 
    marginLeft: 8, 
    fontSize: 14 
  },
  // FORMULAIRES / INPUTS
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 45,
    backgroundColor: '#FAFAFA',
  },
  input: { 
    flex: 1, 
    fontSize: 14, 
    color: '#333' 
  },
  unitText: { 
    fontWeight: 'bold', 
    color: '#666', 
    marginLeft: 5 
  },
  hintText: { 
    fontSize: 11, 
    color: '#999', 
    marginTop: 5, 
    fontStyle: 'italic' 
  },
  // BOUTON DE SOUMISSION FINAL
  submitButton: {
    backgroundColor: '#d1820c', 
    height: 52,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    elevation: 3,
  },
  submitButtonDisabled: { 
    backgroundColor: '#A5D6A7' 
  },
  submitButtonText: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: 'bold' 
  }
});