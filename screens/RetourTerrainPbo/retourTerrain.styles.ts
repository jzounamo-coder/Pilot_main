import { StyleSheet, Platform } from 'react-native';

export const PRIMARY_BLUE = '#1A237E';
export const LIGHT_BLUE = '#E8EAF6';
export const BACKGROUND_COLOR = '#F8F9FA';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND_COLOR },
  
  /* ── DESIGN NOUVEAU HEADER PREMIUM UNIFIÉ ── */
  headerContainer: {
    backgroundColor: PRIMARY_BLUE,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 10,
    paddingBottom: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 15,
  },
  headerTextContainer: { flex: 1 },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: 2 },
  headerHistoryBtn: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  
  card: { backgroundColor: 'white', borderRadius: 16, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: '#EAEAEA', elevation: 2 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 14 },
  actionButtonsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  actionBtn: { flex: 1, flexDirection: 'row', height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginHorizontal: 6, borderWidth: 1, borderColor: '#EAEAEA', backgroundColor: '#F8F9FA' },
  btnText: { fontWeight: '500', marginLeft: 6, fontSize: 14, color: '#333' },
  
  // Saisie Imbriquée BZV-MA-Numero [cite: 226]
  nestedInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F6FA', borderRadius: 12, borderWidth: 1, borderColor: '#E2E4E8', overflow: 'hidden', height: 48 },
  prefixLabelBox: { backgroundColor: '#E8EAF6', paddingHorizontal: 10, height: '100%', justifyContent: 'center', borderRightWidth: 1, borderRightColor: '#C5CAE9' },
  prefixLabelText: { color: PRIMARY_BLUE, fontWeight: '700', fontSize: 14 },
  maInputField: { flex: 0.6, paddingHorizontal: 8, fontSize: 14, fontWeight: '600', color: '#222', textAlign: 'center' },
  dashSeparator: { fontSize: 12, fontWeight: 'bold', color: '#1A237E', paddingHorizontal: 2 },
  numeroInputField: { flex: 0.9, paddingHorizontal: 8, fontSize: 14, fontWeight: '600', color: '#222', textAlign: 'center' },
  checkInnerBtn: { backgroundColor: PRIMARY_BLUE, height: '100%', paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center' },
  clearInnerBtn: { backgroundColor: '#FFEBEE', height: '100%', paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center' },
  
  warningInputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF8E1', borderColor: '#d2850a', borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, minHeight: 45, marginTop: 12 },
  warningIconField: { marginRight: 8 },
  warningInputText: { flex: 1, color: '#d38e17', fontSize: 13, fontWeight: '600', lineHeight: 18 },
  
  // Boîte succès en pointillés Verts
  pboSuccessDottedBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#2E7D32', borderRadius: 10, padding: 12, marginTop: 12 },
  pboSuccessDottedText: { color: '#2E7D32', fontWeight: '700', fontSize: 13 },
  pboErrorDottedBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFEBEE', borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#D32F2F', borderRadius: 10, padding: 12, marginTop: 12 },
  pboErrorText: { color: '#D32F2F', fontWeight: '700', fontSize: 13 },
  
  // STATS PORTS
  portsManagementCard: { backgroundColor: 'white', borderRadius: 16, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#EAEAEA' },
  portsCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  portsSectionTitle: { fontSize: 14, fontWeight: '600', color: '#555' },
  discreetCalcBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F6FA', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  discreetCalcText: { fontSize: 11, fontWeight: '600', color: PRIMARY_BLUE },
  editableStatsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statInputBadge: { flex: 1, borderWidth: 1, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 6, alignItems: 'center', marginHorizontal: 4, backgroundColor: 'white' },
  statLabelText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 },
  inputWithIconRow: { flexDirection: 'row', alignItems: 'center' },
  statTextInput: { fontSize: 14, fontWeight: 'bold', padding: 0, textAlign: 'center', minWidth: 20 },
  statValueDisplay: { fontSize: 16, fontWeight: 'bold', marginTop: 2 },
  
  // LISTE DES PORTS
  listHeaderSection: { flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 12, paddingHorizontal: 4 },
  listSectionTitle: { fontSize: 15, fontWeight: '700', color: '#222', marginLeft: 8 },
  listContainer: { paddingBottom: 20 },
  clientCard: { backgroundColor: 'white', borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#EAEAEA', borderLeftWidth: 4, borderLeftColor: PRIMARY_BLUE, position: 'relative' },
  clientCardLibre: { borderLeftColor: '#90A4AE', backgroundColor: '#FAFAFA', borderStyle: 'dashed' },
  editCardButton: { position: 'absolute', top: 12, right: 12, padding: 6, zIndex: 10, backgroundColor: '#F5F6FA', borderRadius: 10 },
  clientHeader: { flexDirection: 'row', alignItems: 'center' },
  avatarBadge: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#E8EAF6', justifyContent: 'center', alignItems: 'center' },
  avatarBadgeLibre: { backgroundColor: '#ECEFF1' },
  avatarText: { color: PRIMARY_BLUE, fontWeight: 'bold', fontSize: 12 },
  clientMeta: { marginLeft: 10, flex: 1, paddingRight: 32 },
  clientName: { fontSize: 14, fontWeight: 'bold', color: '#222' },
  clientNameLibre: { color: '#78909C', fontWeight: '500', fontSize: 13 },
  cassetteTag: { fontSize: 11, color: '#777', fontStyle: 'italic', marginTop: 1 },
  infoCompactContainer: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F5F5F5' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 2 },
  infoText: { marginLeft: 6, fontSize: 12, color: '#555' },
  
  // MODAL (AMÉLIORÉE POUR CLAVIER)
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, maxHeight: '90%', flexShrink: 1 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 15, borderBottomWidth: 1, borderColor: '#EFEFEF' },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  modalForm: { paddingHorizontal: 20 },
  formRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  formCol: { flex: 0.48 },
  inputLabel: { fontSize: 12, fontWeight: '600', color: '#555', marginBottom: 5, marginTop: 10 },
  modalInput: { backgroundColor: '#F5F6FA', borderRadius: 10, paddingHorizontal: 10, height: 40, borderWidth: 1, borderColor: '#E2E4E8', color: '#222', fontSize: 13 },
  modalFooter: { flexDirection: 'row', padding: 15, borderTopWidth: 1, borderColor: '#EFEFEF', backgroundColor: '#FAFAFA', paddingBottom: Platform.OS === 'ios' ? 25 : 15 },
  modalBtn: { flex: 1, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginHorizontal: 6 },
  modalBtnCancel: { backgroundColor: '#ECEFF1' },
  modalBtnCancelText: { color: '#546E7A', fontWeight: '600', fontSize: 14 },
  modalBtnSave: { backgroundColor: PRIMARY_BLUE },
  modalBtnSaveText: { color: 'white', fontWeight: 'bold' }
});