import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inner: {
    padding: 24,
  },
  backButton: {
    fontSize: 18,
    color: '#1A237E',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  instructions: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    lineHeight: 22,
  },
  otpInput: {
    height: 60,
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 10, 
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  button: {
    backgroundColor: '#1A237E',
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  resendText: {
    color: '#666',
  },
  resendLink: {
    color: '#1A237E',
    fontWeight: 'bold',
  },
});