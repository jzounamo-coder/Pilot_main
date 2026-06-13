import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flex: {
    flex: 1,
  },
  inner: {
    padding: 24,
    flex: 1,
  },
  backArea: {
    marginTop: 10,
    marginBottom: 30,
  },
  backButton: {
    fontSize: 16,
    color: '#1A237E',
    fontWeight: 'bold',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  instructions: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  form: {
    width: '100%',
  },
  input: {
    height: 55,
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 25,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  button: {
    backgroundColor: '#1A237E',
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});