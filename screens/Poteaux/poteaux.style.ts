import { StyleSheet } from 'react-native';

export const PRIMARY_BLUE = '#1A237E';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  headerActions: { flexDirection: 'row', padding: 15, alignItems: 'center', paddingBottom: 5 },
  searchBar: { flex: 1, flexDirection: 'row', backgroundColor: 'white', borderRadius: 10, paddingHorizontal: 10, alignItems: 'center', height: 45, elevation: 2 },
  input: { flex: 1, marginLeft: 10 },
  filterBtn: { marginLeft: 10, backgroundColor: PRIMARY_BLUE, padding: 10, borderRadius: 10, height: 45, width: 45, justifyContent: 'center', alignItems: 'center' },
  
  // ── STYLES POUR LES SUGGESTIONS HORIZONTALES ──
  suggestionsContainer: { backgroundColor: 'white', borderRadius: 10, padding: 10, marginHorizontal: 15, marginBottom: 5, elevation: 2 },
  suggestionTitle: { fontSize: 11, fontWeight: 'bold', color: '#555', marginBottom: 6, marginLeft: 4 },
  scrollSection: { marginBottom: 2 },
  chip: { backgroundColor: '#F0F2F5', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#E4E6EB' },
  chipActive: { backgroundColor: PRIMARY_BLUE, borderColor: PRIMARY_BLUE },
  chipText: { color: '#333', fontSize: 13 },
  chipTextActive: { color: 'white', fontWeight: 'bold' },

  // ── CARDS ET LISTE ──
  listContainer: { padding: 15, paddingBottom: 80 },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#999' },
  card: { backgroundColor: 'white', borderRadius: 12, padding: 15, marginBottom: 12, elevation: 3, position: 'relative' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  idContainer: { flexDirection: 'row', alignItems: 'center' },
  poteauId: { fontSize: 16, fontWeight: 'bold', marginLeft: 8, color: PRIMARY_BLUE },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 5, fontSize: 12, fontWeight: 'bold' },
  cardBody: { borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 10 },
  coordRow: { flexDirection: 'row', alignItems: 'center' },
  coordText: { fontSize: 13, color: '#666', marginLeft: 5 },
  villeText: { fontSize: 12, color: '#999', marginTop: 4 },
  chevron: { position: 'absolute', right: 10, top: '50%' },
  fab: { position: 'absolute', bottom: 20, right: 20, left: 20, backgroundColor: PRIMARY_BLUE, height: 55, borderRadius: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  fabText: { color: 'white', fontWeight: 'bold', marginLeft: 10 },

  // ── ÉCRAN DE DÉTAIL ──
  detailContainer: { flex: 1, backgroundColor: PRIMARY_BLUE, justifyContent: 'center', padding: 20 },
  detailCard: { backgroundColor: 'white', borderRadius: 25, padding: 30, alignItems: 'center' },
  iconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F0F2FF', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  detailId: { fontSize: 24, fontWeight: 'bold', color: PRIMARY_BLUE, marginBottom: 25 },
  infoBox: { width: '100%', marginBottom: 30 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', paddingBottom: 8 },
  infoLabel: { flex: 1, marginLeft: 10, color: '#666' },
  infoValue: { fontWeight: 'bold', color: '#333' },
  btnRenseigner: { backgroundColor: PRIMARY_BLUE, width: '100%', padding: 15, borderRadius: 12, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold' },
});