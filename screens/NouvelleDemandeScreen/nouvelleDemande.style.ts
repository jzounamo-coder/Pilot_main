import { StyleSheet } from 'react-native';

export const PRIMARY_BLUE = '#1A237E';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { backgroundColor: PRIMARY_BLUE, paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center' },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginLeft: 15 },
  body: { padding: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#444', marginTop: 15, marginBottom: 5 },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#DDD' },
  dropdownInput: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
  scanBtn: { backgroundColor: PRIMARY_BLUE, padding: 13, borderRadius: 10, marginLeft: 10 },
  submitBtn: { backgroundColor: PRIMARY_BLUE, marginTop: 30, padding: 15, borderRadius: 10, alignItems: 'center' },
  submitText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', borderRadius: 10, padding: 20 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  option: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  closeModal: { marginTop: 15, alignItems: 'center' },
  closeCameraBtn: { position: 'absolute', top: 50, right: 20 },

  // ── Styles PBO Input ──
  pboInputGroup: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  prefixBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 10, height: 45, borderRadius: 10, justifyContent: 'center', borderWidth: 1, borderColor: '#388E3C' },
  prefixText: { color: '#388E3C', fontWeight: 'bold' },
  separator: { fontSize: 18, fontWeight: 'bold', paddingHorizontal: 3 },
  styledInput: { backgroundColor: '#F0F2F5', height: 45, borderRadius: 10 },
  inputField: { flex: 1, height: 45 },
  inputFieldActive: { borderColor: PRIMARY_BLUE, borderWidth: 1.5, borderRadius: 10 },
  pboNumberContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F2F5', height: 45, borderRadius: 10, paddingHorizontal: 8 },
  pboPrefixText: { fontWeight: 'bold', color: '#666', fontSize: 13 },
  inputWrapperActive: { borderColor: PRIMARY_BLUE, borderWidth: 1.5 },
});