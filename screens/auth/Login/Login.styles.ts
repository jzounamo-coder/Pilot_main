import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
export const MAIN_BLUE = '#1A237E';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topCircle: { 
    width: width * 1.2, 
    height: width * 1.2, 
    borderRadius: width, 
    backgroundColor: '#E8EAF6', 
    position: 'absolute', 
    top: -height * 0.15, 
    left: -width * 0.2 
  },
  bottomCircle: { 
    width: width * 1.2, 
    height: width * 1.2, 
    borderRadius: width, 
    backgroundColor: '#EDF1F7', 
    position: 'absolute', 
    bottom: -height * 0.2, 
    right: -width * 0.3 
  },
  circle: { position: 'absolute' },
  inner: { padding: 24, flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerContainer: { marginBottom: 40, alignItems: 'center' },
  brandTextBack: { fontSize: 80, fontWeight: 'bold', color: '#E8EAF6', position: 'absolute', opacity: 0.5, top: -25 },
  brandTextFront: { fontSize: 45, fontWeight: 'bold', color: MAIN_BLUE },
  subtitle: { fontSize: 10, color: '#666', letterSpacing: 3, marginTop: 5 },
  form: { width: '100%' },
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    height: 60, 
    backgroundColor: '#fff', 
    borderRadius: 15, 
    paddingHorizontal: 15, 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: '#E8E8E8' 
  },
  input: { flex: 1, fontSize: 16 },
  button: { height: 60, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  recoveryContainer: { marginTop: 30, alignItems: 'center' },
  recoveryLink: { paddingVertical: 8 },
  recoveryText: { fontWeight: 'bold', fontSize: 14 },
  divider: { height: 1, width: 50, backgroundColor: '#EEE', marginVertical: 5 }
});