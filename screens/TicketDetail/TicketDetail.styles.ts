import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F7F8' 
  },
  header: { 
    backgroundColor: '#1A237E', 
    alignItems: 'center', 
    paddingVertical: 30 
  },
  avatar: { 
    width: 90, 
    height: 90, 
    borderRadius: 45, 
    borderWidth: 2, 
    borderColor: 'white', 
    marginBottom: 10 
  },
  mainTitle: { 
    color: 'white', 
    fontSize: 22, 
    fontWeight: 'bold' 
  },
  subTitle: { 
    color: '#ddd', 
    fontSize: 16 
  },
  content: { 
    padding: 20 
  },
  sectionTitle: { 
    fontSize: 11, 
    fontWeight: 'bold', 
    color: '#1A237E', 
    marginTop: 15, 
    marginBottom: 8, 
    textTransform: 'uppercase', 
    letterSpacing: 1 
  },
  infoRow: { 
    backgroundColor: 'white', 
    padding: 12, 
    borderRadius: 8, 
    marginBottom: 6, 
    elevation: 1 
  },
  label: { 
    fontSize: 10, 
    color: '#888', 
    textTransform: 'uppercase' 
  },
  value: { 
    fontSize: 15, 
    color: '#333', 
    fontWeight: '600' 
  },
  btn: { 
    margin: 20, 
    backgroundColor: '#1A237E', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  saturationAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  saturationText: {
    color: '#B91C1C',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 10,
  },
  progressSection: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
  },
  progressLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 8,
    fontWeight: '600',
  },
  progressContainer: {
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
});